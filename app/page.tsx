import { Suspense } from "react";

import { HomePage } from "@/components/home";
import { PageMain } from "@/components/layout";

const HomePageFallback = () => {
  return <PageMain />;
};

const Home = () => {
  return (
    <Suspense fallback={<HomePageFallback />}>
      <HomePage />
    </Suspense>
  );
};

export default Home;
