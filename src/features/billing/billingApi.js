import { apiFetch } from "@/lib/http.js";

export async function getBillingStatus() {
    const { res, data } = await apiFetch("/api/billing/status", { method: "GET" });
    if (!res.ok) return { total_slots: 0, used_slots: 0, boosts: [] };
    return data;
}

export async function createCheckoutSession() {
    const { res, data } = await apiFetch("/api/billing/create-checkout-session", { method: "POST" });
    if (!res.ok) throw new Error(data?.detail || "Checkout session creation failed");
    return data; // { url: "..." }
}

export async function unboostGuild(guildId) {
    const { res, data } = await apiFetch("/api/billing/unboost", {
        method: "POST",
        body: JSON.stringify({ guild_id: guildId }),
    });
    if (!res.ok) throw new Error(data?.detail || "Unboost failed");
    return data;
}
