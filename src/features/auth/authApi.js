import { apiFetch } from "@/lib/http.js";

export async function getMe() {
    const { res, data } = await apiFetch("/api/me", { method: "GET" });
    if (!res.ok) return null;
    return data?.user ?? null;
}

export async function logout() {
    await apiFetch("/api/logout", { method: "POST" });
}