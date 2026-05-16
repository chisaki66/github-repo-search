"use client";

import { type SubmitEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { RepositoryList } from "@/components/home/repository-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  searchRepositoriesClient,
  type RepositorySearchResult,
} from "@/lib/github";
import { HOME_SEARCH_QUERY_PARAM } from "@/lib/navigation/search-query-url";
import {
  getCachedSearchResults,
  setCachedSearchResults,
} from "@/lib/search/search-results-cache";

const readRepositoriesForQuery = (query: string): RepositorySearchResult[] => {
  const trimmed = query.trim();
  if (!trimmed) {
    return [];
  }

  return getCachedSearchResults(trimmed) ?? [];
};

export const HomePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryFromUrl = searchParams.get(HOME_SEARCH_QUERY_PARAM) ?? "";

  const [repositoryName, setRepositoryName] = useState(queryFromUrl);
  const [isSearching, setIsSearching] = useState(false);
  const [repositories, setRepositories] = useState<RepositorySearchResult[]>(
    () => readRepositoriesForQuery(queryFromUrl),
  );

  useEffect(() => {
    setRepositoryName(queryFromUrl);

    const trimmed = queryFromUrl.trim();
    if (!trimmed) {
      setRepositories([]);
      return;
    }

    const cached = getCachedSearchResults(trimmed);
    if (cached) {
      setRepositories(cached);
      return;
    }

    let cancelled = false;

    const loadResults = async () => {
      try {
        const results = await searchRepositoriesClient(trimmed);
        if (cancelled) {
          return;
        }

        setCachedSearchResults(trimmed, results);
        setRepositories(results);
      } catch (error) {
        console.error(error);
        if (!cancelled) {
          setRepositories([]);
        }
      }
    };

    void loadResults();

    return () => {
      cancelled = true;
    };
  }, [queryFromUrl]);

  const handleSearch = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmed = repositoryName.trim();
    if (!trimmed || isSearching) {
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchRepositoriesClient(trimmed);
      setCachedSearchResults(trimmed, results);
      setRepositories(results);

      if (trimmed !== queryFromUrl.trim()) {
        const nextParams = new URLSearchParams(searchParams.toString());
        nextParams.set(HOME_SEARCH_QUERY_PARAM, trimmed);
        router.replace(`/?${nextParams.toString()}`);
      }
    } catch (error) {
      console.error(error);
      setRepositories([]);
    } finally {
      setIsSearching(false);
    }
  };

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
      <RepositoryList repositories={repositories} searchQuery={queryFromUrl} />
    </main>
  );
};
