import { z } from "zod";

import {
  REPOSITORY_SEARCH_INVALID_CHARS_MESSAGE,
  REPOSITORY_SEARCH_TOO_LONG_MESSAGE,
} from "@/lib/constants/app-strings";

/** GitHub リポジトリ名および `in:name` 検索で安全に使える文字 */
export const REPOSITORY_SEARCH_ALLOWED_PATTERN = /^[A-Za-z0-9._-]+$/;

export const REPOSITORY_SEARCH_MAX_LENGTH = 100;

const repositorySearchQuerySchema = z
  .string()
  .trim()
  .min(1)
  .max(REPOSITORY_SEARCH_MAX_LENGTH, REPOSITORY_SEARCH_TOO_LONG_MESSAGE)
  .regex(
    REPOSITORY_SEARCH_ALLOWED_PATTERN,
    REPOSITORY_SEARCH_INVALID_CHARS_MESSAGE,
  );

export type RepositorySearchValidationResult =
  | { ok: true; value: string }
  | { ok: false; error: string };

export const parseRepositorySearchQuery = (
  value: string,
): RepositorySearchValidationResult => {
  const result = repositorySearchQuerySchema.safeParse(value);
  if (result.success) {
    return { ok: true, value: result.data };
  }

  const issue = result.error.issues[0];
  return {
    ok: false,
    error: issue?.message ?? REPOSITORY_SEARCH_INVALID_CHARS_MESSAGE,
  };
};

/** 空文字はエラーにしない。入力があり無効なときだけメッセージを返す */
export const getRepositorySearchValidationError = (
  value: string,
): string | null => {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const parsed = parseRepositorySearchQuery(value);
  return parsed.ok ? null : parsed.error;
};
