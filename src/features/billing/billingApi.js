// src/features/billing/billingApi.js

import { apiFetch } from "@/lib/http.js";

/**
 * 課金ステータスを取得
 */
export async function getBillingStatus() {
    const { res, data } = await apiFetch("/api/billing/status", { method: "GET" });
    if (!res.ok) {
        return {
            total_slots: 0,
            used_slots: 0,
            boosts: [],
            manageable_guilds: []
        };
    }
    return data;
}

/**
 * Stripeチェックアウトセッションを作成
 */
export async function createCheckoutSession() {
    const { res, data } = await apiFetch("/api/billing/create-checkout-session", {
        method: "POST"
    });
    if (!res.ok) {
        throw new Error(data?.detail || "チェックアウトセッションの作成に失敗しました");
    }
    return data; // { url: "..." }
}

/**
 * サーバーのブーストを解除
 */
export async function unboostGuild(guildId) {
    const { res, data } = await apiFetch("/api/billing/unboost", {
        method: "POST",
        body: JSON.stringify({ guild_id: guildId }),
    });
    if (!res.ok) {
        throw new Error(data?.detail || "ブースト解除に失敗しました");
    }
    return data;
}

/**
 * サーバーをブースト
 */
export async function boostGuild(guildId) {
    const { res, data } = await apiFetch("/api/billing/boost", {
        method: "POST",
        body: JSON.stringify({ guild_id: guildId }),
    });
    if (!res.ok) {
        throw new Error(data?.detail || "ブーストに失敗しました");
    }
    return data;
}

/**
 * 課金設定を取得
 */
export async function getBillingConfig() {
    const { res, data } = await apiFetch("/api/billing/config", { method: "GET" });
    if (!res.ok) {
        return {
            bot_instances: [],
            max_boosts_per_guild: 1
        };
    }
    return data;
}
