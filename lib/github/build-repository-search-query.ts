/**
 * ユーザー入力を GitHub リポジトリ名検索用のクエリ文字列に変換する。
 *
 * @param userInput - 検索ボックスの生入力（前後空白は trim される）
 * @returns 空または空白のみのときは `""`。それ以外は `{trimmed} in:name`
 *
 * @example
 * buildRepositorySearchQuery("next.js") // => "next.js in:name"
 * buildRepositorySearchQuery("  ") // => ""
 */
export const buildRepositorySearchQuery = (userInput: string): string => {
  const trimmed = userInput.trim();
  if (!trimmed) {
    return "";
  }

  return `${trimmed} in:name`;
};
