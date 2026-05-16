"use client";

import { useRouter } from "next/navigation";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { buildHomeHref } from "@/lib/navigation/search-query-url";
import { SEARCH_PAGE_SIZE } from "@/lib/search/search-page-size";

type SearchPaginationProps = {
  searchQuery: string;
  currentPage: number;
  hasNextPage: boolean;
  resultCount: number;
};

const shouldShowPagination = (
  currentPage: number,
  hasNextPage: boolean,
  resultCount: number,
): boolean => {
  return currentPage > 1 || hasNextPage || resultCount >= SEARCH_PAGE_SIZE;
};

const getVisiblePages = (
  currentPage: number,
  hasNextPage: boolean,
): number[] => {
  const lastPage = hasNextPage ? currentPage + 1 : currentPage;
  return Array.from({ length: lastPage }, (_, index) => index + 1);
};

export const SearchPagination = ({
  searchQuery,
  currentPage,
  hasNextPage,
  resultCount,
}: SearchPaginationProps) => {
  const router = useRouter();
  const trimmed = searchQuery.trim();

  if (
    !trimmed ||
    !shouldShowPagination(currentPage, hasNextPage, resultCount)
  ) {
    return null;
  }

  const pages = getVisiblePages(currentPage, hasNextPage);
  const showLeadingEllipsis = currentPage > 3;
  const trailingPages = showLeadingEllipsis
    ? pages.filter((page) => page >= currentPage - 1)
    : pages;

  const goToPage = (page: number) => {
    router.push(buildHomeHref(trimmed, page));
  };

  return (
    <Pagination className="mt-6">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={buildHomeHref(trimmed, Math.max(1, currentPage - 1))}
            text="前へ"
            className={
              currentPage <= 1 ? "pointer-events-none opacity-50" : undefined
            }
            aria-disabled={currentPage <= 1}
            tabIndex={currentPage <= 1 ? -1 : undefined}
            onClick={(event) => {
              if (currentPage <= 1) {
                return;
              }
              event.preventDefault();
              goToPage(currentPage - 1);
            }}
          />
        </PaginationItem>

        {showLeadingEllipsis ? (
          <>
            <PaginationItem>
              <PaginationLink
                href={buildHomeHref(trimmed, 1)}
                isActive={currentPage === 1}
                onClick={(event) => {
                  event.preventDefault();
                  goToPage(1);
                }}
              >
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          </>
        ) : null}

        {trailingPages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              href={buildHomeHref(trimmed, page)}
              isActive={page === currentPage}
              onClick={(event) => {
                event.preventDefault();
                goToPage(page);
              }}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            href={buildHomeHref(trimmed, currentPage + 1)}
            text="次へ"
            className={
              !hasNextPage ? "pointer-events-none opacity-50" : undefined
            }
            aria-disabled={!hasNextPage}
            tabIndex={!hasNextPage ? -1 : undefined}
            onClick={(event) => {
              if (!hasNextPage) {
                return;
              }
              event.preventDefault();
              goToPage(currentPage + 1);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
