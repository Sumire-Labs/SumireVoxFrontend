<script setup>
import { ref, onMounted } from "vue";
import HeaderBar from "@/components/HeaderBar.vue";
import { getBillingStatus, createCheckoutSession } from "@/features/billing/billingApi.js";

const billingStatus = ref({
  total_slots: 0,
  used_slots: 0,
  boosts: []
});
const isLoading = ref(true);
const isProcessing = ref(false);

onMounted(async () => {
  try {
    billingStatus.value = await getBillingStatus();
  } catch (error) {
    console.error("Failed to fetch billing status:", error);
  } finally {
    isLoading.value = false;
  }
});

async function handleUpgrade() {
  if (isProcessing.value) return;
  isProcessing.value = true;
  try {
    const { url } = await createCheckoutSession();
    window.location.href = url;
  } catch (error) {
    alert("エラーが発生しました: " + error.message);
  } finally {
    isProcessing.value = false;
  }
}
</script>

<template>
  <div class="page">
    <HeaderBar brand-name="Sumire Vox" />

    <main class="container">
      <div class="hero">
        <div>
          <h1 class="title">プレミアムダッシュボード</h1>
          <p class="subtitle">ブースト枠の管理とプランのアップグレードができます。</p>
        </div>
      </div>

      <section class="grid2">
        <div class="card">
          <h2 class="cardEyebrow">現在のプラン状態</h2>

          <div class="statRow">
            <div class="statValue">{{ billingStatus.total_slots }}</div>
            <div class="statLabel">スロット合計</div>
          </div>

          <div class="progress" role="progressbar" aria-label="スロット使用率">
            <div
                class="progressBar"
                :style="{
                width:
                  billingStatus.total_slots > 0
                    ? (billingStatus.used_slots / billingStatus.total_slots) * 100 + '%'
                    : '0%'
              }"
            ></div>
          </div>

          <p class="muted">
            {{ billingStatus.used_slots }} / {{ billingStatus.total_slots }} スロット使用中
          </p>
        </div>

        <div class="card cardStack">
          <div>
            <h2 class="cardEyebrow">プランをアップグレード</h2>
            <p class="muted">
              ブースト枠を追加して、より多くのサーバーで制限解除（500文字読み上げ等）を有効にしましょう。
            </p>
          </div>

          <button type="button" class="btn primary buyBtn" @click="handleUpgrade" :disabled="isProcessing">
            <span v-if="isProcessing">処理中...</span>
            <span v-else>プレミアムプランを購入（Stripeへ）</span>
          </button>
        </div>
      </section>

      <section class="card listCard">
        <div class="listHeader">
          <h2 class="listTitle">ブースト中のサーバー</h2>
        </div>

        <div v-if="isLoading" class="listEmpty muted">
          読み込み中...
        </div>

        <div v-else-if="billingStatus.boosts.length === 0" class="listEmpty">
          <div class="emptyIcon" aria-hidden="true">🚀</div>
          <p class="muted">現在ブースト中のサーバーはありません。</p>
          <p class="muted small">Discord上の <code>/boost activate</code> コマンドでブーストを適用できます。</p>
        </div>

        <div v-else class="rows">
          <div v-for="boost in billingStatus.boosts" :key="boost.guild_id" class="row">
            <div class="rowLeft">
              <div class="avatar" aria-hidden="true">
                {{ boost.guild_name.charAt(0) }}
              </div>
              <div class="rowMeta">
                <div class="rowTitle">{{ boost.guild_name }}</div>
                <div class="rowSub muted">ID: {{ boost.guild_id }}</div>
              </div>
            </div>

            <div class="badge" aria-label="有効">
              Active
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
/* DashboardPage.vue の雰囲気（明るい・ガラス調・丸み・薄い境界）に合わせる */
.container {
  padding: 24px;
  width: min(1100px, calc(100% - 28px));
  margin: 0 auto;
}

.hero {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 18px;
  gap: 12px;
}

.title {
  margin: 0;
  font-size: 28px;
  letter-spacing: -0.02em;
  color: var(--text);
  font-weight: 900;
}

.subtitle {
  margin-top: 6px;
  color: var(--muted);
}

.grid2 {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 12px;
  margin-bottom: 12px;
}

.card {
  border: 1px solid var(--stroke);
  border-radius: 16px;
  padding: 16px;
  background: var(--surface);
  box-shadow: var(--shadow);
}

.cardStack {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 12px;
}

.cardEyebrow {
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted);
  margin: 0 0 10px 0;
  font-weight: 900;
}

.statRow {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.statValue {
  font-size: 40px;
  font-weight: 900;
  color: var(--text);
  line-height: 1;
}

.statLabel {
  color: var(--muted);
  font-weight: 800;
}

.progress {
  margin-top: 10px;
  height: 10px;
  border-radius: 999px;
  background: rgba(66, 84, 140, 0.12);
  overflow: hidden;
  border: 1px solid rgba(66, 84, 140, 0.10);
}

.progressBar {
  height: 100%;
  background: linear-gradient(135deg, var(--primary2), var(--accent));
  transition: width 320ms ease;
}

.muted {
  margin-top: 10px;
  color: var(--muted);
}

.small {
  font-size: 12px;
}

.buyBtn {
  width: 100%;
  padding: 12px 14px;
}

.buyBtn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.listCard {
  padding: 0;
  overflow: hidden;
}

.listHeader {
  padding: 16px;
  border-bottom: 1px solid var(--stroke);
}

.listTitle {
  margin: 0;
  font-size: 18px;
  font-weight: 900;
  color: var(--text);
}

.listEmpty {
  padding: 22px 16px;
  text-align: center;
}

.emptyIcon {
  font-size: 40px;
  margin-bottom: 8px;
}

.rows {
  display: flex;
  flex-direction: column;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-top: 1px solid var(--stroke);
}

.row:first-child {
  border-top: none;
}

.row:hover {
  background: rgba(255, 255, 255, 0.35);
}

.rowLeft {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.avatar {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  font-weight: 900;
  color: rgba(27, 35, 64, 0.9);
  background: linear-gradient(135deg, rgba(167, 182, 255, 0.65), rgba(143, 213, 255, 0.45));
  border: 1px solid rgba(66, 84, 140, 0.15);
  flex: none;
}

.rowMeta {
  min-width: 0;
}

.rowTitle {
  font-weight: 900;
  color: var(--text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.rowSub {
  margin-top: 2px;
  font-size: 12px;
  word-break: break-all;
}

.badge {
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 6px 10px;
  border-radius: 999px;
  color: rgba(15, 22, 51, 0.9);
  background: rgba(143, 213, 255, 0.35);
  border: 1px solid rgba(66, 84, 140, 0.15);
}

@media (max-width: 920px) {
  .grid2 {
    grid-template-columns: 1fr;
  }
}
</style>