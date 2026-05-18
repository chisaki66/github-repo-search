/**
 * GitHub GraphQL API 用の Authorization ヘッダーを組み立てる。
 *
 * @param accessToken - Bearer トークン（前後空白は trim される）
 * @returns `Authorization` と `Content-Type` を含むヘッダー
 * @throws トークンが空のとき `GitHub access token is empty`
 */
export const createGithubGraphqlHeaders = (
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

/**
 * 環境変数 `GITHUB_TOKEN` から GraphQL 用ヘッダーを組み立てる。
 *
 * @returns `createGithubGraphqlHeaders` と同形式のヘッダー
 * @throws `GITHUB_TOKEN` が未設定または空のとき
 */
export const createGithubGraphqlHeadersFromEnv = (): Record<string, string> => {
  const token = process.env.GITHUB_TOKEN;
  if (!token?.trim()) {
    throw new Error("GITHUB_TOKEN is not set");
  }
  return createGithubGraphqlHeaders(token);
};
