"use client";

import { type SubmitEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { RepositoryList } from "@/components/home/repository-list";
import { SearchPagination } from "@/components/home/search-pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { RepositorySearchResult } from "@/lib/github";
import {
  HOME_PAGE_PARAM,
  HOME_SEARCH_QUERY_PARAM,
  buildHomeHref,
  parseHomePageParam,
} from "@/lib/navigation/search-query-url";
import { fetchSearchPage } from "@/lib/search/fetch-search-page";
import { inferHasNextPage } from "@/lib/search/infer-has-next-page";
import {
  getCachedSearchSession,
  getHighestCachedPage,
} from "@/lib/search/search-results-cache";

const readPageFromSession = (
  query: string,
  page: number,
): { results: RepositorySearchResult[]; hasNextPage: boolean } | null => {
  const trimmed = query.trim();
  if (!trimmed) {
    return null;
  }

  const session = getCachedSearchSession(trimmed);
  const results = session?.pages?.[page];

  if (!results) {
    return null;
  }

  return {
    results,
    hasNextPage: inferHasNextPage(results, session.hasNextPageByPage[page]),
  };
};

type SearchResultsProps = {
  searchQuery: string;
  page: number;
};

const SearchResults = ({ searchQuery, page }: SearchResultsProps) => {
  const router = useRouter();
  const cached = readPageFromSession(searchQuery, page);

  const [repositories, setRepositories] = useState<RepositorySearchResult[]>(
    () => cached?.results ?? [],
  );
  const [hasNextPage, setHasNextPage] = useState(
    () => cached?.hasNextPage ?? false,
  );
  const [isLoadingPage, setIsLoadingPage] = useState(!cached);

  useEffect(() => {
    let cancelled = false;

    const loadPage = async () => {
      setIsLoadingPage(true);

      try {
        const result = await fetchSearchPage(searchQuery, page);
        if (cancelled) {
          return;
        }

        if (result.results.length === 0 && page > 1 && !result.hasNextPage) {
          const session = getCachedSearchSession(searchQuery);
          const lastPage = session ? getHighestCachedPage(session) : 1;
          const targetPage = Math.max(1, lastPage);

          if (targetPage !== page) {
            router.replace(buildHomeHref(searchQuery, targetPage));
            return;
          }
        }

        setRepositories(result.results);
        setHasNextPage(result.hasNextPage);
      } catch (error) {
        console.error(error);
        if (!cancelled) {
          setRepositories([]);
          setHasNextPage(false);
        }
      } finally {
        if (!cancelled) {
          setIsLoadingPage(false);
        }
      }
    };

    void loadPage();

    return () => {
      cancelled = true;
    };
  }, [page, router, searchQuery]);

  if (repositories.length === 0 && !isLoadingPage) {
    return null;
  }

  return (
    <>
      <RepositoryList repositories={repositories} searchQuery={searchQuery} />
      <SearchPagination
        searchQuery={searchQuery}
        currentPage={page}
        hasNextPage={hasNextPage}
        resultCount={repositories.length}
      />
    </>
  );
};

export const HomePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryFromUrl = searchParams.get(HOME_SEARCH_QUERY_PARAM) ?? "";
  const pageFromUrl = parseHomePageParam(searchParams.get(HOME_PAGE_PARAM));

  const [repositoryName, setRepositoryName] = useState(queryFromUrl);
  const [syncedQuery, setSyncedQuery] = useState(queryFromUrl);
  const [isSearching, setIsSearching] = useState(false);

  if (queryFromUrl !== syncedQuery) {
    setSyncedQuery(queryFromUrl);
    setRepositoryName(queryFromUrl);
  }

  const handleSearch = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmed = repositoryName.trim();
    if (!trimmed || isSearching) {
      return;
    }

    setIsSearching(true);
    try {
      await fetchSearchPage(trimmed, 1);

      const nextParams = new URLSearchParams();
      nextParams.set(HOME_SEARCH_QUERY_PARAM, trimmed);

      if (trimmed !== queryFromUrl.trim() || pageFromUrl !== 1) {
        router.replace(`/?${nextParams.toString()}`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSearching(false);
    }
  };

  const trimmedQuery = queryFromUrl.trim();

  return (
    <main className="min-h-0 flex-1 p-6">
      <form
        onSubmit={handleSearch}
        className="flex max-w-xl flex-col gap-3 sm:flex-row sm:items-center"
      >
        <Input
          type="search"
          name="repositoryName"
          value={repositoryName}
          onChange={(event) => setRepositoryName(event.target.value)}
          placeholder="リポジトリ名を入力してください"
          className="h-10 flex-1 text-base"
          autoComplete="off"
        />
        <Button
          type="submit"
          disabled={isSearching}
          className="h-10 shrink-0 rounded-lg px-6"
        >
          {isSearching ? "検索中…" : "検索"}
        </Button>
      </form>
      {trimmedQuery ? (
        <SearchResults
          key={`${trimmedQuery}:${pageFromUrl}`}
          searchQuery={trimmedQuery}
          page={pageFromUrl}
        />
      ) : null}
    </main>
  );
};
