import type { Metadata } from "next";
import "./globals.css";

import Provider from "./provider";
import { Toaster } from "@/components/ui/sonner"
import { APP_NAME } from "@/lib/config";



export const metadata: Metadata = {
  title: APP_NAME,
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
