import { INVALID_GITHUB_SEARCH_RESPONSE_MESSAGE } from "./parse-github-response";
import {
  parseRepositorySearchPage,
  parseRepositorySearchPageJson,
} from "./search-page-schema";

const validWire = {
  search: {
    pageInfo: {
      hasNextPage: true,
      endCursor: "cursor-1",
    },
    edges: [
      {
        cursor: "cursor-1",
        node: {
          name: "react",
          owner: {
            login: "facebook",
            avatarUrl: "https://avatars.githubusercontent.com/u/69631",
          },
        },
      },
    ],
  },
};

describe("parseRepositorySearchPage", () => {
  it("maps GraphQL wire JSON to RepositorySearchPage", () => {
    expect(parseRepositorySearchPage(validWire)).toEqual({
      results: [
        {
          icon: "https://avatars.githubusercontent.com/u/69631",
          ownerLogin: "facebook",
          repositoryName: "react",
        },
      ],
      pageInfo: {
        hasNextPage: true,
        endCursor: "cursor-1",
      },
    });
  });

  it("treats null edges as an empty result list", () => {
    expect(
      parseRepositorySearchPage({
        search: {
          pageInfo: { hasNextPage: false, endCursor: null },
          edges: null,
        },
      }),
    ).toEqual({
      results: [],
      pageInfo: { hasNextPage: false, endCursor: null },
    });
  });

  it("skips edges with a null node", () => {
    expect(
      parseRepositorySearchPage({
        search: {
          pageInfo: { hasNextPage: false, endCursor: null },
          edges: [{ cursor: "c1", node: null }],
        },
      }),
    ).toEqual({
      results: [],
      pageInfo: { hasNextPage: false, endCursor: "c1" },
    });
  });

  it("throws when search is missing", () => {
    expect(() => parseRepositorySearchPage({})).toThrow(
      INVALID_GITHUB_SEARCH_RESPONSE_MESSAGE,
    );
  });

  it("throws when hasNextPage is true but endCursor cannot be resolved", () => {
    expect(() =>
      parseRepositorySearchPage({
        search: {
          pageInfo: { hasNextPage: true, endCursor: null },
          edges: [],
        },
      }),
    ).toThrow(INVALID_GITHUB_SEARCH_RESPONSE_MESSAGE);
  });
});

describe("parseRepositorySearchPageJson", () => {
  it("accepts normalized API JSON", () => {
    const page = {
      results: [
        {
          icon: "https://example.com/a.png",
          ownerLogin: "octo",
          repositoryName: "hello",
        },
      ],
      pageInfo: { hasNextPage: false, endCursor: null },
    };

    expect(parseRepositorySearchPageJson(page)).toEqual(page);
  });

  it("throws when results is not an array", () => {
    expect(() =>
      parseRepositorySearchPageJson({
        results: null,
        pageInfo: { hasNextPage: false, endCursor: null },
      }),
    ).toThrow(INVALID_GITHUB_SEARCH_RESPONSE_MESSAGE);
  });
});
