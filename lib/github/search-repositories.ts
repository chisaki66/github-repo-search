import { githubGraphql } from "./graphql-fetch";

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
              ... on User {
                avatarUrl
              }
              ... on Organization {
                avatarUrl
              }
            }
          }
        }
      }
    }
  }
`;

export type SearchRepositoriesVariables = {
  query: string;
  first: number;
  after?: string | null;
};

export type SearchRepositoryOwner = {
  avatarUrl: string;
};

export type SearchRepositoryNode = {
  name: string;
  owner: SearchRepositoryOwner;
};

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

export async function searchRepositories(
  variables: SearchRepositoriesVariables,
  options?: { accessToken?: string },
): Promise<SearchRepositoriesData> {
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
}
