/** ホーム検索の URL クエリ名（リポジトリ詳細への戻りリンクでも同じ名前を使う） */
export const HOME_SEARCH_QUERY_PARAM = "q";

/** ホーム検索のページ番号クエリ名（1 ページ目は URL に含めない） */
export const HOME_PAGE_PARAM = "page";

/**
 * URL の `page` クエリを 1 以上の整数にパースする。
 *
 * @param value - `searchParams.get("page")` など
 * @returns 未指定・空・非数・1 未満のときは `1`
 */
export const parseHomePageParam = (value: string | null): number => {
  if (value === null || value === "") {
    return 1;
  }

  const page = Number.parseInt(value, 10);
  if (!Number.isFinite(page) || page < 1) {
    return 1;
  }

  return page;
};

const formatSearchContextQuery = (
  searchQuery?: string | null,
  page?: number | null,
): string | null => {
  const trimmed = searchQuery?.trim();
  if (!trimmed) {
    return null;
  }

  const pageNumber = page ?? 1;
  const params = new URLSearchParams();
  params.set(HOME_SEARCH_QUERY_PARAM, trimmed);

  if (pageNumber > 1) {
    params.set(HOME_PAGE_PARAM, String(pageNumber));
  }

  return params.toString();
};

/**
 * ホーム（`/`）への href を組み立てる。
 *
 * @param searchQuery - 省略・空のときはクエリなしの `/`
 * @param page - `1` のときは `page` パラメータを付けない。`2` 以上で付与
 *
 * @example
 * buildHomeHref("react", 1) // => "/?q=react"
 * buildHomeHref("react", 3) // => "/?q=react&page=3"
 */
export const buildHomeHref = (
  searchQuery?: string | null,
  page?: number | null,
): string => {
  const query = formatSearchContextQuery(searchQuery, page);
  return query ? `/?${query}` : "/";
};

/**
 * リポジトリ詳細への href を組み立てる（検索文脈をクエリで引き継ぐ）。
 *
 * @param ownerLogin - リポジトリオーナーの login
 * @param repositoryName - リポジトリ名
 * @param searchQuery - 戻るときの検索語（省略可）
 * @param page - 戻るときのページ（`buildHomeHref` と同じ規則）
 */
export const buildRepositoryHref = (
  ownerLogin: string,
  repositoryName: string,
  searchQuery?: string | null,
  page?: number | null,
): string => {
  const base = `/repos/${encodeURIComponent(ownerLogin)}/${encodeURIComponent(repositoryName)}`;
  const query = formatSearchContextQuery(searchQuery, page);
  return query ? `${base}?${query}` : base;
};
