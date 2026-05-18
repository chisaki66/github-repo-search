"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { buildHomeHref } from "@/lib/navigation/search-query-url";

import { getSearchInfiniteQueryOptions } from "./search-query-options";

/**
 * ホーム検索の URL `page` と React Query の infinite ページを同期するフック。
 *
 * - 未ロードのページは `fetchNextPage` で補う
 * - 範囲外のページや空ページは `router.replace` で URL を補正する
 *
 * @param query - URL の検索語
 * @param page - URL の 1 始まりのページ番号
 * @returns 現在ページの `repositories`、`hasNextPage`、データ準備中の `isLoading`
 */
export const useSearchQuery = (query: string, page: number) => {
  const router = useRouter();
  const trimmed = query.trim();

  const infiniteQuery = useInfiniteQuery(
    getSearchInfiniteQueryOptions(trimmed),
  );

  const loadedPageCount = infiniteQuery.data?.pages.length ?? 0;
  const needsMorePages =
    trimmed.length > 0 && page > loadedPageCount && infiniteQuery.hasNextPage;

  useEffect(() => {
    if (!needsMorePages || infiniteQuery.isFetchingNextPage) {
      return;
    }

    void infiniteQuery.fetchNextPage();
  }, [
    needsMorePages,
    infiniteQuery.isFetchingNextPage,
    infiniteQuery.fetchNextPage,
  ]);

  useEffect(() => {
    if (
      !trimmed ||
      infiniteQuery.isPending ||
      infiniteQuery.isFetchingNextPage ||
      needsMorePages
    ) {
      return;
    }

    if (page <= 1) {
      return;
    }

    const currentPageData = infiniteQuery.data?.pages[page - 1];

    const isPastLastPage = page > loadedPageCount;
    const isEmptyPage =
      currentPageData !== undefined &&
      currentPageData.results.length === 0 &&
      !currentPageData.pageInfo.hasNextPage;

    if (!isPastLastPage && !isEmptyPage) {
      return;
    }

    const targetPage = Math.max(1, loadedPageCount);
    if (targetPage !== page) {
      router.replace(buildHomeHref(trimmed, targetPage));
    }
  }, [
    trimmed,
    page,
    loadedPageCount,
    needsMorePages,
    infiniteQuery.isPending,
    infiniteQuery.isFetchingNextPage,
    infiniteQuery.data?.pages,
    router,
  ]);

  const currentPageData = infiniteQuery.data?.pages[page - 1];
  const isPageDataReady = currentPageData !== undefined;
  const isLoading =
    trimmed.length > 0 &&
    !isPageDataReady &&
    (infiniteQuery.isPending ||
      infiniteQuery.isFetching ||
      infiniteQuery.isFetchingNextPage);

  return {
    repositories: currentPageData?.results ?? [],
    hasNextPage: currentPageData?.pageInfo.hasNextPage ?? false,
    isLoading,
  };
};
