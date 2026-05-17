export const HOME_SEARCH_QUERY_PARAM = "q";
export const HOME_PAGE_PARAM = "page";

export const parseHomePageParam = (value: string | null): number => {
  if (value === null || value === "") {
    return 1;
  }

  const page = Number.parseInt(value, 10);
  if (!Number.isFinite(page) || page < 1) {
    return 1;
  }

  return page;
};

export const buildHomeHref = (
  searchQuery?: string | null,
  page?: number | null,
): string => {
  const trimmed = searchQuery?.trim();
  const pageNumber = page ?? 1;

  if (!trimmed) {
    return "/";
  }

  const params = new URLSearchParams();
  params.set(HOME_SEARCH_QUERY_PARAM, trimmed);

  if (pageNumber > 1) {
    params.set(HOME_PAGE_PARAM, String(pageNumber));
  }

  return `/?${params.toString()}`;
};

export const buildRepositoryHref = (
  ownerLogin: string,
  repositoryName: string,
  searchQuery?: string | null,
  page?: number | null,
): string => {
  const base = `/repos/${encodeURIComponent(ownerLogin)}/${encodeURIComponent(repositoryName)}`;
  const trimmed = searchQuery?.trim();
  const pageNumber = page ?? 1;

  if (!trimmed) {
    return base;
  }

  const params = new URLSearchParams();
  params.set(HOME_SEARCH_QUERY_PARAM, trimmed);

  if (pageNumber > 1) {
    params.set(HOME_PAGE_PARAM, String(pageNumber));
  }

  return `${base}?${params.toString()}`;
};
