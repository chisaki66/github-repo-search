import { buildRepositorySearchQuery } from "./build-repository-search-query";

describe("buildRepositorySearchQuery", () => {
  it("returns empty string for blank input", () => {
    expect(buildRepositorySearchQuery("")).toBe("");
    expect(buildRepositorySearchQuery("   ")).toBe("");
  });

  it("appends in:name for repository name input", () => {
    expect(buildRepositorySearchQuery("react")).toBe("react in:name");
    expect(buildRepositorySearchQuery("  next.js  ")).toBe("next.js in:name");
  });
});
