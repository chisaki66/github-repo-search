"use client";

import { type SubmitEvent, useState } from "react";

import { RepositoryList } from "@/components/home/repository-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  searchRepositoriesClient,
  type RepositorySearchResult,
} from "@/lib/github";

export const HomePage = () => {
  const [repositoryName, setRepositoryName] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [repositories, setRepositories] = useState<RepositorySearchResult[]>(
    [],
  );

  const handleSearch = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmed = repositoryName.trim();
    if (!trimmed || isSearching) {
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchRepositoriesClient(trimmed);
      setRepositories(results);
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
      <RepositoryList repositories={repositories} />
    </main>
  );
};
