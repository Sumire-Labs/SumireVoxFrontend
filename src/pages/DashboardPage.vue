<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import HeaderBar from "@/components/HeaderBar.vue";
import { useGuilds } from "@/features/guilds/useGuilds.js";

const router = useRouter();
const { guilds, hasGuilds, isLoading, refreshGuilds } = useGuilds();

onMounted(refreshGuilds);

function openGuild(guildId) {
  router.push(`/dashboard/guilds/${guildId}`);
}
</script>

<template>
  <div class="page">
    <HeaderBar brand-name="Sumire Vox Bot" />

    <div style="padding: 24px; width: min(1100px, calc(100% - 28px)); margin: 0 auto;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
        <h1 style="margin: 0;">Dashboard</h1>
        <router-link 
          to="/dashboard/premium" 
          style="background: #5865f2; color: white; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-weight: bold; display: flex; align-items: center; gap: 8px;"
        >
          <span>💎 プレミアム管理</span>
        </router-link>
      </div>

      <p v-if="isLoading">読み込み中…</p>

      <p v-else-if="!hasGuilds" style="color: rgba(27,35,64,0.72);">
        管理できるサーバーがありません。
      </p>

      <div v-else class="guildList">
        <button
            v-for="g in guilds"
            :key="g.id"
            type="button"
            class="guildCard"
            @click="openGuild(g.id)"
        >
          <img
              v-if="g.icon"
              :src="`https://cdn.discordapp.com/icons/${g.id}/${g.icon}.png`"
              class="guildIcon"
              alt=""
          />
          <div v-else class="guildIcon placeholder" aria-hidden="true"></div>
          <div class="guildMeta">
            <div class="guildName">{{ g.name }}</div>
            <div class="guildId">ID: {{ g.id }}</div>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.guildList {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 12px;
}

.guildCard {
  text-align: left;
  display: flex;
  gap: 12px;
  align-items: center;

  border: 1px solid rgba(66, 84, 140, 0.15);
  border-radius: 16px;
  padding: 12px 12px;
  background: rgba(255, 255, 255, 0.65);
  cursor: pointer;
}

.guildCard:hover {
  transform: translateY(-1px);
  transition: 140ms transform ease;
}

.guildIcon {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(167, 182, 255, 0.65), rgba(143, 213, 255, 0.45));
  border: 1px solid rgba(66, 84, 140, 0.15);
  object-fit: cover;
}

.guildIcon.placeholder {
  background: linear-gradient(135deg, rgba(167, 182, 255, 0.65), rgba(143, 213, 255, 0.45));
}

.guildMeta {
  min-width: 0;
}

.guildName {
  font-weight: 900;
  color: rgba(27, 35, 64, 1);
}

.guildId {
  margin-top: 2px;
  font-size: 12px;
  color: rgba(27, 35, 64, 0.72);
  word-break: break-all;
}

@media (max-width: 920px) {
  .guildList {
    grid-template-columns: 1fr;
  }
}
</style>