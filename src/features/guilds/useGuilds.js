// src/features/guilds/useGuilds.js

import { ref, computed, readonly } from "vue";
import { getGuilds } from "./guildApi.js";

const guilds = ref([]);
const isLoading = ref(false);
const error = ref(null);

const hasGuilds = computed(() => guilds.value.length > 0);

export function useGuilds() {
    async function refreshGuilds() {
        if (isLoading.value) return;

        isLoading.value = true;
        error.value = null;

        try {
            guilds.value = await getGuilds();
        } catch (e) {
            console.error("Failed to fetch guilds:", e);
            error.value = e.message;
            guilds.value = [];
        } finally {
            isLoading.value = false;
        }
    }

    return {
        guilds: readonly(guilds),
        hasGuilds,
        isLoading: readonly(isLoading),
        error: readonly(error),
        refreshGuilds,
    };
}
