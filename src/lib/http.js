export async function apiFetch(path, options = {}) {
    const res = await fetch(path, {
        credentials: "include",
        ...options,
        headers: {
            ...(options.headers || {}),
            "Content-Type": "application/json",
        },
    });

    if (res.status === 204) return { res, data: null };

    const contentType = res.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
        ? await res.json().catch(() => null)
        : await res.text().catch(() => null);

    return { res, data };
}