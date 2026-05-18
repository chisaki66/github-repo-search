import { z } from "zod";

import {
  INVALID_GITHUB_SEARCH_RESPONSE_MESSAGE,
  logGithubParseFailure,
} from "./parse-github-response";
import {
  githubOwnerSchema,
  nonEmptyString,
  pageInfoSchema,
} from "./primitives";

/** 検索一覧の 1 行分 */
export const repositorySearchResultSchema = z.object({
  icon: nonEmptyString,
  ownerLogin: nonEmptyString,
  repositoryName: nonEmptyString,
});

export type RepositorySearchResult = z.infer<
  typeof repositorySearchResultSchema
>;

export type RepositorySearchPageInfo = z.infer<typeof pageInfoSchema>;

/** `/api/search` および React Query が扱う 1 ページ分 */
export const repositorySearchPageSchema = z.object({
  results: z.array(repositorySearchResultSchema),
  pageInfo: pageInfoSchema,
});

export type RepositorySearchPage = z.infer<typeof repositorySearchPageSchema>;

const assertPaginationConsistent = (
  page: RepositorySearchPage,
  ctx: z.RefinementCtx,
): void => {
  if (page.pageInfo.hasNextPage && page.pageInfo.endCursor === null) {
    ctx.addIssue({
      code: "custom",
      message: "hasNextPage is true but endCursor is missing",
      path: ["pageInfo", "endCursor"],
    });
  }
};

/**
 * GraphQL `SearchRepositories` の wire JSON を検証し `RepositorySearchPage` に変換する。
 * フィールドは `lib/github/search-repositories.ts` の GraphQL クエリと一致させる。
 */
export const repositorySearchPageWireSchema = z
  .object({
    search: z.object({
      pageInfo: pageInfoSchema,
      edges: z
        .array(
          z
            .object({
              cursor: z.string(),
              node: z
                .object({
                  name: nonEmptyString,
                  owner: githubOwnerSchema,
                })
                .nullable(),
            })
            .nullable(),
        )
        .nullable(),
    }),
  })
  .transform((data): RepositorySearchPage => {
    const edges = data.search.edges ?? [];

    const results: RepositorySearchResult[] = edges.flatMap((edge) => {
      const node = edge?.node;
      if (!node) {
        return [];
      }

      return [
        {
          icon: node.owner.avatarUrl,
          ownerLogin: node.owner.login,
          repositoryName: node.name,
        },
      ];
    });

    const { hasNextPage, endCursor } = data.search.pageInfo;
    const lastCursor = edges.length > 0 ? (edges.at(-1)?.cursor ?? null) : null;

    return {
      results,
      pageInfo: {
        hasNextPage,
        endCursor: endCursor ?? lastCursor,
      },
    };
  })
  .pipe(
    repositorySearchPageSchema.superRefine((page, ctx) => {
      assertPaginationConsistent(page, ctx);
    }),
  );

/** API が返す正規化済み JSON（クライアント向け・transform なし） */
export const repositorySearchPageJsonSchema =
  repositorySearchPageSchema.superRefine((page, ctx) => {
    assertPaginationConsistent(page, ctx);
  });

/**
 * GitHub GraphQL の検索レスポンスをパースする（サーバー側）。
 *
 * @param data - `githubGraphql` の `data`
 * @throws 形が不正なとき {@link INVALID_GITHUB_SEARCH_RESPONSE_MESSAGE}
 */
export const parseRepositorySearchPage = (
  data: unknown,
): RepositorySearchPage => {
  const result = repositorySearchPageWireSchema.safeParse(data);
  if (!result.success) {
    logGithubParseFailure("parseRepositorySearchPage", result.error);
    throw new Error(INVALID_GITHUB_SEARCH_RESPONSE_MESSAGE);
  }

  return result.data;
};

/**
 * `/api/search` の JSON レスポンスをパースする（クライアント側）。
 *
 * @param data - `response.json()` の結果
 * @throws 形が不正なとき {@link INVALID_GITHUB_SEARCH_RESPONSE_MESSAGE}
 */
export const parseRepositorySearchPageJson = (
  data: unknown,
): RepositorySearchPage => {
  const result = repositorySearchPageJsonSchema.safeParse(data);
  if (!result.success) {
    logGithubParseFailure("parseRepositorySearchPageJson", result.error);
    throw new Error(INVALID_GITHUB_SEARCH_RESPONSE_MESSAGE);
  }

  return result.data;
};
