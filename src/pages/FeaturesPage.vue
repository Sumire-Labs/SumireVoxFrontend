<script setup>
import HeaderBar from "@/components/HeaderBar.vue";

const BRAND = {
  name: "Sumire Vox Bot",
};

const FEATURES = [
  {
    title: "高音質な読み上げ",
    description: "VOICEVOXのエンジンを使用した、自然でクリアな音声でDiscordのチャットを読み上げます。",
    icon: "🔊"
  },
  {
    title: "マルチデバイス対応",
    description: "複数のボットをサーバーに導入することで、複数のボイスチャンネルで同時に読み上げが可能です。（サーバーブースト数に応じて解放）",
    icon: "📱"
  },
  {
    title: "辞書機能",
    description: "読み間違えやすい単語や、サーバー独自の用語を登録して、読み方を自由にカスタマイズできます。",
    icon: "📖"
  },
  {
    title: "ユーザー設定",
    description: "自分の好きなキャラクターの声、速度、ピッチなどを細かく設定できます。",
    icon: "👤"
  },
  {
    title: "Webダッシュボード",
    description: "Discord上だけでなく、Webブラウザから直感的に設定や辞書の管理が行えます。",
    icon: "🌐"
  }
];

const COMMANDS = [
  {
    name: "/join",
    description: "ボイスチャンネルに接続し、コマンドを打ったチャンネルの読み上げを開始します。",
    usage: "/join"
  },
  {
    name: "/leave",
    description: "ボイスチャンネルから切断し、読み上げを終了します。",
    usage: "/leave"
  },
  {
    name: "/set_voice",
    description: "自分の読み上げ音声（キャラクター、速度、ピッチ）をカスタマイズします。",
    usage: "/set_voice"
  },
  {
    name: "/dictionary",
    description: "辞書の表示、単語の追加、削除を行います。",
    usage: "/dictionary [action]"
  },
  {
    name: "/config",
    description: "サーバーごとの読み上げ設定（読み上げ対象外チャンネル、名前の読み上げなど）を変更します。",
    usage: "/config"
  },
  {
    name: "/invite",
    description: "追加のBotを招待します（サーバーブースト済みサーバー限定）。",
    usage: "/invite"
  },
  {
    name: "/ping",
    description: "Botの応答速度を確認します。",
    usage: "/ping"
  }
];
</script>

<template>
  <div class="page">
    <HeaderBar />

    <main class="main">
      <section class="hero">
        <h1 class="title">機能一覧</h1>
        <p class="subtitle">Sumire Voxが提供する多彩な機能と、便利なコマンドをご紹介します。</p>
      </section>

      <section class="section">
        <h2 class="sectionTitle">主な機能</h2>
        <div class="featureGrid">
          <div v-for="feature in FEATURES" :key="feature.title" class="featureCard">
            <div class="featureIcon">{{ feature.icon }}</div>
            <h3 class="featureName">{{ feature.title }}</h3>
            <p class="featureDesc">{{ feature.description }}</p>
          </div>
        </div>
      </section>

      <section class="section">
        <h2 class="sectionTitle">コマンド一覧</h2>
        <div class="commandList">
          <div v-for="cmd in COMMANDS" :key="cmd.name" class="commandItem">
            <div class="commandHeader">
              <code class="commandName">{{ cmd.name }}</code>
              <span class="commandUsage">{{ cmd.usage }}</span>
            </div>
            <p class="commandDesc">{{ cmd.description }}</p>
          </div>
        </div>
      </section>
    </main>

    <footer class="footer">
      <div class="footerInner">
        <div class="footerBrandCol">
          <div class="footerName">{{ BRAND.name }}</div>
          <div class="footerSub">VOICEVOXで、Discordの会話をもっと楽しく。</div>
          <div class="footerPowered">Powered by VOICEVOX</div>
        </div>

        <div class="footerNav">
          <div class="footerCol">
            <div class="footerColTitle">ページ一覧</div>
            <router-link to="/">トップ</router-link>
            <router-link to="/features">機能一覧</router-link>
            <router-link to="/premium">プレミアム</router-link>
            <router-link to="/dashboard">ダッシュボード</router-link>
            <a href="/#howto">コマンド</a>
          </div>
          <div class="footerCol">
            <div class="footerColTitle">その他のリンク</div>
            <a href="#" target="_blank" rel="noopener">X</a>
            <a href="#" target="_blank" rel="noopener">Discord</a>
            <a href="#" target="_blank" rel="noopener">GitHub</a>
          </div>
          <div class="footerCol">
            <div class="footerColTitle">規約とポリシー</div>
            <a href="#">利用規約</a>
            <a href="#">個人情報保護方針</a>
            <a href="#">払い戻しポリシー</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main {
  flex: 1;
  width: min(1000px, 100% - 40px);
  margin: 0 auto;
  padding: 60px 0;
}

.hero {
  text-align: center;
  margin-bottom: 80px;
}

.title {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 16px;
  background: linear-gradient(135deg, var(--text), var(--primary2));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  font-size: 1.25rem;
  color: var(--muted);
}

.section {
  margin-bottom: 100px;
}

.sectionTitle {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 40px;
  text-align: center;
}

.featureGrid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.featureCard {
  background: var(--surface);
  border: 1px solid var(--stroke);
  border-radius: 20px;
  padding: 32px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.featureCard:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.04);
}

.featureIcon {
  font-size: 2.5rem;
  margin-bottom: 20px;
}

.featureName {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 12px;
}

.featureDesc {
  color: var(--muted);
  line-height: 1.6;
}

.commandList {
  background: var(--surface);
  border: 1px solid var(--stroke);
  border-radius: 20px;
  overflow: hidden;
}

.commandItem {
  padding: 24px 32px;
  border-bottom: 1px solid var(--stroke);
}

.commandItem:last-child {
  border-bottom: none;
}

.commandHeader {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.commandName {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-weight: 700;
  color: var(--primary2);
  background: rgba(123, 144, 255, 0.1);
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 1.1rem;
}

.commandUsage {
  color: var(--muted);
  font-size: 0.9rem;
}

.commandDesc {
  color: var(--text);
  line-height: 1.5;
}

.footer {
  margin-top: 50px;
  padding: 0 0 50px;
}

.footerInner {
  width: min(1100px, calc(100% - 28px));
  margin: 0 auto;
  padding: 40px 30px;
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 40px;
  border-radius: 24px;
  border: 1px solid var(--stroke);
  background: rgba(255, 255, 255, 0.55);
}

.footerBrandCol {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.footerName {
  font-weight: 900;
  font-size: 20px;
  letter-spacing: -0.2px;
}

.footerSub {
  color: var(--muted);
  font-size: 14px;
  line-height: 1.5;
}

.footerPowered {
  margin-top: 8px;
  color: rgba(27, 35, 64, 0.5);
  font-size: 12px;
  font-weight: 700;
}

.footerNav {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.footerCol {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footerColTitle {
  font-weight: 800;
  font-size: 14px;
  color: var(--text);
  margin-bottom: 4px;
}

.footerCol a {
  text-decoration: none;
  color: var(--muted);
  font-size: 14px;
  font-weight: 600;
  transition: color 0.2s;
}

.footerCol a:hover {
  color: var(--primary);
}

@media (max-width: 920px) {
  .hero {
    margin-bottom: 40px;
  }

  .title {
    font-size: 36px;
  }

  .footerInner {
    grid-template-columns: 1fr;
    padding: 30px 20px;
  }

  .footerNav {
    grid-template-columns: repeat(2, 1fr);
    gap: 30px;
  }
}
</style>
