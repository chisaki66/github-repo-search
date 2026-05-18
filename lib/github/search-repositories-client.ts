import { SEARCH_PAGE_SIZE } from "@/lib/search/search-page-size";

import type { SearchRepositoriesData } from "./search-repositories";

/** 検索一覧の 1 行分（アバター URL と owner/repo 名） */
export type RepositorySearchResult = {
  icon: string;
  ownerLogin: string;
  repositoryName: string;
};

/** 検索結果ページのページネーション情報 */
export type RepositorySearchPageInfo = {
  hasNextPage: boolean;
  endCursor: string | null;
};

/** `/api/search` 経由で取得した 1 ページ分の検索結果 */
export type RepositorySearchPage = {
  results: RepositorySearchResult[];
  pageInfo: RepositorySearchPageInfo;
};

const toSearchResults = (
  data: SearchRepositoriesData,
): RepositorySearchResult[] => {
  const edges = data.search.edges ?? [];

  return edges.flatMap((edge) => {
    const node = edge?.node;
    if (!node?.owner?.avatarUrl || !node.owner.login || !node.name) {
      return [];
    }

    return [
      {
        icon: node.owner.avatarUrl,
        ownerLogin: node.owner.login,
        repositoryName: node.name,
      },
    ];
  });
};

/**
 * ブラウザから `/api/search` を呼び、一覧表示用に結果を正規化する。
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
    const body = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new Error(body?.error ?? `Search failed (${response.status})`);
  }

  const data = (await response.json()) as SearchRepositoriesData;

  const results = toSearchResults(data);
  const pageInfo = data.search?.pageInfo;
  const edges = data.search.edges ?? [];
  const lastEdgeCursor =
    edges.length > 0 ? (edges[edges.length - 1]?.cursor ?? null) : null;

  return {
    results,
    pageInfo: {
      hasNextPage: pageInfo?.hasNextPage ?? results.length >= SEARCH_PAGE_SIZE,
      endCursor: pageInfo?.endCursor ?? lastEdgeCursor ?? null,
    },
  };
};
