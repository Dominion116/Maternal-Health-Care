import { Link, useLocation } from 'react-router-dom'
import { MessageCircle, BookOpen, LayoutDashboard, User } from 'lucide-react'
import { cn } from '@/utils/cn'
import { ROUTES } from '@/utils/constants'

const tabs = [
  { icon: LayoutDashboard, label: 'Home', href: ROUTES.DASHBOARD },
  { icon: MessageCircle, label: 'Chat', href: ROUTES.CHAT },
  { icon: BookOpen, label: 'Learn', href: ROUTES.EDUCATION },
  { icon: User, label: 'Profile', href: ROUTES.PROFILE },
]

export function AppBottomNav() {
  const location = useLocation()

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-border z-30 safe-bottom"
      aria-label="Bottom navigation"
    >
      <ul className="flex" role="list">
        {tabs.map(tab => {
          const active =
            location.pathname === tab.href || location.pathname.startsWith(tab.href + '/')
          return (
            <li key={tab.href} className="flex-1">
              <Link
                to={tab.href}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 py-3 transition-colors',
                  active ? 'text-rose-700' : 'text-text-muted hover:text-text-secondary'
                )}
                aria-current={active ? 'page' : undefined}
                aria-label={tab.label}
              >
                <tab.icon className={cn('w-5 h-5', active && 'stroke-[2.5]')} aria-hidden />
                <span className={cn('text-xs', active ? 'font-semibold' : 'font-normal')}>
                  {tab.label}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
