import { z } from "zod";

/** 空白のみでない文字列 */
export const nonEmptyString = z.string().trim().min(1);

/** GitHub owner の最小フィールド（検索・詳細で共通） */
export const githubOwnerSchema = z.object({
  login: nonEmptyString,
  avatarUrl: nonEmptyString,
});

/** 非負整数カウント（スター数など） */
export const countSchema = z.number().int().nonnegative();

/** 検索結果ページネーション */
export const pageInfoSchema = z.object({
  hasNextPage: z.boolean(),
  endCursor: z.string().nullable(),
});
