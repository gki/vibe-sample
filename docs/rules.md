# 開発ルール

このドキュメントには、プロジェクトの開発におけるルールやコーディング規約を記載します。

## コーディング規約

### フロントエンド（web/）

#### 言語とフレームワーク
- **Next.js 14+ (App Router)** + **TypeScript** を使用
- TypeScriptの厳格モード（`strict: true`）を有効化
- 型安全性を最優先に、`any`型の使用を避ける

#### 命名規則
- **コンポーネント**: PascalCase（例: `TodoList.tsx`, `CreateTodoForm.tsx`）
- **ファイル名**: コンポーネントファイルはPascalCase、その他はcamelCase
- **変数・関数**: camelCase（例: `todoList`, `handleSubmit`）
- **定数**: UPPER_SNAKE_CASE（例: `API_BASE_URL`）
- **型・インターフェース**: PascalCase、型は`Todo`、インターフェースは`ITodo`（または`Todo`のみで統一）

#### コンポーネント構成
- コンポーネントは`components/`ディレクトリに配置
- 1ファイル1コンポーネントを原則とする
- 共通コンポーネントは`components/common/`に配置
- 機能別コンポーネントは`components/todo/`のように機能ごとにディレクトリを分割

#### スタイリング
- **Vanilla Extract**を使用
- スタイルファイルは`styles/`ディレクトリで一元管理
- 共通スタイル（カラー、スペーシング、タイポグラフィ）は`styles/theme.ts`に定義
- コンポーネント固有のスタイルは`styles/components/`に配置

#### 状態管理
- **Context API**を使用（軽量な状態管理）
- グローバル状態は`contexts/`ディレクトリに配置
- ローカル状態は`useState`を使用
- 複雑な状態管理が必要な場合はカスタムフックを作成

#### GraphQL
- **Apollo Client**を使用
- GraphQLクエリ/ミューテーションは`lib/graphql/`に配置
- 型安全性のため、GraphQL Code Generatorの使用を推奨（将来的に実装）

#### コード品質
- **ESLint** + **Prettier**でコードフォーマットを統一
- コミット前に`pnpm lint`と`pnpm format`を実行
- 未使用のインポート、変数は削除

### バックエンド（api/）

#### 言語とフレームワーク
- **Hono.js** + **TypeScript** を使用
- TypeScriptの厳格モード（`strict: true`）を有効化
- ES Modules (`"type": "module"`) を使用

#### 命名規則
- **ファイル名**: kebab-case（例: `todo-resolver.ts`）またはcamelCase
- **関数・変数**: camelCase
- **型・インターフェース**: PascalCase
- **定数**: UPPER_SNAKE_CASE

#### ディレクトリ構造
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

#### GraphQL
- **@hono/graphql-server**を使用
- スキーマ定義は`src/graphql/schema.ts`に配置
- リゾルバーは型安全に実装（入力値のバリデーションを含む）
- エラーハンドリングは適切に行い、エラーメッセージを返す

#### データベース
- **Prisma**を使用してSQLiteにアクセス
- Prismaクライアントは`src/prisma/client.ts`から一元エクスポート
- マイグレーションは`pnpm prisma:migrate`で実行
- 本番環境では必ずマイグレーションを実行してからデプロイ

#### エラーハンドリング
- GraphQLリゾルバー内でエラーが発生した場合は、適切なエラーメッセージを返す
- 予期しないエラーはログに記録し、ユーザーには一般的なエラーメッセージを返す

#### コード品質
- 型安全性を最優先に、`any`型の使用を避ける
- 非同期処理は適切に`async/await`を使用
- トランザクション処理が必要な場合はPrismaのトランザクション機能を使用

## 作業の進め方

### 開発フロー - TDD (Test-Driven Development)

Kent Beck、t-wada（和田卓人）のTDD手法に基づく開発フローです。

#### TDDの基本サイクル: Red → Green → Refactor

1. **Red: 失敗するテストを書く**
   - 実装する前に、期待する動作をテストコードで表現する
   - テストを実行して失敗することを確認（Red）
   - この時点では実装コードは書かない

2. **Green: テストを通す最小限の実装を行う**
   - テストを通すために必要最小限のコードを書く
   - テストが通ることを確認（Green）
   - 綺麗なコードである必要はない（まず動くこと）

3. **Refactor: リファクタリング**
   - テストが通った状態を維持しながら、コードを改善する
   - 重複の削除、可読性の向上、パフォーマンスの改善など
   - リファクタリング後もテストが通ることを確認

#### TDDの三原則（Robert C. Martin）

1. **失敗するテストを書くまでプロダクションコードを書いてはならない**
2. **失敗するテストをコンパイルできるようにするまで追加のテストを書いてはならない**
3. **失敗するテストをパスするために必要な以上のプロダクションコードを書いてはならない**

