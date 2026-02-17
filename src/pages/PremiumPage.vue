<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import HeaderBar from "@/components/HeaderBar.vue";
import { 
  getBillingStatus, 
  createCheckoutSession, 
  unboostGuild, 
  boostGuild, 
  getBillingConfig 
} from "@/features/billing/billingApi.js";

const route = useRoute();

const billingStatus = ref({
  total_slots: 0,
  used_slots: 0,
  boosts: [],
  manageable_guilds: []
});
const billingConfig = ref({
  client_id_0: '',
  bot_instances: [],
  max_boosts_per_guild: 0
});
const isLoading = ref(true);
const isProcessing = ref(false);

async function fetchData() {
  try {
    const [status, config] = await Promise.all([
      getBillingStatus(),
      getBillingConfig()
    ]);
    billingStatus.value = status;
    billingConfig.value = config;
  } catch (error) {
    console.error("Failed to fetch billing data:", error);
  } finally {
    isLoading.value = false;
  }
}

onMounted(async () => {
  await fetchData();
  
  // 決済完了後の自動更新チェック
  if (route.query.session_id) {
    // 実際にはAPIでセッション確認する方が良いが、ここでは再取得で代用
    setTimeout(fetchData, 2000); 
  }
});

const isOverLimit = computed(() => {
  return billingStatus.value.used_slots > billingStatus.value.total_slots;
});

const availableSlots = computed(() => {
  return Math.max(0, billingStatus.value.total_slots - billingStatus.value.used_slots);
});

async function handleUpgrade() {
  if (isProcessing.value) return;
  isProcessing.value = true;
  try {
    const { url } = await createCheckoutSession();
    window.location.href = url;
  } catch (error) {
    alert("エラーが発生しました: " + error.message);
    isProcessing.value = false;
  }
}

async function handleBoost(guild) {
  if (availableSlots.value <= 0) {
    alert("空きスロットがありません。プランをアップグレードしてください。");
    return;
  }
  
  // ボット在席チェック
  if (!guild.bot_in_guild) {
    const mainBotId = billingConfig.value.client_id_0 || import.meta.env.VITE_DISCORD_CLIENT_ID || '1469627429008969741';
    const inviteUrl = getInviteUrl(mainBotId);
    const confirmed = confirm(
      "ボットがサーバーに参加していません。\n先にボットを招待してからブーストを適用することをお勧めします。\n\nボットを招待しますか？"
    );
    if (confirmed) {
      window.open(inviteUrl, '_blank');
    }
    return;
  }
  
  isProcessing.value = true;
  try {
    await boostGuild(guild.id);
    await fetchData();
  } catch (error) {
    alert("ブーストに失敗しました: " + error.message);
  } finally {
    isProcessing.value = false;
  }
}

async function handleUnboost(guildId) {
  if (!confirm("このサーバーのブーストを解除しますか？\n枠が返却され、他のサーバーで使用できるようになります。")) return;
  
  isProcessing.value = true;
  try {
    await unboostGuild(guildId);
    // 解除成功後、即座にデータを再取得して表示を更新する
    await fetchData();
  } catch (error) {
    alert("解除に失敗しました: " + error.message);
  } finally {
    isProcessing.value = false;
  }
}

function getGuildBoostStatus(guildId) {
  return billingStatus.value.boosts.find(b => b.guild_id === String(guildId));
}

function getInviteUrl(botId) {
  return `https://discord.com/api/oauth2/authorize?client_id=${botId}&permissions=3145728&scope=bot%20applications.commands`;
}
</script>

