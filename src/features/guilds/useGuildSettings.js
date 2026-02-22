import { ref, watch, computed } from "vue";
import { getGuildSettings, updateGuildSettings, getGuildDict, addDictEntry, deleteDictEntry } from "./guildApi.js";

export function useGuildSettings(guildIdRef) {
    const settings = ref(null);
    const dictEntries = ref([]);
    const billingStatus = ref(null);
    const isLoading = ref(false);
    const isSaving = ref(false);
    const error = ref(null);

    // guildId を computed で取得（ref または 生の値 両方に対応）
    const guildId = computed(() => {
        if (typeof guildIdRef === 'function') return guildIdRef();
        if (guildIdRef?.value !== undefined) return guildIdRef.value;
        return guildIdRef;
    });

    async function load() {
        const id = guildId.value;
        if (!id) {
            console.warn("guildId is undefined, skipping load");
            return;
        }

        isLoading.value = true;
        error.value = null;
        try {
            const { getBillingStatus } = await import("@/features/billing/billingApi.js");
            const [s, d, b] = await Promise.all([
                getGuildSettings(id),
                getGuildDict(id),
                getBillingStatus()
            ]);
            settings.value = s;
            dictEntries.value = d;
            billingStatus.value = b;
        } catch (e) {
            console.error(e);
            error.value = e.message;
        } finally {
            isLoading.value = false;
        }
    }

    async function saveSettings() {
        const id = guildId.value;
        if (!settings.value || !id) return;
        isSaving.value = true;
        try {
            await updateGuildSettings(id, settings.value);
        } finally {
            isSaving.value = false;
        }
    }

    async function addWord(word, reading) {
        const id = guildId.value;
        if (!id) return false;
        const { ok } = await addDictEntry(id, { word, reading });
        if (ok) {
            await loadDict();
        }
        return ok;
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
    watch(guildId, (newId) => {
        if (newId) {
            load();
        }
    }, { immediate: true });

    return {
        settings,
        dictEntries,
        billingStatus,
        isLoading,
        isSaving,
        error,
        saveSettings,
        addWord,
        removeWord,
        refresh: load
    };
}
