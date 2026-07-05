import { cn } from '@/utils/cn'

export function Spinner({ size = 'md', className }) {
  const sizes = {
    xs:  'w-3 h-3 border-[1.5px]',
    sm:  'w-4 h-4 border-2',
    md:  'w-6 h-6 border-2',
    lg:  'w-8 h-8 border-[3px]',
    xl:  'w-12 h-12 border-4',
  }

  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn(
        'inline-block rounded-full border-rose-200 border-t-rose-700 animate-spin',
        sizes[size],
        className
      )}
    />
  )
}

export function PageLoader() {
  return (
    <div
      className="fixed inset-0 bg-warm-white/80 backdrop-blur-sm z-50 flex items-center justify-center"
      role="status"
      aria-label="Loading page"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-brand-gradient flex items-center justify-center shadow-rose animate-pulse-soft">
          <span className="text-white text-2xl font-bold">M</span>
        </div>
        <p className="text-sm text-text-secondary">Loading...</p>
      </div>
    </div>
  )
}

export function SkeletonLine({ className }) {
  return <div className={cn('skeleton h-4', className)} />
}

export function SkeletonBlock({ className }) {
  return <div className={cn('skeleton', className)} />
}
