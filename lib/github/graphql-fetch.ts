const GITHUB_GRAPHQL_API_URL = "https://api.github.com/graphql";

const createGithubGraphqlHeaders = (
  accessToken: string,
): Record<string, string> => {
  const trimmed = accessToken.trim();
  if (!trimmed) {
    throw new Error("GitHub access token is empty");
  }

  return {
    Authorization: `Bearer ${trimmed}`,
    "Content-Type": "application/json",
  };
};

const createGithubGraphqlHeadersFromEnv = (): Record<string, string> => {
  const token = process.env.GITHUB_TOKEN;
  if (!token?.trim()) {
    throw new Error("GITHUB_TOKEN is not set");
  }
  return createGithubGraphqlHeaders(token);
};

/** `githubGraphql` に渡す GraphQL リクエスト本体 */
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

/**
 * GitHub GraphQL API に POST し、`data` フィールドを返す。
 *
 * `options.accessToken` を省略すると `GITHUB_TOKEN` 環境変数を使う。
 * レスポンスの `errors`、非 OK の HTTP、JSON パース失敗、`data` 欠落時はいずれも throw する。
 *
 * @param request - GraphQL クエリと任意の variables
 * @param options - 省略時は環境変数からトークンを解決
 * @returns パース済みの `data` オブジェクト
 */
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
