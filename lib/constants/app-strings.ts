export const APP_TITLE = "GitHub Repo Search";

export const BACK_TO_HOME_LABEL = "トップページへ戻る";

export const REPOSITORY_SEARCH_INVALID_CHARS_MESSAGE =
  "使用できない文字が含まれています。英数字、ハイフン（-）、アンダースコア（_）、ピリオド（.）のみ入力できます。";

export const REPOSITORY_SEARCH_TOO_LONG_MESSAGE =
  "リポジトリ名は100文字以内で入力してください。";

export const formatAppPageTitle = (segment: string) =>
  `${segment} | ${APP_TITLE}`;
