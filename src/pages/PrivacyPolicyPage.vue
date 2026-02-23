<script setup>
import HeaderBar from "@/components/HeaderBar.vue";
import FooterBar from "@/components/FooterBar.vue";

const LAST_UPDATED = "2026年2月23日";

const SECTIONS = [
  {
    id: "section-1",
    title: "1. はじめに",
    content: `Sumire-Labs（以下「当方」といいます）は、SumireVoxサービス（Discord読み上げBot「SumireVoxBot」、Webダッシュボード「SumireVoxFrontend」、およびバックエンドAPI「SumireVoxBackend」を含む、以下「本サービス」といいます）を提供するにあたり、ユーザーの個人情報の保護を重要な責務と認識しています。`,
    subContent: `本個人情報保護方針（以下「本ポリシー」といいます）は、当方が収集する情報の種類、利用目的、管理方法、およびユーザーの権利について説明するものです。本サービスをご利用いただくことで、ユーザーは本ポリシーに同意したものとみなされます。`
  },
  {
    id: "section-2",
    title: "2. 収集する情報",
    content: `当方は、本サービスの提供および改善のために、以下の情報を収集することがあります。`,
    subSections: [
      {
        title: "2.1 Discordアカウント情報",
        content: `本サービスの利用に際して、DiscordユーザーID、ユーザー名、およびアバター画像を取得します。これらの情報は、Discord OAuthを通じてユーザーの同意のもと取得されます。`
      },
      {
        title: "2.2 サーバーおよびチャンネル情報",
        content: `本サービスが導入されたDiscordサーバーのサーバーID、サーバー名、およびボイスチャンネル・テキストチャンネルのIDを取得します。`
      },
      {
        title: "2.3 ユーザー設定情報",
        content: `ユーザーが本サービス内で設定した情報を保存します。具体的には、読み上げ音声の設定（スピーカーID、速度、ピッチ）、辞書に登録した単語および読み方、Bot設定（自動接続、通知設定等）が含まれます。`
      },
      {
        title: "2.4 決済情報",
        content: `プレミアムプランをご購入いただく場合、決済に必要な情報はStripeを通じて処理されます。当方がクレジットカード番号、セキュリティコード等の機密性の高い決済情報を直接保存することはありません。当方が保存するのは、StripeカスタマーID、購入履歴（購入日、プラン名、金額）、およびサブスクリプションの状態に限られます。`
      },
      {
        title: "2.5 ログ情報",
        content: `本サービスの運用およびトラブルシューティングのために、アクセスログ、エラーログ、およびコマンド実行ログを収集することがあります。これらのログには、実行日時、実行されたコマンド、およびサーバーID・チャンネルIDが含まれる場合があります。`
      },
      {
        title: "2.6 読み上げテキスト",
        content: `ボイスチャンネルで読み上げられるテキストメッセージは、音声合成処理のために一時的に処理されますが、当方のサーバーに永続的に保存されることはありません。`
      },
      {
        title: "2.7 サポート対応に伴い収集する情報",
        content: `ユーザーからの払い戻し申請、サポート依頼、お問い合わせ、その他の要望に対応するため、本ポリシーの他の条項に定める情報以外の情報を収集することがあります。これには、ユーザーが任意に提供する氏名、メールアドレス、電話番号、決済明細やレシートの画像、問題の状況を示すスクリーンショット、その他対応に必要と判断される情報が含まれます。`,
        subContent: `これらの情報は、ユーザーの要望への対応、問題の調査・解決、および関連する記録の保持のために利用されます。当方からこれらの情報の提供を求めた場合であっても、ユーザーは自己の判断により提供の可否を決定することができます。ただし、必要な情報が提供されない場合、要望に対応できないことがあります。`
      }
    ]
  },
  {
    id: "section-3",
    title: "3. 情報の利用目的",
    content: `当方は、収集した情報を以下の目的のために利用します。`,
    purposeItems: [
      "本サービスの提供、運営、および維持のため",
      "ユーザーの設定に基づいた読み上げ機能の提供のため",
      "プレミアムプランの課金処理および管理のため",
      "本サービスの改善、新機能の開発のため",
      "システムの安全性確保、不正利用の防止のため",
      "ユーザーからのお問い合わせへの対応のため",
      "利用規約違反の調査および対応のため",
      "法令に基づく義務の履行のため"
    ]
  },
  {
    id: "section-4",
    title: "4. 情報の共有および第三者提供",
    content: `当方は、以下の場合を除き、ユーザーの個人情報を第三者に提供することはありません。`,
    subSections: [
      {
        title: "4.1 ユーザーの同意がある場合",
        content: `ユーザーから明示的な同意を得た場合、その範囲内で第三者に情報を提供することがあります。`
      },
      {
        title: "4.2 サービス提供に必要な外部サービス",
        content: `本サービスの提供にあたり、以下の外部サービスを利用しています。`,
        externalServices: [
          {
            name: "Discord",
            description: "本サービスはDiscordプラットフォーム上で動作するため、Discordのプライバシーポリシーが適用されます。",
            url: "https://discord.com/privacy"
          },
          {
            name: "Stripe",
            description: "決済処理のためにStripeを利用しています。決済情報はStripeのセキュリティ基準に従って処理されます。",
            url: "https://stripe.com/privacy"
          },
          {
            name: "VOICEVOX",
            description: "音声合成のためにVOICEVOXエンジンを利用しています。読み上げテキストは音声合成処理のためにVOICEVOXエンジンに送信されますが、当方が運用するVOICEVOXエンジンは当方のサーバー内で稼働しており、外部に送信されることはありません。",
            url: null
          }
        ]
      },
      {
        title: "4.3 法令に基づく場合",
        content: `法令に基づく開示請求があった場合、裁判所、警察、その他の公的機関からの要請に応じて情報を開示することがあります。`
      },
      {
        title: "4.4 権利保護のために必要な場合",
        content: `当方、ユーザー、または第三者の権利、財産、安全を保護するために必要と判断した場合、情報を開示することがあります。`
      },
      {
        title: "4.5 事業譲渡の場合",
        content: `合併、買収、事業譲渡等により本サービスの運営主体が変更される場合、それに伴い個人情報が移転されることがあります。この場合、移転先においても本ポリシーと同等の保護が維持されるよう努めます。`
      }
    ]
  },
  {
    id: "section-5",
    title: "5. 情報の保管と安全管理",
    content: ``,
    subSections: [
      {
        title: "5.1 保管場所",
        content: `収集した情報は、当方が管理するサーバー上のデータベース（PostgreSQL）に保管されます。`
      },
      {
        title: "5.2 安全管理措置",
        content: `当方は、収集した情報を適切に管理するために、以下の安全管理措置を講じています。データベースへのアクセス制限、通信の暗号化（HTTPS/TLS）、定期的なセキュリティアップデートの実施、および管理者アクセスの制限と監視を行っています。`
      },
      {
        title: "5.3 保管期間",
        content: `収集した情報は、本サービスの提供に必要な期間、または法令で定められた期間保管します。ユーザーがアカウントを削除した場合、または本サービスからBotが削除された場合、関連する情報は合理的な期間内に削除されます。ただし、法令上の義務を履行するために必要な情報、および不正利用の防止のために必要な情報は、一定期間保持することがあります。`,
        subContent: `サポート対応に伴い収集した情報（第2.7項）については、当該対応が完了した後も、将来の問い合わせへの対応、紛争解決、および法的義務の履行のために合理的な期間保持することがあります。`
      }
    ]
  },
  {
    id: "section-6",
    title: "6. ユーザーの権利",
    content: `ユーザーは、自己の個人情報に関して以下の権利を有します。`,
    subSections: [
      {
        title: "6.1 アクセス権",
        content: `ユーザーは、当方が保有する自己の個人情報の開示を請求することができます。`
      },
      {
        title: "6.2 訂正権",
        content: `ユーザーは、自己の個人情報に誤りがある場合、訂正を請求することができます。本サービス内の設定については、Webダッシュボードまたはコマンドを通じてユーザー自身で変更することも可能です。`
      },
      {
        title: "6.3 削除権",
        content: `ユーザーは、自己の個人情報の削除を請求することができます。ただし、法令上の義務の履行に必要な情報、または正当な事業目的のために必要な情報については、削除できない場合があります。`
      },
      {
        title: "6.4 処理の制限権",
        content: `ユーザーは、一定の条件のもと、自己の個人情報の処理の制限を請求することができます。`
      },
      {
        title: "6.5 データポータビリティ権",
        content: `ユーザーは、自己の個人情報を構造化された一般的に使用される機械可読形式で受け取ることを請求することができます。`
      },
      {
        title: "6.6 権利行使の方法",
        content: `上記の権利を行使される場合は、第13条に記載のお問い合わせ先までご連絡ください。本人確認のため、DiscordアカウントのユーザーIDその他の情報をお伺いする場合があります。`
      }
    ]
  },
  {
    id: "section-7",
    title: "7. Cookieおよび類似技術",
    content: ``,
    subSections: [
      {
        title: "7.1 Webダッシュボードにおける使用",
        content: `本サービスのWebダッシュボード（SumireVoxFrontend）では、ユーザー認証およびセッション管理のためにCookieを使用することがあります。`
      },
      {
        title: "7.2 使用するCookieの種類",
        content: `必須Cookieとして、サービスの基本機能を提供するために必要なCookieがあります。これにはセッション管理、認証状態の維持等が含まれます。`
      },
      {
        title: "7.3 Cookieの管理",
        content: `ユーザーは、ブラウザの設定によりCookieを無効にすることができます。ただし、Cookieを無効にした場合、Webダッシュボードの一部機能が正常に動作しない場合があります。`
      }
    ]
  },
  {
    id: "section-8",
    title: "8. 未成年者の個人情報",
    content: `本サービスは、原則として年齢制限を設けていませんが、未成年の方が本サービスを利用する場合は、保護者の同意を得たうえでご利用ください。`,
    subContent: `当方は、意図的に13歳未満の児童から個人情報を収集することはありません。13歳未満の児童の個人情報が収集されたことが判明した場合、当方は当該情報を速やかに削除する措置を講じます。`
  },
  {
    id: "section-9",
    title: "9. 国際的なデータ移転",
    content: `本サービスは日本国内で運営されていますが、利用する外部サービス（Discord、Stripe等）の性質上、ユーザーの情報が日本国外に移転される場合があります。その場合、当該サービス提供者のプライバシーポリシーおよび適用法令に従って情報が取り扱われます。`
  },
  {
    id: "section-10",
    title: "10. サポート対応に伴う情報収集に関する免責",
    content: `ユーザーからの払い戻し申請、サポート依頼、その他の要望に対応するために収集・管理する情報（本ポリシーの他の条項に定める情報以外の情報を含む）に関連して、以下の事項について当方は責任を負いません。`,
    disclaimerItems: [
      "ユーザーが自己の判断により提供した情報の内容の正確性または完全性",
      "ユーザーが提供した情報に起因して生じた損害（誤った情報の提供による対応の遅延、第三者の権利侵害等を含む）",
      "当方が合理的な安全管理措置を講じていたにもかかわらず発生した情報の漏洩、紛失、または毀損",
      "サポート対応の過程で当方が行った判断または助言に起因して生じた損害"
    ],
    subContent: `ユーザーは、当方に情報を提供する際、当該情報の提供が自己の責任において行われるものであること、および当該情報が第三者の権利を侵害しないことを確認し、保証するものとします。`
  },
  {
    id: "section-11",
    title: "11. 本ポリシーの変更",
    content: `当方は、法令の変更、本サービスの変更、またはその他の理由により、本ポリシーを変更することがあります。重要な変更を行う場合は、本サービス上での告知、またはその他適切な方法によりユーザーに通知します。`,
    subContent: `変更後の本ポリシーは、本サービス上に掲載された時点で効力を生じます。変更後も本サービスを継続して利用された場合、ユーザーは変更後のポリシーに同意したものとみなされます。`
  },
  {
    id: "section-12",
    title: "12. 準拠法",
    content: `本ポリシーは日本法に準拠し、日本法に従って解釈されるものとします。`
  },
  {
    id: "section-13",
    title: "13. お問い合わせ",
    content: `本ポリシーに関するご質問、個人情報の開示・訂正・削除の請求、その他のお問い合わせは、以下までご連絡ください。`,
    operatorInfo: "運営者: Sumire-Labs",
    contactInfo: {
      email: "sumirevox@gmail.com",
      discord: "https://discord.gg/8RzjWAvUUt"
    }
  }
];
</script>

