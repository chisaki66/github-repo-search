import { searchRepositoriesClient } from "@/lib/github";
import type { RepositorySearchPage } from "@/lib/github/search-repositories-client";

const searchQueryKey = (query: string) => ["search", query.trim()] as const;

/**
 * ホーム検索用の React Query infinite オプションを返す。
 *
 * `query` が空のときは `enabled: false`。次ページは GraphQL の `endCursor` を `pageParam` に渡す。
 *
 * @param query - URL の検索語（内部で trim し `queryKey` に使う）
 */
export const getSearchInfiniteQueryOptions = (query: string) => {
  const trimmed = query.trim();

  return {
    queryKey: searchQueryKey(trimmed),
    queryFn: ({ pageParam }: { pageParam: string | undefined }) =>
      searchRepositoriesClient(trimmed, { after: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage: RepositorySearchPage) => {
      if (!lastPage.pageInfo.hasNextPage) {
        return undefined;
      }

      return lastPage.pageInfo.endCursor ?? undefined;
    },
    enabled: trimmed.length > 0,
  };
};
