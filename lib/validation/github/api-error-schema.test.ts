import { parseApiErrorBody } from "./api-error-schema";

describe("parseApiErrorBody", () => {
  it("returns the error message from a valid body", () => {
    expect(parseApiErrorBody({ error: "GitHub search failed" })).toBe(
      "GitHub search failed",
    );
  });

  it("returns null when error is missing or empty", () => {
    expect(parseApiErrorBody({})).toBeNull();
    expect(parseApiErrorBody({ error: "" })).toBeNull();
    expect(parseApiErrorBody(null)).toBeNull();
  });
});
