import { INVALID_GITHUB_REPOSITORY_RESPONSE_MESSAGE } from "./parse-github-response";
import { parseRepositoryDetail } from "./repository-detail-schema";

const validWire = {
  repository: {
    name: "next.js",
    owner: {
      login: "vercel",
      avatarUrl: "https://avatars.githubusercontent.com/u/14985020",
    },
    primaryLanguage: { name: "TypeScript" },
    stargazerCount: 120_000,
    watchers: { totalCount: 5_000 },
    forkCount: 25_000,
    issues: { totalCount: 42 },
  },
};

describe("parseRepositoryDetail", () => {
  it("maps GraphQL wire JSON to RepositoryDetail", () => {
    expect(parseRepositoryDetail(validWire)).toEqual({
      name: "next.js",
      ownerLogin: "vercel",
      ownerAvatarUrl: "https://avatars.githubusercontent.com/u/14985020",
      language: "TypeScript",
      starCount: 120_000,
      watcherCount: 5_000,
      forkCount: 25_000,
      issueCount: 42,
    });
  });

  it("returns null when repository is missing", () => {
    expect(parseRepositoryDetail({ repository: null })).toBeNull();
  });

  it("sets language to null when primaryLanguage is absent", () => {
    expect(
      parseRepositoryDetail({
        repository: {
          ...validWire.repository,
          primaryLanguage: null,
        },
      }),
    ).toMatchObject({ language: null });
  });

  it("throws when required owner fields are empty", () => {
    expect(() =>
      parseRepositoryDetail({
        repository: {
          ...validWire.repository,
          owner: { login: "", avatarUrl: "" },
        },
      }),
    ).toThrow(INVALID_GITHUB_REPOSITORY_RESPONSE_MESSAGE);
  });

  it("throws when repository object is missing", () => {
    expect(() => parseRepositoryDetail({})).toThrow(
      INVALID_GITHUB_REPOSITORY_RESPONSE_MESSAGE,
    );
  });
});
