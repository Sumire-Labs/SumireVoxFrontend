// src/features/auth/authApi.js

import { apiFetch, AuthError, NetworkError } from "@/lib/http.js";

/**
 * 現在のログインユーザー情報を取得
 * @returns {Promise<{discordId: string, username: string} | null>}
 */
export async function getMe() {
    try {
        const { res, data } = await apiFetch("/auth/me", {
            method: "GET",
            skipAuthRedirect: true
        });

        if (!res.ok) {
            return null;
        }

        return data?.user ?? null;
    } catch (error) {
        if (error instanceof AuthError) {
            return null;
        }
        if (error instanceof NetworkError) {
            throw error;
        }
        console.error("getMe error:", error);
        return null;
    }
}

/**
 * ログアウト（現在のセッションのみ）
 */
export async function logout() {
    await apiFetch("/auth/logout", { method: "POST" });
}

/**
 * すべてのデバイスからログアウト
 */
export async function logoutAll() {
    const { res } = await apiFetch("/auth/logout-all", { method: "POST" });
    if (!res.ok) {
        throw new Error("すべてのセッションのログアウトに失敗しました");
    }
}
