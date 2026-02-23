// src/features/guilds/useGuildSettings.js

import { ref, watch, computed, onUnmounted, readonly } from "vue";
import {
    getGuildSettings,
    updateGuildSettings,
    getGuildDict,
    addDictEntry,
    deleteDictEntry
} from "./guildApi.js";
import { getBillingStatus } from "@/features/billing/billingApi.js";

export function useGuildSettings(guildIdRef) {
    const settings = ref(null);
    const dictEntries = ref([]);
    const billingStatus = ref(null);
    const isLoading = ref(false);
    const isSaving = ref(false);
    const error = ref(null);

    // guildId を computed で取得（ref または 生の値 両方に対応）
    const guildId = computed(() => {
        if (typeof guildIdRef === "function") return guildIdRef();
        if (guildIdRef?.value !== undefined) return guildIdRef.value;
        return guildIdRef;
    });

    // 現在のリクエストをキャンセルするためのコントローラー
    let abortController = null;

    async function load() {
        const id = guildId.value;
        if (!id) {
            console.warn("guildId is undefined, skipping load");
            return;
        }

        // 前のリクエストをキャンセル
        if (abortController) {
            abortController.abort();
        }
        abortController = new AbortController();

        isLoading.value = true;
        error.value = null;

        try {
            const [s, d, b] = await Promise.all([
                getGuildSettings(id),
                getGuildDict(id),
                getBillingStatus()
            ]);

            // キャンセルされていなければ状態を更新
            if (!abortController.signal.aborted) {
                settings.value = s;
                dictEntries.value = d;
                billingStatus.value = b;
            }
        } catch (e) {
            if (e.name === "AbortError") {
                // キャンセルされた場合は無視
                return;
            }
            console.error(e);
            error.value = e.message;
        } finally {
            if (!abortController?.signal.aborted) {
                isLoading.value = false;
            }
        }
    }

    async function saveSettings() {
        const id = guildId.value;
        if (!settings.value || !id) return { ok: false };

        isSaving.value = true;
        try {
            const result = await updateGuildSettings(id, settings.value);
            return result;
        } catch (e) {
            console.error("Save settings error:", e);
            return { ok: false, error: e.message };
        } finally {
            isSaving.value = false;
        }
    }

    async function addWord(word, reading) {
        const id = guildId.value;
        if (!id) return { ok: false, errors: ["ギルドIDが指定されていません"] };

        const { ok, errors } = await addDictEntry(id, { word, reading });
        if (ok) {
            await loadDict();
        }
        return { ok, errors };
    }

    async function removeWord(word) {
        const id = guildId.value;
        if (!id) return false;

        const ok = await deleteDictEntry(id, word);
        if (ok) {
            await loadDict();
        }
        return ok;
    }

    async function loadDict() {
        const id = guildId.value;
        if (!id) return;
        dictEntries.value = await getGuildDict(id);
    }

    // guildId が変更されたら自動でロード
    const stopWatch = watch(
        guildId,
        (newId) => {
            if (newId) {
                load();
            }
        },
        { immediate: true }
    );

    // クリーンアップ
    onUnmounted(() => {
        stopWatch();
        if (abortController) {
            abortController.abort();
        }
    });

    return {
        settings,
        dictEntries: readonly(dictEntries),
        billingStatus: readonly(billingStatus),
        isLoading: readonly(isLoading),
        isSaving: readonly(isSaving),
        error: readonly(error),
        saveSettings,
        addWord,
        removeWord,
        refresh: load,
    };
}
