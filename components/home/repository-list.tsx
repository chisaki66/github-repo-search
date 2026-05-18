import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  borderColor,
  mutedBackgroundHoverColor,
} from "@/lib/constants/design-colors";
import { bodyMediumFont } from "@/lib/constants/design-fonts";
import {
  cardPadding,
  gapCard,
  gapList,
  sectionMarginTop,
} from "@/lib/constants/design-sizes";
import type { RepositorySearchResult } from "@/lib/github";
import { buildRepositoryHref } from "@/lib/navigation/search-query-url";
import { cn } from "@/lib/utils";

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
    <ul className={cn("flex flex-col", sectionMarginTop, gapList)}>
      {repositories.map((repository) => (
        <li key={`${repository.ownerLogin}/${repository.repositoryName}`}>
          <Link
            href={buildRepositoryHref(
              repository.ownerLogin,
              repository.repositoryName,
              searchQuery,
              page,
            )}
            className={cn(
              "flex min-w-0 items-center rounded-lg border transition-colors",
              gapCard,
              borderColor,
              cardPadding,
              mutedBackgroundHoverColor,
            )}
          >
            <Avatar className="shrink-0">
              <AvatarImage src={repository.icon} alt="" />
              <AvatarFallback>
                {repository.repositoryName.slice(0, 1).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className={cn("min-w-0 truncate", bodyMediumFont)}>
              {repository.repositoryName}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
};