<template>
  <div class="page">
    <HeaderBar />

    <main class="main">
      <section class="hero">
        <h1 class="title">SumireVox 個人情報保護方針</h1>
        <p class="subtitle">プライバシーポリシー</p>
        <p class="lastUpdated">最終更新日：{{ LAST_UPDATED }}</p>
      </section>

      <nav class="toc">
        <h2 class="tocTitle">目次</h2>
        <ul class="tocList">
          <li v-for="section in SECTIONS" :key="section.id">
            <a :href="'#' + section.id" class="tocLink">{{ section.title }}</a>
          </li>
          <li>
            <a href="#supplementary" class="tocLink">附則</a>
          </li>
        </ul>
      </nav>

      <div class="policyContent">
        <article
            v-for="section in SECTIONS"
            :key="section.id"
            :id="section.id"
            class="article"
        >
          <h2 class="articleTitle">{{ section.title }}</h2>

          <p v-if="section.content" class="articleText">{{ section.content }}</p>

          <p v-if="section.subContent" class="articleText">
            {{ section.subContent }}
          </p>

          <!-- 利用目的リスト -->
          <ul v-if="section.purposeItems" class="articleList">
            <li v-for="(item, index) in section.purposeItems" :key="index">
              {{ item }}
            </li>
          </ul>

          <!-- 免責事項リスト -->
          <ul v-if="section.disclaimerItems" class="articleList">
            <li v-for="(item, index) in section.disclaimerItems" :key="index">
              {{ item }}
            </li>
          </ul>

          <!-- サブセクション -->
          <div v-if="section.subSections" class="subSections">
            <div
                v-for="(sub, index) in section.subSections"
                :key="index"
                class="subSection"
            >
              <h3 class="subSectionTitle">{{ sub.title }}</h3>
              <p class="articleText">{{ sub.content }}</p>
              <p v-if="sub.subContent" class="articleText">{{ sub.subContent }}</p>

              <!-- 外部サービス -->
              <div v-if="sub.externalServices" class="externalServices">
                <div
                    v-for="(service, idx) in sub.externalServices"
                    :key="idx"
                    class="externalServiceItem"
                >
                  <span class="serviceName">{{ service.name }}</span>
                  <span class="serviceDesc">{{ service.description }}</span>
                  <a
                      v-if="service.url"
                      :href="service.url"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="serviceLink"
                  >
                    詳細: {{ service.url }}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- 運営者情報 -->
          <p v-if="section.operatorInfo" class="operatorInfo">
            {{ section.operatorInfo }}
          </p>

          <!-- お問い合わせ -->
          <div v-if="section.contactInfo" class="contactBox">
            <div class="contactItem">
              <p class="contactLabel">Email:</p>
              <a
                  :href="'mailto:' + section.contactInfo.email"
                  class="contactLink"
              >
                {{ section.contactInfo.email }}
              </a>
            </div>
            <div class="contactItem">
              <p class="contactLabel">Discord:</p>
              <a
                  :href="section.contactInfo.discord"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="contactLink"
              >
                サポートサーバーに参加
              </a>
            </div>
          </div>
        </article>

        <article id="supplementary" class="article">
          <h2 class="articleTitle">附則</h2>
          <p class="articleText">
            本ポリシーは{{ LAST_UPDATED }}より施行します。
          </p>
        </article>
      </div>
    </main>

    <FooterBar />
  </div>
