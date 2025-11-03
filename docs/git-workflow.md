# Git運用ルール

このドキュメントには、プロジェクトのGit運用ルールを記載します。

## ブランチ命名規則

- `main`: 本番環境用ブランチ（保護ブランチ）
- `feature/`: 機能追加用ブランチ（例: `feature/todo-crud`）
- `fix/`: バグ修正用ブランチ（例: `fix/todo-update-error`）
- `hotfix/`: 緊急修正用ブランチ（例: `hotfix/security-patch`）

## コミットメッセージ規約

**Conventional Commits形式**に従う:

```
<type>(<scope>): <subject>

<body>  # 必要な場合のみ記述

<footer>  # 必要な場合のみ記述（BREAKING CHANGEなど）
```

### 基本形式

- **必須**: `<type>(<scope>): <subject>`
- **任意**: `<body>`（変更の詳細説明が必要な場合のみ）
- **任意**: `<footer>`（BREAKING CHANGE、関連するIssue番号など）

### Type

- `feat`: 新機能
- `fix`: バグ修正
- `docs`: ドキュメントのみの変更
- `style`: コードの動作に影響しない変更（フォーマット、セミコロンなど）
- `refactor`: バグ修正や機能追加を伴わないコード改善
- `test`: テストの追加・修正
- `chore`: ビルドプロセスやツールの変更

### Scope（任意）

- 変更範囲を明確にする場合に指定（例: `web`, `api`, `graphql`, `prisma`）

### Subject

- 変更内容を簡潔に説明（50文字以内推奨）
- 現在形で記述（例: "Add" ではなく "Adds" ではなく "Add"）
- 文末にピリオドを付けない

### Body（必要な場合のみ記述）

以下に該当する場合はbodyを記述:
- 変更の理由や背景を説明する必要がある場合
- 複数の変更を含む場合
- BREAKING CHANGEを含む場合
- 関連するIssueやPRを参照する場合

### 例

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

## コミットのベストプラクティス（TDDベース）

- **グリーンバー（全テスト成功）の状態でコミット**: TDDの基本原則（詳細は[tdd-process.md](./tdd-process.md)を参照）
- **1つのTDDサイクル = 1つのコミット**: Red → Green → Refactor の1サイクルを1コミット
- **意味のあるコミットメッセージ**: 何を変更したか、なぜ変更したかを明確に
- **テストと実装を同時にコミット**: テストコードとプロダクションコードを同じコミットに含める

