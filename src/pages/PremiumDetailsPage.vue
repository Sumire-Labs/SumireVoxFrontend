<script setup>
import { onMounted } from "vue";
import HeaderBar from "@/components/HeaderBar.vue";
import FooterBar from "@/components/FooterBar.vue";
import { useAuth } from "@/features/auth/useAuth.js";

const { isLoggedIn } = useAuth();

const BRAND = {
  name: "Sumire Vox Bot",
};

const BENEFIT_GROUPS = [
  {
    level: "0 Boost",
    name: "無料版",
    description: "基本機能を無料でご利用いただけます。",
    benefits: [
      { text: "文字数制限: 50文字", enabled: true },
      { text: "辞書上限: 10個", enabled: true },
      { text: "キャラクター変更可能", enabled: true },
      { text: "自動接続不可", enabled: false },
      { text: "速度・ピッチ変更不可", enabled: false }
    ],
    featured: false
  },
  {
    level: "1 Boost",
    name: "プレミアム機能",
    description: "1つのブーストで読み上げ機能をフルに解放します。",
    benefits: [
      { text: "文字数制限: 200文字まで緩和", enabled: true },
      { text: "辞書上限: 100個まで拡張", enabled: true },
      { text: "速度・ピッチ変更解放", enabled: true },
      { text: "自動接続機能解放", enabled: true },
      { text: "優先的なサポート", enabled: true }
    ],
    featured: true
  },
  {
    level: "2+ Boosts",
    name: "マルチインスタンス",
    description: "ブースト数に応じて、複数のBotを同時に利用可能です。",
    benefits: [
      { text: "2台目のBot招待可能 (2 Boosts)", enabled: true },
      { text: "3台目のBot招待可能 (3 Boosts)", enabled: true },
      { text: "各Botを別々のチャンネルで運用可能", enabled: true },
      { text: "大規模サーバーに最適", enabled: true }
    ],
    featured: false
  }
];

const FAQ_ITEMS = [
  {
    question: "ブーストはいつでも移動できますか？",
    answer: "はい。Webダッシュボードからいつでもブーストを解除し、別のサーバーに割り当て直すことができます。"
  },
  {
    question: "複数のサーバーを同時にブーストできますか？",
    answer: "複数のブースト枠（スロット）を購入することで、複数のサーバーを同時にプレミアム状態にすることが可能です。"
  },
  {
    question: "解約した場合、ブーストはどうなりますか？",
    answer: "サブスクリプションを解約しても、有効期限まではブースト特典が継続されます。期限が切れると自動的に全サーバーのブーストが解除されます。"
  },
  {
    question: "サーモンは漬けてありますか？",
    answer: "はい。サーモンを振り回してください！"
  }
];

function loginWithDiscord() {
  window.location.href = "/auth/discord/start";
}
</script>

<template>
  <div class="page">
    <HeaderBar />

    <main id="top" class="main">
      <section class="hero">
        <div class="heroLeft">
          <p class="pill">Premium Plan</p>
          <h1 class="heroTitle">
            Sumire Vox Premium
          </h1>
          <p class="heroLead">
            サーバーをブーストして、読み上げ制限の解除やマルチBot機能を体験しましょう。
          </p>
          <div class="heroButtons">
            <router-link v-if="isLoggedIn" to="/dashboard/premium" class="btn primary big">
              💎 プレミアムを管理する
            </router-link>
            <button v-else @click="loginWithDiscord" class="btn primary big">
              Discordでログインして購入
            </button>
          </div>
        </div>
      </section>

      <section id="plans" class="section">
        <h2 class="sectionTitle">プランと特典</h2>
        <p class="sectionLead">
          Sumire Voxは「サーバーブースト形式」を採用しています。<br/>
          ユーザーが購入したブースト枠を好きなサーバーに割り当てることで、そのサーバー全体に特典が適用されます。
        </p>

        <div class="benefitsGrid">
          <div
            v-for="group in BENEFIT_GROUPS"
            :key="group.name"
            class="benefitCard"
            :class="{ 'featured': group.featured }"
          >
            <div class="benefitHeader">
              <span class="benefitLevel">{{ group.level }}</span>
              <h3 class="benefitName">{{ group.name }}</h3>
              <p class="benefitDesc">{{ group.description }}</p>
            </div>
            <ul class="benefitList">
              <li v-for="benefit in group.benefits" :key="benefit.text" :class="{ 'disabled': !benefit.enabled }">
                <span class="benefitIcon">{{ benefit.enabled ? '✅' : '❌' }}</span>
                <span class="benefitText">{{ benefit.text }}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section id="workflow" class="section">
        <h2 class="sectionTitle">プレミアムの仕組み</h2>
        <div class="steps">
          <div class="step">
            <div class="stepNum">1</div>
            <div>
              <div class="stepTitle">ブースト枠を購入</div>
              <div class="stepText">ダッシュボードからブースト枠（スロット）を購入します。Stripeによる安全な決済が可能です。</div>
            </div>
          </div>
          <div class="step">
            <div class="stepNum">2</div>
            <div>
              <div class="stepTitle">サーバーに割り当て</div>
              <div class="stepText">購入した枠を、あなたが管理している任意のDiscordサーバーに適用（ブースト）します。</div>
            </div>
          </div>
          <div class="step">
            <div class="stepNum">3</div>
            <div>
              <div class="stepTitle">特典をサーバー全員で利用</div>
              <div class="stepText">ブーストされたサーバーでは、参加者全員が文字数制限の緩和などの恩恵を受けられます。</div>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" class="section">
        <h2 class="sectionTitle">よくある質問</h2>
        <div class="faq">
          <details v-for="(faq, index) in FAQ_ITEMS" :key="index">
            <summary>{{ faq.question }}</summary>
            <p>{{ faq.answer }}</p>
          </details>
        </div>
      </section>

      <div class="callout">
        <div>
          <div class="calloutTitle">今すぐプレミアム体験を始めましょう</div>
          <div class="calloutText">1つのブーストで、あなたのサーバーの読み上げ体験が劇的に向上します。</div>
        </div>
        <div class="calloutBtns">
          <button v-if="!isLoggedIn" @click="loginWithDiscord" class="btn primary">
            Discordでログインして始める
          </button>
          <router-link v-else to="/dashboard/premium" class="btn primary">
            ダッシュボードへ移動
          </router-link>
        </div>
      </div>
    </main>

    <FooterBar />
  </div>
