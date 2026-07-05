import { cn } from '@/utils/cn'

/**
 * Centralised page container.
 *
 * size="app"    → max-w-4xl  (pages inside AppLayout / AdminLayout — sidebar consumes space)
 * size="public" → max-w-6xl  (public-facing pages with no sidebar)
 * size="auth"   → max-w-md   (auth forms — narrow for focus)
 * size="wide"   → max-w-5xl  (mid-range, e.g. some admin pages)
 */
export function PageContainer({ children, className, size = 'app', noPadY = false }) {
  return (
    <div
      className={cn(
        'mx-auto w-full px-4',
        !noPadY && 'py-6',
        size === 'app' && 'max-w-4xl',
        size === 'public' && 'max-w-6xl',
        size === 'auth' && 'max-w-md',
        size === 'wide' && 'max-w-5xl',
        className,
      )}
    >
      {children}
    </div>
  )
}
