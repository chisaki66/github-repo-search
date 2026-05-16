import type { RepositorySearchResult } from "@/lib/github";

import { SEARCH_PAGE_SIZE } from "./search-page-size";

const STORAGE_KEY = "github-repo-search:search-results";

export type SearchSessionCache = {
  pages: Record<number, RepositorySearchResult[]>;
  endCursors: (string | null)[];
  hasNextPageByPage: Record<number, boolean>;
};

type SearchResultsCache = Record<string, SearchSessionCache>;

const isRepositorySearchResult = (
  value: unknown,
): value is RepositorySearchResult => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;
  return (
    typeof record.icon === "string" &&
    typeof record.ownerLogin === "string" &&
    typeof record.repositoryName === "string"
  );
};

const isLegacySearchResults = (
  value: unknown,
): value is RepositorySearchResult[] => {
  return Array.isArray(value) && value.every(isRepositorySearchResult);
};

const isSearchSessionCache = (value: unknown): value is SearchSessionCache => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;
  return (
    typeof record.pages === "object" &&
    record.pages !== null &&
    !Array.isArray(record.pages) &&
    Array.isArray(record.endCursors) &&
    typeof record.hasNextPageByPage === "object" &&
    record.hasNextPageByPage !== null &&
    !Array.isArray(record.hasNextPageByPage)
  );
};

const normalizeSession = (value: unknown): SearchSessionCache | null => {
  if (isSearchSessionCache(value)) {
    return {
      pages: { ...value.pages },
      endCursors: [...value.endCursors],
      hasNextPageByPage: { ...value.hasNextPageByPage },
    };
  }

  if (isLegacySearchResults(value)) {
    return {
      pages: { 1: value },
      endCursors: [],
      hasNextPageByPage: {
        1: value.length >= SEARCH_PAGE_SIZE,
      },
    };
  }

  return null;
};

const readCache = (): SearchResultsCache => {
  if (typeof sessionStorage === "undefined") {
    return {};
  }

  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const normalized: SearchResultsCache = {};

    for (const [query, entry] of Object.entries(parsed)) {
      const session = normalizeSession(entry);
      if (session) {
        normalized[query] = session;
      }
    }

    return normalized;
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

export const getCachedSearchSession = (
  query: string,
): SearchSessionCache | null => {
  const trimmed = query.trim();
  if (!trimmed) {
    return null;
  }

  return normalizeSession(readCache()[trimmed]) ?? null;
};

export const createEmptySearchSession = (): SearchSessionCache => ({
  pages: {},
  endCursors: [],
  hasNextPageByPage: {},
});

export const setCachedSearchSession = (
  query: string,
  session: SearchSessionCache,
): void => {
  const trimmed = query.trim();
  if (!trimmed) {
    return;
  }

  writeCache({
    ...readCache(),
    [trimmed]: session,
  });
};

export const getHighestCachedPage = (session: SearchSessionCache): number => {
  const pageNumbers = Object.keys(session.pages ?? {})
    .map(Number)
    .filter((n) => Number.isFinite(n) && n >= 1);

  if (pageNumbers.length === 0) {
    return 0;
  }

  return Math.max(...pageNumbers);
};
