/** リポジトリ名検索用に GitHub search クエリ文字列へ変換する */
export const buildRepositorySearchQuery = (userInput: string): string => {
  const trimmed = userInput.trim();
  if (!trimmed) {
    return "";
  }

  return `${trimmed} in:name`;
};
