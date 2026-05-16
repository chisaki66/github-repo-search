import type { RepositorySearchResult } from "@/lib/github";

const STORAGE_KEY = "github-repo-search:search-results";

type SearchResultsCache = Record<string, RepositorySearchResult[]>;

const readCache = (): SearchResultsCache => {
  if (typeof sessionStorage === "undefined") {
    return {};
  }

  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {};
    }

    return JSON.parse(raw) as SearchResultsCache;
  } catch {
    return {};
  }
};

const writeCache = (cache: SearchResultsCache): void => {
  if (typeof sessionStorage === "undefined") {
    return;
  }

  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  } catch {
    // sessionStorage が使えない環境ではキャッシュをスキップする
  }
};

export const getCachedSearchResults = (
  query: string,
): RepositorySearchResult[] | null => {
  const trimmed = query.trim();
  if (!trimmed) {
    return null;
  }

  return readCache()[trimmed] ?? null;
};

export const setCachedSearchResults = (
  query: string,
  results: RepositorySearchResult[],
): void => {
  const trimmed = query.trim();
  if (!trimmed) {
    return;
  }

  writeCache({
    ...readCache(),
    [trimmed]: results,
  });
};
