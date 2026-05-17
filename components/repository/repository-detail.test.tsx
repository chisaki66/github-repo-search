import { render, screen } from "@testing-library/react";

import { RepositoryDetailView } from "./repository-detail";
import type { RepositoryDetail } from "@/lib/github";
import { BACK_TO_HOME_LABEL } from "@/lib/constants/app-strings";

jest.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
}));

jest.mock("next/link", () => {
  return function MockLink({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) {
    return <a href={href}>{children}</a>;
  };
});

const repository: RepositoryDetail = {
  name: "next.js",
  ownerLogin: "vercel",
  ownerAvatarUrl: "https://avatars.githubusercontent.com/u/14985020",
  language: "TypeScript",
  starCount: 1234,
  watcherCount: 567,
  forkCount: 890,
  issueCount: 12,
};

describe("RepositoryDetailView", () => {
  it("renders repository metadata and formatted stats", async () => {
    render(<RepositoryDetailView repository={repository} />);

    expect(
      await screen.findByRole("heading", { name: "next.js" }),
    ).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("1,234")).toBeInTheDocument();
    expect(screen.getByText("567")).toBeInTheDocument();
    expect(screen.getByText("890")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getAllByText(BACK_TO_HOME_LABEL).length).toBeGreaterThan(0);
  });

  it("shows em dash when language is null", async () => {
    render(
      <RepositoryDetailView
        repository={{
          ...repository,
          language: null,
        }}
      />,
    );

    expect(await screen.findByText("—")).toBeInTheDocument();
  });
});
