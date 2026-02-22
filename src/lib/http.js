// src/lib/http.js

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
 * APIリクエストを送信する
 * @param {string} path - APIパス
 * @param {RequestInit} options - fetchオプション
 * @returns {Promise<{res: Response, data: any}>}
 */
export async function apiFetch(path, options = {}) {
    const res = await fetch(path, {
        credentials: "include",
        ...options,
        headers: {
            ...(options.headers || {}),
            "Content-Type": "application/json",
        },
    });

    // レート制限エラー
    if (res.status === 429) {
        const retryAfter = parseInt(res.headers.get("Retry-After") || "60", 10);
        throw new RateLimitError(retryAfter);
    }

    // 認証エラー
    if (res.status === 401) {
        throw new AuthError();
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
