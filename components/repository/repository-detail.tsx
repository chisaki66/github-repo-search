import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";

import { PageMain } from "@/components/layout";
import { BackToHomeLink } from "@/components/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BACK_TO_HOME_LABEL } from "@/lib/constants/app-strings";
import { foregroundHoverColor } from "@/lib/constants/design-colors";
import {
  backLinkFont,
  pageHeadingFont,
  statLabelFont,
  statValueFont,
  subtitleFont,
} from "@/lib/constants/design-fonts";
import {
  avatarLgSize,
  contentMarginTop,
  gapCard,
  gapSm,
  iconSmSize,
  statsMarginTop,
} from "@/lib/constants/design-sizes";
import type { RepositoryDetail } from "@/lib/github";
import { cn } from "@/lib/utils";

type RepositoryDetailViewProps = {
  repository: RepositoryDetail;
};

const formatCount = (value: number) => value.toLocaleString("ja-JP");

const stats = [
  { label: "Star数", key: "starCount" },
  { label: "Watcher数", key: "watcherCount" },
  { label: "Fork数", key: "forkCount" },
  { label: "Issue数", key: "issueCount" },
] as const satisfies ReadonlyArray<{
  label: string;
  key: keyof Pick<
    RepositoryDetail,
    "starCount" | "watcherCount" | "forkCount" | "issueCount"
  >;
}>;

export const RepositoryDetailView = ({
  repository,
}: RepositoryDetailViewProps) => {
  return (
    <PageMain>
      <Suspense
        fallback={
          <span className={cn("inline-flex items-center", gapSm, backLinkFont)}>
            <ArrowLeft className={iconSmSize} aria-hidden />
            {BACK_TO_HOME_LABEL}
          </span>
        }
      >
        <BackToHomeLink
          className={cn(
            "inline-flex items-center transition-colors",
            gapSm,
            backLinkFont,
            foregroundHoverColor,
          )}
        >
          <ArrowLeft className={iconSmSize} aria-hidden />
          {BACK_TO_HOME_LABEL}
        </BackToHomeLink>
      </Suspense>

      <div
        className={cn(
          "flex flex-col items-start sm:flex-row",
          contentMarginTop,
          gapCard,
        )}
      >
        <Avatar className={cn(avatarLgSize, "shrink-0")}>
          <AvatarImage src={repository.ownerAvatarUrl} alt="" />
          <AvatarFallback>
            {repository.ownerLogin.slice(0, 1).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <h1 className={cn("break-words", pageHeadingFont)}>
            {repository.name}
          </h1>
          <p className={cn("mt-1", subtitleFont)}>
            {repository.language ?? "—"}
          </p>
        </div>
      </div>

      <dl
        className={cn(
          "grid grid-cols-2 gap-[clamp(1.5rem,4vw,2rem)] sm:grid-cols-4",
          statsMarginTop,
        )}
      >
        {stats.map(({ label, key }) => (
          <div key={key}>
            <dt className={statLabelFont}>{label}</dt>
            <dd className={cn("mt-2", statValueFont)}>
              {formatCount(repository[key])}
            </dd>
          </div>
        ))}
      </dl>
    </PageMain>
  );
};
