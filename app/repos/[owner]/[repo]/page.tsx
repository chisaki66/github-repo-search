import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { RepositoryDetailView } from "@/components/repository";
import { formatAppPageTitle } from "@/lib/constants/app-strings";
import { getRepository } from "@/lib/github";

type RepositoryPageProps = {
  params: Promise<{
    owner: string;
    repo: string;
  }>;
};

export const generateMetadata = async ({
  params,
}: RepositoryPageProps): Promise<Metadata> => {
  const { owner, repo } = await params;

  return {
    title: formatAppPageTitle(`${owner}/${repo}`),
  };
};

const RepositoryPage = async ({ params }: RepositoryPageProps) => {
  const { owner, repo } = await params;
  const repository = await getRepository({
    owner: decodeURIComponent(owner),
    name: decodeURIComponent(repo),
  });

  if (!repository) {
    notFound();
  }

  return <RepositoryDetailView repository={repository} />;
};

export default RepositoryPage;
