<!-- GuildSettingsPage.vue -->
<script setup>
import { ref, computed, watch, onUnmounted } from "vue";
import HeaderBar from "@/components/HeaderBar.vue";
import FooterBar from "@/components/FooterBar.vue";
import { useGuildSettings } from "@/features/guilds/useGuildSettings.js";
import { useToast } from "@/composables/useToast.js";
import { getDiscordInviteUrl } from "@/lib/config.js";
import { validateDictEntry } from "@/lib/validation.js";

const props = defineProps({
  id: { type: String, required: true },
});

const {
  settings,
  dictEntries,
  billingStatus,
  isLoading,
  isSaving,
  error,
  saveSettings: saveSettingsApi,
  addWord,
  removeWord,
  refresh
} = useGuildSettings(() => props.id);

const { toast, showSuccess, showError, hideToast } = useToast();

const isBoosted = computed(() => {
  if (!billingStatus.value) return false;
  const guild = billingStatus.value.manageable_guilds?.find(g => String(g.id) === String(props.id));
  return (guild?.boost_count || 0) >= 1;
});

const dictLimit = computed(() => isBoosted.value ? 100 : 10);
const charLimit = computed(() => isBoosted.value ? 200 : 50);

// スライダーの進捗率を計算
const sliderProgress = computed(() => {
  if (!settings.value) return 0;
  const min = 10;
  const max = charLimit.value;
  const value = settings.value.max_chars;
  return ((value - min) / (max - min)) * 100;
});

const inviteUrl = computed(() => getDiscordInviteUrl(props.id, true));

const newWord = ref("");
const newReading = ref("");
const wordError = ref("");

// 文字数制限のバリデーション
watch(
    () => settings.value?.max_chars,
    (newValue, oldValue) => {
      if (!settings.value || oldValue === undefined) return;

      if (!isBoosted.value && newValue > 50) {
        settings.value.max_chars = 50;
        showError("プレミアム（1ブースト以上）が有効ではないため、51文字以上は設定できません");
      }
    }
);

async function saveSettings() {
  try {
    const result = await saveSettingsApi();
    if (result.ok) {
      showSuccess("設定を保存しました");
    } else {
      showError("保存に失敗しました");
    }
  } catch (e) {
    showError("保存に失敗しました");
  }
}

async function handleAddWord() {
  wordError.value = "";

  if (!newWord.value || !newReading.value) {
    wordError.value = "単語と読みを入力してください";
    return;
  }

  // バリデーション
  const validation = validateDictEntry(newWord.value, newReading.value);
  if (!validation.valid) {
    wordError.value = validation.errors.join("、");
    return;
  }

  // 辞書上限チェック
  if (dictEntries.value.length >= dictLimit.value) {
    showError(`辞書の登録数が上限（${dictLimit.value}件）に達しています`);
    return;
  }

  const { ok, errors } = await addWord(newWord.value, newReading.value);
  if (ok) {
    newWord.value = "";
    newReading.value = "";
    showSuccess("辞書に追加しました");
  } else {
    showError(errors.length > 0 ? errors.join("、") : "追加に失敗しました");
  }
}

async function handleRemoveWord(word) {
  const ok = await removeWord(word);
  if (ok) {
    showSuccess("辞書から削除しました");
  } else {
    showError("削除に失敗しました");
  }
}
</script>

