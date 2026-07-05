import { cn } from '@/utils/cn'

export function Card({ className, hover = false, padding = true, children, ...props }) {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl border border-border shadow-sm',
        padding && 'p-5',
        hover && 'transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className, children }) {
  return <div className={cn('mb-4', className)}>{children}</div>
}

export function CardTitle({ className, children }) {
  return (
    <h3 className={cn('text-base font-semibold text-text-primary', className)}>
      {children}
    </h3>
  )
}

export function CardDescription({ className, children }) {
  return (
    <p className={cn('text-sm text-text-secondary mt-1', className)}>
      {children}
    </p>
  )
}

export function CardFooter({ className, children }) {
  return (
    <div className={cn('mt-4 pt-4 border-t border-border flex items-center gap-3', className)}>
      {children}
    </div>
  )
}
