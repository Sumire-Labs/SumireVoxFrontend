import { ref, onMounted } from "vue";
import { getGuildSettings, updateGuildSettings, getGuildDict, addDictEntry, deleteDictEntry } from "./guildApi.js";

export function useGuildSettings(guildId) {
    const settings = ref(null);
    const dictEntries = ref([]);
    const billingStatus = ref(null); // 追加
    const isLoading = ref(false);
    const isSaving = ref(false);
    const error = ref(null);

    async function load() {
        isLoading.value = true;
        error.value = null;
        try {
            const { getBillingStatus } = await import("@/features/billing/billingApi.js");
            const [s, d, b] = await Promise.all([
                getGuildSettings(guildId),
                getGuildDict(guildId),
                getBillingStatus() // 追加
            ]);
            settings.value = s;
            dictEntries.value = d;
            billingStatus.value = b; // 追加
        } catch (e) {
            console.error(e);
            error.value = e.message;
        } finally {
            isLoading.value = false;
        }
    }

    async function saveSettings() {
        if (!settings.value) return;
        isSaving.value = true;
        try {
            await updateGuildSettings(guildId, settings.value);
        } finally {
            isSaving.value = false;
        }
    }

    async function addWord(word, reading) {
        const { ok, data } = await addDictEntry(guildId, { word, reading });
        if (ok) {
            await loadDict(); // リロード
        }
        return ok;
    }

    async function removeWord(word) {
        const ok = await deleteDictEntry(guildId, word);
        if (ok) {
            await loadDict(); // リロード
        }
        return ok;
    }

    async function loadDict() {
        dictEntries.value = await getGuildDict(guildId);
    }

    onMounted(load);

    return {
        settings,
        dictEntries,
        billingStatus, // 追加
        isLoading,
        isSaving,
        error,
        saveSettings,
        addWord,
        removeWord,
        refresh: load
    };
}
