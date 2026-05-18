import { SEARCH_PAGE_SIZE } from "@/lib/search/search-page-size";
import { parseApiErrorBody } from "@/lib/validation/github/api-error-schema";
import {
  parseRepositorySearchPageJson,
  type RepositorySearchPage,
  type RepositorySearchPageInfo,
  type RepositorySearchResult,
} from "@/lib/validation/github/search-page-schema";

export type {
  RepositorySearchPage,
  RepositorySearchPageInfo,
  RepositorySearchResult,
};

/**
 * ブラウザから `/api/search` を呼び、一覧表示用に結果を取得する。
 *
 * @param repositoryName - 検索ボックスの値（`q` パラメータ。API 側で `in:name` 付与）
 * @param options.after - GraphQL cursor（2 ページ目以降）
 * @returns 正規化済みの `results` と `pageInfo`
 * @throws HTTP エラー時はレスポンス JSON の `error`、なければステータス付きメッセージ
 */
export const searchRepositoriesClient = async (
  repositoryName: string,
  options?: {
    after?: string | null;
  },
): Promise<RepositorySearchPage> => {
  const q = repositoryName.trim();

  const params = new URLSearchParams({
    q,
    first: String(SEARCH_PAGE_SIZE),
  });

  const after = options?.after?.trim();
  if (after) {
    params.set("after", after);
  }

  const response = await fetch(`/api/search?${params.toString()}`);

  if (!response.ok) {
    const body: unknown = await response.json().catch(() => null);
    throw new Error(
      parseApiErrorBody(body) ?? `Search failed (${response.status})`,
    );
  }

  const json: unknown = await response.json();
  return parseRepositorySearchPageJson(json);
};
