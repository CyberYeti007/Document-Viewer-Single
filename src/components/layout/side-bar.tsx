import { signOut, useSession } from 'next-auth/react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  LogOut,
  ChevronDown,
} from "lucide-react"
import { menuPageItems, adminPageItems } from "@/lib/page-data"

export const SideBarNav = () => {
  const {data: session, status } = useSession({
    required: true,
  })

  const userInitials = session?.user?.name
  ?.split(' ')
  .map((n) => n[0])
  .join('')
  .toUpperCase() || 'U'

  var menuItems = menuPageItems.filter(item => item.role.includes(session?.user?.accessType || "User") ||
                                              (item.role.includes("approver") && session?.user?.isApprover) ||
                                              (item.role.includes("fileOwner") && session?.user?.isFileOwner))
  var adminItems = adminPageItems.filter(item => item.role.includes(session?.user?.accessType || "User"))

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }
  return (
    <Sidebar>
      <SidebarHeader className="border-b px-6 py-4">
        <h2 className="text-lg font-semibold">Mazda Toyota Manufacturing</h2>
        <p className="text-sm text-muted-foreground">Management System</p>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild>
                    <a href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        {adminItems.length > 0 ? (
        <SidebarGroup>
          <SidebarGroupLabel>Administration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild>
                    <a href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        ) : (<></>)}
      </SidebarContent>
      
      <SidebarFooter className="border-t p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="group/avatar w-full justify-start has-[>svg]:px-2 cursor-pointer">
              <Avatar  id="me" className="h-8 w-8 mr-2">
                <AvatarImage src={session?.user?.image || undefined} />
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start flex-1">
                <span className="text-sm font-medium w-34 text-left relative overflow-hidden">
                  {(session?.user?.name?.split(' ')[0] + ' ' + session?.user?.name?.split(' ')[1][0].toUpperCase()) || 'User'}
                  <div className="absolute inset-y-0 right-0 w-6 bg-gradient-to-r from-transparent to-slate-50 group-hover/avatar:to-accent transition-colors duration-300"></div>
                </span>
                <span className="text-xs text-muted-foreground w-34 text-left relative overflow-hidden">
                  {session?.user?.email}
                  <div className="absolute inset-y-0 right-0 w-6 bg-gradient-to-r from-transparent to-slate-50 group-hover/avatar:to-accent transition-colors duration-300"></div>
                </span>
              </div>
              <ChevronDown className="h-4 w-4 ml-auto" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Preferences</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-red-600"
              onClick={() => signOut({ callbackUrl: '/login' })}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  )
}