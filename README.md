# GitHub Repo Search

GitHub のリポジトリを名前で検索し、一覧から詳細（スター数・Watcher 数・Fork 数・Issue 数など）を閲覧できる Web アプリです。

- **フレームワーク**: Next.js 16（App Router）/ React 19
- **データ取得**: GitHub GraphQL API（サーバー側プロキシ経由）
- **クライアント状態**: TanStack React Query（検索結果のキャッシュ・ページング）
- **UI**: shadcn/ui（base-nova）+ Tailwind CSS 4

## 機能概要

| 画面                            | 内容                                                                                       |
| ------------------------------- | ------------------------------------------------------------------------------------------ |
| トップ（`/`）                   | リポジトリ名の部分一致検索（`in:name`）、ページネーション、0 件時メッセージ                |
| 詳細（`/repos/[owner]/[repo]`） | リポジトリ名・主要言語・オーナーアイコン・各種カウント。検索文脈を保持した「トップへ戻る」 |

## セットアップ

### 必要環境

- Node.js **22 以上**（`package.json` の `engines` / `.nvmrc` に準拠）

### 環境変数

リポジトリルートに `.env.local` を作成し、GitHub Personal Access Token を設定してください。

```bash
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
```

トークンは **サーバー側のみ** で参照します（`lib/github/graphql-fetch.ts`）。ブラウザには送られません。

### 起動

```bash
npm ci
npm run dev
```