<template>
  <div class="page">
    <HeaderBar brand-name="Sumire Vox" />

    <main class="container">
      <!-- 警告表示 -->
      <div v-if="isOverLimit" class="alert error">
        <div class="alertIcon">⚠️</div>
        <div class="alertContent">
          <h3 class="alertTitle">ブースト制限を超過しています</h3>
          <p>保有スロット数を超えてブーストが適用されています。一部のブーストが停止している可能性があるため、スロットを再割り当てするかアップグレードしてください。</p>
        </div>
      </div>

      <div class="hero">
        <div>
          <h1 class="title">プレミアムダッシュボード</h1>
          <p class="subtitle">マルチインスタンス機能とブースト枠の管理</p>
        </div>
      </div>

      <section class="grid2">
        <!-- スロット・ビジュアライザー -->
        <div class="card">
          <h2 class="cardEyebrow">スロット利用状況</h2>

          <div class="statRow">
            <div class="statValue">{{ billingStatus.used_slots }} <span class="statSeparator">/</span> {{ billingStatus.total_slots }}</div>
            <div class="statLabel">使用中スロット</div>
          </div>

          <div class="progress" :class="{ 'over': isOverLimit }" role="progressbar">
            <div
                class="progressBar"
                :style="{
                width:
                  billingStatus.total_slots > 0
                    ? Math.min(100, (billingStatus.used_slots / billingStatus.total_slots) * 100) + '%'
                    : (billingStatus.used_slots > 0 ? '100%' : '0%')
              }"
            ></div>
          </div>

          <p class="muted" v-if="!isOverLimit">
            残り <strong>{{ availableSlots }}</strong> スロット使用可能です。
          </p>
          <p class="errorText" v-else>
            <strong>{{ billingStatus.used_slots - billingStatus.total_slots }}</strong> スロット分オーバーしています。
          </p>
        </div>

        <div class="card cardStack">
          <div>
            <h2 class="cardEyebrow">プラン管理</h2>
            <p class="muted">
              スロットを追加購入して、複数のサーバーでの同時読み上げやサブBotの追加を解放しましょう。
            </p>
          </div>

          <button type="button" class="btn primary buyBtn" @click="handleUpgrade" :disabled="isProcessing">
            <span v-if="isProcessing">処理中...</span>
            <span v-else>💳 スロットを追加購入する</span>
          </button>
        </div>
      </section>

      <!-- サーバーリスト -->
      <section class="card listCard">
        <div class="listHeader">
          <h2 class="listTitle">管理可能なサーバー</h2>
        </div>

        <div v-if="isLoading" class="listEmpty muted">
          読み込み中...
        </div>

        <div v-else-if="billingStatus.manageable_guilds.length === 0" class="listEmpty">
          <div class="emptyIcon">📥</div>
          <p class="muted">管理可能なサーバーが見つかりません。</p>
        </div>

        <div v-else class="rows">
          <div v-for="guild in billingStatus.manageable_guilds" :key="guild.id" class="row">
            <div class="rowLeft">
              <div v-if="guild.icon" class="avatarImg">
                <img :src="`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`" alt="" />
              </div>
              <div v-else class="avatar" aria-hidden="true">
                {{ guild.name.charAt(0) }}
              </div>
              <div class="rowMeta">
                <div class="rowTitle">{{ guild.name }}</div>
                <div class="boostStatus">
                  <span v-if="guild.boost_count > 0" class="activeBoost">
                    💎 ブースト適用中 ({{ guild.boost_count }} / {{ billingConfig.max_boosts_per_guild }})
                  </span>
                  <span v-else class="inactiveBoost">ブースト未適用</span>
                  <span v-if="!guild.bot_in_guild" class="botWarning">⚠️ ボット不在</span>
                </div>
              </div>
            </div>

            <div class="rowRight">
              <!-- ブースト操作 -->
              <div class="actionGroup">
                <button 
                  v-if="guild.boost_count < billingConfig.max_boosts_per_guild"
                  type="button" 
                  class="boostBtn" 
                  @click="handleBoost(guild)"
                  :disabled="isProcessing || availableSlots <= 0"
                >
                  {{ guild.boost_count > 0 ? '追加ブースト' : 'ブーストする' }}
                </button>
                <button 
                  v-if="getGuildBoostStatus(guild.id)"
                  type="button" 
                  class="unboostBtn" 
                  @click="handleUnboost(guild.id)"
                  :disabled="isProcessing"
                >
                  解除
                </button>
              </div>

              <!-- 招待・機能ステータス (ブースト時のみ) -->
              <div v-if="guild.boost_count > 0" class="inviteActions">
                <div class="featureBadge">
                  ✨ プレミアム機能有効
                </div>
                <div class="inviteBadge" :class="{ 'missing': !guild.bot_in_guild }">
                  1台目: {{ guild.bot_in_guild ? '導入済み' : '未導入' }}
                </div>
                <template v-for="(bot, index) in billingConfig.bot_instances" :key="bot.id">
                  <a 
                    v-if="index > 0 && guild.boost_count >= index + 1" 
                    :href="getInviteUrl(bot.client_id)" 
                    target="_blank" 
                    class="inviteLink"
                  >
                    🚀 {{ bot.bot_name }}を招待
                  </a>
                  <div v-else-if="index > 0 && guild.boost_count < index + 1" class="lockedInvite">
                    🔒 {{ index + 1 }}ブーストで{{ index + 1 }}台目解放
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.container {
  padding: 24px;
  width: min(1100px, calc(100% - 28px));
  margin: 0 auto;
}

