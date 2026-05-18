/** アプリ全体の表示名（ヘッダー・metadata など） */
export const APP_TITLE = "GitHub Repo Search";

/** リポジトリ詳細などからホームへ戻るリンクのラベル */
export const BACK_TO_HOME_LABEL = "トップページへ戻る";

/** `parseRepositorySearchQuery` で許可文字外のときに使うメッセージ */
export const REPOSITORY_SEARCH_INVALID_CHARS_MESSAGE =
  "使用できない文字が含まれています。英数字、ハイフン（-）、アンダースコア（_）、ピリオド（.）のみ入力できます。";

/** `parseRepositorySearchQuery` で最大長超過のときに使うメッセージ */
export const REPOSITORY_SEARCH_TOO_LONG_MESSAGE =
  "リポジトリ名は100文字以内で入力してください。";

/**
 * ページ固有の metadata `title` を組み立てる。
 *
 * @param segment - ページ識別子（例: `facebook/react`）
 * @returns `{segment} | GitHub Repo Search` 形式の文字列
 */
export const formatAppPageTitle = (segment: string) =>
  `${segment} | ${APP_TITLE}`;
