import { useState, useEffect, useCallback } from 'react'

export function useResendCooldown(storageKey, cooldownSeconds = 60) {
  function getRemaining() {
    try {
      const expiry = parseInt(localStorage.getItem(storageKey), 10)
      if (!expiry) return 0
      return Math.max(0, Math.ceil((expiry - Date.now()) / 1000))
    } catch {
      return 0
    }
  }

  const [secondsLeft, setSecondsLeft] = useState(getRemaining)

  // Tick down every second while cooldown is active
  useEffect(() => {
    if (secondsLeft <= 0) return
    const id = setTimeout(() => setSecondsLeft(getRemaining()), 1000)
    return () => clearTimeout(id)
  }, [secondsLeft, storageKey])

  const startCooldown = useCallback(() => {
    const expiry = Date.now() + cooldownSeconds * 1000
    try { localStorage.setItem(storageKey, String(expiry)) } catch {}
    setSecondsLeft(cooldownSeconds)
  }, [storageKey, cooldownSeconds])

  return {
    secondsLeft,
    canResend: secondsLeft === 0,
    startCooldown,
  }
}
