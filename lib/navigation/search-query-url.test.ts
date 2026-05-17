import {
  buildHomeHref,
  buildRepositoryHref,
  parseHomePageParam,
} from "./search-query-url";

describe("parseHomePageParam", () => {
  it("returns 1 for null, empty, invalid, or non-positive values", () => {
    expect(parseHomePageParam(null)).toBe(1);
    expect(parseHomePageParam("")).toBe(1);
    expect(parseHomePageParam("abc")).toBe(1);
    expect(parseHomePageParam("0")).toBe(1);
    expect(parseHomePageParam("-3")).toBe(1);
  });

  it("returns parsed page for valid positive integers", () => {
    expect(parseHomePageParam("1")).toBe(1);
    expect(parseHomePageParam("2")).toBe(2);
    expect(parseHomePageParam("10")).toBe(10);
  });
});

describe("buildHomeHref", () => {
  it("returns root path when search query is empty", () => {
    expect(buildHomeHref()).toBe("/");
    expect(buildHomeHref(null)).toBe("/");
    expect(buildHomeHref("   ")).toBe("/");
  });

  it("includes q and omits page when page is 1", () => {
    expect(buildHomeHref("react")).toBe("/?q=react");
    expect(buildHomeHref("react", 1)).toBe("/?q=react");
  });

  it("includes page when greater than 1", () => {
    expect(buildHomeHref("react", 2)).toBe("/?q=react&page=2");
  });
});

describe("buildRepositoryHref", () => {
  it("builds repository path without query params when search is empty", () => {
    expect(buildRepositoryHref("vercel", "next.js")).toBe(
      "/repos/vercel/next.js",
    );
  });

  it("preserves search context in query string", () => {
    expect(buildRepositoryHref("vercel", "next.js", "react", 3)).toBe(
      "/repos/vercel/next.js?q=react&page=3",
    );
  });
});
