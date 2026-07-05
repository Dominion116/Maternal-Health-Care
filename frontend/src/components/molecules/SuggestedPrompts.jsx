import { cn } from '@/utils/cn'
import { Sparkles } from 'lucide-react'

export function SuggestedPrompts({ prompts = [], onSelect, className }) {
  if (!prompts.length) return null

  return (
    <div className={cn('px-4 pb-3', className)}>
      <div className="flex items-center gap-1.5 mb-2.5">
        <Sparkles className="w-3.5 h-3.5 text-amber-500" aria-hidden />
        <p className="text-xs font-medium text-text-muted">Suggested questions</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {prompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => onSelect(prompt)}
            className={cn(
              'text-xs px-3 py-2 rounded-full border border-rose-200',
              'bg-white text-rose-700 font-medium',
              'hover:bg-rose-50 hover:border-rose-300 hover:shadow-sm',
              'active:bg-rose-100 transition-all duration-150',
              'text-left leading-snug max-w-[200px]'
            )}
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  )
}
