import { githubGraphql } from "./graphql-fetch";

/** `searchRepositories` で使う GraphQL クエリ文字列 */
export const SEARCH_REPOSITORIES_QUERY = `
  query SearchRepositories($query: String!, $first: Int!, $after: String) {
    search(query: $query, type: REPOSITORY, first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        cursor
        node {
          ... on Repository {
            name
            owner {
              login
              avatarUrl
            }
          }
        }
      }
    }
  }
`;

/** `searchRepositories` の GraphQL variables */
export type SearchRepositoriesVariables = {
  query: string;
  first: number;
  after?: string | null;
};

/** 検索結果 1 件のオーナー情報 */
export type SearchRepositoryOwner = {
  login: string;
  avatarUrl: string;
};

/** 検索結果 1 件のリポジトリノード */
export type SearchRepositoryNode = {
  name: string;
  owner: SearchRepositoryOwner;
};

/** `searchRepositories` の GraphQL レスポンス */
export type SearchRepositoriesData = {
  search: {
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string | null;
    };
    edges: Array<{
      cursor: string;
      node: SearchRepositoryNode | null;
    } | null> | null;
  };
};

/**
 * GitHub GraphQL でリポジトリを検索する（サーバー側）。
 *
 * `after` が空でないときだけ variables に含める（初回ページは省略）。
 *
 * @param variables - 検索クエリ・`first`・任意の cursor `after`
 * @param options - 省略時は `GITHUB_TOKEN` を使用
 */
export const searchRepositories = async (
  variables: SearchRepositoriesVariables,
  options?: { accessToken?: string },
): Promise<SearchRepositoriesData> => {
  const { query, first, after } = variables;
  return githubGraphql<SearchRepositoriesData>(
    {
      query: SEARCH_REPOSITORIES_QUERY,
      variables:
        after != null && after !== ""
          ? { query, first, after }
          : { query, first },
    },
    options,
  );
};
