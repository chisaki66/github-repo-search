"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { buildHomeHref } from "@/lib/navigation/search-query-url";

type BackToHomeLinkProps = {
  children?: React.ReactNode;
  className?: string;
};

export const BackToHomeLink = ({
  children = "トップページへ戻る",
  className,
}: BackToHomeLinkProps) => {
  const searchParams = useSearchParams();
  const href = buildHomeHref(searchParams.get("q"));

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
};
