// src/features/billing/billingApi.js

import { apiGet, apiPost } from "@/lib/http.js";

/**
 * 課金ステータスを取得
 * @returns {Promise<Object|null>}
 */
export async function getBillingStatus() {
    try {
        const { res, data } = await apiGet("/api/billing/status");
        if (!res.ok) return null;
        return data;
    } catch (error) {
        console.error("getBillingStatus error:", error);
        return null;
    }
}

/**
 * 課金設定（価格情報など）を取得
 * @returns {Promise<Object|null>}
 */
export async function getBillingConfig() {
    try {
        const { res, data } = await apiGet("/api/billing/config");
        if (!res.ok) return null;
        return data;
    } catch (error) {
        console.error("getBillingConfig error:", error);
        return null;
    }
}

/**
 * プレミアムプランの一覧を取得
 * @returns {Promise<Array>}
 */
export async function getPremiumPlans() {
    try {
        const { res, data } = await apiGet("/api/billing/plans");
        if (!res.ok) return [];
        return data ?? [];
    } catch (error) {
        console.error("getPremiumPlans error:", error);
        return [];
    }
}

/**
 * ギルドにブーストを適用
 * @param {string} guildId - ギルドID
 * @returns {Promise<{ok: boolean, data: any, error?: string}>}
 */
export async function boostGuild(guildId) {
    if (!guildId) {
        return { ok: false, data: null, error: "guildId is required" };
    }

    try {
        // バックエンドはPOSTボディでguild_idを受け取る
        const { res, data } = await apiPost("/api/billing/boost", {
            guild_id: guildId
        });

        if (!res.ok) {
            const errorMessage = data?.detail || "ブーストに失敗しました";
            return { ok: false, data: null, error: errorMessage };
        }

        return { ok: res.ok, data };
    } catch (error) {
        console.error("boostGuild error:", error);
        return { ok: false, data: null, error: error.message };
    }
}

/**
 * ギルドからブーストを解除
 * @param {string} guildId - ギルドID
 * @returns {Promise<{ok: boolean, data: any, error?: string}>}
 */
export async function unboostGuild(guildId) {
    if (!guildId) {
        return { ok: false, data: null, error: "guildId is required" };
    }

    try {
        // バックエンドはPOSTボディでguild_idを受け取る
        const { res, data } = await apiPost("/api/billing/unboost", {
            guild_id: guildId
        });

        if (!res.ok) {
            const errorMessage = data?.detail || "ブースト解除に失敗しました";
            return { ok: false, data: null, error: errorMessage };
        }

        return { ok: res.ok, data };
    } catch (error) {
        console.error("unboostGuild error:", error);
        return { ok: false, data: null, error: error.message };
    }
}

/**
 * サブスクリプション情報を取得
 * @returns {Promise<Object|null>}
 */
export async function getSubscription() {
    try {
        const { res, data } = await apiGet("/api/billing/subscription");
        if (!res.ok) return null;
        return data;
    } catch (error) {
        console.error("getSubscription error:", error);
        return null;
    }
}

/**
 * チェックアウトセッションを作成（新規購入）
 * @returns {Promise<{url: string}|null>}
 */
export async function createCheckoutSession() {
    try {
        const { res, data } = await apiPost("/api/billing/create-checkout-session");
        if (!res.ok) return null;
        return data;
    } catch (error) {
        console.error("createCheckoutSession error:", error);
        return null;
    }
}

/**
 * カスタマーポータルURLを取得（Stripe等の決済管理画面）
 * @returns {Promise<{url: string}|null>}
 */
export async function getCustomerPortalUrl() {
    try {
        const { res, data } = await apiPost("/api/billing/portal");
        if (!res.ok) return null;
        return data;
    } catch (error) {
        console.error("getCustomerPortalUrl error:", error);
        return null;
    }
}
