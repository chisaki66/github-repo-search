import { githubGraphql } from "./graphql-fetch";
import {
  parseRepositoryDetail,
  type RepositoryDetail,
} from "@/lib/validation/github/repository-detail-schema";

const GET_REPOSITORY_QUERY = `
  query GetRepository($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      name
      owner {
        login
        avatarUrl
      }
      primaryLanguage {
        name
      }
      stargazerCount
      watchers {
        totalCount
      }
      forkCount
      issues(states: OPEN) {
        totalCount
      }
    }
  }
`;

type GetRepositoryVariables = {
  owner: string;
  name: string;
};

export type { RepositoryDetail };

/**
 * オーナーとリポジトリ名で GitHub から詳細を取得する。
 *
 * @param variables - `owner` と `name`
 * @param options - 省略時は `GITHUB_TOKEN` を使用
 * @returns 正規化済みの詳細。リポジトリが無いときは `null`
 */
export const getRepository = async (
  variables: GetRepositoryVariables,
  options?: { accessToken?: string },
): Promise<RepositoryDetail | null> => {
  const raw = await githubGraphql<unknown>(
    {
      query: GET_REPOSITORY_QUERY,
      variables,
    },
    options,
  );

  return parseRepositoryDetail(raw);
};
