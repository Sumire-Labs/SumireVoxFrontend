// src/features/guilds/guildApi.js

import { apiFetch, apiGet, apiPost, apiPatch, apiDelete, ApiError } from "@/lib/http.js";
import { validateDictEntry } from "@/lib/validation.js";

/**
 * ギルド一覧を取得
 * @returns {Promise<Array>}
 */
export async function getGuilds() {
  try {
    const { res, data } = await apiGet("/api/guilds");
    if (!res.ok) return [];
    return data ?? [];
  } catch (error) {
    console.error("getGuilds error:", error);
    return [];
  }
}

/**
 * ギルド設定を取得
 * @param {string} guildId
 * @returns {Promise<Object|null>}
 */
export async function getGuildSettings(guildId) {
  if (!guildId) {
    throw new Error("guildId is required");
  }

  const { res, data } = await apiGet(`/api/guilds/${encodeURIComponent(guildId)}/settings`);

  if (res.status === 200) {
    // データが空（Bot未導入）の場合は null を返す
    if (data && Object.keys(data).length === 0) return null;
    return data;
  }

  // 404 の場合も未導入として扱う
  if (res.status === 404) return null;

  // それ以外のエラー
  throw new ApiError(res.status, `設定の取得に失敗しました: ${res.status}`);
}

/**
 * ギルド設定を更新
 * @param {string} guildId
 * @param {Object} settings
 * @returns {Promise<{ok: boolean, data: any}>}
 */
export async function updateGuildSettings(guildId, settings) {
  if (!guildId) {
    throw new Error("guildId is required");
  }

  const { res, data } = await apiPatch(
      `/api/guilds/${encodeURIComponent(guildId)}/settings`,
      settings
  );

  return { ok: res.ok, data };
}

/**
 * ギルド辞書を取得
 * @param {string} guildId
 * @returns {Promise<Array>}
 */
export async function getGuildDict(guildId) {
  if (!guildId) {
    throw new Error("guildId is required");
  }

  try {
    const { res, data } = await apiGet(`/api/guilds/${encodeURIComponent(guildId)}/dict`);
    if (!res.ok) return [];
    return data ?? [];
  } catch (error) {
    console.error("getGuildDict error:", error);
    return [];
  }
}

/**
 * 辞書エントリを追加
 * @param {string} guildId
 * @param {{ word: string, reading: string }} entry
 * @returns {Promise<{ok: boolean, data: any, errors: string[]}>}
 */
export async function addDictEntry(guildId, entry) {
  if (!guildId) {
    return { ok: false, data: null, errors: ["guildId is required"] };
  }

  // クライアント側バリデーション
  const validation = validateDictEntry(entry.word, entry.reading);
  if (!validation.valid) {
    return { ok: false, data: null, errors: validation.errors };
  }

  try {
    const { res, data } = await apiPost(
        `/api/guilds/${encodeURIComponent(guildId)}/dict`,
        {
          word: entry.word.trim(),
          reading: entry.reading.trim(),
        }
    );

    return { ok: res.ok, data, errors: [] };
  } catch (error) {
    console.error("addDictEntry error:", error);
    return { ok: false, data: null, errors: [error.message || "追加に失敗しました"] };
  }
}

/**
 * 辞書エントリを削除
 * @param {string} guildId
 * @param {string} word
 * @returns {Promise<boolean>}
 */
export async function deleteDictEntry(guildId, word) {
  if (!guildId || !word) {
    return false;
  }

  try {
    const { res } = await apiDelete(
        `/api/guilds/${encodeURIComponent(guildId)}/dict/${encodeURIComponent(word)}`
    );
    return res.ok;
  } catch (error) {
    console.error("deleteDictEntry error:", error);
    return false;
  }
}
