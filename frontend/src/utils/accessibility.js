import { LOCAL_STORAGE_KEYS } from './constants'

// Accessibility is a per-device preference, so it lives in localStorage
// (not the user profile) and is applied to <html> as a11y-* classes that
// index.css styles against.

export const DEFAULT_ACCESSIBILITY = {
  fontSize: 'medium', // 'small' | 'medium' | 'large' | 'xl'
  highContrast: false,
  reduceMotion: false,
  screenReader: false,
}

export function loadAccessibility() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESSIBILITY)
    if (!raw) return { ...DEFAULT_ACCESSIBILITY }
    return { ...DEFAULT_ACCESSIBILITY, ...JSON.parse(raw) }
  } catch {
    return { ...DEFAULT_ACCESSIBILITY }
  }
}

export function applyAccessibility(settings) {
  const root = document.documentElement
  for (const size of ['small', 'medium', 'large', 'xl']) {
    root.classList.toggle(`a11y-font-${size}`, settings.fontSize === size)
  }
  root.classList.toggle('a11y-high-contrast', !!settings.highContrast)
  root.classList.toggle('a11y-reduce-motion', !!settings.reduceMotion)
  root.classList.toggle('a11y-screen-reader', !!settings.screenReader)
}

export function saveAccessibility(settings) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEYS.ACCESSIBILITY, JSON.stringify(settings))
  } catch {
    // storage full/blocked — still apply for this session
  }
  applyAccessibility(settings)
}
