import { createApp } from "vue";
import AppRoot from "@/app/AppRoot.vue";
import { router } from "@/app/router.js";

import "@/styles/base.css";
import "@/styles/components.css";
import "@/styles/layout.css";

// グローバルエラーハンドラー
const app = createApp(AppRoot);

app.config.errorHandler = (err, instance, info) => {
    console.error("Global error:", err);
    console.error("Component:", instance);
    console.error("Info:", info);
    // 本番環境ではエラートラッキングサービスに送信
};

app.use(router);
app.mount("#app");
