'use client'

import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { SideBarNav } from '@/components/layout/side-bar'
import { NotificationCenter } from '@/components/notification-center'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { User, Settings, LogOut } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { signOut } from 'next-auth/react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session } = useSession()

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">  
        <SideBarNav />     
        <div className="flex-1 flex flex-col">
          <header className="border-b px-6 py-3 flex items-center justify-between">
            <div className="flex items-center">
              <SidebarTrigger />
              <h2 className="ml-4 text-lg font-semibold">MTM Document Management</h2>
            </div>
            <div className="flex items-center gap-4">
              <NotificationCenter />
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={session?.user?.image || ''} />
                      <AvatarFallback>
                        {session?.user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{session?.user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{session?.user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => window.location.href = '/dashboard/settings'}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => window.location.href = '/dashboard/profile'}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto bg-muted/10">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}