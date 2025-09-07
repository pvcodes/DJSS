'use client'
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/app-navbar";
import { SessionProvider } from "next-auth/react";

export default function Provider({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <SessionProvider>

                <SidebarProvider>
                    <AppSidebar />
                    <main className="w-full">
                        <Navbar />
                        {children}
                    </main>
                </SidebarProvider>
            </SessionProvider >
        </ThemeProvider>
    );
}
