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

export const createGithubGraphqlHeadersFromEnv = (): Record<string, string> => {
  const token = process.env.GITHUB_TOKEN;
  if (!token?.trim()) {
    throw new Error("GITHUB_TOKEN is not set");
  }
  return createGithubGraphqlHeaders(token);
};
