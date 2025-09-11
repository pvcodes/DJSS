import { Gem, BookOpen, CreditCard, LogOut } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { useSidebar } from "@/components/ui/sidebar"
import { ModeToggle } from "./theme-toggle"
import { Button } from "./ui/button"
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

// Menu items for jewellery business
const items = [
  {
    title: "Design Catalog",
    url: "/catalog",
    icon: Gem,
    description: "Browse jewellery designs"
  },
  {
    title: "Khata Book",
    url: "/khata",
    icon: BookOpen,
    description: "Customer accounts & records"
  },
  {
    title: "Business Cards",
    url: "/business-cards",
    icon: CreditCard,
    description: "Manage business cards"
  },
]

export function AppSidebar() {
  const { setOpenMobile } = useSidebar()
  const router = useRouter()

  const handleNavigation = (url: string) => {
    // Close mobile sidebar when navigating
    setOpenMobile(false)
    // Navigate to the URL
    router.push(url)
  }

  const handleSignOut = () => {
    // Close sidebar before signing out
    setOpenMobile(false)
    signOut()
  }

  return (
    <Sidebar className="border-r border-border/40">
      {/* Header Section */}
      <SidebarHeader className="border-b border-border/40 p-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg">
            <Gem className="w-5 h-5 text-white" />
          </div>
          <div>
            <SidebarGroupLabel className="text-base font-bold text-foreground mb-0">
              DJSS Jewellers
            </SidebarGroupLabel>
            <p className="text-xs text-muted-foreground">Premium Jewellery</p>
          </div>
        </div>
      </SidebarHeader>

      {/* Main Content */}
      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Main Menu
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-2">
            <SidebarMenu className="space-y-1">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    className="w-full h-auto min-h-[60px] justify-start gap-3 px-3 py-3 rounded-lg hover:bg-accent/80 hover:text-accent-foreground transition-all duration-200 group cursor-pointer"
                    onClick={() => handleNavigation(item.url)}
                    disabled={item.url != '/catalog'}
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 group-hover:bg-primary/20 transition-colors flex-shrink-0">
                      <item.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex flex-col items-start text-left flex-1 min-w-0">
                      <span className="text-sm font-medium leading-tight">{item.title}</span>
                      <span className="text-xs text-muted-foreground leading-tight mt-0.5">{item.description}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer Section */}
      <SidebarFooter className="border-t border-border/40 p-4 space-y-2">
        {/* Theme Toggle */}
        <div className="flex items-center justify-between px-2">
          <span className="text-sm font-medium text-muted-foreground">Theme</span>
          <ModeToggle />
        </div>

        {/* Sign Out Button */}
        <Button
          onClick={handleSignOut}
          variant="outline"
          size="sm"
          className="w-full justify-start gap-2 hover:bg-destructive hover:text-destructive-foreground transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}