export function formatTime(date) {
  return new Date(date).toLocaleTimeString('en-NG', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function formatRelativeTime(date) {
  const now = new Date()
  const d = new Date(date)
  const diffMs = now - d
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return formatDate(date)
}

export function truncate(text, maxLength = 100) {
  if (!text || text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '…'
}

export function capitalize(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export function getInitials(name) {
  if (!name) return '??'
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(n => n[0].toUpperCase())
    .join('')
}

export function formatConfidence(score) {
  if (score >= 0.85) return { label: 'High', color: 'text-green-600' }
  if (score >= 0.65) return { label: 'Medium', color: 'text-amber-600' }
  return { label: 'Low', color: 'text-red-500' }
}

export function formatWeeksPregnant(weeks) {
  if (!weeks) return 'Unknown'
  const w = parseInt(weeks, 10)
  if (w <= 12) return `${w} weeks (1st Trimester)`
  if (w <= 26) return `${w} weeks (2nd Trimester)`
  if (w <= 40) return `${w} weeks (3rd Trimester)`
  return `${w} weeks`
}
