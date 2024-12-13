import Providers from "@/components/providers";
import AppLayout from "@/components/layout/app-layout";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <AppLayout>{children}</AppLayout>
          <GoogleAnalytics gaId="G-3J89W3VQ5F" />
          <Toaster position="top-center" />
        </Providers>
      </body>
    </html>
  );
}
