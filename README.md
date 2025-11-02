# Vibe Sample - AI Coding Sample Web App

AIを使ったコーディングのサンプルとなるWebアプリケーション。

## プロジェクト構成

このプロジェクトはモノレポ構成になっています。

```
vibe-sample/
├── web/          # Webフロントエンド
├── api/          # バックエンドAPI
├── docs/          # ドキュメント（仕様・ルール）
└── README.md      # このファイル
```

## セットアップ

### 前提条件

- Node.js (推奨バージョン: 18以上)
- pnpm (推奨バージョン: 10.0.0以上)
- Git

### 初期セットアップ

1. リポジトリをクローン
```bash
git clone <repository-url>
cd vibe-sample
```

2. 依存関係のインストール
```bash
pnpm install
```

3. 環境変数の設定
- API: `api/.env` ファイルを作成し、`DATABASE_URL` と `PORT` を設定
- Web: `web/.env.local` ファイルを作成し、必要に応じて環境変数を設定

詳細は各ディレクトリのREADMEを参照してください。

- [Webフロントエンドのセットアップ](./web/README.md)
- [APIバックエンドのセットアップ](./api/README.md)

## 動作確認

ルートディレクトリの `package.json` に用意されているコマンドを使用して、開発・テスト・ビルドを実行できます。

### 開発サーバーの起動

**APIとWebを同時に起動:**
```bash
pnpm dev
```

**個別に起動:**
```bash
pnpm dev:api   # APIのみ（http://localhost:3001）
pnpm dev:web   # Webのみ（http://localhost:3000）
```

### テストの実行

**APIとWebのテストを同時に実行:**
```bash
pnpm test
```

**個別に実行:**
```bash
pnpm test:api       # APIのテストのみ
pnpm test:web       # Webのテストのみ
pnpm test:coverage  # カバレッジ付きでテスト実行
```

### ビルドの確認

**APIとWebをビルド:**
```bash
pnpm build
```

**個別にビルド:**
```bash
pnpm build:api  # APIのみ
pnpm build:web  # Webのみ
```

### リント・コード品質チェック

**リントとコード品質チェック:**
```bash
pnpm lint       # knip（未使用コード検出）+ ESLint（API + Web）
pnpm lint:api   # ESLintのみ（API）
pnpm lint:web   # ESLintのみ（Web）
pnpm lint:knip  # knipのみ（未使用コード・依存関係の検出）
```

**コードフォーマット:**
```bash
pnpm format     # Prettierでフォーマット（API + Web）
pnpm format:api # Prettierでフォーマット（APIのみ）
pnpm format:web # Prettierでフォーマット（Webのみ）
```

### その他のコマンド

```bash
pnpm start       # プロダクションモードで起動（事前にビルドが必要）
```

## 開発ルール

プロジェクトの開発ルールやコーディング規約については、[docs/rules.md](./docs/rules.md)を参照してください。

## 仕様

アプリケーションの仕様については、[docs/specification.md](./docs/specification.md)を参照してください。

## ライセンス

[ライセンス情報をここに追加]