#### グリーンバーのルール（t-wada）

- **グリーンバー（テスト成功）の時にコミットする**
  - テストが全て通っている状態でコミット
  - レッドバー（テスト失敗）の状態でコミットしない

#### 開発フローの詳細ステップ

1. **タスクの確認**
   - 実装する機能・修正内容を明確にする
   - 必要に応じて`docs/specification.md`を更新
   - テストすべき振る舞いを定義する

2. **ブランチ作成**
   - `feature/`、`fix/`、`hotfix/`プレフィックスを使用
   - ブランチ名は作業内容を明確に（例: `feature/todo-list-component`）

3. **TDDサイクルの実行**
   - **Red**: 失敗するテストを書く
   - **Green**: テストを通す最小限の実装
   - **Refactor**: コードの改善（テストは常にグリーン）
   - このサイクルを小さなステップで繰り返す

4. **コード品質チェック**
   - フロントエンド: `pnpm lint`、`pnpm format`
   - バックエンド: `pnpm lint`、`pnpm format`
   - エラーや警告を修正（リファクタリングの一部として）

5. **コミット**
   - **グリーンバー（全テスト成功）の状態でコミット**
   - Conventional Commits形式に従う
   - 小さなコミットを心がける（1つのTDDサイクル = 1つのコミット）

6. **プッシュ・マージ**
   - リモートブランチにプッシュ
   - 必要に応じてプルリクエストを作成

#### TDDのベストプラクティス

- **小さなステップで進む**: 一度に多くのことを実装しようとしない
- **テストを先に書く**: 実装コードより先にテストを書く習慣をつける
- **グリーンバーを維持**: リファクタリング中もテストが通る状態を保つ
- **テストの粒度**: 単体テストを中心に、小さな単位でテストを書く
- **失敗の確認**: テストが本当に失敗していることを確認してから実装する

### 実装の優先順位

1. **Phase 1: 基盤セットアップ**（完了）
   - プロジェクト初期化
   - 開発ツール設定

2. **Phase 2: データベース・API**
   - Prisma設定とデータモデル定義
   - GraphQLスキーマ・Resolver実装
   - API動作確認

3. **Phase 3: フロントエンド**
   - Apollo Client設定
   - TODOコンポーネント実装
   - GraphQLクエリ/ミューテーション実装

4. **Phase 4: 統合テスト・ドキュメント**
   - エンドツーエンドテスト
   - ドキュメント整備

## Git運用ルール

### ブランチ命名規則

- `main`: 本番環境用ブランチ（保護ブランチ）
- `feature/`: 機能追加用ブランチ（例: `feature/todo-crud`）
- `fix/`: バグ修正用ブランチ（例: `fix/todo-update-error`）
- `hotfix/`: 緊急修正用ブランチ（例: `hotfix/security-patch`）

### コミットメッセージ規約

**Conventional Commits形式**に従う:

```
<type>(<scope>): <subject>

<body>  # 必要な場合のみ記述

<footer>  # 必要な場合のみ記述（BREAKING CHANGEなど）
```

#### 基本形式

- **必須**: `<type>(<scope>): <subject>`
- **任意**: `<body>`（変更の詳細説明が必要な場合のみ）
- **任意**: `<footer>`（BREAKING CHANGE、関連するIssue番号など）

#### Type
- `feat`: 新機能
- `fix`: バグ修正
- `docs`: ドキュメントのみの変更
- `style`: コードの動作に影響しない変更（フォーマット、セミコロンなど）
- `refactor`: バグ修正や機能追加を伴わないコード改善
- `test`: テストの追加・修正
- `chore`: ビルドプロセスやツールの変更

#### Scope（任意）
- 変更範囲を明確にする場合に指定（例: `web`, `api`, `graphql`, `prisma`）

#### Subject
- 変更内容を簡潔に説明（50文字以内推奨）
- 現在形で記述（例: "Add" ではなく "Adds" ではなく "Add"）
- 文末にピリオドを付けない

#### Body（必要な場合のみ記述）
以下に該当する場合はbodyを記述:
- 変更の理由や背景を説明する必要がある場合
- 複数の変更を含む場合
- BREAKING CHANGEを含む場合
- 関連するIssueやPRを参照する場合

#### 例

**シンプルな例（bodyなし）**
```
feat(web): Add TODO list component
```

```
fix(api): Handle null values in todo resolver
```

```
test(graphql): Add test for createTodo mutation
```

**詳細な例（bodyあり）**
```
feat(web): Add TODO list component

- Create TodoList component with Apollo Client integration
- Add GraphQL query for fetching todos
- Implement responsive design with Vanilla Extract

Closes #123
```

