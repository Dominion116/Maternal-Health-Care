import { BarChart3, TrendingUp, Users, MessageSquare, Clock, AlertTriangle, BookOpen, ArrowUpRight } from 'lucide-react'
import { Badge } from '@/components/atoms/Badge'

const weeklyData = [
  { day: 'Mon', conversations: 28, users: 18 },
  { day: 'Tue', conversations: 35, users: 24 },
  { day: 'Wed', conversations: 42, users: 31 },
  { day: 'Thu', conversations: 38, users: 27 },
  { day: 'Fri', conversations: 51, users: 38 },
  { day: 'Sat', conversations: 29, users: 19 },
  { day: 'Sun', conversations: 22, users: 14 },
]
const maxConv = Math.max(...weeklyData.map(d => d.conversations))

const intentBreakdown = [
  { intent: 'Danger signs query', count: 312, pct: 78, badge: 'error' },
  { intent: 'ANC schedule inquiry', count: 289, pct: 72, badge: 'sage' },
  { intent: 'Nutrition guidance', count: 256, pct: 64, badge: 'success' },
  { intent: 'Baby movement concern', count: 198, pct: 50, badge: 'warning' },
  { intent: 'Postpartum question', count: 145, pct: 36, badge: 'info' },
  { intent: 'Mental health support', count: 112, pct: 28, badge: 'neutral' },
  { intent: 'Medication safety', count: 98, pct: 25, badge: 'neutral' },
  { intent: 'Labour signs', count: 87, pct: 22, badge: 'rose' },
]

const confidenceData = [
  { label: 'High (>85%)', count: 1204, pct: 64, color: 'bg-green-500' },
  { label: 'Medium (65–85%)', count: 488, pct: 26, color: 'bg-amber-400' },
  { label: 'Low (<65%)', count: 200, pct: 10, color: 'bg-red-400' },
]

const topModules = [
  { module: 'Danger Signs', views: 412, change: '+18%' },
  { module: 'Trimester Guide', views: 388, change: '+12%' },
  { module: 'ANC Schedule', views: 291, change: '+8%' },
  { module: 'Nutrition', views: 254, change: '+5%' },
  { module: 'Birth Preparedness', views: 198, change: '+22%' },
]

const hourlyPeak = [
  { hour: '6am', load: 10 }, { hour: '9am', load: 35 }, { hour: '12pm', load: 55 },
  { hour: '3pm', load: 48 }, { hour: '6pm', load: 70 }, { hour: '9pm', load: 45 }, { hour: '12am', load: 15 },
]
const maxLoad = Math.max(...hourlyPeak.map(h => h.load))

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-gray-900">Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">Usage patterns and performance metrics for MamaGuide</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Conversations', value: '1,892', change: '+8%', icon: MessageSquare, color: 'text-rose-600 bg-rose-100' },
          { label: 'Unique Users', value: '248', change: '+12%', icon: Users, color: 'text-sage-600 bg-sage-100' },
          { label: 'Avg Response Time', value: '0.8s', change: '-0.1s', icon: Clock, color: 'text-blue-600 bg-blue-100' },
          { label: 'Emergency Escalations', value: '23', change: '+2', icon: AlertTriangle, color: 'text-amber-600 bg-amber-100' },
        ].map(kpi => (
          <div key={kpi.label} className="bg-white rounded-2xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className={`w-9 h-9 rounded-xl flex items-center justify-center ${kpi.color}`}>
                <kpi.icon className="w-4.5 h-4.5" aria-hidden />
              </span>
              <span className="text-xs text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" />
                {kpi.change}
              </span>
            </div>
            <p className="font-display font-extrabold text-2xl text-gray-900">{kpi.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{kpi.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Weekly conversations chart */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-4.5 h-4.5 text-rose-600" aria-hidden />
            Conversations This Week
          </h2>
          <div className="flex items-end justify-between gap-2 h-32">
            {weeklyData.map(d => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs text-gray-500 font-medium">{d.conversations}</span>
                <div
                  className="w-full bg-rose-500 rounded-t-lg transition-all"
                  style={{ height: `${(d.conversations / maxConv) * 80}px` }}
                  role="img"
                  aria-label={`${d.day}: ${d.conversations} conversations`}
                />
                <span className="text-xs text-gray-400">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Intent breakdown */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4.5 h-4.5 text-rose-600" aria-hidden />
            Top Query Intents
          </h2>
          <ul className="space-y-3">
            {intentBreakdown.slice(0, 6).map(item => (
              <li key={item.intent}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-700 font-medium truncate">{item.intent}</span>
                  <span className="text-gray-400 ml-2 shrink-0">{item.count}</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full" style={{ width: `${item.pct}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* AI confidence distribution */}
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
          <p className="text-xs text-gray-400 mt-4">Total: 1,892 AI responses analysed</p>
        </div>

        {/* Education module engagement */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BookOpen className="w-4.5 h-4.5 text-rose-600" aria-hidden />
            Education Module Views
          </h2>
          <ul className="space-y-2">
            {topModules.map((m, i) => (
              <li key={m.module} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="text-sm text-gray-700">{m.module}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-sm font-semibold text-gray-900">{m.views}</span>
                  <span className="text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full font-medium">{m.change}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Usage by hour */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <h2 className="font-semibold text-gray-900 mb-4">Peak Usage Hours</h2>
        <div className="flex items-end gap-3 h-24">
          {hourlyPeak.map(h => (
            <div key={h.hour} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full bg-sage-500 rounded-t-lg opacity-80"
                style={{ height: `${(h.load / maxLoad) * 70}px` }}
                aria-label={`${h.hour}: ${h.load}% load`}
              />
              <span className="text-xs text-gray-400">{h.hour}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-2">Peak usage: 6pm–9pm. MamaGuide handles 24/7 queries — monitoring shows system performs well overnight.</p>
      </div>
    </div>
  )
}