</template>

<style scoped>
.main {
  flex: 1;
  width: min(900px, 100% - 40px);
  margin: 0 auto;
  padding: 40px 0 60px;
}

.hero {
  text-align: center;
  margin-bottom: 40px;
}

.title {
  font-size: clamp(28px, 4vw, 40px);
  font-weight: 800;
  margin-bottom: 8px;
  background: linear-gradient(135deg, var(--text), var(--primary2));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  font-size: 16px;
  color: var(--muted);
  font-weight: 600;
  margin-bottom: 12px;
}

.lastUpdated {
  color: var(--muted);
  font-size: 14px;
  font-weight: 600;
}

.toc {
  background: var(--surface);
  border: 1px solid var(--stroke);
  border-radius: 18px;
  padding: 24px 28px;
  margin-bottom: 40px;
}

.tocTitle {
  font-size: 18px;
  font-weight: 800;
  margin-bottom: 16px;
  color: var(--text);
}

.tocList {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 8px 16px;
}

.tocLink {
  display: block;
  padding: 8px 12px;
  color: var(--muted);
  font-size: 14px;
  font-weight: 600;
  border-radius: 10px;
  transition: background 0.2s, color 0.2s;
}

.tocLink:hover {
  background: rgba(123, 144, 255, 0.10);
  color: var(--primary);
}

