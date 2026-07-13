import { useState, useEffect } from 'react'
import { Star, MessageSquare, Search, TrendingUp, Download } from 'lucide-react'
import { Badge } from '@/components/atoms/Badge'
import { Input } from '@/components/atoms/Input'
import { Spinner } from '@/components/atoms/Spinner'
import { Alert } from '@/components/atoms/Alert'
import { adminService } from '@/services/adminService'
import { downloadCSV } from '@/utils/csv'
import { cn } from '@/utils/cn'

// Real backend categories (FeedbackSubmitDto) — not the mock's chat/education/general.
const categoryConfig = {
  bug: { label: 'Bug', variant: 'error' },
  suggestion: { label: 'Suggestion', variant: 'info' },
  praise: { label: 'Praise', variant: 'success' },
  other: { label: 'Other', variant: 'neutral' },
}

export default function AdminFeedbackPage() {
  const [feedback, setFeedback] = useState([])
  const [avgRating, setAvgRating] = useState(null)
  const [byCategory, setByCategory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError('')
      try {
        const res = await adminService.getFeedback({ limit: 100 })
        setFeedback(res.data.data.feedback || [])
        setAvgRating(res.data.data.avg_rating)
        setByCategory(res.data.data.by_category || [])
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load feedback')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <div className="py-24 flex justify-center"><Spinner size="lg" /></div>
  if (error) return <Alert variant="error">{error}</Alert>

  const filtered = feedback.filter(f => {
    const q = search.toLowerCase()
    const matchSearch = !q || f.comment?.toLowerCase().includes(q) || f.user_id?.toLowerCase().includes(q)
    const matchCategory = categoryFilter === 'all' || f.category === categoryFilter
    return matchSearch && matchCategory
  })

  function handleExport() {
    downloadCSV(
      'feedback.csv',
      ['User ID', 'Rating', 'Category', 'Comment', 'Submitted At'],
      feedback.map((f) => [f.user_id, f.rating, f.category, f.comment, f.submitted_at]),
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-gray-900">User Feedback</h1>
          <p className="text-sm text-gray-500 mt-1">{feedback.length} feedback submissions from participants</p>
        </div>
        <button
          onClick={handleExport}
          disabled={feedback.length === 0}
          className="inline-flex items-center gap-2 text-sm text-rose-700 border border-rose-200 bg-rose-50 px-4 py-2 rounded-xl hover:bg-rose-100 transition-colors font-medium disabled:opacity-50"
        >
          <Download className="w-4 h-4" aria-hidden />
          Export CSV
        </button>
      </div>

      {feedback.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 py-16 text-center">
          <p className="text-sm text-gray-400">No feedback submitted yet.</p>
        </div>
      ) : (
        <>
          {/* KPI cards */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <p className="text-xs text-gray-500 mb-1">Average Rating</p>
              <div className="flex items-end gap-1.5">
                <p className="font-display font-extrabold text-4xl text-gray-900">{avgRating ?? 'N/A'}</p>
                <p className="text-sm text-gray-400 mb-1">/ 5</p>
              </div>
              <div className="flex gap-0.5 mt-1.5">
                {[1, 2, 3, 4, 5].map(n => (
                  <Star key={n} className={cn('w-3.5 h-3.5', avgRating && n <= Math.round(avgRating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200')} />
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <p className="text-xs text-gray-500 mb-1">Total Submissions</p>
              <p className="font-display font-extrabold text-4xl text-gray-900">{feedback.length}</p>
              <p className="text-xs text-gray-400 mt-1">From all participants</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-5 col-span-2 lg:col-span-1">
              <p className="text-xs text-gray-500 mb-2">By Category</p>
              <div className="flex flex-wrap gap-1.5">
                {byCategory.map((c) => (
                  <Badge key={c.category} variant={categoryConfig[c.category]?.variant || 'neutral'} size="sm">
                    {categoryConfig[c.category]?.label || c.category}: {c.count}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Rating distribution */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-4.5 h-4.5 text-rose-600" aria-hidden />
              Rating Distribution
            </h2>
            <div className="space-y-2.5">
              {[5, 4, 3, 2, 1].map(star => {
                const count = feedback.filter(f => f.rating === star).length
                const pct = Math.round((count / feedback.length) * 100)
                return (
                  <div key={star} className="flex items-center gap-3">
                    <div className="flex items-center gap-0.5 w-20 shrink-0">
                      {[1, 2, 3, 4, 5].map(n => (
                        <Star key={n} className={cn('w-3 h-3', n <= star ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200')} />
                      ))}
                    </div>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs text-gray-500 w-16 text-right shrink-0">{count} ({pct}%)</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-48">
              <Input
                placeholder="Search by user ID or comment..."
                icon={<Search className="w-4 h-4" />}
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="h-11 px-4 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-2 focus:outline-rose-500"
            >
              <option value="all">All categories</option>
              {Object.entries(categoryConfig).map(([key, cfg]) => (
                <option key={key} value={key}>{cfg.label}</option>
              ))}
            </select>
          </div>

          {/* Feedback cards */}
          <div className="space-y-3">
            {filtered.map(f => (
              <div key={f.id} className="bg-white rounded-2xl border border-gray-200 p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-xs font-bold text-rose-700 shrink-0">
                      {(f.user_id || '?').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{f.user_id?.slice(0, 8)}…</p>
                      <p className="text-xs text-gray-400">{new Date(f.submitted_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <Badge variant={categoryConfig[f.category]?.variant || 'neutral'} size="sm">
                    {categoryConfig[f.category]?.label || f.category}
                  </Badge>
                </div>

                <div className="flex gap-0.5 mb-2">
                  {[1, 2, 3, 4, 5].map(n => (
                    <Star key={n} className={cn('w-3.5 h-3.5', n <= f.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200')} />
                  ))}
                </div>

                {f.comment && <p className="text-sm text-gray-700 leading-relaxed">{f.comment}</p>}
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="py-12 text-center">
                <MessageSquare className="w-10 h-10 text-gray-200 mx-auto mb-2" />
                <p className="text-sm text-gray-400">No feedback matches your filters.</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
