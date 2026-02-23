import { createApp } from "vue";
import * as Sentry from "@sentry/vue";
import AppRoot from "@/app/AppRoot.vue";
import { router } from "@/app/router.js";

import "@/styles/base.css";
import "@/styles/components.css";
import "@/styles/layout.css";

const app = createApp(AppRoot);

// Sentry初期化（本番環境のみ）
if (import.meta.env.PROD) {
    Sentry.init({
        app,
        dsn: import.meta.env.VITE_SENTRY_DSN,
        integrations: [
            Sentry.browserTracingIntegration({ router }),
            Sentry.replayIntegration(),
        ],
        // パフォーマンストレースのサンプリングレート（0.0〜1.0）
        tracesSampleRate: 0.1,
        // セッションリプレイのサンプリングレート
        replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1.0,
        // 環境名
        environment: import.meta.env.MODE,
        // リリースバージョン（CI/CDで自動設定推奨）
        release: import.meta.env.VITE_APP_VERSION || "1.0.0",
        // 送信前にデータをフィルタリング
        beforeSend(event, hint) {
            // 開発者向けの詳細ログ
            console.error("[Sentry] Captured exception:", hint.originalException);
            return event;
        },
    });
}

// グローバルエラーハンドラー
app.config.errorHandler = (err, instance, info) => {
    // 本番環境：Sentryに送信
    if (import.meta.env.PROD) {
        Sentry.withScope((scope) => {
            scope.setExtra("componentName", instance?.$options?.name || "Unknown");
            scope.setExtra("info", info);
            Sentry.captureException(err);
        });
    }

    // 開発環境：コンソールに出力
    if (import.meta.env.DEV) {
        console.error("Global error:", err);
        console.error("Component:", instance?.$options?.name || instance);
        console.error("Info:", info);
    }
};

// 未処理のPromiseエラーをキャッチ
window.addEventListener("unhandledrejection", (event) => {
    if (import.meta.env.PROD) {
        Sentry.captureException(event.reason);
    }
    if (import.meta.env.DEV) {
        console.error("Unhandled promise rejection:", event.reason);
    }
});

app.use(router);
app.mount("#app");
