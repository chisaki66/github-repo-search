import { z } from "zod";

import {
  INVALID_GITHUB_REPOSITORY_RESPONSE_MESSAGE,
  logGithubParseFailure,
} from "./parse-github-response";
import { countSchema, githubOwnerSchema, nonEmptyString } from "./primitives";

const repositoryDetailSchema = z.object({
  name: nonEmptyString,
  ownerLogin: nonEmptyString,
  ownerAvatarUrl: nonEmptyString,
  language: z.string().nullable(),
  starCount: countSchema,
  watcherCount: countSchema,
  forkCount: countSchema,
  issueCount: countSchema,
});

export type RepositoryDetail = z.infer<typeof repositoryDetailSchema>;

/**
 * GraphQL `GetRepository` の wire JSON を検証し `RepositoryDetail` に変換する。
 * `repository: null` は存在しないリポジトリとして `null` を返す（throw しない）。
 */
const repositoryDetailWireSchema = z
  .object({
    repository: z
      .object({
        name: nonEmptyString,
        owner: githubOwnerSchema,
        primaryLanguage: z.object({ name: nonEmptyString }).nullable(),
        stargazerCount: countSchema,
        watchers: z.object({ totalCount: countSchema }),
        forkCount: countSchema,
        issues: z.object({ totalCount: countSchema }),
      })
      .nullable(),
  })
  .transform((data): RepositoryDetail | null => {
    const repository = data.repository;
    if (!repository) {
      return null;
    }

    return {
      name: repository.name,
      ownerLogin: repository.owner.login,
      ownerAvatarUrl: repository.owner.avatarUrl,
      language: repository.primaryLanguage?.name ?? null,
      starCount: repository.stargazerCount,
      watcherCount: repository.watchers.totalCount,
      forkCount: repository.forkCount,
      issueCount: repository.issues.totalCount,
    };
  })
  .pipe(repositoryDetailSchema.nullable());

/**
 * GitHub GraphQL のリポジトリ詳細レスポンスをパースする。
 *
 * @param data - `githubGraphql` の `data`
 * @returns 正規化済み詳細。リポジトリが無いときは `null`
 * @throws wire 形が壊れているとき {@link INVALID_GITHUB_REPOSITORY_RESPONSE_MESSAGE}
 */
export const parseRepositoryDetail = (
  data: unknown,
): RepositoryDetail | null => {
  const result = repositoryDetailWireSchema.safeParse(data);
  if (!result.success) {
    logGithubParseFailure("parseRepositoryDetail", result.error);
    throw new Error(INVALID_GITHUB_REPOSITORY_RESPONSE_MESSAGE);
  }

  return result.data;
};
