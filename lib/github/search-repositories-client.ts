import type { SearchRepositoriesData } from "./search-repositories";

export type RepositorySearchResult = {
  icon: string;
  repositoryName: string;
};

function toSearchResults(
  data: SearchRepositoriesData,
): RepositorySearchResult[] {
  const edges = data.search.edges ?? [];

  return edges.flatMap((edge) => {
    const node = edge?.node;
    if (!node?.owner?.avatarUrl || !node.name) {
      return [];
    }

    return [
      {
        icon: node.owner.avatarUrl,
        repositoryName: node.name,
      },
    ];
  });
}

export async function searchRepositoriesClient(
  repositoryName: string,
): Promise<RepositorySearchResult[]> {
  const q = repositoryName.trim();
  if (!q) {
    return [];
  }

  const response = await fetch(`/api/search?q=${encodeURIComponent(q)}`);

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new Error(body?.error ?? `Search failed (${response.status})`);
  }

  const data = (await response.json()) as SearchRepositoriesData;
  return toSearchResults(data);
}
