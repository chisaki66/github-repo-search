import { SEARCH_PAGE_SIZE } from "@/lib/search/search-page-size";

import type { SearchRepositoriesData } from "./search-repositories";

export type RepositorySearchResult = {
  icon: string;
  ownerLogin: string;
  repositoryName: string;
};

export type RepositorySearchPageInfo = {
  hasNextPage: boolean;
  endCursor: string | null;
};

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

export const searchRepositoriesClient = async (
  repositoryName: string,
  options?: {
    after?: string | null;
    first?: number;
  },
): Promise<RepositorySearchPage> => {
  const q = repositoryName.trim();
  if (!q) {
    return {
      results: [],
      pageInfo: { hasNextPage: false, endCursor: null },
    };
  }

  const params = new URLSearchParams({
    q,
    first: String(options?.first ?? SEARCH_PAGE_SIZE),
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
