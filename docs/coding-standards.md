# コーディング規約

このドキュメントには、プロジェクトのコーディング規約を記載します。

## フロントエンド（web/）

### 言語とフレームワーク

- **Next.js 14+ (App Router)** + **TypeScript** を使用
- TypeScriptの厳格モード（`strict: true`）を有効化
- 型安全性を最優先に、`any`型の使用を避ける

### 命名規則

- **コンポーネント**: PascalCase（例: `TodoList.tsx`, `CreateTodoForm.tsx`）
- **ファイル名**: コンポーネントファイルはPascalCase、その他はcamelCase
- **変数・関数**: camelCase（例: `todoList`, `handleSubmit`）
- **定数**: UPPER_SNAKE_CASE（例: `API_BASE_URL`）
- **型・インターフェース**: PascalCase、型は`Todo`、インターフェースは`ITodo`（または`Todo`のみで統一）

### コンポーネント構成

- コンポーネントは`components/`ディレクトリに配置
- 1ファイル1コンポーネントを原則とする
- 共通コンポーネントは`components/common/`に配置
- 機能別コンポーネントは`components/todo/`のように機能ごとにディレクトリを分割

### スタイリング

- **Vanilla Extract**を使用
- スタイルファイルは`styles/`ディレクトリで一元管理
- 共通スタイル（カラー、スペーシング、タイポグラフィ）は`styles/theme.ts`に定義
- コンポーネント固有のスタイルは`styles/components/`に配置

### 状態管理

- **Context API**を使用（軽量な状態管理）
- グローバル状態は`contexts/`ディレクトリに配置
- ローカル状態は`useState`を使用
- 複雑な状態管理が必要な場合はカスタムフックを作成

### GraphQL

- **Apollo Client**を使用
- GraphQLクエリ/ミューテーションは`lib/graphql/`に配置
- 型安全性のため、GraphQL Code Generatorの使用を推奨（将来的に実装）

### コード品質

- **ESLint** + **Prettier**でコードフォーマットを統一
- **knip**で未使用コード・依存関係を検出・クリーンアップ
- コミット前に`pnpm lint`（knip + ESLint（API + Web））と`pnpm format`を実行
- 未使用のインポート、変数、ファイルは削除

## バックエンド（api/）

### 言語とフレームワーク

- **Hono.js** + **TypeScript** を使用
- TypeScriptの厳格モード（`strict: true`）を有効化
- ES Modules (`"type": "module"`) を使用

### 命名規則

- **ファイル名**: kebab-case（例: `todo-resolver.ts`）またはcamelCase
- **関数・変数**: camelCase
- **型・インターフェース**: PascalCase
- **定数**: UPPER_SNAKE_CASE

### ディレクトリ構造

```
api/
├── src/
│   ├── graphql/        # GraphQLスキーマとリゾルバー
│   ├── prisma/         # Prismaクライアント
│   └── index.ts        # エントリーポイント
├── prisma/
│   └── schema.prisma   # Prismaスキーマ
└── dist/               # ビルド出力
```

### GraphQL

- **@hono/graphql-server**を使用
- スキーマ定義は`src/graphql/schema.ts`に配置
- リゾルバーは型安全に実装（入力値のバリデーションを含む）
- エラーハンドリングは適切に行い、エラーメッセージを返す

### データベース

- **Prisma**を使用してSQLiteにアクセス
- Prismaクライアントは`src/prisma/client.ts`から一元エクスポート
- マイグレーションは`pnpm prisma:migrate`で実行
- 本番環境では必ずマイグレーションを実行してからデプロイ

### エラーハンドリング

- GraphQLリゾルバー内でエラーが発生した場合は、適切なエラーメッセージを返す
- 予期しないエラーはログに記録し、ユーザーには一般的なエラーメッセージを返す

### コード品質

- **ESLint** + **Prettier**でコードフォーマットを統一
- **knip**で未使用コード・依存関係を検出・クリーンアップ
- コミット前に`pnpm lint`（knip + ESLint（API + Web））と`pnpm format`を実行
- 型安全性を最優先に、`any`型の使用を避ける
- 非同期処理は適切に`async/await`を使用
- トランザクション処理が必要な場合はPrismaのトランザクション機能を使用

