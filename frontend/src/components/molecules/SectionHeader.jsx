import { cn } from '@/utils/cn'

/**
 * SectionHeader — consistent section title with icon, number, and description
 * Props:
 *   number?: number | string  — optional section number
 *   icon?: LucideIcon
 *   title: string
 *   description?: string
 *   className?: string
 *   size?: 'sm' | 'md' | 'lg'
 */
export function SectionHeader({ number, icon: Icon, title, description, className, size = 'md' }) {
  return (
    <div className={cn('flex items-start gap-4', className)}>
      {(number !== undefined || Icon) && (
        <div className="shrink-0 flex flex-col items-center gap-1 pt-0.5">
          {number !== undefined && (
            <span className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 text-sm font-bold flex items-center justify-center shrink-0">
              {number}
            </span>
          )}
          {Icon && number === undefined && (
            <span className="w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
              <Icon className="w-5 h-5 text-rose-600" aria-hidden />
            </span>
          )}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <h2
          className={cn(
            'font-display font-bold text-text-primary leading-tight',
            size === 'lg' && 'text-2xl',
            size === 'md' && 'text-xl',
            size === 'sm' && 'text-base',
          )}
        >
          {title}
        </h2>
        {description && (
          <p className="text-text-secondary leading-relaxed mt-1.5 text-sm">{description}</p>
        )}
      </div>
    </div>
  )
}
