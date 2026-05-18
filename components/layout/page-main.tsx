import type { ComponentProps } from "react";

import { PageContainer } from "@/components/layout/page-container";
import { pagePaddingY } from "@/lib/constants/design-sizes";
import { cn } from "@/lib/utils";

type PageMainProps = ComponentProps<"main">;

export const PageMain = ({ className, children, ...props }: PageMainProps) => {
  return (
    <main className={cn("min-h-0 flex-1", pagePaddingY, className)} {...props}>
      <PageContainer>{children}</PageContainer>
    </main>
  );
};
