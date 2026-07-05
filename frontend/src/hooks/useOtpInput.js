import { useState, useRef, useCallback, createRef } from 'react'

export function useOtpInput(length = 6) {
  const [values, setValues] = useState(() => Array(length).fill(''))
  const inputRefs = useRef(Array.from({ length }, () => createRef()))

  const focusAt = (index) =>
    inputRefs.current[index]?.current?.focus()

  const handleChange = useCallback((index, raw) => {
    const digit = raw.replace(/\D/g, '').slice(-1)
    setValues(prev => {
      const next = [...prev]
      next[index] = digit
      return next
    })
    if (digit && index < length - 1) focusAt(index + 1)
  }, [length])

  const handleKeyDown = useCallback((index, e) => {
    if (e.key === 'Backspace') {
      e.preventDefault()
      setValues(prev => {
        const next = [...prev]
        if (prev[index]) {
          next[index] = ''
        } else if (index > 0) {
          next[index - 1] = ''
          focusAt(index - 1)
        }
        return next
      })
    } else if (e.key === 'ArrowLeft' && index > 0) {
      focusAt(index - 1)
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      focusAt(index + 1)
    }
  }, [length])

  const handlePaste = useCallback((e) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    if (!text) return
    const next = Array(length).fill('')
    for (let i = 0; i < text.length; i++) next[i] = text[i]
    setValues(next)
    focusAt(Math.min(text.length, length - 1))
  }, [length])

  const reset = useCallback(() => {
    setValues(Array(length).fill(''))
    focusAt(0)
  }, [length])

  const otp = values.join('')
  const isComplete = values.every(v => v !== '')

  return {
    values,
    refs: inputRefs,
    otp,
    isComplete,
    handleChange,
    handleKeyDown,
    handlePaste,
    reset,
  }
}
