import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

type PageContainerProps = ComponentProps<"div">;

export const PageContainer = ({ className, ...props }: PageContainerProps) => {
  return (
    <div
      className={cn("mx-auto w-full max-w-6xl px-6", className)}
      {...props}
    />
  );
};
