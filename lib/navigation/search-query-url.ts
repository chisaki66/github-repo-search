export const HOME_SEARCH_QUERY_PARAM = "q";

export const buildHomeHref = (searchQuery?: string | null): string => {
  const trimmed = searchQuery?.trim();
  if (!trimmed) {
    return "/";
  }

  return `/?${HOME_SEARCH_QUERY_PARAM}=${encodeURIComponent(trimmed)}`;
};

export const buildRepositoryHref = (
  ownerLogin: string,
  repositoryName: string,
  searchQuery?: string | null,
): string => {
  const base = `/repos/${encodeURIComponent(ownerLogin)}/${encodeURIComponent(repositoryName)}`;
  const trimmed = searchQuery?.trim();

  if (!trimmed) {
    return base;
  }

  return `${base}?${HOME_SEARCH_QUERY_PARAM}=${encodeURIComponent(trimmed)}`;
};
