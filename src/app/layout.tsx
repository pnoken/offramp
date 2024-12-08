import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/redux/provider";
import { Suspense } from "react";
import Spinner from "@/components/spinner";
import { Toaster } from "react-hot-toast";
import Providers from "@/components/providers";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Alewa Testnet",
  description: "Fiatsend incentivized testnet",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient();
  return (
    <html lang="en">
      <body className={inter.className}>
        <Suspense fallback={<Spinner />}>
          <Toaster />
          <ReduxProvider>
            <Providers>{children}</Providers>
          </ReduxProvider>
        </Suspense>
      </body>
    </html>
  );
}
