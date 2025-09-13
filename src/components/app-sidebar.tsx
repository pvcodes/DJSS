import { Gem, User2, ChevronUp, DiamondIcon, LogInIcon, ChevronRightIcon, BoxesIcon } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarMenuSub,
} from "@/components/ui/sidebar"
import { useSidebar } from "@/components/ui/sidebar"
import { ModeToggle } from "./theme-toggle"
import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import Link from "next/link"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible"
import { getAllCategories } from "@/actions/catalog"
import { useEffect, useState } from "react"
import { Category } from "@prisma/client"
import { cn } from "@/lib/utils"
import { APP_NAME } from "@/lib/config"

// Menu items for jewellery business
const items = [
  {
    title: "Design Catalog",
    url: "/catalog",
    icon: Gem,
    description: "Browse jewellery designs"
  },
]

export function AppSidebar() {
  const { setOpenMobile, setOpen, open: sidebarOpen } = useSidebar()
  const router = useRouter()
  const { status: authStatus, data } = useSession()

  const [categories, setCategories] = useState<Array<Category>>()
  const [categoriesCollapsibleOpen, setCategoriesCollapsibleOpen] = useState<boolean>(true)

  const handleCategoriesCollapsible = () => setCategoriesCollapsibleOpen(!categoriesCollapsibleOpen)


  useEffect(() => {
    async function getData() {
      try {
        // setLoading(true);
        const fetchedData = await getAllCategories();
        setCategories(fetchedData);
      } catch {
      } finally {
      }
    }
    getData();
  }, []);

  const handleNavigation = (url: string) => {
    // Close mobile sidebar when navigating
    setOpenMobile(false)
    router.push(url)
  }

  return (
    <Sidebar variant='inset' collapsible='icon'>
      {/* Header Section */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/">
                <DiamondIcon className="!size-5" />
                <span className="text-base font-semibold">{APP_NAME}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Main Content */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu >
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => handleNavigation(item.url)}
                    asChild
                  >
                    <div>
                      <item.icon className="w-4 h-4 text-primary" />
                      <span>{item.title}</span>
                      {/* <span className="text-xs text-muted-foreground leading-tight mt-0.5">{item.description}</span> */}
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <Collapsible defaultOpen open={categoriesCollapsibleOpen} onOpenChange={handleCategoriesCollapsible}>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild >
                    {/* <SidebarMenuButton /> */}
                    <SidebarMenuButton className="flex justify-between" onClick={() => setOpen(true)} >
                      <div className="flex">
                        <BoxesIcon className="!size-5 mr-1" />
                        <span>Categories</span>
                      </div>
                      <ChevronRightIcon className={cn("transform transition-transform duration-300", categoriesCollapsibleOpen ? 'rotate-90' : 'rotate-0')} />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {categories?.map((item) => (
                        <SidebarMenuItem key={item.id}>
                          <SidebarMenuButton
                            onClick={() => handleNavigation(`/catalog?categories=${item.name.toLowerCase()}`)}
                          // asChild
                          >
                            <div>
                              {/* <item.icon className="w-4 h-4 text-primary" /> */}
                              <span>{item.name}</span>
                              {/* <span className="text-xs text-muted-foreground leading-tight mt-0.5">{item.description}</span> */}
                            </div>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer Section */}
      <SidebarFooter >
        <SidebarMenu>
          {/* <SidebarMenuItem>
            <SidebarMenuButton>
              <div>
                <ModeToggle variant={null} /> Toggle Theme
                <div className="ml-auto"></div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem> */}
          <SidebarMenuItem>
            {
              authStatus === 'authenticated' ?
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton>
                      <User2 /> {data.user.name}
                      <ChevronUp className="ml-auto" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    side="top"
                    className="w-[--radix-popper-anchor-width]"
                  >
                    <DropdownMenuItem>
                      <span>Account</span>
                    </DropdownMenuItem>
                    {/* <DropdownMenuItem>
                      <span>Billing</span>
                    </DropdownMenuItem> */}
                    <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/' })}>
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu> :
                <SidebarMenuButton onClick={() => handleNavigation('/signin')} variant='outline'><LogInIcon />Login</SidebarMenuButton>
            }
          </SidebarMenuItem>
          {sidebarOpen && <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:!p-1.5 pl-2"
              asChild
            >
              <ModeToggle />
            </SidebarMenuButton>
          </SidebarMenuItem>}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar >
  )
}