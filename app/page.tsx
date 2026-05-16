import { Suspense } from "react";

import { HomePage } from "@/components/home";

const HomePageFallback = () => {
  return <main className="min-h-0 flex-1 p-6" />;
};

const Home = () => {
  return (
    <Suspense fallback={<HomePageFallback />}>
      <HomePage />
    </Suspense>
  );
};

export default Home;
