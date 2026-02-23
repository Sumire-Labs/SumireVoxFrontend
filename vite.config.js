import { fileURLToPath, URL } from "node:url";

import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";

export default defineConfig(({ mode }) => {
  // 環境変数を読み込む
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      vue(),
      // 開発環境のみDevToolsを有効化
      mode === "development" && vueDevTools(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    server: {
      proxy: {
        "/api": {
          target: env.VITE_API_BASE_URL || "http://localhost:8787",
          changeOrigin: true,
        },
        "/auth": {
          target: env.VITE_API_BASE_URL || "http://localhost:8787",
          changeOrigin: true,
        },
      },
    },
    build: {
      // チャンクサイズの警告閾値
      chunkSizeWarningLimit: 500,
      rollupOptions: {
        output: {
          // ベンダーチャンクの分離
          manualChunks: {
            vue: ["vue", "vue-router"],
          },
        },
      },
    },
  };
});
