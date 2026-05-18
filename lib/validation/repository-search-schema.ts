import { z } from "zod";

import {
  REPOSITORY_SEARCH_INVALID_CHARS_MESSAGE,
  REPOSITORY_SEARCH_TOO_LONG_MESSAGE,
} from "@/lib/constants/app-strings";

/** GitHub リポジトリ名および `in:name` 検索で安全に使える文字（英数字・`.`・`_`・`-`） */
export const REPOSITORY_SEARCH_ALLOWED_PATTERN = /^[A-Za-z0-9._-]+$/;

/** 検索クエリの最大文字数（GitHub リポジトリ名の実用上限に合わせた値） */
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

/** `parseRepositorySearchQuery` の判別可能な戻り値 */
export type RepositorySearchValidationResult =
  | { ok: true; value: string }
  | { ok: false; error: string };

/**
 * 検索文字列を trim・長さ・許可文字で検証する。
 *
 * @param value - 生の検索入力
 * @returns 成功時は trim 済みの `value`、失敗時はユーザー向け `error` 文言
 *
 * @example
 * parseRepositorySearchQuery("next.js") // { ok: true, value: "next.js" }
 * parseRepositorySearchQuery("") // { ok: false, error: "..." }
 */
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

/**
 * フォーム向けのインライン検証。空文字はエラーにしない。
 *
 * @param value - 入力中の文字列
 * @returns 入力があり無効なときだけエラーメッセージ。空・有効時は `null`
 */
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
