<script setup>
import { onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";
import HeaderBar from "@/components/HeaderBar.vue";
import FooterBar from "@/components/FooterBar.vue";
import { useGuilds } from "@/features/guilds/useGuilds.js";

const router = useRouter();
const { guilds, hasGuilds, isLoading, refreshGuilds } = useGuilds();

const invitedGuilds = computed(() => guilds.value.filter(g => g.bot_in_guild));
const hasInvitedGuilds = computed(() => invitedGuilds.value.length > 0);

onMounted(refreshGuilds);

function openGuild(guildId) {
  router.push(`/dashboard/guilds/${guildId}`);
}

function handleGuildClick(guild) {
  openGuild(guild.id);
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

      <div v-else-if="!hasInvitedGuilds" class="listEmpty">
        <div class="emptyIcon">📥</div>
        <p class="muted">管理可能なサーバー（Bot導入済み）が見つかりません。</p>
        <p class="emptyHint">サーバーにBotを招待すると、ここに表示されます。</p>
        <router-link to="/dashboard/premium" class="btn primary inviteAllBtn">
          💎 プレミアム管理で確認
        </router-link>
      </div>

      <div v-else class="rows">
        <div
            v-for="g in invitedGuilds"
            :key="g.id"
            class="row"
            @click="handleGuildClick(g)"
        >
          <div class="rowLeft">
            <img
                v-if="g.icon"
                :src="`https://cdn.discordapp.com/icons/${g.id}/${g.icon}.png`"
                class="avatarImg"
                alt=""
            />
            <div v-else class="avatar" aria-hidden="true">
              {{ g.name.charAt(0) }}
            </div>
            <div class="rowMeta">
              <div class="rowTitle">{{ g.name }}</div>
              <div class="rowId">ID: {{ g.id }}</div>
            </div>
          </div>
          
          <div class="rowRight">
            <button class="settings-btn">
              ⚙️ 設定を開く
            </button>
          </div>
        </div>
      </div>
    </div>
    <FooterBar />
  </div>
</template>

<style scoped>
.rows {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 12px;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border: 1px solid var(--stroke);
  border-radius: 16px;
  background: var(--surface);
  cursor: pointer;
  transition: all 0.2s ease;
}

.row:hover {
  transform: translateY(-1px);
  border-color: rgba(123, 144, 255, 0.3);
  background: rgba(255, 255, 255, 0.85);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}

.rowLeft {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.avatar, .avatarImg {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  flex-shrink: 0;
  object-fit: cover;
}

.avatar {
  background: linear-gradient(135deg, var(--primary2), var(--accent));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 900;
  font-size: 20px;
  border: 1px solid var(--stroke);
}

.avatarImg img {
  width: 100%;
  height: 100%;
  border-radius: 14px;
  border: 1px solid var(--stroke);
}

.rowMeta {
  min-width: 0;
}

.rowTitle {
  font-weight: 900;
  color: var(--text);
  font-size: 16px;
}

.rowId {
  margin-top: 2px;
  font-size: 12px;
  color: var(--muted);
}

.settings-btn {
  background: white;
  border: 1px solid var(--stroke);
  padding: 8px 16px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: bold;
  color: var(--text);
  transition: all 0.2s;
}

.row:hover .settings-btn {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}

.listEmpty {
  padding: 60px 20px;
  text-align: center;
  background: var(--surface);
  border: 1px solid var(--stroke);
  border-radius: 20px;
}

.emptyIcon {
  font-size: 48px;
  margin-bottom: 16px;
}

.muted {
  color: var(--muted);
}

.emptyHint {
  font-size: 14px;
  color: var(--muted);
  margin-top: 8px;
  margin-bottom: 24px;
}

.inviteAllBtn {
  text-decoration: none;
  display: inline-block;
}

@media (max-width: 600px) {
  .row {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  .rowRight {
    width: 100%;
  }
  .settings-btn {
    width: 100%;
  }
}
</style>