<script setup>
import HeaderBar from "@/components/HeaderBar.vue";
import FooterBar from "@/components/FooterBar.vue";

const LAST_UPDATED = "2026年2月23日";

const SECTIONS = [
  {
    id: "section-1",
    title: "1. はじめに",
    content: `本払い戻しポリシー（以下「本ポリシー」といいます）は、Sumire-Labs（以下「当方」といいます）が提供するSumireVoxサービス（以下「本サービス」といいます）における払い戻しの条件および手続きについて定めるものです。本ポリシーは、SumireVox サービス利用規約と併せて適用されます。`
  },
  {
    id: "section-2",
    title: "2. 基本方針",
    content: `本サービスはデジタルコンテンツおよびオンラインサービスとして提供されるため、購入完了後の払い戻しは原則として行いません。ユーザーは、購入前にサービス内容、機能、料金を十分にご確認ください。`,
    subContent: `無料プランをご利用いただくことで、本サービスの基本機能をお試しいただけます。プレミアムプランの購入は、本サービスの内容を理解したうえで行ってください。`
  },
  {
    id: "section-3",
    title: "3. 払い戻しが認められる場合",
    content: `以下の場合に限り、当方は払い戻しを検討します。`,
    subSections: [
      {
        title: "3.1 当方の責に帰すべき事由による場合",
        content: `当方のシステム障害やサービス提供の不備により、購入したプレミアムプランの機能が全く利用できない状態が継続した場合、払い戻しを検討します。ただし、一時的なサービス中断やメンテナンスによる利用停止は、払い戻しの対象とはなりません。`
      },
      {
        title: "3.2 二重課金・誤課金の場合",
        content: `同一のサービスに対して複数回課金された場合、または誤った金額が課金された場合は、重複分または差額について払い戻しを行います。`
      },
      {
        title: "3.3 法令により払い戻しが義務付けられる場合",
        content: `消費者保護法その他の適用法令により払い戻しが義務付けられる場合は、当該法令に従って対応します。`
      }
    ]
  },
  {
    id: "section-4",
    title: "4. 払い戻しが認められない場合",
    content: `以下の場合には、払い戻しには応じられません。`,
    notAllowedItems: [
      "ユーザーの都合による解約（気が変わった、サービスを使わなくなった等）の場合",
      "サービス内容や機能に対する不満（ただし、購入前に明示されていた内容と著しく異なる場合を除く）の場合",
      "ユーザーの環境（インターネット接続、Discordアカウントの問題等）に起因してサービスを利用できない場合",
      "利用規約に違反したことによりアカウントが停止された場合",
      "サブスクリプションの解約手続きをユーザーが怠ったことにより発生した課金の場合",
      "Stripeのシステムに起因する問題により解約手続きが正常に完了しなかった場合",
      "購入から14日を超えて払い戻しを申請した場合（第3.2項の二重課金・誤課金の場合を除く）"
    ]
  },
  {
    id: "section-5",
    title: "5. 払い戻し申請の手続き",
    content: ``,
    subSections: [
      {
        title: "5.1 申請期限",
        content: `払い戻しの申請は、購入日から14日以内に行ってください。14日を超えた申請については、二重課金・誤課金の場合を除き、原則として受け付けられません。`
      },
      {
        title: "5.2 申請方法",
        content: `払い戻しを希望される場合は、以下の情報を添えて当方までお問い合わせください。`,
        requiredItems: [
          "ご登録のDiscordユーザー名およびユーザーID",
          "購入日および購入したプランの名称",
          "決済時に使用したメールアドレス",
          "払い戻しを希望する理由の詳細",
          "該当する場合は問題を示すスクリーンショット等の証拠"
        ]
      },
      {
        title: "5.3 申請先",
        content: `GitHub Issues: https://github.com/Sumire-Labs/SumireVoxBot/issues`,
        subContent: `または当方が別途指定する連絡先にお問い合わせください。`
      }
    ]
  },
  {
    id: "section-6",
    title: "6. 払い戻しの審査と決定",
    content: ``,
    subSections: [
      {
        title: "6.1 審査",
        content: `当方は、払い戻し申請を受領後、申請内容を審査します。審査には通常5営業日程度を要しますが、調査が必要な場合はさらに時間がかかることがあります。`
      },
      {
        title: "6.2 決定",
        content: `払い戻しの可否は当方の裁量により決定します。審査結果は、申請時にご連絡いただいた方法によりお知らせします。`
      },
      {
        title: "6.3 払い戻し方法",
        content: `払い戻しが承認された場合、原則として元の支払い方法に対して返金処理を行います。返金処理はStripeを通じて行われ、実際に返金が反映されるまでに5〜10営業日程度かかる場合があります。返金のタイミングは、ご利用の金融機関やカード会社の処理状況により異なります。`
      }
    ]
  },
  {
    id: "section-7",
    title: "7. サブスクリプションの解約について",
    content: ``,
    subSections: [
      {
        title: "7.1 解約手続き",
        content: `サブスクリプションの解約は払い戻しとは異なります。解約は、ユーザー自身がStripeの顧客ポータルまたは当方が案内する手続き方法により行ってください。`
      },
      {
        title: "7.2 解約後の取り扱い",
        content: `解約手続きが完了した場合、次回以降の課金は停止されます。解約後も、当該契約期間の終了時まではプレミアムプランの機能を引き続きご利用いただけます。解約に伴う日割り計算での払い戻しは行いません。`
      },
      {
        title: "7.3 解約に関する免責",
        content: `当方は解約手続きに関するサポートを提供しますが、Stripeのシステムに起因する解約手続きの遅延、不具合、課金の継続その他の問題について、当方は一切の責任を負いません。ユーザーは、次回更新日までに十分な余裕をもって解約手続きを完了する責任を負います。`
      }
    ]
  },
  {
    id: "section-8",
    title: "8. サービス終了時の対応",
    content: `当方が本サービスを終了する場合、有効なサブスクリプション契約を有するユーザーに対しては、未使用期間に相当する料金の払い戻しを行います。払い戻しの具体的な方法および時期については、サービス終了の告知と併せてお知らせします。`
  },
  {
    id: "section-9",
    title: "9. 不正な払い戻し申請",
    content: `虚偽の情報に基づく払い戻し申請、または不正な手段による払い戻しの取得を試みた場合、当方は当該ユーザーのアカウントを停止し、法的措置を講じる権利を留保します。`
  },
  {
    id: "section-10",
    title: "10. 払い戻し申請に伴う情報収集",
    content: `払い戻し申請の審査および対応のため、当方はサービス利用規約および個人情報保護方針に定める情報以外の情報（氏名、メールアドレス、決済明細、スクリーンショット、その他ユーザーが任意に提供する情報を含む）を収集・管理することがあります。`,
    subContent: `ユーザーは、これらの情報を当方に提供することにより、払い戻し申請の審査および関連する調査のために当該情報を利用することに同意したものとみなされます。`,
    additionalContent: `これらの情報の収集・管理に関連して生じた損害について、当方の故意または重大な過失による場合を除き、当方は一切の責任を負いません。`
  },
  {
    id: "section-11",
    title: "11. Stripeに関する免責事項",
    content: `本サービスの決済処理はStripeを通じて行われます。Stripeの利用に起因して生じた損害（払い戻し処理の遅延、エラー、システム障害等を含む）について、当方は一切の責任を負いません。Stripeに関する問題については、ユーザーが直接Stripeにお問い合わせください。`,
    externalLink: {
      label: "Stripeサポート",
      url: "https://support.stripe.com/"
    }
  },
  {
    id: "section-12",
    title: "12. 本ポリシーの変更",
    content: `当方は、必要に応じて本ポリシーを変更することができます。変更を行う場合は、本サービス上で告知します。変更後も本サービスを継続して利用された場合、ユーザーは変更後のポリシーに同意したものとみなされます。`
  },
  {
    id: "section-13",
    title: "13. お問い合わせ",
    content: `本ポリシーに関するご質問やご不明点がございましたら、以下までお問い合わせください。`,
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
        <h1 class="title">SumireVox 払い戻しポリシー</h1>
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

          <p v-if="section.additionalContent" class="articleText">
            {{ section.additionalContent }}
          </p>

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

              <!-- 必要項目リスト -->
              <ul v-if="sub.requiredItems" class="articleList">
                <li v-for="(item, idx) in sub.requiredItems" :key="idx">
                  {{ item }}
                </li>
              </ul>
            </div>
          </div>

          <!-- 認められない場合のリスト -->
          <ul v-if="section.notAllowedItems" class="articleList">
            <li v-for="(item, index) in section.notAllowedItems" :key="index">
              {{ item }}
            </li>
          </ul>

          <!-- 外部リンク -->
          <div v-if="section.externalLink" class="externalLinkBox">
            <a
                :href="section.externalLink.url"
                target="_blank"
                rel="noopener noreferrer"
                class="externalLink"
            >
              {{ section.externalLink.label }}: {{ section.externalLink.url }}
            </a>
          </div>

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
  margin-bottom: 12px;
  background: linear-gradient(135deg, var(--text), var(--primary2));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
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

.externalLinkBox {
  margin-top: 16px;
  padding: 12px 16px;
  background: rgba(123, 144, 255, 0.08);
  border-radius: 10px;
  border: 1px solid rgba(123, 144, 255, 0.15);
}

.externalLink {
  color: var(--primary);
  font-weight: 600;
  font-size: 14px;
  word-break: break-all;
}

.externalLink:hover {
  opacity: 0.8;
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