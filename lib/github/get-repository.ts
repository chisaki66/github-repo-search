import { githubGraphql } from "./graphql-fetch";

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

export type GetRepositoryVariables = {
  owner: string;
  name: string;
};

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
