"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import {
  HOME_PAGE_PARAM,
  HOME_SEARCH_QUERY_PARAM,
  buildHomeHref,
  parseHomePageParam,
} from "@/lib/navigation/search-query-url";
import { BACK_TO_HOME_LABEL } from "@/lib/constants/app-strings";

type BackToHomeLinkProps = {
  children?: React.ReactNode;
  className?: string;
};

export const BackToHomeLink = ({
  children = BACK_TO_HOME_LABEL,
  className,
}: BackToHomeLinkProps) => {
  const searchParams = useSearchParams();
  const href = buildHomeHref(
    searchParams.get(HOME_SEARCH_QUERY_PARAM),
    parseHomePageParam(searchParams.get(HOME_PAGE_PARAM)),
  );

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
};
