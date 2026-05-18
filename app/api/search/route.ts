import { NextResponse } from "next/server";

import { buildRepositorySearchQuery, searchRepositories } from "@/lib/github";
import { SEARCH_PAGE_SIZE } from "@/lib/search/search-page-size";
import { parseRepositorySearchQuery } from "@/lib/validation/repository-search-schema";

export const runtime = "nodejs";

const MAX_FIRST = 100;

const jsonError = (message: string, status: number) => {
  return NextResponse.json({ error: message }, { status });
};

const parseFirstFromSearchParam = (value: string | null): number | null => {
  if (value === null || value === "") {
    return SEARCH_PAGE_SIZE;
  }
  const n = Number.parseInt(value, 10);
  if (!Number.isFinite(n) || n < 1 || n > MAX_FIRST) {
    return null;
  }
  return n;
};

const handleSearchFailure = (error: unknown) => {
  const message = error instanceof Error ? error.message : "";

  if (
    message.includes("GITHUB_TOKEN is not set") ||
    message.includes("GitHub access token is empty")
  ) {
    return jsonError("GitHub API is not configured on this server", 503);
  }

  if (/bad credentials/i.test(message) || /\b401\b/.test(message)) {
    return jsonError("GitHub authentication failed", 502);
  }

  if (
    /rate limit/i.test(message) ||
    /\b403\b/.test(message) ||
    /abuse/i.test(message)
  ) {
    return jsonError("GitHub API rate limit or access denied", 429);
  }

  if (message) {
    return jsonError(message, 502);
  }

  return jsonError("GitHub search failed", 502);
};

export const GET = async (request: Request) => {
  const url = new URL(request.url);
  const qRaw = url.searchParams.get("q") ?? "";
  if (!qRaw.trim()) {
    return jsonError("Missing or empty query parameter q", 400);
  }

  const parsedQuery = parseRepositorySearchQuery(qRaw);
  if (!parsedQuery.ok) {
    return jsonError(parsedQuery.error, 400);
  }

  const first = parseFirstFromSearchParam(url.searchParams.get("first"));
  if (first === null) {
    return jsonError(
      `first must be an integer between 1 and ${MAX_FIRST}`,
      400,
    );
  }

  const afterRaw = url.searchParams.get("after")?.trim();
  const after = afterRaw ? afterRaw : undefined;

  try {
    const data = await searchRepositories({
      query: buildRepositorySearchQuery(parsedQuery.value),
      first,
      after,
    });
    return NextResponse.json(data);
  } catch (error) {
    return handleSearchFailure(error);
  }
};
