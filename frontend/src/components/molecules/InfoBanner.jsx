import { AlertTriangle, Info, CheckCircle, XCircle, Lightbulb, Heart } from 'lucide-react'
import { cn } from '@/utils/cn'

const variants = {
  info: {
    wrap: 'bg-blue-50 border-blue-200 text-blue-800',
    icon: Info,
    iconColor: 'text-blue-600',
  },
  warning: {
    wrap: 'bg-amber-50 border-amber-200 text-amber-800',
    icon: AlertTriangle,
    iconColor: 'text-amber-600',
  },
  error: {
    wrap: 'bg-red-50 border-red-200 text-red-800',
    icon: XCircle,
    iconColor: 'text-red-600',
  },
  success: {
    wrap: 'bg-green-50 border-green-200 text-green-800',
    icon: CheckCircle,
    iconColor: 'text-green-600',
  },
  tip: {
    wrap: 'bg-rose-50 border-rose-200 text-rose-800',
    icon: Lightbulb,
    iconColor: 'text-rose-600',
  },
  health: {
    wrap: 'bg-sage-50 border-sage-200 text-sage-800',
    icon: Heart,
    iconColor: 'text-sage-600',
  },
}

/**
 * InfoBanner — contextual alert/info/warning/tip banners
 * Props:
 *   variant: 'info' | 'warning' | 'error' | 'success' | 'tip' | 'health'
 *   title?: string
 *   children: ReactNode (the message)
 *   className?: string
 *   icon?: LucideIcon (override default icon)
 */
export function InfoBanner({ variant = 'info', title, children, className, icon }) {
  const config = variants[variant] || variants.info
  const Icon = icon || config.icon

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-2xl border',
        config.wrap,
        className,
      )}
      role={variant === 'error' || variant === 'warning' ? 'alert' : 'note'}
    >
      <Icon className={cn('w-5 h-5 shrink-0 mt-0.5', config.iconColor)} aria-hidden />
      <div className="flex-1 min-w-0">
        {title && (
          <p className="font-semibold text-sm mb-1 leading-snug">{title}</p>
        )}
        <div className="text-sm leading-relaxed">{children}</div>
      </div>
    </div>
  )
}
