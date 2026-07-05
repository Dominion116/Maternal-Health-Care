import { cn } from '@/utils/cn'
import { Badge } from '@/components/atoms/Badge'

/**
 * PageHero — full-width hero/header for public and app pages
 * Props:
 *   badge?: string
 *   badgeVariant?: string
 *   icon?: LucideIcon
 *   iconBg?: string (tailwind class for icon background)
 *   title: string
 *   description?: string
 *   meta?: string (small caption below description, e.g. "Last updated: May 2026")
 *   gradient?: boolean
 *   children?: ReactNode (extra content below description)
 *   center?: boolean
 *   className?: string
 */
export function PageHero({
  badge,
  badgeVariant = 'rose',
  icon: Icon,
  iconBg = 'bg-rose-100',
  iconColor = 'text-rose-600',
  title,
  description,
  meta,
  gradient = false,
  children,
  center = true,
  className,
}) {
  return (
    <div
      className={cn(
        'px-4 py-16 md:py-20',
        gradient && 'bg-gradient-to-b from-rose-50/80 to-transparent',
        className,
      )}
    >
      <div
        className={cn(
          'max-w-4xl mx-auto',
          center && 'text-center',
        )}
      >
        {badge && (
          <div className={cn('mb-4', center && 'flex justify-center')}>
            <Badge variant={badgeVariant} size="md">{badge}</Badge>
          </div>
        )}

        {Icon && (
          <div className={cn('mb-5', center && 'flex justify-center')}>
            <span
              className={cn(
                'w-16 h-16 rounded-2xl flex items-center justify-center',
                iconBg,
              )}
              aria-hidden
            >
              <Icon className={cn('w-8 h-8', iconColor)} />
            </span>
          </div>
        )}

        <h1 className="font-display font-bold text-3xl md:text-4xl text-text-primary mb-4 leading-tight">
          {title}
        </h1>

        {description && (
          <p
            className={cn(
              'text-lg text-text-secondary leading-relaxed',
              center && 'mx-auto max-w-2xl',
            )}
          >
            {description}
          </p>
        )}

        {meta && (
          <p className="text-sm text-text-muted mt-3">{meta}</p>
        )}

        {children && (
          <div className="mt-6">{children}</div>
        )}
      </div>
    </div>
  )
}
