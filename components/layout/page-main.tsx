import type { ComponentProps } from "react";

import { PageContainer } from "@/components/layout/page-container";
import { cn } from "@/lib/utils";

type PageMainProps = ComponentProps<"main">;

export const PageMain = ({ className, children, ...props }: PageMainProps) => {
  return (
    <main className={cn("min-h-0 flex-1 py-6", className)} {...props}>
      <PageContainer>{children}</PageContainer>
    </main>
  );
};
