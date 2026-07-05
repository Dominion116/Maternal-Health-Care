import { useState, useEffect } from 'react'
import { List } from 'lucide-react'
import { cn } from '@/utils/cn'

/**
 * TableOfContents — scroll-aware TOC with responsive rendering.
 *
 * variant:
 *   "full"    — renders both mobile select AND desktop sticky nav (legacy, avoids duplicate issues)
 *   "mobile"  — renders ONLY the mobile <select> dropdown (use inside content column)
 *   "desktop" — renders ONLY the sticky sidebar nav (use as a flex/grid sibling)
 */
export function TableOfContents({ sections, title = 'On this page', variant = 'full' }) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? '')

  useEffect(() => {
    function onScroll() {
      let current = sections[0]?.id ?? ''
      for (const s of sections) {
        const el = document.getElementById(s.id)
        if (el && el.getBoundingClientRect().top <= 120) {
          current = s.id
        }
      }
      setActiveId(current)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [sections])

  function scrollTo(id) {
    const el = document.getElementById(id)
    if (!el) return
    const y = el.getBoundingClientRect().top + window.scrollY - 90
    window.scrollTo({ top: y, behavior: 'smooth' })
  }

  const mobileEl = (
    <div className="mb-8">
      <label
        htmlFor="toc-select"
        className="block text-xs font-semibold text-text-muted uppercase tracking-widest mb-2"
      >
        Jump to section
      </label>
      <select
        id="toc-select"
        value={activeId}
        onChange={e => scrollTo(e.target.value)}
        className="w-full h-11 px-3 rounded-xl border border-border bg-white text-sm text-text-primary focus:outline-2 focus:outline-rose-500"
      >
        {sections.map((s, i) => (
          <option key={s.id} value={s.id}>
            {i + 1}. {s.title}
          </option>
        ))}
      </select>
    </div>
  )

  const desktopEl = (
    <nav aria-label="Table of contents">
      <p className="flex items-center gap-2 text-xs font-semibold text-text-muted uppercase tracking-widest mb-4">
        <List className="w-3.5 h-3.5" aria-hidden />
        {title}
      </p>
      <ol className="space-y-0.5 border-l-2 border-border">
        {sections.map((s, i) => (
          <li key={s.id}>
            <button
              onClick={() => scrollTo(s.id)}
              className={cn(
                'block text-left w-full text-sm py-1.5 px-3 rounded-r-lg transition-all border-l-2 -ml-0.5',
                activeId === s.id
                  ? 'text-rose-700 font-semibold border-rose-500 bg-rose-50'
                  : 'text-text-muted border-transparent hover:text-text-primary hover:border-gray-300 hover:bg-gray-50',
              )}
            >
              <span className="text-xs opacity-50 mr-1">{i + 1}.</span>
              {s.title}
            </button>
          </li>
        ))}
      </ol>
    </nav>
  )

  if (variant === 'mobile') return mobileEl
  if (variant === 'desktop') return desktopEl

  // "full" — both, with responsive visibility (legacy single-instance usage)
  return (
    <>
      <div className="lg:hidden">{mobileEl}</div>
      <div className="hidden lg:block">{desktopEl}</div>
    </>
  )
}
