import { searchRepositoriesClient } from "@/lib/github";
import type { RepositorySearchPage } from "@/lib/github/search-repositories-client";

export const searchQueryKey = (query: string) =>
  ["search", query.trim()] as const;

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
