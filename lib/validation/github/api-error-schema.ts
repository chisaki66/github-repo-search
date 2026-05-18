import { z } from "zod";

import { nonEmptyString } from "./primitives";

/** `/api/search` 等のエラーレスポンス `{ error: string }` */
export const apiErrorBodySchema = z.object({
  error: nonEmptyString,
});

/**
 * エラーレスポンス JSON からユーザー向けメッセージを取り出す。
 *
 * @param data - `response.json()` の結果
 * @returns パース成功時は `error` 文字列。形が違うときは `null`
 */
export const parseApiErrorBody = (data: unknown): string | null => {
  const result = apiErrorBodySchema.safeParse(data);
  return result.success ? result.data.error : null;
};
