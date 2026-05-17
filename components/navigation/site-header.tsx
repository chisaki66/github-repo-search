"use client";

import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { MouseEvent } from "react";

import { APP_TITLE } from "@/lib/constants/app-strings";

export const SiteHeader = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleTitleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    queryClient.removeQueries({ queryKey: ["search"] });
    router.push("/");
  };

  return (
    <header className="shrink-0 border-b border-border">
      <div className="flex h-14 items-center px-6">
        <Link
          href="/"
          onClick={handleTitleClick}
          className="text-lg font-semibold text-foreground transition-colors hover:text-foreground/80"
        >
          {APP_TITLE}
        </Link>
      </div>
    </header>
  );
};
