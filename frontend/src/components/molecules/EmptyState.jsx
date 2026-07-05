import { cn } from '@/utils/cn'

/**
 * EmptyState — meaningful empty state with icon, message, and CTA
 * Props:
 *   icon: LucideIcon
 *   title: string
 *   description: string
 *   action?: ReactNode (button or link)
 *   className?: string
 *   compact?: boolean
 */
export function EmptyState({ icon: Icon, title, description, action, className, compact = false }) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        compact ? 'py-10 px-4' : 'py-16 px-6',
        className,
      )}
    >
      <div
        className={cn(
          'rounded-2xl flex items-center justify-center mb-4',
          compact ? 'w-14 h-14 bg-rose-100' : 'w-20 h-20 bg-rose-50',
        )}
        aria-hidden
      >
        <Icon className={cn('text-rose-400', compact ? 'w-7 h-7' : 'w-10 h-10')} />
      </div>

      <h3
        className={cn(
          'font-semibold text-text-primary mb-2',
          compact ? 'text-base' : 'text-lg',
        )}
      >
        {title}
      </h3>
      <p
        className={cn(
          'text-text-secondary leading-relaxed mb-6',
          compact ? 'text-xs max-w-xs' : 'text-sm max-w-sm',
        )}
      >
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  )
}
