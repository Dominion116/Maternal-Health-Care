import { cn } from '@/utils/cn'

const variants = {
  rose:      'bg-rose-100 text-rose-800',
  sage:      'bg-sage-100 text-sage-800',
  amber:     'bg-amber-100 text-amber-800',
  success:   'bg-success-light text-success-dark',
  warning:   'bg-warning-light text-warning-dark',
  error:     'bg-error-light text-error-dark',
  info:      'bg-info-light text-info-dark',
  emergency: 'bg-emergency-light text-emergency-dark',
  neutral:   'bg-gray-100 text-gray-700',
}

const sizes = {
  sm: 'text-xs px-2 py-0.5 rounded-md',
  md: 'text-xs px-2.5 py-1 rounded-lg',
  lg: 'text-sm px-3 py-1 rounded-lg',
}

export function Badge({ variant = 'rose', size = 'md', dot = false, className, children }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 font-medium', variants[variant], sizes[size], className)}>
      {dot && (
        <span className={cn('w-1.5 h-1.5 rounded-full', {
          'bg-rose-500': variant === 'rose',
          'bg-sage-500': variant === 'sage',
          'bg-amber-500': variant === 'amber',
          'bg-success': variant === 'success',
          'bg-warning': variant === 'warning',
          'bg-error': variant === 'error',
          'bg-emergency': variant === 'emergency',
          'bg-gray-400': variant === 'neutral',
        })} aria-hidden />
      )}
      {children}
    </span>
  )
}
