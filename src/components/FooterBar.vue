<script setup>
const BRAND = {
  name: "Sumire Vox Bot",
};

const LINKS = [
  { name: "Discord", href: "https://discord.gg/8RzjWAvUUt" },
  { name: "GitHub", href: "https://github.com/Sumire-Labs" },
];
</script>

<template>
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
        </div>
        <div class="footerCol">
          <div class="footerColTitle">その他のリンク</div>
          <a v-for="link in LINKS" :href="link.href" target="_blank" rel="noopener">{{ link.name }}</a>
        </div>
        <div class="footerCol">
          <div class="footerColTitle">規約とポリシー</div>
          <a href="/terms">利用規約</a>
          <a href="#">個人情報保護方針</a>
          <a href="#">払い戻しポリシー</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
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