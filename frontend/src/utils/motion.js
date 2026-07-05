// Motion design tokens for healthcare-grade animations
// Calm, reassuring, trustworthy — not flashy or aggressive

const ease = [0.22, 1, 0.36, 1]

// ── Scroll-triggered variants ───────────────────────────────────────────────

export const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
}

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease } },
}

export const slideLeft = {
  hidden: { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease } },
}

export const slideRight = {
  hidden: { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease } },
}

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease } },
}

// Returns a stagger container variant
export const stagger = (delay = 0.08, initial = 0.04) => ({
  hidden: {},
  visible: { transition: { staggerChildren: delay, delayChildren: initial } },
})

// ── Continuous ambient animations ───────────────────────────────────────────

export const float = {
  y: [0, -8, 0],
  transition: { duration: 4.5, repeat: Infinity, ease: 'easeInOut' },
}

export const floatSlow = {
  y: [0, -5, 0],
  transition: { duration: 6.5, repeat: Infinity, ease: 'easeInOut' },
}

export const floatFast = {
  y: [0, -6, 0],
  transition: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' },
}

export const pulseRing = {
  scale: [1, 1.4, 1],
  opacity: [0.35, 0, 0.35],
  transition: { duration: 2.8, repeat: Infinity, ease: 'easeInOut' },
}

export const heartbeat = {
  scale: [1, 1.06, 1, 1.04, 1],
  transition: { duration: 1.6, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1.5 },
}
