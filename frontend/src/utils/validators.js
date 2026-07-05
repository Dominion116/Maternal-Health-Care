export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function isValidPhone(phone) {
  return /^(\+234|0)[789][01]\d{8}$/.test(phone.replace(/\s/g, ''))
}

export function isStrongPassword(password) {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password)
  )
}

export function getPasswordStrength(password) {
  if (!password) return { score: 0, label: '', color: '' }
  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[A-Z]/.test(password)) score++
  if (/[a-z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  if (score <= 2) return { score, label: 'Weak', color: 'bg-red-500' }
  if (score <= 4) return { score, label: 'Fair', color: 'bg-amber-500' }
  if (score === 5) return { score, label: 'Good', color: 'bg-blue-500' }
  return { score, label: 'Strong', color: 'bg-green-500' }
}

export function isEmergencyMessage(text) {
  const lower = text.toLowerCase()
  const emergencyWords = [
    'bleeding', 'severe pain', 'can\'t breathe', 'cannot breathe',
    'baby not moving', 'not moving', 'unconscious', 'faint', 'seizure',
    'convulsion', 'water broke', 'emergency', 'help me', 'dying',
    'hospital now', 'bleed', 'heavy bleeding',
  ]
  return emergencyWords.some(word => lower.includes(word))
}