<template>
  <div class="page">
    <HeaderBar />

    <!-- トースト通知 -->
    <Transition name="toast">
      <div v-if="toast.show" class="toast" :class="toast.type" @click="hideToast">
        <span class="toast-icon">{{ toast.type === 'success' ? '✓' : '✕' }}</span>
        <span class="toast-message">{{ toast.message }}</span>
      </div>
    </Transition>

    <div style="padding: 24px; width: min(1100px, calc(100% - 28px)); margin: 0 auto;">
      <div style="margin-bottom: 12px;">
        <h1 style="margin: 0;">サーバー設定</h1>
      </div>

      <p style="color: rgba(27,35,64,0.72); margin-bottom: 24px; display: flex; align-items: center; gap: 8px;">
        <router-link to="/dashboard" style="color: #4f46e5;">&larr; ダッシュボードに戻る</router-link>
        <span style="color: rgba(66, 84, 140, 0.3);">|</span>
        <span>Guild ID: {{ props.id }}</span>
      </p>

      <div v-if="isLoading" class="card">
        読み込み中...
      </div>

      <div v-else-if="error" class="card" style="border-color: #ef4444; background: rgba(239, 68, 68, 0.05);">
        <h2 style="color: #ef4444;">エラーが発生しました</h2>
        <p>{{ error }}</p>
        <button @click="refresh" class="refresh-button" style="margin-top: 12px;">再試行する</button>
      </div>

      <div v-else-if="!settings" class="card invite-card">
        <h2>Botが未導入です</h2>
        <p>このサーバーでBotを利用するには、まずBotを招待してください。</p>
        <p>招待後、サーバー内のテキストチャンネルで <code>/config</code> コマンドを実行することで、初期設定が完了しこの画面が利用可能になります。</p>
        <div style="margin-top: 24px;">
          <a :href="inviteUrl" target="_blank" class="invite-button">Botを招待する</a>
          <button @click="refresh" class="refresh-button">導入済みか再確認する</button>
        </div>
      </div>

      <div v-else class="settings-grid">
        <section class="card">
          <div class="card-header">
            <h2>読み上げ設定</h2>
            <button @click="saveSettings" :disabled="isSaving" class="save-button">
              <span class="save-icon">💾</span>
              {{ isSaving ? '保存中...' : '設定を保存' }}
            </button>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <label>自動接続</label>
              <p>この設定は<code class="code">/config</code>コマンドからのみ設定できます</p>
              <p v-if="!isBoosted" class="premium-hint">💎 プレミアム（1ブースト以上）限定機能です</p>
            </div>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <label>入退出の読み上げ</label>
              <p>ユーザーの入退出を通知します</p>
            </div>
            <label class="toggle">
              <input type="checkbox" v-model="settings.read_vc_status" />
              <span class="toggle-slider"></span>
            </label>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <label>メンション読み上げ</label>
              <p>メンションを名前で読み上げます</p>
            </div>
            <label class="toggle">
              <input type="checkbox" v-model="settings.read_mention" />
              <span class="toggle-slider"></span>
            </label>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <label>絵文字読み上げ</label>
              <p>絵文字を読み上げます</p>
            </div>
            <label class="toggle">
              <input type="checkbox" v-model="settings.read_emoji" />
              <span class="toggle-slider"></span>
            </label>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <label>さん付け</label>
              <p>ユーザー名の後に「さん」を付けます</p>
            </div>
            <label class="toggle">
              <input type="checkbox" v-model="settings.add_suffix" />
              <span class="toggle-slider"></span>
            </label>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <label>ローマ字読み</label>
              <p>ローマ字を読み上げます</p>
            </div>
            <label class="toggle">
              <input type="checkbox" v-model="settings.read_romaji" />
              <span class="toggle-slider"></span>
            </label>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <label>添付ファイル読み上げ</label>
              <p>添付ファイルの存在を読み上げます</p>
            </div>
            <label class="toggle">
              <input type="checkbox" v-model="settings.read_attachments" />
              <span class="toggle-slider"></span>
            </label>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <label>コードブロック省略</label>
              <p>コードブロックを省略します</p>
            </div>
            <label class="toggle">
              <input type="checkbox" v-model="settings.skip_code_blocks" />
              <span class="toggle-slider"></span>
            </label>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <label>URL省略</label>
              <p>URLを省略します</p>
            </div>
            <label class="toggle">
              <input type="checkbox" v-model="settings.skip_urls" />
              <span class="toggle-slider"></span>
            </label>
          </div>

          <!-- 文字数制限（モダンデザイン） -->
          <div class="setting-item char-limit-section">
            <div class="setting-info">
              <label>文字数制限</label>
              <p>読み上げる文字数の上限を設定します</p>
              <p class="premium-hint">
                {{ isBoosted ? '💎 プレミアム適用中: 最大200文字' : '📝 無料版制限: 50文字まで' }}
              </p>
            </div>
            <div class="char-limit-control">
              <div class="char-limit-display">
                <span class="char-limit-value">{{ settings.max_chars }}</span>
                <span class="char-limit-unit">文字</span>
              </div>
              <div class="slider-container">
                <input
                    type="range"
                    v-model.number="settings.max_chars"
                    :min="10"
                    :max="charLimit"
                    step="1"
                    class="modern-slider"
                    :style="{ '--progress': sliderProgress + '%' }"
                />
                <div class="slider-labels">
                  <span>10</span>
                  <span>{{ charLimit }}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 辞書設定セクション -->
        <section class="card">
          <div class="card-header">
            <h2>辞書設定</h2>
            <span class="dict-count">{{ dictEntries.length }} / {{ dictLimit }}</span>
          </div>

          <div class="dict-form">
            <div class="dict-inputs">
              <input
                  v-model="newWord"
                  type="text"
                  placeholder="単語"
                  class="dict-input"
                  maxlength="50"
              />
              <input
                  v-model="newReading"
                  type="text"
                  placeholder="読み"
                  class="dict-input"
                  maxlength="100"
              />
              <button
                  @click="handleAddWord"
                  class="dict-add-btn"
                  :disabled="dictEntries.length >= dictLimit"
              >
                追加
              </button>
            </div>
            <p v-if="wordError" class="dict-error">{{ wordError }}</p>
          </div>

          <div v-if="dictEntries.length === 0" class="dict-empty">
            辞書に単語が登録されていません
          </div>

          <div v-else class="dict-list">
            <div v-for="entry in dictEntries" :key="entry.word" class="dict-item">
              <div class="dict-item-content">
                <span class="dict-word">{{ entry.word }}</span>
                <span class="dict-arrow">→</span>
                <span class="dict-reading">{{ entry.reading }}</span>
              </div>
              <button @click="handleRemoveWord(entry.word)" class="dict-remove-btn">
                削除
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
    <FooterBar />
  </div>
