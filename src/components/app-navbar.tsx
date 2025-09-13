import { Button, buttonVariants } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { TypographyH4 } from "./typography"
import Link from "next/link"
import { Input } from "./ui/input"
import { signIn, useSession } from "next-auth/react"
import { cn } from "@/lib/utils"
import { Search } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Skeleton } from "./ui/skeleton"
import { APP_NAME, TEL_NUMBER } from "@/lib/config"
export default function Navbar() {

    const session = useSession()
    const router = useRouter()
    // session.status
    const [query, setQuery] = useState<string>()

    const handleSearch = () => {
        router.push(`/catalog/?q=${query}`)
    }

    return (
        <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
            <div className="flex w-full items-center justify-between gap-1 px-4 lg:gap-2 lg:px-6 py-3">
                <div className="flex items-center  gap-1 min-w-max py-0.5 mr-2">
                    <SidebarTrigger className="-ml-1" />
                    <Separator
                        orientation="vertical"
                        className="mx-1 data-[orientation=vertical]:h-4"
                    />
                    <Link href="/">
                        <TypographyH4 className="hidden sm:block">{APP_NAME}</TypographyH4>
                        <TypographyH4 className={cn("md:hidden", query && 'hidden')}>DJSS</TypographyH4>
                    </Link>
                </div>
                <div className="relative w-full max-w-xl min-w-max">
                    <Input
                        placeholder="Search your design"
                        enterKeyHint="search"
                        className="min-w-max max-w-xl pr-8" // add padding-right for icon
                        // onSubmit={handleSearch}
                        type='search'
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                handleSearch();
                            }
                        }}
                        onChange={(e) => setQuery(e.target.value)}
                        aria-label='Search Designs'
                    />
                    <Search className="absolute right-2 top-1/2 w-5 h-5 -translate-y-1/2 text-muted-foreground cursor-pointer" onClick={handleSearch} />
                </div>

                <div className="hidden sm:flex gap-2">
                    {/* <Button size='sm'>hell</Button> */}
                    <Button

                        className="bg-gradient-to-r from-amber-500 to-rose-500 text-white font-semibold px-6 py-2 rounded-full hover:from-amber-600 hover:to-rose-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                        onClick={() => router.push('/catalog')}
                    >
                        View Catalog
                    </Button>
                    <Link className={cn(buttonVariants({ variant: 'outline' }))} href={`tel:${TEL_NUMBER}`} inputMode="tel">Call Us</Link>
                    {session.status === "loading" ? (
                        <Skeleton className="w-3-" />
                    ) : session.status === "authenticated" && session.data.user?.isAdmin ? (
                        <Button onClick={() => router.push('/admin')}>Admin Dashboard</Button>
                    ) : session.status !== "authenticated" ? (
                        <Button onClick={() => signIn()}>Login</Button>
                    ) : null}

                </div>

            </div>
        </header>

    )
}
