import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/redux/provider";
import { Suspense } from "react";
import Spinner from "@/components/spinner";
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "fsWallet",
  description: "Your gateway to decentralized identity and seamless transactions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <html lang="en">

      <body className={inter.className}>
        <Suspense fallback={<Spinner />}>
          <Toaster />
          <ReduxProvider>{children}</ReduxProvider>
        </Suspense>
      </body>

    </html>
  );
}
