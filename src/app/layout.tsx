import Providers from "@/components/providers";
import AppLayout from "@/components/layout/app-layout";
import { Toaster } from "react-hot-toast";
import "./globals.css";

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
          <Toaster position="top-center" />
        </Providers>
      </body>
    </html>
  );
}
