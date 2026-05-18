import { formatSearchNoResultsMessage } from "@/lib/constants/app-strings";
import { bodyFont } from "@/lib/constants/design-fonts";
import { sectionMarginTop } from "@/lib/constants/design-sizes";
import { cn } from "@/lib/utils";

type SearchResultsEmptyProps = {
  searchQuery: string;
};

export const SearchResultsEmpty = ({
  searchQuery,
}: SearchResultsEmptyProps) => (
  <p
    className={cn(sectionMarginTop, bodyFont)}
    role="status"
    aria-live="polite"
  >
    {formatSearchNoResultsMessage(searchQuery)}
  </p>
);
