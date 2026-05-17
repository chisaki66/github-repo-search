"use client";

import { useQueryClient } from "@tanstack/react-query";
import { type SubmitEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { RepositoryList } from "@/components/home/repository-list";
import { SearchResultsLoading } from "@/components/home/search-results-loading";
import { SearchPagination } from "@/components/home/search-pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  HOME_PAGE_PARAM,
  HOME_SEARCH_QUERY_PARAM,
  parseHomePageParam,
} from "@/lib/navigation/search-query-url";
import { getSearchInfiniteQueryOptions } from "@/lib/search/search-query-options";
import { useSearchQuery } from "@/lib/search/use-search-query";

type SearchResultsProps = {
  searchQuery: string;
  page: number;
};

const SearchResults = ({ searchQuery, page }: SearchResultsProps) => {
  const { repositories, hasNextPage, isLoading } = useSearchQuery(
    searchQuery,
    page,
  );

  if (isLoading) {
    return <SearchResultsLoading />;
  }

  if (repositories.length === 0) {
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

type SearchFormProps = {
  initialQuery: string;
  queryFromUrl: string;
  pageFromUrl: number;
};

const SearchForm = ({
  initialQuery,
  queryFromUrl,
  pageFromUrl,
}: SearchFormProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [repositoryName, setRepositoryName] = useState(initialQuery);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmed = repositoryName.trim();
    if (!trimmed || isSearching) {
      return;
    }

    setIsSearching(true);
    try {
      await queryClient.prefetchInfiniteQuery(
        getSearchInfiniteQueryOptions(trimmed),
      );

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

  return (
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
  );
};

export const HomePage = () => {
  const searchParams = useSearchParams();
  const queryFromUrl = searchParams.get(HOME_SEARCH_QUERY_PARAM) ?? "";
  const pageFromUrl = parseHomePageParam(searchParams.get(HOME_PAGE_PARAM));
  const trimmedQuery = queryFromUrl.trim();

  return (
    <main className="min-h-0 flex-1 p-6">
      <SearchForm
        key={queryFromUrl}
        initialQuery={queryFromUrl}
        queryFromUrl={queryFromUrl}
        pageFromUrl={pageFromUrl}
      />
      {trimmedQuery ? (
        <SearchResults searchQuery={trimmedQuery} page={pageFromUrl} />
      ) : null}
    </main>
  );
};
