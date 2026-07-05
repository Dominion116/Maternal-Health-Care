import { Outlet } from 'react-router-dom'
import { AppSidebar } from '@/components/organisms/AppSidebar'
import { AppBottomNav } from '@/components/organisms/AppBottomNav'
import { ScrollRestorer } from '@/components/atoms/ScrollRestorer'
import { useUIStore } from '@/store/useUIStore'
import { Menu } from 'lucide-react'
import { cn } from '@/utils/cn'

export function AppLayout() {
  const { toggleSidebar, sidebarCollapsed } = useUIStore()

  return (
    <div className="min-h-dvh flex bg-warm-white">
      <AppSidebar />

      {/* Content area — shifts right based on sidebar state */}
      <div
        className={cn(
          'flex-1 flex flex-col min-w-0 transition-[margin] duration-300 ease-in-out',
          sidebarCollapsed ? 'md:ml-16' : 'md:ml-64',
        )}
      >
        {/* Mobile top bar */}
        <header className="md:hidden sticky top-0 z-20 bg-white border-b border-border px-4 h-14 flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg text-text-muted hover:bg-rose-50 hover:text-rose-700 transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-bold text-lg font-display text-text-primary">
            Mama<span className="text-rose-700">Guide</span>
          </span>
        </header>

        <ScrollRestorer />
        <main
          className="flex-1 pb-20 md:pb-0 overflow-auto"
          id="main-content"
          tabIndex={-1}
        >
          <Outlet />
        </main>
      </div>

      <AppBottomNav />
    </div>
  )
}
