'use client'

import { cn } from '@/lib/utils'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { useUIStore } from '@/store/useStore'

interface DashboardLayoutProps {
  children: React.ReactNode
  className?: string
}

export function DashboardLayout({ children, className }: DashboardLayoutProps) {
  const { sidebarOpen } = useUIStore()
  
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className={cn(
          "hidden md:block fixed inset-y-0 z-50 border-r bg-background transition-all duration-300",
          sidebarOpen ? "w-64" : "w-16"
        )}>
          <Sidebar collapsed={!sidebarOpen} />
        </aside>

        {/* Main Content */}
        <div className={cn(
          "flex flex-col flex-1 transition-all duration-300",
          sidebarOpen ? "md:ml-64" : "md:ml-16"
        )}>
          <Header />
          
          <main className={cn('flex-1 p-6', className)}>
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
