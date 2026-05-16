import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { RepositorySearchResult } from "@/lib/github";

type RepositoryListProps = {
  repositories: RepositorySearchResult[];
};

export const RepositoryList = ({ repositories }: RepositoryListProps) => {
  if (repositories.length === 0) {
    return null;
  }

  return (
    <ul className="mt-6 flex flex-col gap-3">
      {repositories.map((repository) => (
        <li key={`${repository.ownerLogin}/${repository.repositoryName}`}>
          <Link
            href={`/repos/${encodeURIComponent(repository.ownerLogin)}/${encodeURIComponent(repository.repositoryName)}`}
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
