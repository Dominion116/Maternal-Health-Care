import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const OFFSET = 90

export function ScrollRestorer() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    const mainEl = document.getElementById('main-content')
    const adminEl = document.getElementById('admin-scroll')

    let scroller = window
    if (mainEl) {
      const style = window.getComputedStyle(mainEl)
      if (style.overflowY === 'auto' || style.overflowY === 'scroll') {
        scroller = mainEl
      }
    } else if (adminEl) {
      scroller = adminEl
    }

    const scrollTo = (y, behavior = 'instant') =>
      scroller.scrollTo({ top: y, behavior })

    if (hash) {
      const id = hash.slice(1)
      let attempts = 0
      const tryScroll = () => {
        const el = document.getElementById(id)
        if (el) {
          const base = scroller === window ? window.scrollY : scroller.scrollTop
          scrollTo(el.getBoundingClientRect().top + base - OFFSET, 'smooth')
        } else if (attempts++ < 8) {
          setTimeout(tryScroll, 100)
        }
      }
      setTimeout(tryScroll, 50)
    } else {
      scrollTo(0)
    }
  }, [pathname, hash])

  return null
}
