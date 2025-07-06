'use client'

import { useAuthStore, useUIStore } from '@/store/useStore'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MobileSidebar } from './Sidebar'
import { User, LogOut, Settings, Menu } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { vendorAuthApi } from '@/lib/api/client'
import { toast } from 'sonner'

export function Header() {
  const { user, store, clearAuth } = useAuthStore()
  const { toggleSidebar } = useUIStore()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await vendorAuthApi.logout()
      clearAuth()
      router.push('/login')
      toast.success('Logged out successfully')
    } catch (error) {
      console.error('Logout error:', error)
      // Clear auth even if API call fails
      clearAuth()
      router.push('/login')
    }
  }

  const userInitials = user 
    ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() || user.email[0].toUpperCase()
    : 'U'

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <MobileSidebar />
          
          {/* Desktop Sidebar Toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="hidden md:flex"
            onClick={toggleSidebar}
          >
            <Menu className="h-4 w-4" />
          </Button>
          
          <div className="hidden md:flex items-center space-x-2">
            <h1 className="text-xl font-semibold">
              RENART Vendor Panel
            </h1>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" alt={user?.firstName || 'User'} />
                    <AvatarFallback className="text-xs">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.firstName && user?.lastName 
                        ? `${user.firstName} ${user.lastName}`
                        : user?.email
                      }
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                    {store && (
                      <p className="text-xs leading-none text-muted-foreground">
                        {store.name}
                      </p>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <button 
                    className="w-full cursor-pointer"
                    onClick={() => router.push('/store-settings')}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Store Settings</span>
                  </button>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <button 
                    className="w-full cursor-pointer"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </div>
    </header>
  )
}
