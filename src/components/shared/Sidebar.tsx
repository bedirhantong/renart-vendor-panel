'use client'

import { cn } from '@/lib/utils'
import { useUIStore, useAuthStore } from '@/store/useStore'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { 
  LayoutDashboard, 
  Package, 
  Settings, 
  Menu,
  X,
  Store,
  BarChart3,
  PlusCircle
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Products',
    href: '/products',
    icon: Package,
  },
  {
    name: 'Add Product',
    href: '/products/new',
    icon: PlusCircle,
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
  },
  {
    name: 'Store Settings',
    href: '/store-settings',
    icon: Settings,
  },
]

interface SidebarProps {
  className?: string
  collapsed?: boolean
}

export function Sidebar({ className, collapsed = false }: SidebarProps) {
  const pathname = usePathname()
  const { store } = useAuthStore()

  return (
    <div className={cn('pb-12 min-h-screen', className)}>
      <div className="space-y-4 py-4">
        {/* Logo/Store Name */}
        <div className="px-3 py-2">
          <div className={cn(
            "flex items-center",
            collapsed ? "justify-center" : "space-x-2"
          )}>
            <Store className="h-6 w-6" />
            {!collapsed && (
              <h2 className="text-lg font-semibold tracking-tight">
                {store?.name || 'RENART Store'}
              </h2>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className={cn(
          collapsed ? "px-2" : "px-3",
          "py-2"
        )}>
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Button
                  key={item.name}
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={cn(
                    'w-full',
                    collapsed ? 'justify-center px-2' : 'justify-start',
                    isActive && 'bg-secondary'
                  )}
                  asChild
                  title={collapsed ? item.name : undefined}
                >
                  <Link href={item.href}>
                    <item.icon className={cn(
                      "h-4 w-4",
                      !collapsed && "mr-2"
                    )} />
                    {!collapsed && item.name}
                  </Link>
                </Button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export function MobileSidebar() {
  const { sidebarOpen, setSidebarOpen } = useUIStore()

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="sm"
        className="md:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Open sidebar</span>
      </Button>

      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <Sidebar />
        </SheetContent>
      </Sheet>
    </>
  )
}
