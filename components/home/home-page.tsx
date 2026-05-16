"use client";

import { type SubmitEvent, useState } from "react";

import { searchRepositoriesClient } from "@/lib/github";

export const HomePage = () => {
  const [repositoryName, setRepositoryName] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmed = repositoryName.trim();
    if (!trimmed || isSearching) {
      return;
    }

    setIsSearching(true);
    try {
      await searchRepositoriesClient(trimmed);
    } catch (error) {
      console.error(error);
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
        <input
          type="search"
          name="repositoryName"
          value={repositoryName}
          onChange={(event) => setRepositoryName(event.target.value)}
          placeholder="リポジトリ名を入力してください"
          className="min-w-0 flex-1 rounded-lg border border-neutral-300 px-4 py-2 text-base text-foreground outline-none focus:border-neutral-500"
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={isSearching}
          className="rounded-full border border-neutral-800 bg-neutral-900 px-6 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSearching ? "検索中…" : "検索"}
        </button>
      </form>
    </main>
  );
};
