<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "@/features/auth/useAuth.js";

const router = useRouter();
const { isLoggedIn, refreshMe, logout } = useAuth();

const props = defineProps({
  brandName: { type: String, required: true },
});

onMounted(refreshMe);

function loginWithDiscord() {
  window.location.href = "/auth/discord/start";
}

function goDashboard() {
  router.push("/dashboard");
}

async function onLogout() {
  await logout();
  router.push("/");
}
</script>

<template>
  <header class="header">
    <a class="logo" href="/" aria-label="Sumire Vox Bot">
      <span class="logoMark" aria-hidden="true"></span>
      <span class="logoText">{{ props.brandName }}</span>
    </a>

    <nav class="nav">
      <a href="#features">機能</a>
      <a href="#howto">使い方</a>
      <a href="#premium">プレミアム</a>
    </nav>

    <div class="headerCtas">
      <button
          v-if="!isLoggedIn"
          class="btn primary"
          type="button"
          @click="loginWithDiscord"
      >
        Discordでログイン
      </button>

      <template v-else>
        <button class="btn primary" type="button" @click="goDashboard">
          ダッシュボード
        </button>
        <button class="btn ghost" type="button" @click="onLogout">
          ログアウト
        </button>
      </template>
    </div>
  </header>
</template>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 20;

  width: min(1100px, calc(100% - 28px));
  margin: 14px auto 0;
  padding: 12px 14px;

  display: flex;
  align-items: center;
  gap: 14px;

  background: var(--surface);
  backdrop-filter: blur(12px);
  border: 1px solid var(--stroke);
  border-radius: 14px;
  box-shadow: 0 8px 24px rgba(20, 25, 50, 0.06);
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: inherit;
  font-weight: 700;
}

.logoMark {
  width: 28px;
  height: 28px;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--primary2), var(--accent));
  box-shadow: 0 10px 20px rgba(123, 144, 255, 0.25);
}

.logoText {
  letter-spacing: 0.2px;
}

.nav {
  margin-left: auto;
  display: flex;
  gap: 14px;
}

.nav a {
  text-decoration: none;
  color: var(--muted);
  font-weight: 600;
  padding: 8px 10px;
  border-radius: 10px;
}

.nav a:hover {
  background: rgba(123, 144, 255, 0.10);
  color: var(--text);
}

.headerCtas {
  display: flex;
  gap: 10px;
}

@media (max-width: 920px) {
  .nav {
    display: none;
  }
}
</style>