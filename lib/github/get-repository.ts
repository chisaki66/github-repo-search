import { githubGraphql } from "./graphql-fetch";

/** `getRepository` で使う GraphQL クエリ文字列 */
export const GET_REPOSITORY_QUERY = `
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

/** `getRepository` の GraphQL variables */
export type GetRepositoryVariables = {
  owner: string;
  name: string;
};

/** `getRepository` の GraphQL レスポンス（`repository` は存在しないリポジトリで null） */
export type GetRepositoryData = {
  repository: {
    name: string;
    owner: {
      login: string;
      avatarUrl: string;
    };
    primaryLanguage: {
      name: string;
    } | null;
    stargazerCount: number;
    watchers: {
      totalCount: number;
    };
    forkCount: number;
    issues: {
      totalCount: number;
    };
  } | null;
};

/** 詳細画面向けに正規化したリポジトリ情報 */
export type RepositoryDetail = {
  name: string;
  ownerLogin: string;
  ownerAvatarUrl: string;
  language: string | null;
  starCount: number;
  watcherCount: number;
  forkCount: number;
  issueCount: number;
};

/**
 * GraphQL レスポンスを `RepositoryDetail` に変換する。
 *
 * @param data - `getRepository` の GraphQL レスポンス
 * @returns 必須フィールドが揃っているときのみオブジェクト。それ以外は `null`
 */
export const toRepositoryDetail = (
  data: GetRepositoryData,
): RepositoryDetail | null => {
  const repository = data.repository;
  if (
    !repository?.owner?.avatarUrl ||
    !repository.owner.login ||
    !repository.name
  ) {
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
};

/**
 * オーナーとリポジトリ名で GitHub から詳細を取得する。
 *
 * @param variables - `owner` と `name`
 * @param options - 省略時は `GITHUB_TOKEN` を使用
 * @returns 正規化済みの詳細。リポジトリが無い・必須フィールド欠落時は `null`
 */
export const getRepository = async (
  variables: GetRepositoryVariables,
  options?: { accessToken?: string },
): Promise<RepositoryDetail | null> => {
  const data = await githubGraphql<GetRepositoryData>(
    {
      query: GET_REPOSITORY_QUERY,
      variables,
    },
    options,
  );

  return toRepositoryDetail(data);
};
