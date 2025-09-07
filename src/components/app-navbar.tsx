import { ModeToggle } from "./theme-toggle"
import { TypographyH3 } from "./typography"
import { SidebarTrigger } from "./ui/sidebar"
import { buttonVariants } from "./ui/button"
import Link from "next/link"
import { useSession } from "next-auth/react"

export default function Navbar() {
    const session = useSession()
    return (
        <div className="w-full flex items-center justify-between p-2 shadow-sm border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            {/* Left section - Logo and Sidebar */}
            <div className="flex items-center gap-3">
                <SidebarTrigger />
                <TypographyH3>
                    DJSS Jewellers
                </TypographyH3>
            </div>

            {/* Right section - Actions */}
            <div className="flex items-center gap-2">
                {
                    !session.data?.user &&
                    <Link
                        href="/signin"
                        className={buttonVariants({ variant: 'secondary', size: 'sm' })}
                    >
                        Sign In
                    </Link>

                }
                {
                    session.data?.user.isAdmin && <Link href='/admin'
                        className={buttonVariants({ size: 'sm' })}

                    >Admin Dashboard</Link>
                }
                <ModeToggle />
            </div>
        </div >
    )
}