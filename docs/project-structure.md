# プロジェクト構造とその他

このドキュメントには、プロジェクト構造とその他のガイドラインについて記載します。

## プロジェクト構造

このプロジェクトはモノレポ構成になっています。

```
vibe-sample/
├── web/          # Webフロントエンド
│   ├── app/      # Next.js App Router
│   ├── components/  # Reactコンポーネント
│   ├── contexts/   # Context API
│   ├── lib/        # ライブラリ（GraphQLクライアントなど）
│   └── styles/     # Vanilla Extractスタイル
├── api/          # バックエンドAPI
│   ├── src/
│   │   ├── graphql/  # GraphQLスキーマとリゾルバー
│   │   ├── prisma/   # Prismaクライアント
│   │   └── index.ts  # エントリーポイント
│   └── prisma/       # Prismaスキーマ
├── docs/         # ドキュメント
└── README.md     # プロジェクトのREADME
```

詳細なディレクトリ構造については、各セクションのドキュメントを参照してください：
- フロントエンド: [coding-standards.md](./coding-standards.md)
- バックエンド: [coding-standards.md](./coding-standards.md)

## ドキュメント

- コードの重要な部分にはコメントを追加
- 関数・コンポーネントにはJSDocコメントを追加（特にパブリックAPI）
- `docs/`ディレクトリのドキュメントは最新の状態に保つ

## パフォーマンス

### フロントエンド

- 不要な再レンダリングを避ける（React.memo、useMemo、useCallbackの適切な使用）
- GraphQLクエリは必要なデータのみ取得

### バックエンド

- データベースクエリは適切なインデックスを使用
- 非同期処理は適切に`async/await`を使用（詳細は[coding-standards.md](./coding-standards.md)を参照）