.alert {
  display: flex;
  gap: 16px;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 24px;
}

.alert.error {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #991b1b;
}

.alertIcon {
  font-size: 24px;
}

.alertTitle {
  margin: 0 0 4px 0;
  font-weight: 900;
}

.hero {
  margin-bottom: 18px;
}

.title {
  margin: 0;
  font-size: 28px;
  font-weight: 900;
}

.subtitle {
  color: var(--muted);
  margin-top: 4px;
}

.grid2 {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 24px;
}

.card {
  border: 1px solid var(--stroke);
  border-radius: 16px;
  padding: 20px;
  background: var(--surface);
  box-shadow: var(--shadow);
}

.cardStack {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.cardEyebrow {
  font-size: 12px;
  text-transform: uppercase;
  color: var(--muted);
  margin: 0 0 12px 0;
  font-weight: 900;
}

.statRow {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 12px;
}

.statValue {
  font-size: 36px;
  font-weight: 900;
}

.statSeparator {
  color: var(--muted);
  font-size: 24px;
  margin: 0 4px;
}

.progress {
  height: 12px;
  border-radius: 999px;
  background: rgba(66, 84, 140, 0.1);
  overflow: hidden;
  margin-bottom: 12px;
}

.progress.over {
  background: #fee2e2;
}

.progressBar {
  height: 100%;
  background: linear-gradient(90deg, #5865f2, #8547ff);
  transition: width 0.5s ease;
}

.progress.over .progressBar {
  background: #ef4444;
}

.muted {
  color: var(--muted);
  font-size: 14px;
}

.errorText {
  color: #ef4444;
  font-size: 14px;
}

.buyBtn {
  width: 100%;
  padding: 14px;
  font-weight: 900;
}

.listCard {
  padding: 0;
}

.listHeader {
  padding: 16px 20px;
  border-bottom: 1px solid var(--stroke);
}

.listTitle {
  margin: 0;
  font-size: 18px;
  font-weight: 900;
}

.listEmpty {
  padding: 40px;
  text-align: center;
}

.emptyIcon {
  font-size: 48px;
  margin-bottom: 12px;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--stroke);
}

.row:last-child {
  border-bottom: none;
}

.rowLeft {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar, .avatarImg {
  width: 48px;
  height: 48px;
  border-radius: 16px;
  overflow: hidden;
}

.avatar {
  background: #eef2ff;
  display: grid;
  place-items: center;
  font-weight: 900;
  color: #5865f2;
}

.avatarImg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.rowTitle {
  font-weight: 900;
}

.boostStatus {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  margin-top: 2px;
}

.botWarning {
  color: #f59e0b;
  font-weight: bold;
}

.actionGroup {
  display: flex;
  gap: 8px;
}

.inviteBadge.missing {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
  border-color: rgba(245, 158, 11, 0.2);
}

.activeBoost {
  color: #8547ff;
  font-weight: bold;
}

.inactiveBoost {
  color: var(--muted);
}

.rowRight {
  display: flex;
  align-items: center;
  gap: 16px;
}

.boostBtn {
  background: #5865f2;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}

.boostBtn:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
}

.unboostBtn {
  background: white;
  border: 1px solid #ef4444;
  color: #ef4444;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}

.inviteActions {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-end;
}

.featureBadge {
  font-size: 11px;
  background: #fffbeb;
  padding: 2px 8px;
  border-radius: 4px;
  color: #b45309;
  font-weight: bold;
  border: 1px solid #fde68a;
}

.lockedInvite {
  font-size: 11px;
  color: #94a3b8;
  font-style: italic;
}

.inviteBadge {
  font-size: 11px;
  background: #f1f5f9;
  padding: 2px 8px;
  border-radius: 4px;
  color: #64748b;
}

.inviteLink {
  font-size: 13px;
  color: #5865f2;
  text-decoration: none;
  font-weight: bold;
}

.inviteLink:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .grid2 {
    grid-template-columns: 1fr;
  }
  .row {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  .rowRight {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