</template>

<style scoped>
.main {
  width: min(1100px, calc(100% - 28px));
  margin: 0 auto;
  padding: 26px 0 50px;
}

.hero {
  padding: 80px 0 60px;
}

.pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  color: rgba(27, 35, 64, 0.75);
  background: rgba(255, 255, 255, 0.55);
  border: 1px solid var(--stroke);
  padding: 7px 10px;
  border-radius: 999px;
}

.heroTitle {
  font-size: clamp(34px, 4vw, 52px);
  margin: 14px 0 10px;
  letter-spacing: -0.4px;
}

.heroLead {
  color: var(--muted);
  line-height: 1.7;
  font-size: 16px;
  margin: 0 0 18px;
}

.heroButtons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

.section {
  padding: 34px 0 6px;
}

.sectionTitle {
  font-size: 26px;
  margin: 0 0 6px;
}

.sectionLead {
  margin: 0 0 16px;
  color: var(--muted);
  line-height: 1.7;
}

.benefitsGrid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.benefitCard {
  background: rgba(255, 255, 255, 0.65);
  border: 1px solid var(--stroke);
  border-radius: 18px;
  padding: 24px;
  box-shadow: 0 10px 24px rgba(20, 25, 50, 0.06);
  transition: transform 0.2s, box-shadow 0.2s;
}

.benefitCard:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
}

.benefitCard.featured {
  border: 2px solid var(--primary);
  position: relative;
}

.benefitCard.featured::after {
  content: "RECOMMENDED";
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--primary);
  color: #0f1633;
  font-size: 10px;
  font-weight: 900;
  padding: 4px 12px;
  border-radius: 20px;
}

.benefitHeader {
  margin-bottom: 20px;
}

.benefitLevel {
  color: var(--primary);
  font-weight: 900;
  font-size: 12px;
  text-transform: uppercase;
}

.benefitName {
  font-size: 20px;
  font-weight: 900;
  margin: 4px 0;
}

.benefitDesc {
  font-size: 13px;
  color: var(--muted);
}

.benefitList {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.benefitList li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 14px;
}

.benefitList li.disabled {
  color: var(--muted);
  opacity: 0.6;
}

.benefitIcon {
  font-size: 14px;
  flex-shrink: 0;
  margin-top: 2px;
}

.steps {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
  margin-top: 12px;
}

.step {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  background: rgba(255, 255, 255, 0.62);
  border: 1px solid var(--stroke);
  border-radius: 16px;
  padding: 12px 12px;
}

.stepNum {
  width: 34px;
  height: 34px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  font-weight: 800;
  background: linear-gradient(135deg, rgba(123, 144, 255, 0.35), rgba(143, 213, 255, 0.25));
  border: 1px solid rgba(123, 144, 255, 0.20);
}

.stepTitle {
  font-weight: 800;
  margin-bottom: 4px;
}

.stepText {
  color: var(--muted);
  line-height: 1.7;
}

.faq {
  background: rgba(255, 255, 255, 0.65);
  border: 1px solid var(--stroke);
  border-radius: 18px;
  padding: 14px 14px;
  box-shadow: 0 10px 24px rgba(20, 25, 50, 0.06);
}

details {
  border: 1px solid var(--stroke);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.55);
  padding: 10px 10px;
  margin-bottom: 10px;
}

summary {
  cursor: pointer;
  font-weight: 800;
}

details p {
  margin: 8px 0 0;
  color: var(--muted);
  line-height: 1.7;
}

.callout {
  margin-top: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 14px;
  border-radius: 18px;
  border: 1px solid rgba(123, 144, 255, 0.22);
  background: linear-gradient(135deg, rgba(167, 182, 255, 0.34), rgba(143, 213, 255, 0.22));
}

.calloutTitle {
  font-weight: 900;
  margin-bottom: 2px;
}

.calloutText {
  color: rgba(27, 35, 64, 0.70);
}

.calloutBtns {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.btn.primary.big {
  padding: 12px 14px;
  border-radius: 14px;
}

@media (max-width: 920px) {
  .hero {
    padding: 60px 0 40px;
  }

  .benefitsGrid {
    grid-template-columns: 1fr;
  }

  .callout {
    flex-direction: column;
    text-align: center;
  }
}
</style>
