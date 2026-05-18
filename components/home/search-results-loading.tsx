import { Loader2 } from "lucide-react";

import { captionFont } from "@/lib/constants/design-fonts";
import {
  gapSm,
  iconSmSize,
  sectionMarginTop,
} from "@/lib/constants/design-sizes";
import { cn } from "@/lib/utils";

export const SearchResultsLoading = () => (
  <p
    className={cn("flex items-center", sectionMarginTop, gapSm, captionFont)}
    role="status"
    aria-live="polite"
  >
    <Loader2 className={cn(iconSmSize, "animate-spin")} aria-hidden />
    読み込み中…
  </p>
);
