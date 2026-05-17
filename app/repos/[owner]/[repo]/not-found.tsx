import { Suspense } from "react";

import { BackToHomeLink } from "@/components/navigation";
import { BACK_TO_HOME_LABEL } from "@/lib/constants/app-strings";

const RepositoryNotFound = () => {
  return (
    <main className="min-h-0 flex-1 p-6">
      <p className="text-base text-foreground">
        リポジトリが見つかりませんでした。
      </p>
      <Suspense
        fallback={
          <span className="mt-4 inline-block text-sm text-muted-foreground">
            {BACK_TO_HOME_LABEL}
          </span>
        }
      >
        <BackToHomeLink className="mt-4 inline-block text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline" />
      </Suspense>
    </main>
  );
};

export default RepositoryNotFound;
