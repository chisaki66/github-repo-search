import Link from "next/link";

const RepositoryNotFound = () => {
  return (
    <main className="min-h-0 flex-1 p-6">
      <p className="text-base text-foreground">
        リポジトリが見つかりませんでした。
      </p>
      <Link
        href="/"
        className="mt-4 inline-block text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
      >
        トップページへ戻る
      </Link>
    </main>
  );
};

export default RepositoryNotFound;
