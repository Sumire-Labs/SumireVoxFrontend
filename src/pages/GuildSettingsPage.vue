<!-- GuildSettingsPage.vue -->
<script setup>
import { ref, computed } from "vue";
import HeaderBar from "@/components/HeaderBar.vue";
import { useGuildSettings } from "@/features/guilds/useGuildSettings.js";

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
  saveSettings,
  addWord,
  removeWord,
  refresh
} = useGuildSettings(props.id);

const isBoosted = computed(() => {
  if (!billingStatus.value) return false;
  const guild = billingStatus.value.manageable_guilds?.find(g => String(g.id) === String(props.id));
  return (guild?.boost_count || 0) >= 1;
});

const dictLimit = computed(() => isBoosted.value ? 100 : 10);
const charLimit = computed(() => isBoosted.value ? 200 : 50);

const inviteUrl = `https://discord.com/api/oauth2/authorize?client_id=1469627429008969741&permissions=3145728&scope=bot%20applications.commands&guild_id=${props.id}&disable_guild_select=true`;

const newWord = ref("");
const newReading = ref("");

async function handleAddWord() {
  if (!newWord.value || !newReading.value) return;
  const ok = await addWord(newWord.value, newReading.value);
  if (ok) {
    newWord.value = "";
    newReading.value = "";
  }
}
</script>

<template>
  <div class="page">
    <HeaderBar brand-name="Sumire Vox Bot" />

    <div style="padding: 24px; width: min(1100px, calc(100% - 28px)); margin: 0 auto;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
        <h1 style="margin: 0;">サーバー設定</h1>
        <button v-if="settings" @click="saveSettings" :disabled="isSaving" class="save-button" style="margin-left: 12px;">
          {{ isSaving ? '保存中...' : '設定を保存' }}
        </button>
      </div>

      <p style="color: rgba(27,35,64,0.72); margin-bottom: 24px; display: flex; align-items: center; gap: 8px;">
        <router-link to="/dashboard" style="color: #4f46e5; text-decoration: none;">&larr; ダッシュボードに戻る</router-link>
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
          <h2 style="margin-bottom: 16px;">読み上げ設定</h2>

          <div class="setting-item">
            <div class="setting-info">
              <label>自動接続</label>
              <p>ボイスチャンネルへの自動接続を有効にします</p>
              <p v-if="!isBoosted" class="premium-hint">💎 プレミアム（1ブースト以上）限定機能です</p>
            </div>
            <label class="toggle" :class="{ disabled: !isBoosted }">
              <input type="checkbox" v-model="settings.auto_join" :disabled="!isBoosted" />
              <span class="toggle-slider"></span>
            </label>
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

          <div class="setting-item">
            <div class="setting-info">
              <label>文字数制限</label>
              <p>読み上げる文字数の上限を設定します</p>
              <p class="premium-hint">
                {{ isBoosted ? '💎 プレミアム適用中: 最大200文字' : '📝 無料版制限: 50文字まで' }}
              </p>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <input type="number" v-model.number="settings.max_chars" :min="10" :max="charLimit" class="number-input" />
              <span style="font-size: 14px;">文字</span>
            </div>
          </div>
        </section>

        <section class="card">
          <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 16px;">
            <h2 style="margin: 0;">辞書編集</h2>
            <span class="premium-hint">{{ dictEntries.length }} / {{ dictLimit }} 個登録済み</span>
          </div>

          <div v-if="dictEntries.length >= dictLimit" class="limit-warning">
            ⚠️ 辞書登録数が上限（{{ dictLimit }}個）に達しています。
            <router-link v-if="!isBoosted" to="/dashboard/premium" style="color: #8547ff;">プレミアムプランで拡張</router-link>
          </div>

          <div class="add-word-form">
            <input v-model="newWord" placeholder="単語" class="text-input" :disabled="dictEntries.length >= dictLimit" />
            <input v-model="newReading" placeholder="読み" class="text-input" :disabled="dictEntries.length >= dictLimit" />
            <button @click="handleAddWord" class="add-button" :disabled="dictEntries.length >= dictLimit">追加</button>
          </div>

          <div class="dict-list">
            <div v-for="entry in dictEntries" :key="entry.word" class="dict-item">
              <div class="dict-word-pair">
                <span class="word">{{ entry.word }}</span>
                <span class="arrow">→</span>
                <span class="reading">{{ entry.reading }}</span>
              </div>
              <button @click="removeWord(entry.word)" class="delete-button">削除</button>
            </div>
            <p v-if="dictEntries.length === 0" style="color: rgba(27,35,64,0.5); text-align: center; margin-top: 20px;">
              登録されている単語はありません
            </p>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ==================== Toggle Switch (iOS Style) ==================== */
