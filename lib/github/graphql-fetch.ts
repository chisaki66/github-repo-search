import {
  createGithubGraphqlHeaders,
  createGithubGraphqlHeadersFromEnv,
} from "./request-headers";

export const GITHUB_GRAPHQL_API_URL = "https://api.github.com/graphql";

export type GithubGraphqlRequest = {
  query: string;
  variables?: Record<string, unknown>;
};

type GithubGraphqlResponseBody<TData> = {
  data?: TData;
  errors?: Array<{ message: string }>;
  message?: string;
};

const resolveAuthHeaders = (accessToken?: string): Record<string, string> => {
  if (accessToken !== undefined) {
    return createGithubGraphqlHeaders(accessToken);
  }
  return createGithubGraphqlHeadersFromEnv();
};

export const githubGraphql = async <TData>(
  request: GithubGraphqlRequest,
  options?: { accessToken?: string },
): Promise<TData> => {
  const headers = resolveAuthHeaders(options?.accessToken);

  const response = await fetch(GITHUB_GRAPHQL_API_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({
      query: request.query,
      ...(request.variables !== undefined
        ? { variables: request.variables }
        : {}),
    }),
  });

  const raw = await response.text();
  let parsed: unknown;
  try {
    parsed = raw.trim() ? JSON.parse(raw) : null;
  } catch {
    throw new Error(
      `GitHub GraphQL response is not valid JSON (HTTP ${response.status})`,
    );
  }

  if (parsed === null || typeof parsed !== "object") {
    throw new Error(
      `GitHub GraphQL returned an unexpected body (HTTP ${response.status})`,
    );
  }

  const body = parsed as GithubGraphqlResponseBody<TData>;

  if (body.errors?.length) {
    throw new Error(body.errors.map((e) => e.message).join("; "));
  }

  if (!response.ok) {
    const message =
      typeof body.message === "string" && body.message
        ? body.message
        : `GitHub GraphQL request failed (HTTP ${response.status})`;
    throw new Error(message);
  }

  if (body.data === undefined) {
    throw new Error("GitHub GraphQL response is missing data");
  }

  return body.data;
};
