import { toRepositoryDetail, type GetRepositoryData } from "./get-repository";

const validRepository: NonNullable<GetRepositoryData["repository"]> = {
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
};

describe("toRepositoryDetail", () => {
  it("maps GraphQL response to RepositoryDetail", () => {
    expect(
      toRepositoryDetail({
        repository: validRepository,
      }),
    ).toEqual({
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
    expect(toRepositoryDetail({ repository: null })).toBeNull();
  });

  it("returns null when required owner fields are missing", () => {
    expect(
      toRepositoryDetail({
        repository: {
          ...validRepository,
          owner: { login: "", avatarUrl: "" },
        },
      }),
    ).toBeNull();
  });

  it("sets language to null when primaryLanguage is absent", () => {
    expect(
      toRepositoryDetail({
        repository: {
          ...validRepository,
          primaryLanguage: null,
        },
      }),
    ).toMatchObject({ language: null });
  });
});
