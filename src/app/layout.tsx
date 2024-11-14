import type { Metadata } from "next";
// import localFont from "next/font/local";
import "./globals.css";

import {
  NavigationMenu,
  // NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  // NavigationMenuTrigger,
  // navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import Link from "next/link";


// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

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
    <html lang="en">
      <body
        // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        className="container mx-auto"
      >
        <div className="flex justify-between my-2">
          <div className="text-xl">DJSS</div>
          <NavigationMenu>
            <NavigationMenuList className="flex">

              <NavigationMenuItem><Link href='/about'>About Us</Link></NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        {children}
      </body>
    </html>
  );
}
