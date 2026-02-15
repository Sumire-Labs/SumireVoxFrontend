<script setup>
import { ref } from "vue";
import HeaderBar from "@/components/HeaderBar.vue";
import { useGuildSettings } from "@/features/guilds/useGuildSettings.js";

const props = defineProps({
  id: { type: String, required: true },
});

const {
  settings,
  dictEntries,
  isLoading,
  isSaving,
  error,
  saveSettings,
  addWord,
  removeWord,
  refresh
} = useGuildSettings(props.id);

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
            </div>
            <input type="checkbox" v-model="settings.auto_join" />
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <label>入退出の読み上げ</label>
              <p>ユーザーの入退出を通知します</p>
            </div>
            <input type="checkbox" v-model="settings.read_vc_status" />
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <label>メンション読み上げ</label>
              <p>メンションを名前で読み上げます</p>
            </div>
            <input type="checkbox" v-model="settings.read_mention" />
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <label>絵文字読み上げ</label>
              <p>絵文字を読み上げます</p>
            </div>
            <input type="checkbox" v-model="settings.read_emoji" />
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <label>さん付け</label>
              <p>ユーザー名の後に「さん」を付けます</p>
            </div>
            <input type="checkbox" v-model="settings.add_suffix" />
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <label>ローマ字読み</label>
              <p>ローマ字を読み上げます</p>
            </div>
            <input type="checkbox" v-model="settings.read_romaji" />
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <label>添付ファイル読み上げ</label>
              <p>添付ファイルの存在を読み上げます</p>
            </div>
            <input type="checkbox" v-model="settings.read_attachments" />
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <label>コードブロック省略</label>
              <p>コードブロックを省略します</p>
            </div>
            <input type="checkbox" v-model="settings.skip_code_blocks" />
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <label>URL省略</label>
              <p>URLを省略します</p>
            </div>
            <input type="checkbox" v-model="settings.skip_urls" />
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <label>文字数制限</label>
              <p>読み上げる文字数の上限を設定します (10-500)</p>
            </div>
            <input type="number" v-model.number="settings.max_chars" min="10" max="500" class="number-input" />
          </div>
        </section>

        <section class="card">
          <h2 style="margin-bottom: 16px;">辞書編集</h2>

          <div class="add-word-form">
            <input v-model="newWord" placeholder="単語" class="text-input" />
            <input v-model="newReading" placeholder="読み" class="text-input" />
            <button @click="handleAddWord" class="add-button">追加</button>
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