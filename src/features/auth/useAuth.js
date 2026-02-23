// src/features/auth/useAuth.js

import { ref, computed, readonly } from "vue";
import { getMe, logout as logoutApi, logoutAll as logoutAllApi } from "./authApi.js";

// モジュールスコープの状態（シングルトンパターン）
// SSR対応が必要な場合は provide/inject パターンに変更する
const me = ref(null);
const isLoading = ref(false);
const isInitialized = ref(false);
const lastError = ref(null);

const isLoggedIn = computed(() => me.value !== null);

export function useAuth() {
    async function refreshMe() {
        // 既にロード中の場合は待機
        if (isLoading.value) {
            return;
        }

        isLoading.value = true;
        lastError.value = null;

        try {
            me.value = await getMe();
            isInitialized.value = true;
        } catch (error) {
            console.error("Failed to refresh auth state:", error);
            lastError.value = error;
            me.value = null;
        } finally {
            isLoading.value = false;
        }
    }

    async function logout() {
        try {
            await logoutApi();
        } catch (error) {
            console.error("Logout failed:", error);
            // ログアウト失敗してもローカル状態はクリアする
        } finally {
            me.value = null;
        }
    }

    async function logoutAll() {
        try {
            await logoutAllApi();
        } catch (error) {
            console.error("Logout all failed:", error);
            throw error;
        } finally {
            me.value = null;
        }
    }

    /**
     * 状態をリセット（テスト用）
     */
    function reset() {
        me.value = null;
        isLoading.value = false;
        isInitialized.value = false;
        lastError.value = null;
    }

    return {
        // 読み取り専用でエクスポート
        me: readonly(me),
        isLoggedIn,
        isLoading: readonly(isLoading),
        isInitialized: readonly(isInitialized),
        lastError: readonly(lastError),

        // アクション
        refreshMe,
        logout,
        logoutAll,
        reset,
    };
}