.toggle {
  position: relative;
  display: inline-block;
  width: 51px;
  height: 31px;
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
  background-color: rgba(120, 120, 128, 0.16);
  border-radius: 31px;
  transition: background-color 0.25s ease;
}

.toggle-slider::before {
  position: absolute;
  content: "";
  height: 27px;
  width: 27px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  border-radius: 50%;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15), 0 1px 1px rgba(0, 0, 0, 0.06);
  transition: transform 0.25s ease;
}

.toggle input:checked + .toggle-slider {
  background-color: var(--primary);
}

.toggle input:checked + .toggle-slider::before {
  transform: translateX(20px);
}

.toggle input:focus + .toggle-slider {
  box-shadow: 0 0 0 3px rgba(52, 199, 89, 0.3);
}

/* Disabled state */
.toggle.disabled {
  opacity: 0.5;
  pointer-events: none;
}

.toggle.disabled .toggle-slider {
  cursor: not-allowed;
}

/* ==================== Existing Styles ==================== */
.premium-hint {
  font-size: 12px;
  color: #8547ff;
  font-weight: bold;
  margin-top: 4px;
}

.limit-warning {
  background: #fffbeb;
  border: 1px solid #fde68a;
  color: #b45309;
  padding: 10px;
  border-radius: 8px;
  font-size: 13px;
  margin-bottom: 12px;
}

.settings-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

@media (max-width: 900px) {
  .settings-grid {
    grid-template-columns: 1fr;
  }
}

.card {
  background: rgba(255, 255, 255, 0.65);
  border: 1px solid rgba(66, 84, 140, 0.15);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 10px 24px rgba(20, 25, 50, 0.06);
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid rgba(66, 84, 140, 0.1);
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-info {
  flex: 1;
  min-width: 0;
  padding-right: 16px;
}

.setting-info label {
  display: block;
  font-weight: bold;
  margin-bottom: 4px;
}

.setting-info p {
  font-size: 13px;
  color: rgba(27, 35, 64, 0.72);
  margin: 0;
}

.save-button {
  background: #4f46e5;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}

.save-button:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.save-button:hover:not(:disabled) {
  background: #4338ca;
}

.invite-card {
  text-align: center;
  padding: 48px 24px;
}

.invite-card h2 {
  margin-bottom: 16px;
  color: #1b2340;
}

.invite-card p {
  margin-bottom: 8px;
  color: rgba(27, 35, 64, 0.72);
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
  transition: background 0.2s;
}

.invite-button:hover {
  background: #4752c4;
}

.refresh-button {
  background: white;
  color: #1b2340;
  border: 1px solid rgba(66, 84, 140, 0.3);
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}

.refresh-button:hover {
  background: #f3f4f6;
}

.number-input {
  width: 60px;
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid rgba(66, 84, 140, 0.3);
}

.add-word-form {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.text-input {
  flex: 1;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid rgba(66, 84, 140, 0.3);
}

.add-button {
  background: #10b981;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
}

.dict-list {
  max-height: 400px;
  overflow-y: auto;
}

.dict-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  border-bottom: 1px solid rgba(66, 84, 140, 0.1);
}

.dict-word-pair {
  display: flex;
  align-items: center;
  gap: 8px;
}

.word {
  font-weight: bold;
}

.arrow {
  color: rgba(27, 35, 64, 0.4);
}

.delete-button {
  background: transparent;
  color: #ef4444;
  border: 1px solid #ef4444;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
}

.delete-button:hover {
  background: #ef4444;
  color: white;
}
</style>