// src/features/guilds/guildApi.js

import { apiFetch } from "@/lib/http.js";

/**
 * ギルド一覧を取得
 */
export async function getGuilds() {
  const { res, data } = await apiFetch("/api/guilds", { method: "GET" });
  if (!res.ok) return [];
  return data ?? [];
}

/**
 * ギルド設定を取得
 */
export async function getGuildSettings(guildId) {
  const { res, data } = await apiFetch(`/api/guilds/${guildId}/settings`, {
    method: "GET"
  });

  if (res.status === 200) {
    // データが空（Bot未導入）の場合は null を返す
    if (data && Object.keys(data).length === 0) return null;
    return data;
  }

  // 404 の場合も未導入として扱う
  if (res.status === 404) return null;

  // それ以外のエラー
  throw new Error(`設定の取得に失敗しました: ${res.status}`);
}

/**
 * ギルド設定を更新
 */
export async function updateGuildSettings(guildId, settings) {
  const { res, data } = await apiFetch(`/api/guilds/${guildId}/settings`, {
    method: "PATCH",
    body: JSON.stringify(settings),
  });
  return { ok: res.ok, data };
}

/**
 * ギルド辞書を取得
 */
export async function getGuildDict(guildId) {
  const { res, data } = await apiFetch(`/api/guilds/${guildId}/dict`, {
    method: "GET"
  });
  if (!res.ok) return [];
  return data ?? [];
}

/**
 * 辞書エントリを追加
 */
export async function addDictEntry(guildId, entry) {
  const { res, data } = await apiFetch(`/api/guilds/${guildId}/dict`, {
    method: "POST",
    body: JSON.stringify(entry),
  });
  return { ok: res.ok, data };
}

/**
 * 辞書エントリを削除
 */
export async function deleteDictEntry(guildId, word) {
  const { res } = await apiFetch(
      `/api/guilds/${guildId}/dict/${encodeURIComponent(word)}`,
      { method: "DELETE" }
  );
  return res.ok;
}
