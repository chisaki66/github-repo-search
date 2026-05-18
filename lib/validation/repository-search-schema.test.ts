import {
  getRepositorySearchValidationError,
  parseRepositorySearchQuery,
} from "./repository-search-schema";
import { REPOSITORY_SEARCH_INVALID_CHARS_MESSAGE } from "@/lib/constants/app-strings";

describe("parseRepositorySearchQuery", () => {
  it("accepts valid repository name characters", () => {
    expect(parseRepositorySearchQuery("react")).toEqual({
      ok: true,
      value: "react",
    });
    expect(parseRepositorySearchQuery("  next.js  ")).toEqual({
      ok: true,
      value: "next.js",
    });
    expect(parseRepositorySearchQuery("my_repo-name")).toEqual({
      ok: true,
      value: "my_repo-name",
    });
  });

  it("rejects empty input", () => {
    expect(parseRepositorySearchQuery("")).toEqual({
      ok: false,
      error: expect.any(String),
    });
    expect(parseRepositorySearchQuery("   ")).toEqual({
      ok: false,
      error: expect.any(String),
    });
  });

  it("rejects characters unsafe for GitHub search queries", () => {
    for (const value of [
      "foo bar",
      "repo/name",
      "a:b",
      "hello@world",
      "test*",
      'quote"',
      "plus+",
    ]) {
      const result = parseRepositorySearchQuery(value);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe(REPOSITORY_SEARCH_INVALID_CHARS_MESSAGE);
      }
    }
  });
});

describe("getRepositorySearchValidationError", () => {
  it("returns null for empty input", () => {
    expect(getRepositorySearchValidationError("")).toBeNull();
    expect(getRepositorySearchValidationError("   ")).toBeNull();
  });

  it("returns an error message for invalid non-empty input", () => {
    expect(getRepositorySearchValidationError("bad query!")).toBe(
      REPOSITORY_SEARCH_INVALID_CHARS_MESSAGE,
    );
  });
});
