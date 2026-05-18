"use client";

import { Suspense, type ReactNode } from "react";

import { BackToHomeLink } from "@/components/navigation/back-to-home-link";
import { BACK_TO_HOME_LABEL } from "@/lib/constants/app-strings";

type BackToHomeLinkWithSuspenseProps = {
  className?: string;
  fallbackClassName?: string;
  children?: ReactNode;
};

export const BackToHomeLinkWithSuspense = ({
  className,
  fallbackClassName,
  children,
}: BackToHomeLinkWithSuspenseProps) => {
  const content = children ?? BACK_TO_HOME_LABEL;

  return (
    <Suspense fallback={<span className={fallbackClassName}>{content}</span>}>
      <BackToHomeLink className={className}>{content}</BackToHomeLink>
    </Suspense>
  );
};
