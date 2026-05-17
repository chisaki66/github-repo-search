import { Loader2 } from "lucide-react";

export const SearchResultsLoading = () => (
  <p
    className="mt-6 flex items-center gap-2 text-sm text-muted-foreground"
    role="status"
    aria-live="polite"
  >
    <Loader2 className="size-4 animate-spin" aria-hidden />
    読み込み中…
  </p>
);