```
fix(api): Handle null values in todo resolver

Fixed issue where todo resolver would crash when ID doesn't exist.
Added proper error handling and validation.

Fixes #456
```

```
feat(api): Change GraphQL schema structure

BREAKING CHANGE: The Todo type now uses createdAt instead of created_at.
Migration guide: Update your GraphQL queries accordingly.
```

### コミットのベストプラクティス（TDDベース）

- **グリーンバー（全テスト成功）の状態でコミット**: TDDの基本原則
- **1つのTDDサイクル = 1つのコミット**: Red → Green → Refactor の1サイクルを1コミット
- **意味のあるコミットメッセージ**: 何を変更したか、なぜ変更したかを明確に
- **テストと実装を同時にコミット**: テストコードとプロダクションコードを同じコミットに含める

## データベース管理

### SQLite

- データベースファイル（`dev.db`）は`api/`ディレクトリに配置
- `.gitignore`で除外（コミットしない）

### マイグレーション

- Prismaマイグレーションを使用
- スキーマ変更後は必ずマイグレーションを作成: `pnpm prisma:migrate`
- マイグレーションファイルはコミットに含める

### バックアップ

- 本番環境では定期的にデータベースファイルをバックアップ
- 開発環境では必要に応じて手動でバックアップ

### 開発時のデータベース管理

- `pnpm prisma:studio`でPrisma Studioを起動してデータを確認・編集
- 開発中のテストデータは必要に応じて手動で投入

## テスト

### テストフレームワーク

- **Vitest**を使用（フロントエンド・バックエンド共通）

### TDDにおけるテストの書き方

#### 単体テスト（優先）

- 関数、コンポーネント、リゾルバーの個別テスト
- TDDでは、まず単体テストから始める
- 小さな単位でテストを書く（1つの関数、1つのメソッドなど）

#### 統合テスト

- APIエンドポイント、GraphQLクエリ/ミューテーションのテスト
- 単体テストが揃った後に追加で書く

### テストの構造（AAAパターン）

```typescript
describe('関数名またはコンポーネント名', () => {
  it('期待する振る舞いを説明', () => {
    // Arrange（準備）: テストデータやモックの準備
    const input = 'test data';
    
    // Act（実行）: テスト対象の実行
    const result = functionToTest(input);
    
    // Assert（検証）: 結果の検証
    expect(result).toBe(expectedValue);
  });
});
```

### テスト実行

- **開発中**: `pnpm test`（ウォッチモード）- TDDサイクル中は常に実行
- **コミット前**: `pnpm test` - 全テストが通ることを確認
- **カバレッジ確認**: `pnpm test:coverage`

### TDDにおけるテストの原則

1. **テストは明確に**: テスト名は何をテストしているか明確に
2. **1つのテスト、1つのアサーション**: 1つのテストで1つのことを検証
3. **独立性**: テストは互いに依存しない（実行順序に依存しない）
4. **再現性**: 同じ条件下で常に同じ結果になる

### カバレッジ目標

- TDDで実装した部分: 高いカバレッジが自然に達成される
- 初期実装: 60%以上
- 本番リリース前: 80%以上（推奨）

**注意**: カバレッジは目標であり、TDDの目的ではない。TDDの目的は「動作する仕様」を作ること。

## コードレビュー

### レビューの基準

- **機能要件**: 要件を満たしているか
- **コード品質**: 読みやすく、保守しやすいコードか
- **パフォーマンス**: パフォーマンスに問題がないか
- **セキュリティ**: セキュリティ上の問題がないか
- **テスト**: 適切なテストが書かれているか

### 必須チェック項目

- [ ] コードがLintルールに準拠しているか
- [ ] 型安全性が保たれているか
- [ ] エラーハンドリングが適切か
- [ ] ドキュメント（コメント）が適切か
- [ ] 未使用のコードがないか

## 環境変数管理

### 環境変数ファイル

- `.env.example`: テンプレートファイル（コミットする）
- `.env`: 実際の環境変数（`.gitignore`で除外）

### 環境変数の命名

- 大文字とアンダースコアを使用（例: `DATABASE_URL`、`API_BASE_URL`）

## その他

### 依存関係の管理

- 新しいパッケージ追加時は`pnpm add <package>`を使用
- 不要になったパッケージは削除する
- 定期的に依存関係の更新を検討

### ドキュメント

- コードの重要な部分にはコメントを追加
- 関数・コンポーネントにはJSDocコメントを追加（特にパブリックAPI）
- `docs/`ディレクトリのドキュメントは最新の状態に保つ

### パフォーマンス

- 不要な再レンダリングを避ける（React.memo、useMemo、useCallbackの適切な使用）
- GraphQLクエリは必要なデータのみ取得
- データベースクエリは適切なインデックスを使用

