// src/features/guilds/useGuilds.js

import { ref, computed } from "vue";
import { getGuilds } from "./guildApi.js";

const guilds = ref([]);
const isLoading = ref(false);
const hasGuilds = computed(() => guilds.value.length > 0);

export function useGuilds() {
    async function refreshGuilds() {
        isLoading.value = true;
        try {
            guilds.value = await getGuilds();
        } finally {
            isLoading.value = false;
        }
    }

    return {
        guilds,
        hasGuilds,
        isLoading,
        refreshGuilds,
    };
}
