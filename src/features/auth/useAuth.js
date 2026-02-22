// src/features/auth/useAuth.js

import { ref, computed } from "vue";
import { getMe, logout as logoutApi, logoutAll as logoutAllApi } from "./authApi.js";

const me = ref(null);
const isLoading = ref(false);
const isLoggedIn = computed(() => me.value !== null);

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

    async function logoutAll() {
        await logoutAllApi();
        me.value = null;
    }

    return {
        me,
        isLoggedIn,
        isLoading,
        refreshMe,
        logout,
        logoutAll,
    };
}
