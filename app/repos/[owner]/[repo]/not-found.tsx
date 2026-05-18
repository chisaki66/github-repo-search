import { PageMain } from "@/components/layout";
import { BackToHomeLinkWithSuspense } from "@/components/navigation";
import { foregroundHoverColor } from "@/lib/constants/design-colors";
import { backLinkFont, bodyFont } from "@/lib/constants/design-fonts";
import { linkMarginTop } from "@/lib/constants/design-sizes";
import { cn } from "@/lib/utils";

const RepositoryNotFound = () => {
  return (
    <PageMain>
      <p className={bodyFont}>リポジトリが見つかりませんでした。</p>
      <BackToHomeLinkWithSuspense
        fallbackClassName={cn("inline-block", linkMarginTop, backLinkFont)}
        className={cn(
          "inline-block underline-offset-4 hover:underline",
          linkMarginTop,
          backLinkFont,
          foregroundHoverColor,
        )}
      />
    </PageMain>
  );
};

export default RepositoryNotFound;
