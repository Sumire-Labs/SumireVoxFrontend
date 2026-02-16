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