[http://localhost:3000](http://localhost:3000) を開いて動作を確認できます。

### 品質チェック（ローカル）

```bash
npm run lint          # ESLint（max-warnings 0）
npm run format:check  # Prettier
npm run test          # Jest（33 テスト）
npm run build         # 本番ビルド
```

`main` への push / PR では GitHub Actions（`.github/workflows/ci.yml`）で上記と同等のチェックを実行します。

---

## 工夫した点・拘ったポイント

評価の観点ごとに、意図と実装の対応をまとめます。

### 1. セキュリティと API 設計（BFF パターン）

GitHub のアクセストークンをクライアントに露出させないため、検索は **Next.js Route Handler**（`app/api/search/route.ts`）を経由する構成にしています。

- ブラウザ → `/api/search` → GitHub GraphQL
- トークン未設定・認証失敗・レート制限・レスポンス異常などは、HTTP ステータスと `{ error: string }` に **意味のある単位でマッピング**（400 / 429 / 502 / 503）

### 2. 入力・外部レスポンスの多層バリデーション（Zod）

| 層          | 役割                                           | 主なファイル                                 |
| ----------- | ---------------------------------------------- | -------------------------------------------- |
| フォーム    | リアルタイム検証（空入力はエラーにしない）     | `lib/validation/repository-search-schema.ts` |
| API         | `q` / `first` / `after` の検証                 | `app/api/search/route.ts`                    |
| GitHub 応答 | GraphQL の wire 形式を正規化し、アプリ型に変換 | `lib/validation/github/*.ts`                 |

検索クエリは英数字・`.`・`_`・`-` のみ、最大 100 文字に制限しています。GitHub 側の想定外フィールドや `hasNextPage` と `endCursor` の不整合も `superRefine` で検出し、**ランタイムでも型でも信頼できるデータ**だけを UI に渡します。

### 3. レスポンシブ対応

モバイル〜デスクトップで読みやすさと操作性を揃えるため、Tailwind のブレークポイント（主に `sm:`）とデザイントークン（`lib/constants/design-sizes.ts`）でレイアウトを揃えています。

- **タッチターゲット**: 検索入力・送信ボタンに `min-h-11`（44px 相当）を共通適用し、指での操作しやすさを確保
- **トップ（検索フォーム）**: 狭い画面では入力とボタンを縦積み、幅が広がると横並びグリッドに切り替え（`components/home/home-page.tsx`）
- **詳細画面**: オーナーアイコンとリポジトリ名は縦積み → `sm` 以上で横並び。統計（Star / Watcher / Fork / Issue）は 2 列グリッド → `sm` 以上で 4 列（`clamp` でギャップも画面幅に追従）
- **ページネーション**: 前へ・次へなどのラベルは小画面で非表示にし、番号中心のコンパクト表示（`components/ui/pagination.tsx`）
- **全体レイアウト**: `max-w-6xl` のコンテナと横パディングで、大画面でも行長が伸びすぎないよう制御（`components/layout/page-container.tsx`）

### 4. 保守性：関心の分離とプロジェクト規約

ディレクトリ構成は **機能（home / repository）と横断関心（github / validation / navigation / search）** で分け、コンポーネントは表示、 `lib/` はロジックに寄せています。

加えて、レビューしやすさのために以下を導入しています。

- **ユーザー向け文言**の定数化（`lib/constants/app-strings.ts`）— 2 箇所以上の重複を禁止する Cursor ルールとセット
- **デザイントークン**（色・フォント・サイズ）の集中管理
- **shadcn/ui** をプリミティブ層に限定し、業務コンポーネントは `components/home` などに配置
- **JSDoc** を `lib/` と API Route の export に付与（仕様の読み取りコスト低減）
- **Conventional Commits** + Husky（pre-commit: lint-staged、pre-push: テスト）

### 5. テスト戦略

UI のスナップショットより、**仕様が明文化しやすい層**にテストを置いています（7 スイート / 33 テスト）。

- 検索クエリのバリデーション
- GitHub レスポンスの Zod パース（正常系・異常系）
- `buildRepositorySearchQuery`（`in:name` 付与）
- URL 組み立て・ページパラメータのパース
- リポジトリ詳細の表示（Testing Library）

CI では `lint` → `format:check` → `test:ci` → `build` の順で、**マージ前に壊れにくいパイプライン**にしています。

### 6. 技術選定の意図（要点）

| 選定               | 理由                                                              |
| ------------------ | ----------------------------------------------------------------- |
| GraphQL            | 検索と詳細で必要なフィールドだけ取得。REST よりクエリの意図が明確 |
| React Query        | 同一検索語の再訪問時のキャッシュ、infinite ページの蓄積           |
| Next.js App Router | 詳細ページの Server Component で初回 HTML にデータを載せられる    |
| Zod 4              | 入力・API・外部 JSON のスキーマを TypeScript 型と一元管理         |

---

## AI 利用レポート

本プロジェクトの開発では **Cursor（エージェント / チャット）** を補助的に利用しています。以下に、利用の目的・範囲・人間側の役割を記載します。

### 利用ツール

| ツール                                | 用途                                                                                 |
| ------------------------------------- | ------------------------------------------------------------------------------------ |
| Cursor Agent / Chat                   | 実装・リファクタ・テスト追加・README 整備                                            |
| Cursor Rules（`.cursor/rules/*.mdc`） | コミット形式、文言定数化、shadcn 利用、JSDoc 方針などの **プロジェクト規約の永続化** |

### 利用のしかた（プロセス）

1. **要件の分解は人間が行う**  
   例: 「トークンをクライアントに出さない」「URL で検索状態を復元する」など、課題の制約を先に決めてから実装依頼する。

2. **AI にはボイラープレートと反復作業を任せる**
   - Zod スキーマとテストのひな形
   - shadcn コンポーネントの導入・`className` の調整
   - CI ワークフローや Husky 設定
   - JSDoc・Cursor ルールのドラフト

3. **生成コードは必ず人間がレビューする**
   - セキュリティ（トークン・エラーメッセージの漏洩）
   - URL / ページングの境界条件（深いページ、空ページ、不正 `page`）
   - 既存の命名・ディレクトリ規約との整合

4. **規約はルールファイルに落とし、再生成のブレを抑える**  
   AI が毎回異なるスタイルで書くのを防ぐため、`app-strings` の共通化や shadcn の使い分けなどを `.cursor/rules` に明文化しています。

### AI に任せなかった / 最終判断は人間が行った領域

- **アーキテクチャ**: BFF（`/api/search`）、URL を状態の中心にする設計、infinite query とページ番号のハイブリッド
- **プロダクト仕様**: 許可文字・最大文字数、1 ページ 20 件、詳細からの検索文脈の引き継ぎ
- **品質ゲート**: CI の段階、ESLint `max-warnings 0`、pre-push でテスト実行
- **セキュリティ**: `GITHUB_TOKEN` の参照箇所の限定、HTTP ステータスとエラーメッセージの対応表

### 透明性について

- AI 生成のままマージしたコードはなく、**lint / test / build を通したものだけ**をコミットしています。
- コミット履歴は Conventional Commits で機能単位に分割しており、どの変更が何の目的か追いやすいようにしています。

### 振り返り（AI 利用の効果と注意点）

| 効果                                       | 注意点                                                                                   |
| ------------------------------------------ | ---------------------------------------------------------------------------------------- |
| ボイラープレートとテストの初期実装が速い   | ページングや認証まわりは仕様の読み違えが起きやすいため、境界条件のテストを人間が追加した |
| ルール化によりスタイルの一貫性が保ちやすい | ルール自体のメンテナンスが必要（過剰なルールは避け、実際にブレた点だけを追記）           |
| README・JSDoc の下書きが楽                 | 実装と乖離しないよう、export の変更時にドキュメントも更新する                            |

---

## ディレクトリ構成（抜粋）

```text
app/
  api/search/route.ts      # GitHub 検索プロキシ
  page.tsx                 # トップ（HomePage）
  repos/[owner]/[repo]/    # 詳細（Server Component）
components/
  home/                    # 検索フォーム・一覧・ページネーション
  repository/              # 詳細表示
  navigation/              # ヘッダー・戻るリンク
lib/
  github/                  # GraphQL クライアント・検索・詳細取得
  validation/              # Zod スキーマ（入力・GitHub 応答）
  navigation/              # URL 組み立て・パース
  search/                  # React Query オプション・フック
  constants/               # 文言・デザイントークン
```
