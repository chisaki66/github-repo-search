import {
  searchRepositoriesClient,
  type RepositorySearchResult,
} from "@/lib/github";
import {
  createEmptySearchSession,
  getCachedSearchSession,
  setCachedSearchSession,
  type SearchSessionCache,
} from "@/lib/search/search-results-cache";
import { inferHasNextPage } from "@/lib/search/infer-has-next-page";

export type SearchPageResult = {
  page: number;
  results: RepositorySearchResult[];
  hasNextPage: boolean;
};

const emptyPage = (page: number): SearchPageResult => ({
  page,
  results: [],
  hasNextPage: false,
});

const getAfterCursor = (
  session: SearchSessionCache,
  page: number,
): string | undefined => {
  if (page <= 1) {
    return undefined;
  }

  const cursor = session.endCursors?.[page - 2];
  if (typeof cursor !== "string" || cursor === "") {
    return undefined;
  }

  return cursor;
};

/** キャッシュ済みのページをスキップして次ページへ進めるか（endCursor が無いと不可） */
const canUseCachedPageInChain = (
  session: SearchSessionCache,
  page: number,
): boolean => {
  if (!session.pages?.[page]) {
    return false;
  }

  if (session.hasNextPageByPage[page] === false) {
    return true;
  }

  return getAfterCursor(session, page + 1) !== undefined;
};

const fetchAndCachePage = async (
  query: string,
  page: number,
  session: SearchSessionCache,
): Promise<SearchPageResult> => {
  const endCursors = session.endCursors ?? [];
  const after = getAfterCursor(session, page);

  if (page > 1 && after === undefined) {
    return emptyPage(page);
  }

  const { results, pageInfo } = await searchRepositoriesClient(query, {
    after,
  });

  const nextSession: SearchSessionCache = {
    pages: { ...(session.pages ?? {}), [page]: results },
    endCursors: [...endCursors],
    hasNextPageByPage: {
      ...(session.hasNextPageByPage ?? {}),
      [page]: pageInfo.hasNextPage,
    },
  };

  nextSession.endCursors[page - 1] = pageInfo.endCursor;

  setCachedSearchSession(query, nextSession);

  return {
    page,
    results,
    hasNextPage: inferHasNextPage(results, pageInfo.hasNextPage),
  };
};

export const fetchSearchPage = async (
  query: string,
  page: number,
): Promise<SearchPageResult> => {
  const trimmed = query.trim();
  if (!trimmed || page < 1) {
    return emptyPage(Math.max(1, page));
  }

  let session = getCachedSearchSession(trimmed) ?? createEmptySearchSession();

  const cached = session.pages?.[page];
  if (cached) {
    return {
      page,
      results: cached,
      hasNextPage: inferHasNextPage(cached, session.hasNextPageByPage[page]),
    };
  }

  for (let p = 1; p <= page; p += 1) {
    if (canUseCachedPageInChain(session, p)) {
      session = getCachedSearchSession(trimmed) ?? session;
      continue;
    }

    const previousHasNext = session.hasNextPageByPage?.[p - 1];
    if (p > 1 && previousHasNext === false) {
      return emptyPage(page);
    }

    const result = await fetchAndCachePage(trimmed, p, session);
    session = getCachedSearchSession(trimmed) ?? session;

    if (p === page) {
      return result;
    }

    if (!result.hasNextPage) {
      return emptyPage(page);
    }
  }

  return emptyPage(page);
};
