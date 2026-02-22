// src/features/auth/authApi.js

import { apiFetch } from "@/lib/http.js";

/**
 * 現在のログインユーザー情報を取得
 * @returns {Promise<{discordId: string, username: string} | null>}
 */
export async function getMe() {
    const { res, data } = await apiFetch("/auth/me", { method: "GET" });
    if (!res.ok) return null;
    return data?.user ?? null;
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
