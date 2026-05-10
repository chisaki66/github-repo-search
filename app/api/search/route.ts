import { NextResponse } from "next/server";

import { searchRepositories } from "@/lib/github";

export const runtime = "nodejs";

// 1回の取得件数。GitHub の search は first に上限があるため、API 側でも 1〜100 に制限する（省略時は 20）。
const DEFAULT_FIRST = 20;
const MAX_FIRST = 100;

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

function parseFirstFromSearchParam(value: string | null): number | null {
  if (value === null || value === "") {
    return DEFAULT_FIRST;
  }
  const n = Number.parseInt(value, 10);
  if (!Number.isFinite(n) || n < 1 || n > MAX_FIRST) {
    return null;
  }
  return n;
}

function handleSearchFailure(error: unknown) {
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
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q")?.trim() ?? "";
  if (!q) {
    return jsonError("Missing or empty query parameter q", 400);
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
    const data = await searchRepositories({ query: q, first, after });
    return NextResponse.json(data);
  } catch (error) {
    return handleSearchFailure(error);
  }
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body", 400);
  }

  if (body === null || typeof body !== "object" || Array.isArray(body)) {
    return jsonError("Body must be a JSON object", 400);
  }

  const record = body as Record<string, unknown>;
  const q = typeof record.q === "string" ? record.q.trim() : "";
  if (!q) {
    return jsonError("Missing or empty string field q", 400);
  }

  let first = DEFAULT_FIRST;
  if (record.first !== undefined && record.first !== null) {
    const n =
      typeof record.first === "number"
        ? record.first
        : Number.parseInt(String(record.first), 10);
    if (!Number.isFinite(n) || n < 1 || n > MAX_FIRST) {
      return jsonError(
        `first must be an integer between 1 and ${MAX_FIRST}`,
        400,
      );
    }
    first = Math.trunc(n);
  }

  let after: string | undefined;
  if (typeof record.after === "string") {
    const trimmed = record.after.trim();
    if (trimmed) {
      after = trimmed;
    }
  }

  try {
    const data = await searchRepositories({ query: q, first, after });
    return NextResponse.json(data);
  } catch (error) {
    return handleSearchFailure(error);
  }
}
