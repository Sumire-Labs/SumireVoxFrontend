// src/lib/http.js

import { router } from "@/app/router.js";

/**
 * ネットワークエラー
 */
export class NetworkError extends Error {
    constructor(message = "ネットワークエラーが発生しました。接続を確認してください。") {
        super(message);
        this.name = "NetworkError";
    }
}

/**
 * レート制限エラー
 */
export class RateLimitError extends Error {
    constructor(retryAfter = 60) {
        super(`レート制限に達しました。${retryAfter}秒後に再試行してください。`);
        this.name = "RateLimitError";
        this.retryAfter = retryAfter;
    }
}

/**
 * 認証エラー
 */
export class AuthError extends Error {
    constructor(message = "ログインが必要です") {
        super(message);
        this.name = "AuthError";
    }
}

/**
 * APIエラー
 */
export class ApiError extends Error {
    constructor(status, message = "APIエラーが発生しました") {
        super(message);
        this.name = "ApiError";
        this.status = status;
    }
}

/**
 * 認証エラー時のハンドラー
 */
function handleAuthError() {
    // 現在のパスを保存してログイン後にリダイレクト
    const currentPath = window.location.pathname;
    if (currentPath !== "/" && !currentPath.startsWith("/auth")) {
        sessionStorage.setItem("redirectAfterLogin", currentPath);
    }
    router.push("/");
}

/**
 * APIリクエストを送信する
 * @param {string} path - APIパス
 * @param {RequestInit} options - fetchオプション
 * @returns {Promise<{res: Response, data: any}>}
 */
export async function apiFetch(path, options = {}) {
    let res;

    try {
        res = await fetch(path, {
            credentials: "include",
            ...options,
            headers: {
                ...(options.headers || {}),
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        // ネットワークエラー（オフライン、DNS解決失敗など）
        console.error("Network error:", error);
        throw new NetworkError();
    }

    // レート制限エラー
    if (res.status === 429) {
        const retryAfter = parseInt(res.headers.get("Retry-After") || "60", 10);
        throw new RateLimitError(retryAfter);
    }

    // 認証エラー
    if (res.status === 401) {
        handleAuthError();
        throw new AuthError();
    }

    // サーバーエラー
    if (res.status >= 500) {
        throw new ApiError(res.status, "サーバーエラーが発生しました。しばらく経ってから再試行してください。");
    }

    // No Content
    if (res.status === 204) {
        return { res, data: null };
    }

    const contentType = res.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
        ? await res.json().catch(() => null)
        : await res.text().catch(() => null);

    return { res, data };
}

/**
 * GETリクエスト用のヘルパー
 */
export async function apiGet(path) {
    return apiFetch(path, { method: "GET" });
}

/**
 * POSTリクエスト用のヘルパー
 */
export async function apiPost(path, body = null) {
    return apiFetch(path, {
        method: "POST",
        body: body ? JSON.stringify(body) : undefined,
    });
}

/**
 * PATCHリクエスト用のヘルパー
 */
export async function apiPatch(path, body) {
    return apiFetch(path, {
        method: "PATCH",
        body: JSON.stringify(body),
    });
}

/**
 * DELETEリクエスト用のヘルパー
 */
export async function apiDelete(path) {
    return apiFetch(path, { method: "DELETE" });
}
