import { githubGraphql } from "./graphql-fetch";
import {
  parseRepositorySearchPage,
  type RepositorySearchPage,
} from "@/lib/validation/github/search-page-schema";

const SEARCH_REPOSITORIES_QUERY = `
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

type SearchRepositoriesVariables = {
  query: string;
  first: number;
  after?: string | null;
};

export type { RepositorySearchPage };

/**
 * GitHub GraphQL でリポジトリを検索する（サーバー側）。
 *
 * `after` が空でないときだけ variables に含める（初回ページは省略）。
 * レスポンスは Zod で検証・正規化した {@link RepositorySearchPage} を返す。
 *
 * @param variables - 検索クエリ・`first`・任意の cursor `after`
 * @param options - 省略時は `GITHUB_TOKEN` を使用
 */
export const searchRepositories = async (
  variables: SearchRepositoriesVariables,
  options?: { accessToken?: string },
): Promise<RepositorySearchPage> => {
  const { query, first, after } = variables;
  const raw = await githubGraphql<unknown>(
    {
      query: SEARCH_REPOSITORIES_QUERY,
      variables:
        after != null && after !== ""
          ? { query, first, after }
          : { query, first },
    },
    options,
  );

  return parseRepositorySearchPage(raw);
};
