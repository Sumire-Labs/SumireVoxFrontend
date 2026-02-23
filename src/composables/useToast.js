// src/composables/useToast.js

import { ref, onUnmounted } from "vue";

/**
 * トースト通知を管理するComposable
 * @param {number} defaultDuration - デフォルトの表示時間（ミリ秒）
 */
export function useToast(defaultDuration = 3000) {
    const toast = ref({
        show: false,
        message: "",
        type: "success", // "success" | "error" | "warning" | "info"
    });

    let toastTimer = null;

    function showToast(message, type = "success", duration = defaultDuration) {
        // 前のタイマーをクリア
        if (toastTimer) {
            clearTimeout(toastTimer);
            toastTimer = null;
        }

        toast.value = { show: true, message, type };

        toastTimer = setTimeout(() => {
            toast.value.show = false;
            toastTimer = null;
        }, duration);
    }

    function hideToast() {
        toast.value.show = false;
        if (toastTimer) {
            clearTimeout(toastTimer);
            toastTimer = null;
        }
    }

    function showSuccess(message, duration) {
        showToast(message, "success", duration);
    }

    function showError(message, duration) {
        showToast(message, "error", duration);
    }

    function showWarning(message, duration) {
        showToast(message, "warning", duration);
    }

    function showInfo(message, duration) {
        showToast(message, "info", duration);
    }

    // コンポーネントがアンマウントされたらタイマーをクリア
    onUnmounted(() => {
        if (toastTimer) {
            clearTimeout(toastTimer);
            toastTimer = null;
        }
    });

    return {
        toast,
        showToast,
        hideToast,
        showSuccess,
        showError,
        showWarning,
        showInfo,
    };
}
