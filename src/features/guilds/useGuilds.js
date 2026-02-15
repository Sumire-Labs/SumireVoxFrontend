import { computed, ref } from "vue";
import { getGuilds as fetchGuilds } from "./guildApi.js";

const guilds = ref([]);
const isLoading = ref(false);

export function useGuilds() {
    async function refreshGuilds() {
        isLoading.value = true;
        try {
            guilds.value = await fetchGuilds();
        } finally {
            isLoading.value = false;
        }
    }

    const hasGuilds = computed(() => guilds.value.length > 0);

    return {
        guilds,
        hasGuilds,
        isLoading,
        refreshGuilds,
    };
}