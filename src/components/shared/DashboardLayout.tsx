'use client'

import { cn } from '@/lib/utils'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

interface DashboardLayoutProps {
  children: React.ReactNode
  className?: string
}

export function DashboardLayout({ children, className }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block fixed inset-y-0 z-50 w-64 border-r bg-background">
          <Sidebar />
        </aside>

        {/* Main Content */}
        <div className="flex flex-col flex-1 md:ml-64">
          <Header />
          
          <main className={cn('flex-1 p-6', className)}>
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
