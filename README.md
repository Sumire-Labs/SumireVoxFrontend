# SumireVoxFrontend

SumireVoxBot の公式ウェブサイトフロントエンドです。VOICEVOXを活用したDiscord読み上げBotのランディングページ、ダッシュボード、管理画面を提供します。

## 概要

SumireVoxFrontendは、SumireVoxBot（Discord向けテキスト読み上げBot）のユーザーインターフェースを提供するVue.jsベースのウェブアプリケーションです。ユーザーはDiscord OAuth2認証を通じてログインし、ギルド（サーバー）設定の管理やプレミアム機能の購入が可能です。

## 技術スタック

- **フレームワーク**: Vue 3
- **ルーティング**: Vue Router
- **ビルドツール**: Vite
- **監視**: Sentry
- **認証**: Discord OAuth2

## 必要条件

- Node.js `^20.19.0` または `>=22.12.0`
- npm または yarn

## セットアップ

### 1. リポジトリのクローン

```bash
git clone https://github.com/Sumire-Labs/SumireVoxFrontend.git
cd SumireVoxFrontend
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. 環境変数の設定

`.env.template` をコピーして `.env` ファイルを作成し、必要な値を設定してください。

```bash
cp .env.template .env
```

| 環境変数 | 説明 |
|---------|------|
| `VITE_DISCORD_CLIENT_ID` | Discord OAuth2 クライアントID |
| `VITE_DISCORD_BOT_PERMISSIONS` | Botの権限（デフォルト: 3145728） |
| `VITE_API_BASE_URL` | バックエンドAPIのベースURL |
| `VITE_SENTRY_DSN` | Sentry DSN（本番環境用） |
| `VITE_APP_VERSION` | アプリバージョン |

### 4. 開発サーバーの起動

```bash
npm run dev
```

開発サーバーは `http://localhost:5173` で起動します。

## 利用可能なスクリプト

| コマンド | 説明 |
|---------|------|
| `npm run dev` | 開発サーバーを起動 |
| `npm run dev:api` | APIサーバーを起動 |
| `npm run build` | 本番用ビルドを作成 |
| `npm run preview` | ビルドのプレビュー |

## プロジェクト構成

```
src/
├── app/           # アプリケーション設定
├── assets/        # 静的アセット
├── components/    # 再利用可能なコンポーネント
├── composables/   # Vue Composition API フック
├── features/      # 機能モジュール
│   ├── auth/      # Discord OAuth認証
│   ├── billing/   # 課金・決済
│   └── guilds/    # ギルド管理
├── lib/           # ユーティリティ・ライブラリ
├── pages/         # ページコンポーネント
├── styles/        # グローバルスタイル
└── main.js        # エントリーポイント
```

## 主な機能

- **ホームページ**: SumireVoxBotの紹介とBot招待
- **ダッシュボード**: ユーザーが管理するギルド一覧
- **ギルド設定**: サーバーごとの読み上げ設定管理
- **プレミアム**: 有料プランの紹介と購入
- **認証**: Discord OAuth2によるログイン

## 関連プロジェクト

- [SumireVoxBot](https://github.com/Sumire-Labs/SumireVoxBot) - Discord読み上げBot本体
- [SumireVoxBackend](https://github.com/Sumire-Labs/SumireVoxBackend) - Discord読み上げBotのバックエンド

## ライセンス

このプロジェクトは [GNU Lesser General Public License v3.0](LICENSE.md) の下で公開されています。

## コントリビューション

Issue や Pull Request は歓迎します。大きな変更を行う場合は、事前にIssueで議論してください。

---

© 2026 Sumire-Labs