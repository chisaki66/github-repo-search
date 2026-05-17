import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";

import { BackToHomeLink } from "@/components/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BACK_TO_HOME_LABEL } from "@/lib/constants/app-strings";
import type { RepositoryDetail } from "@/lib/github";

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
    <main className="min-h-0 flex-1 p-6">
      <Suspense
        fallback={
          <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <ArrowLeft className="size-4" aria-hidden />
            {BACK_TO_HOME_LABEL}
          </span>
        }
      >
        <BackToHomeLink className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="size-4" aria-hidden />
          {BACK_TO_HOME_LABEL}
        </BackToHomeLink>
      </Suspense>

      <div className="mt-8 flex items-start gap-4">
        <Avatar className="size-16">
          <AvatarImage src={repository.ownerAvatarUrl} alt="" />
          <AvatarFallback>
            {repository.ownerLogin.slice(0, 1).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold text-foreground">
            {repository.name}
          </h1>
          <p className="mt-1 text-base text-muted-foreground">
            {repository.language ?? "—"}
          </p>
        </div>
      </div>

      <dl className="mt-10 grid grid-cols-2 gap-8 sm:grid-cols-4">
        {stats.map(({ label, key }) => (
          <div key={key}>
            <dt className="text-sm text-muted-foreground">{label}</dt>
            <dd className="mt-2 text-3xl font-semibold tabular-nums text-foreground">
              {formatCount(repository[key])}
            </dd>
          </div>
        ))}
      </dl>
    </main>
  );
};
