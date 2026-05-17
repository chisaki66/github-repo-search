import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";

import { SiteHeader } from "@/components/navigation/site-header";
import { QueryProvider } from "@/components/providers/query-provider";
import { APP_TITLE } from "@/lib/constants/app-strings";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: APP_TITLE,
  description: "Search GitHub repositories from the browser.",
};

export const viewport: Viewport = {
  colorScheme: "light",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <QueryProvider>
          <SiteHeader />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
};

export default RootLayout;
