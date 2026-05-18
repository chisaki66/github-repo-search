import { Suspense } from "react";

import { PageMain } from "@/components/layout";
import { BackToHomeLink } from "@/components/navigation";
import { BACK_TO_HOME_LABEL } from "@/lib/constants/app-strings";
import { foregroundHoverColor } from "@/lib/constants/design-colors";
import { backLinkFont, bodyFont } from "@/lib/constants/design-fonts";
import { linkMarginTop } from "@/lib/constants/design-sizes";
import { cn } from "@/lib/utils";

const RepositoryNotFound = () => {
  return (
    <PageMain>
      <p className={bodyFont}>リポジトリが見つかりませんでした。</p>
      <Suspense
        fallback={
          <span className={cn("inline-block", linkMarginTop, backLinkFont)}>
            {BACK_TO_HOME_LABEL}
          </span>
        }
      >
        <BackToHomeLink
          className={cn(
            "inline-block underline-offset-4 hover:underline",
            linkMarginTop,
            backLinkFont,
            foregroundHoverColor,
          )}
        />
      </Suspense>
    </PageMain>
  );
};

export default RepositoryNotFound;
