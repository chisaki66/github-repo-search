"use client";

import { useQueryClient } from "@tanstack/react-query";
import { type SubmitEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { PageMain } from "@/components/layout";
import { RepositoryList } from "@/components/home/repository-list";
import { SearchResultsLoading } from "@/components/home/search-results-loading";
import { SearchPagination } from "@/components/home/search-pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { baseFont, errorMessageFont } from "@/lib/constants/design-fonts";
import {
  buttonPaddingX,
  errorMessageMinHeight,
  touchTargetMinHeight,
} from "@/lib/constants/design-sizes";
import { cn } from "@/lib/utils";
import {
  HOME_PAGE_PARAM,
  HOME_SEARCH_QUERY_PARAM,
  parseHomePageParam,
} from "@/lib/navigation/search-query-url";
import { getSearchInfiniteQueryOptions } from "@/lib/search/search-query-options";
import { useSearchQuery } from "@/lib/search/use-search-query";
import {
  getRepositorySearchValidationError,
  parseRepositorySearchQuery,
} from "@/lib/validation/repository-search-schema";

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
      <RepositoryList
        repositories={repositories}
        searchQuery={searchQuery}
        page={page}
      />
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
  const validationError = getRepositorySearchValidationError(repositoryName);

  const handleSearch = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsed = parseRepositorySearchQuery(repositoryName);
    if (!parsed.ok || isSearching) {
      return;
    }

    setIsSearching(true);
    try {
      await queryClient.prefetchInfiniteQuery(
        getSearchInfiniteQueryOptions(parsed.value),
      );

      const nextParams = new URLSearchParams();
      nextParams.set(HOME_SEARCH_QUERY_PARAM, parsed.value);

      if (parsed.value !== queryFromUrl.trim() || pageFromUrl !== 1) {
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
      className="grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-y-1.5"
    >
      <Input
        type="search"
        name="repositoryName"
        value={repositoryName}
        onChange={(event) => setRepositoryName(event.target.value)}
        placeholder="リポジトリ名を入力してください"
        className={cn(
          touchTargetMinHeight,
          baseFont,
          "sm:col-start-1 sm:row-start-1",
        )}
        autoComplete="off"
        aria-invalid={validationError ? true : undefined}
        aria-describedby={
          validationError ? "repository-search-error" : undefined
        }
      />
      <Button
        type="submit"
        disabled={isSearching}
        className={cn(
          touchTargetMinHeight,
          buttonPaddingX,
          "w-full shrink-0 rounded-lg sm:col-start-2 sm:row-start-1 sm:w-auto",
        )}
      >
        {isSearching ? "検索中…" : "検索"}
      </Button>
      <p
        id="repository-search-error"
        className={cn(
          "col-span-full max-sm:text-pretty sm:text-nowrap",
          errorMessageMinHeight,
          errorMessageFont,
          !validationError && "invisible",
        )}
        role={validationError ? "alert" : undefined}
        aria-hidden={!validationError}
      >
        {validationError ?? "\u00a0"}
      </p>
    </form>
  );
};

export const HomePage = () => {
  const searchParams = useSearchParams();
  const queryFromUrl = searchParams.get(HOME_SEARCH_QUERY_PARAM) ?? "";
  const pageFromUrl = parseHomePageParam(searchParams.get(HOME_PAGE_PARAM));
  const trimmedQuery = queryFromUrl.trim();
  const isQueryValid =
    trimmedQuery.length > 0 &&
    getRepositorySearchValidationError(queryFromUrl) === null;

  return (
    <PageMain>
      <SearchForm
        key={queryFromUrl}
        initialQuery={queryFromUrl}
        queryFromUrl={queryFromUrl}
        pageFromUrl={pageFromUrl}
      />
      {isQueryValid ? (
        <SearchResults searchQuery={trimmedQuery} page={pageFromUrl} />
      ) : null}
    </PageMain>
  );
};