.policyContent {
  background: var(--surface);
  border: 1px solid var(--stroke);
  border-radius: 20px;
  overflow: hidden;
}

.article {
  padding: 32px 32px;
  border-bottom: 1px solid var(--stroke);
}

.article:last-child {
  border-bottom: none;
}

.articleTitle {
  font-size: 20px;
  font-weight: 800;
  color: var(--text);
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid rgba(123, 144, 255, 0.20);
}

.articleText {
  color: var(--text);
  font-size: 15px;
  line-height: 1.8;
  margin-bottom: 16px;
}

.articleText:last-child {
  margin-bottom: 0;
}

.subSections {
  margin-top: 8px;
}

.subSection {
  margin-bottom: 24px;
  padding-left: 16px;
  border-left: 3px solid rgba(123, 144, 255, 0.15);
}

.subSection:last-child {
  margin-bottom: 0;
}

.subSectionTitle {
  font-size: 16px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 12px;
}

.articleList {
  margin: 16px 0;
  padding-left: 24px;
  color: var(--text);
  font-size: 15px;
  line-height: 1.8;
}

.articleList li {
  margin-bottom: 8px;
  padding-left: 8px;
}

.articleList li::marker {
  color: var(--primary);
}

.externalServices {
  margin-top: 12px;
}

