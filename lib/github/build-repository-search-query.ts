/** リポジトリ名検索用に GitHub search クエリ文字列へ変換する */
export function buildRepositorySearchQuery(userInput: string): string {
  const trimmed = userInput.trim();
  if (!trimmed) {
    return "";
  }

  // 既に GitHub の検索修飾子を含む場合はそのまま渡す
  if (/\b(in:|user:|org:|repo:|language:|stars:|fork:)/i.test(trimmed)) {
    return trimmed;
  }

  return `${trimmed} in:name`;
}
