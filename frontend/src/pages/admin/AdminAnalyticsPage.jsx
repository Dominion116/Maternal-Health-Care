import { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, Users, MessageSquare, AlertTriangle } from 'lucide-react'
import { Spinner } from '@/components/atoms/Spinner'
import { Alert } from '@/components/atoms/Alert'
import { adminService } from '@/services/adminService'

const HOUR_LABELS = ['12am', '3am', '6am', '9am', '12pm', '3pm', '6pm', '9pm']

function lastNDays(n) {
  const days = []
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push(d.toISOString().slice(0, 10))
  }
  return days
}

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError('')
      try {
        const res = await adminService.getAnalytics()
        setAnalytics(res.data.data)
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load analytics')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <div className="py-24 flex justify-center"><Spinner size="lg" /></div>
  if (error) return <Alert variant="error">{error}</Alert>

  const days = lastNDays(7)
  const dailyMap = new Map((analytics.daily_conversations || []).map((d) => [d.date, d.count]))
  const weeklyData = days.map((date) => ({
    day: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
    count: dailyMap.get(date) || 0,
  }))
  const maxConv = Math.max(1, ...weeklyData.map((d) => d.count))

  const maxIntentCount = Math.max(1, ...analytics.top_intents.map((i) => i.count))

  const conf = analytics.confidence_distribution
  const totalConf = Math.max(1, conf.high + conf.medium + conf.low)
  const confidenceData = [
    { label: 'High (>85%)', count: conf.high, pct: Math.round((conf.high / totalConf) * 100), color: 'bg-green-500' },
    { label: 'Medium (65–85%)', count: conf.medium, pct: Math.round((conf.medium / totalConf) * 100), color: 'bg-amber-400' },
    { label: 'Low (<65%)', count: conf.low, pct: Math.round((conf.low / totalConf) * 100), color: 'bg-red-400' },
  ]

  // Collapse the 24 hourly buckets down to the 8 label points shown, summing
  // the 3-hour window each label represents.
  const hourlyDisplay = HOUR_LABELS.map((label, i) => {
    const startHour = i * 3
    const sum = analytics.hourly_load.slice(startHour, startHour + 3).reduce((a, b) => a + b, 0)
    return { hour: label, load: sum }
  })
  const maxLoad = Math.max(1, ...hourlyDisplay.map((h) => h.load))

  const kpis = [
    { label: 'Total Conversations', value: analytics.totals.conversations, icon: MessageSquare, color: 'text-rose-600 bg-rose-100' },
    { label: 'Total Users', value: analytics.totals.users, icon: Users, color: 'text-sage-600 bg-sage-100' },
    { label: 'Total Messages', value: analytics.totals.messages, icon: BarChart3, color: 'text-blue-600 bg-blue-100' },
    { label: 'Emergency Escalations', value: analytics.totals.emergency_messages, icon: AlertTriangle, color: 'text-amber-600 bg-amber-100' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-gray-900">Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">Usage patterns and performance metrics for MamaGuide</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(kpi => (
          <div key={kpi.label} className="bg-white rounded-2xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className={`w-9 h-9 rounded-xl flex items-center justify-center ${kpi.color}`}>
                <kpi.icon className="w-4.5 h-4.5" aria-hidden />
              </span>
            </div>
            <p className="font-display font-extrabold text-2xl text-gray-900">{kpi.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{kpi.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-4.5 h-4.5 text-rose-600" aria-hidden />
            Conversations This Week
          </h2>
          <div className="flex items-end justify-between gap-2 h-32">
            {weeklyData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs text-gray-500 font-medium">{d.count}</span>
                <div
                  className="w-full bg-rose-500 rounded-t-lg transition-all"
                  style={{ height: `${(d.count / maxConv) * 80}px` }}
                  role="img"
                  aria-label={`${d.day}: ${d.count} conversations`}
                />
                <span className="text-xs text-gray-400">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4.5 h-4.5 text-rose-600" aria-hidden />
            Top Query Intents
          </h2>
          {analytics.top_intents.length === 0 ? (
            <p className="text-sm text-gray-400">No classified messages yet.</p>
          ) : (
            <ul className="space-y-3">
              {analytics.top_intents.slice(0, 6).map(item => (
                <li key={item.intent}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-700 font-medium truncate">{item.intent.replace(/_/g, ' ')}</span>
                    <span className="text-gray-400 ml-2 shrink-0">{item.count}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-500 rounded-full" style={{ width: `${(item.count / maxIntentCount) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <h2 className="font-semibold text-gray-900 mb-4">AI Confidence Distribution</h2>
        <div className="space-y-3">
          {confidenceData.map(item => (
            <div key={item.label}>
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span className="text-gray-700">{item.label}</span>
                <span className="text-gray-500 text-xs">{item.count} responses ({item.pct}%)</span>
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-4">Total: {totalConf} classified responses analysed</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <h2 className="font-semibold text-gray-900 mb-4">Usage by Time of Day</h2>
        <div className="flex items-end gap-3 h-24">
          {hourlyDisplay.map(h => (
            <div key={h.hour} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full bg-sage-500 rounded-t-lg opacity-80"
                style={{ height: `${(h.load / maxLoad) * 70}px` }}
                aria-label={`${h.hour}: ${h.load} messages`}
              />
              <span className="text-xs text-gray-400">{h.hour}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