</template>

<style scoped>
.settings-grid {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.card {
  background: var(--surface);
  border: 1px solid var(--stroke);
  border-radius: 16px;
  padding: 24px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.card-header h2 {
  margin: 0;
  font-size: 20px;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid var(--stroke);
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-info {
  flex: 1;
}

.setting-info label {
  font-weight: 700;
  font-size: 15px;
  color: var(--text);
}

.setting-info p {
  margin: 4px 0 0;
  font-size: 13px;
  color: var(--muted);
}

.code {
  background: rgba(0, 0, 0, 0.05);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
}

.premium-hint {
  color: #7c3aed !important;
  font-size: 12px !important;
}

/* トグルスイッチ */
.toggle {
  position: relative;
  display: inline-block;
  width: 52px;
  height: 28px;
  flex-shrink: 0;
}

.toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #e2e8f0;
  transition: 0.3s;
  border-radius: 28px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 22px;
  width: 22px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.toggle input:checked + .toggle-slider {
  background-color: #5865f2;
}

.toggle input:checked + .toggle-slider:before {
  transform: translateX(24px);
}

/* 保存ボタン */
.save-button {
  background: #5865f2;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}

.save-button:hover:not(:disabled) {
  background: #4752c4;
}

.save-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 文字数制限 */
.char-limit-section {
  flex-direction: column;
  align-items: stretch;
  gap: 16px;
}

.char-limit-control {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-top: 12px;
}

.char-limit-display {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.char-limit-value {
  font-size: 32px;
  font-weight: 900;
  color: #5865f2;
}

.char-limit-unit {
  font-size: 14px;
  color: var(--muted);
}

.slider-container {
  flex: 1;
}

.modern-slider {
  width: 100%;
  height: 8px;
  border-radius: 4px;
  background: linear-gradient(
      to right,
      #5865f2 0%,
      #5865f2 var(--progress),
      #e2e8f0 var(--progress),
      #e2e8f0 100%
  );
  outline: none;
  -webkit-appearance: none;
  cursor: pointer;
}

.modern-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: white;
  border: 2px solid #5865f2;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.slider-labels {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--muted);
  margin-top: 4px;
}

/* 招待カード */
.invite-card h2 {
  margin-top: 0;
}

.invite-button {
  display: inline-block;
  background: #5865f2;
  color: white;
  text-decoration: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: bold;
  margin-right: 12px;
}

.refresh-button {
  background: white;
  border: 1px solid var(--stroke);
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}

/* 辞書 */
.dict-count {
  font-size: 14px;
  color: var(--muted);
}

.dict-form {
  margin-bottom: 16px;
}

.dict-inputs {
  display: flex;
  gap: 8px;
}

.dict-input {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid var(--stroke);
  border-radius: 8px;
  font-size: 14px;
}

.dict-add-btn {
  background: #5865f2;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}

.dict-add-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.dict-error {
  color: #ef4444;
  font-size: 13px;
  margin-top: 8px;
}

.dict-empty {
  text-align: center;
  padding: 32px;
  color: var(--muted);
}

.dict-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.dict-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
}

.dict-item-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.dict-word {
  font-weight: 600;
}

.dict-arrow {
  color: var(--muted);
}

.dict-reading {
  color: var(--muted);
}

.dict-remove-btn {
  background: none;
  border: 1px solid #ef4444;
  color: #ef4444;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.dict-remove-btn:hover {
  background: #ef4444;
  color: white;
}

/* トースト */
.toast {
  position: fixed;
  top: 80px;
  right: 24px;
  padding: 12px 20px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.toast.success {
  background: #10b981;
  color: white;
}

.toast.error {
  background: #ef4444;
  color: white;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(100px);
}

@media (max-width: 600px) {
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .char-limit-control {
    flex-direction: column;
    align-items: flex-start;
  }

  .dict-inputs {
    flex-direction: column;
  }

  .toast {
    left: 24px;
    right: 24px;
  }
}
</style>