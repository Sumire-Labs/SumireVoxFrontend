import { computed, ref } from "vue";
import { getMe, logout as logoutApi } from "./authApi.js";

// アプリ全体で共有する状態（このファイルが1回だけ評価される前提）
const me = ref(null);
const isLoading = ref(false);
const isLoggedIn = computed(() => Boolean(me.value));

export function useAuth() {
    async function refreshMe() {
        isLoading.value = true;
        try {
            me.value = await getMe();
        } finally {
            isLoading.value = false;
        }
    }

    async function logout() {
        await logoutApi();
        me.value = null;
    }

    return {
        me,
        isLoggedIn,
        isLoading,
        refreshMe,
        logout,
    };
}