import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { RepositorySearchResult } from "@/lib/github";
import { buildRepositoryHref } from "@/lib/navigation/search-query-url";

type RepositoryListProps = {
  repositories: RepositorySearchResult[];
  searchQuery: string;
  page: number;
};

export const RepositoryList = ({
  repositories,
  searchQuery,
  page,
}: RepositoryListProps) => {
  return (
    <ul className="mt-6 flex flex-col gap-3">
      {repositories.map((repository) => (
        <li key={`${repository.ownerLogin}/${repository.repositoryName}`}>
          <Link
            href={buildRepositoryHref(
              repository.ownerLogin,
              repository.repositoryName,
              searchQuery,
              page,
            )}
            className="flex items-center gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
          >
            <Avatar>
              <AvatarImage src={repository.icon} alt="" />
              <AvatarFallback>
                {repository.repositoryName.slice(0, 1).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-base font-medium text-foreground">
              {repository.repositoryName}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
};
