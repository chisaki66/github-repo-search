import type { z } from "zod";

/** `parseRepositorySearchPage` 失敗時に throw するメッセージ（API・ログ用） */
export const INVALID_GITHUB_SEARCH_RESPONSE_MESSAGE =
  "Invalid GitHub search response";

/** `parseRepositoryDetail` 失敗時に throw するメッセージ */
export const INVALID_GITHUB_REPOSITORY_RESPONSE_MESSAGE =
  "Invalid GitHub repository response";

/**
 * 開発時のみ Zod の検証エラーをログする。
 *
 * @param label - ログ識別子
 * @param error - `safeParse` の `error`
 */
export const logGithubParseFailure = (
  label: string,
  error: z.ZodError,
): void => {
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  console.error(`[${label}]`, error.flatten());
};
