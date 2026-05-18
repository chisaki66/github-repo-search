import {
  getRepositorySearchValidationError,
  parseRepositorySearchQuery,
  REPOSITORY_SEARCH_MAX_LENGTH,
} from "./repository-search-schema";
import {
  REPOSITORY_SEARCH_INVALID_CHARS_MESSAGE,
  REPOSITORY_SEARCH_TOO_LONG_MESSAGE,
} from "@/lib/constants/app-strings";

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

  it("accepts input up to the maximum length", () => {
    const value = "a".repeat(REPOSITORY_SEARCH_MAX_LENGTH);
    expect(parseRepositorySearchQuery(value)).toEqual({
      ok: true,
      value,
    });
  });

  it("rejects input longer than the maximum length", () => {
    const value = "a".repeat(REPOSITORY_SEARCH_MAX_LENGTH + 1);
    const result = parseRepositorySearchQuery(value);
    expect(result).toEqual({
      ok: false,
      error: REPOSITORY_SEARCH_TOO_LONG_MESSAGE,
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

  it("returns an error message when input exceeds the maximum length", () => {
    const value = "a".repeat(REPOSITORY_SEARCH_MAX_LENGTH + 1);
    expect(getRepositorySearchValidationError(value)).toBe(
      REPOSITORY_SEARCH_TOO_LONG_MESSAGE,
    );
  });
});
