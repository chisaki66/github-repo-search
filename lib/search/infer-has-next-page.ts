import type { RepositorySearchResult } from "@/lib/github";

import { SEARCH_PAGE_SIZE } from "./search-page-size";

export const inferHasNextPage = (
  results: RepositorySearchResult[],
  stored?: boolean,
): boolean => {
  if (stored !== undefined) {
    return stored;
  }

  return results.length >= SEARCH_PAGE_SIZE;
};
