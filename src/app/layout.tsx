import type { Metadata } from "next";
import "./globals.css";

import Provider from "./provider";
import { Toaster } from "@/components/ui/sonner"



export const metadata: Metadata = {
  title: "DJSS Jewellers",
  description: "Dharmendra Singh Jitendra Singh Saraaf",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
      // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Provider>
          {children}
          <Toaster />
        </Provider>

      </body>
    </html>
  );
}
