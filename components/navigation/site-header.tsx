"use client";

import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { MouseEvent } from "react";

import { PageContainer } from "@/components/layout";
import { APP_TITLE } from "@/lib/constants/app-strings";
import {
  borderColor,
  foregroundMutedHoverColor,
} from "@/lib/constants/design-colors";
import { siteTitleFont } from "@/lib/constants/design-fonts";
import { headerHeight } from "@/lib/constants/design-sizes";
import { cn } from "@/lib/utils";

export const SiteHeader = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleTitleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    queryClient.removeQueries({ queryKey: ["search"] });
    router.push("/");
  };

  return (
    <header className={cn("shrink-0 border-b", borderColor)}>
      <PageContainer className={cn("flex items-center", headerHeight)}>
        <Link
          href="/"
          onClick={handleTitleClick}
          className={cn(
            siteTitleFont,
            "transition-colors",
            foregroundMutedHoverColor,
          )}
        >
          {APP_TITLE}
        </Link>
      </PageContainer>
    </header>
  );
};
