import { motion, useReducedMotion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1]

/**
 * FadeUp — fades a section up into view on scroll.
 * Automatically skips animation when prefers-reduced-motion is set.
 */
export function FadeUp({ children, className, delay = 0, ...props }) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className} {...props}>{children}</div>
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease, delay }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

/**
 * FadeStagger — parent container that staggers its FadeItem children.
 */
export function FadeStagger({ children, className, stagger = 0.08, ...props }) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className} {...props}>{children}</div>
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger, delayChildren: 0.04 } },
      }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

/**
 * FadeItem — child of FadeStagger. Fades up with stagger timing.
 */
export function FadeItem({ children, className, ...props }) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className} {...props}>{children}</div>
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 16 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease } },
      }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

/**
 * SlideIn — slides in from left or right on scroll.
 */
export function SlideIn({ children, className, from = 'left', delay = 0, ...props }) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className} {...props}>{children}</div>
  const x = from === 'left' ? -28 : 28
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease, delay }}
      {...props}
    >
      {children}
    </motion.div>
  )
}
