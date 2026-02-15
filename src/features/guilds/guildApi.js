import { apiFetch } from "@/lib/http.js";

export async function getGuilds() {
  const { res, data } = await apiFetch("/api/guilds", { method: "GET" });
  if (!res.ok) return [];
  return data ?? [];
}

export async function getGuildSettings(guildId) {
  const { res, data } = await apiFetch(`/api/guilds/${guildId}/settings`, { method: "GET" });
  
  if (res.status === 200) {
    // データが空（Bot未導入）の場合は null を返し、そうでない場合はデータを返す
    if (data && Object.keys(data).length === 0) return null;
    return data;
  }
  
  // 404 の場合も未導入として扱う
  if (res.status === 404) return null;

  // それ以外のエラー（429など）は例外を投げて loading 中の状態を維持するかエラー表示にする
  throw new Error(`Failed to fetch settings: ${res.status}`);
}

export async function updateGuildSettings(guildId, settings) {
  const { res, data } = await apiFetch(`/api/guilds/${guildId}/settings`, {
    method: "PATCH",
    body: JSON.stringify(settings),
  });
  return { ok: res.ok, data };
}

export async function getGuildDict(guildId) {
  const { res, data } = await apiFetch(`/api/guilds/${guildId}/dict`, { method: "GET" });
  if (!res.ok) return [];
  return data ?? [];
}

export async function addDictEntry(guildId, entry) {
  const { res, data } = await apiFetch(`/api/guilds/${guildId}/dict`, {
    method: "POST",
    body: JSON.stringify(entry),
  });
  return { ok: res.ok, data };
}

export async function deleteDictEntry(guildId, word) {
  const { res } = await apiFetch(`/api/guilds/${guildId}/dict/${encodeURIComponent(word)}`, {
    method: "DELETE",
  });
  return res.ok;
}