.externalServiceItem {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 16px;
  margin-bottom: 12px;
  background: rgba(123, 144, 255, 0.06);
  border-radius: 10px;
  border: 1px solid rgba(123, 144, 255, 0.12);
}

.externalServiceItem:last-child {
  margin-bottom: 0;
}

.serviceName {
  font-weight: 700;
  color: var(--text);
  font-size: 15px;
}

.serviceDesc {
  color: var(--muted);
  font-size: 14px;
  line-height: 1.6;
}

.serviceLink {
  color: var(--primary);
  font-size: 13px;
  font-weight: 600;
  word-break: break-all;
}

.serviceLink:hover {
  opacity: 0.8;
}

.operatorInfo {
  font-weight: 700;
  color: var(--text);
  margin-bottom: 16px;
}

.contactBox {
  margin-top: 16px;
  padding: 16px 20px;
  background: rgba(123, 144, 255, 0.08);
  border-radius: 12px;
  border: 1px solid rgba(123, 144, 255, 0.15);
}

.contactItem {
  margin-bottom: 12px;
}

.contactItem:last-child {
  margin-bottom: 0;
}

.contactLabel {
  font-weight: 700;
  color: var(--text);
  margin-bottom: 4px;
  font-size: 14px;
}

.contactLink {
  color: var(--primary);
  font-weight: 600;
  font-size: 15px;
  word-break: break-all;
  transition: opacity 0.2s;
}

.contactLink:hover {
  opacity: 0.8;
}

@media (max-width: 640px) {
  .main {
    padding: 30px 0 50px;
  }

  .hero {
    margin-bottom: 30px;
  }

  .toc {
    padding: 20px;
  }

  .tocList {
    grid-template-columns: 1fr;
  }

  .article {
    padding: 24px 20px;
  }

  .articleTitle {
    font-size: 18px;
  }

  .articleText {
    font-size: 14px;
  }

  .subSection {
    padding-left: 12px;
  }

  .subSectionTitle {
    font-size: 15px;
  }

  .articleList {
    font-size: 14px;
    padding-left: 20px;
  }
}
</style>