import { useState } from 'react'
import { Star, ThumbsUp, ThumbsDown, MessageSquare, Filter, Search, TrendingUp, Download } from 'lucide-react'
import { Badge } from '@/components/atoms/Badge'
import { Input } from '@/components/atoms/Input'
import { cn } from '@/utils/cn'

const mockFeedback = [
  { id: 'f1', user: 'Adaeze O.', role: 'pregnant_woman', rating: 5, thumb: 'up', category: 'chat', comment: 'MamaGuide helped me understand what danger signs to look out for. I feel more confident now.', date: '2026-05-20', flagged: false },
  { id: 'f2', user: 'Chioma K.', role: 'pregnant_woman', rating: 4, thumb: 'up', category: 'education', comment: 'The nutrition guide was very helpful. I learned about ugwu and the importance of iron.', date: '2026-05-19', flagged: false },
  { id: 'f3', user: 'Nurse Fatima', role: 'nurse', rating: 3, thumb: 'up', category: 'chat', comment: 'Good information but sometimes the AI does not understand clinical questions precisely. More nurse-specific content needed.', date: '2026-05-18', flagged: false },
  { id: 'f4', user: 'Halima M.', role: 'pregnant_woman', rating: 2, thumb: 'down', category: 'chat', comment: 'I asked about my medication and the answer was confusing. Please make it simpler.', date: '2026-05-17', flagged: true },
  { id: 'f5', user: 'Emeka O.', role: 'nurse', rating: 5, thumb: 'up', category: 'general', comment: 'Excellent tool. Very impressed with the emergency detection feature. Will recommend to colleagues.', date: '2026-05-17', flagged: false },
  { id: 'f6', user: 'Blessing N.', role: 'pregnant_woman', rating: 4, thumb: 'up', category: 'education', comment: 'The ANC schedule page was clear and easy to follow. Now I know when to go for my visits.', date: '2026-05-16', flagged: false },
  { id: 'f7', user: 'Amaka C.', role: 'pregnant_woman', rating: 1, thumb: 'down', category: 'chat', comment: 'The chatbot gave me wrong information about my due date calculation. This needs to be fixed.', date: '2026-05-15', flagged: true },
  { id: 'f8', user: 'Dr. Emeka Obi', role: 'nurse', rating: 4, thumb: 'up', category: 'general', comment: 'Good overall. Would benefit from references to FMOH guidelines directly in responses.', date: '2026-05-14', flagged: false },
]

const categoryConfig = {
  chat: { label: 'Chat', variant: 'rose' },
  education: { label: 'Education', variant: 'sage' },
  general: { label: 'General', variant: 'info' },
}

const avgRating = Math.round((mockFeedback.reduce((s, f) => s + f.rating, 0) / mockFeedback.length) * 10) / 10
const thumbsUpPct = Math.round((mockFeedback.filter(f => f.thumb === 'up').length / mockFeedback.length) * 100)
const flaggedCount = mockFeedback.filter(f => f.flagged).length

export default function AdminFeedbackPage() {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [thumbFilter, setThumbFilter] = useState('all')
  const [showFlagged, setShowFlagged] = useState(false)

  const filtered = mockFeedback.filter(f => {
    const matchSearch = f.user.toLowerCase().includes(search.toLowerCase()) || f.comment.toLowerCase().includes(search.toLowerCase())
    const matchCategory = categoryFilter === 'all' || f.category === categoryFilter
    const matchThumb = thumbFilter === 'all' || f.thumb === thumbFilter
    const matchFlagged = !showFlagged || f.flagged
    return matchSearch && matchCategory && matchThumb && matchFlagged
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-gray-900">User Feedback</h1>
          <p className="text-sm text-gray-500 mt-1">{mockFeedback.length} feedback submissions from participants</p>
        </div>
        <button className="inline-flex items-center gap-2 text-sm text-rose-700 border border-rose-200 bg-rose-50 px-4 py-2 rounded-xl hover:bg-rose-100 transition-colors font-medium">
          <Download className="w-4 h-4" aria-hidden />
          Export CSV
        </button>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-xs text-gray-500 mb-1">Average Rating</p>
          <div className="flex items-end gap-1.5">
            <p className="font-display font-extrabold text-4xl text-gray-900">{avgRating}</p>
            <p className="text-sm text-gray-400 mb-1">/ 5</p>
          </div>
          <div className="flex gap-0.5 mt-1.5">
            {[1, 2, 3, 4, 5].map(n => (
              <Star key={n} className={cn('w-3.5 h-3.5', n <= Math.round(avgRating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200')} />
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-xs text-gray-500 mb-1">Positive Feedback</p>
          <p className="font-display font-extrabold text-4xl text-gray-900">{thumbsUpPct}%</p>
          <p className="text-xs text-green-600 mt-1 font-medium flex items-center gap-1">
            <ThumbsUp className="w-3 h-3" />
            {mockFeedback.filter(f => f.thumb === 'up').length} thumbs up
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-xs text-gray-500 mb-1">Total Submissions</p>
          <p className="font-display font-extrabold text-4xl text-gray-900">{mockFeedback.length}</p>
          <p className="text-xs text-gray-400 mt-1">From all participants</p>
        </div>
        <div className={cn('rounded-2xl border p-5', flaggedCount > 0 ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200')}>
          <p className="text-xs text-gray-500 mb-1">Flagged for Review</p>
          <p className={cn('font-display font-extrabold text-4xl', flaggedCount > 0 ? 'text-red-700' : 'text-gray-900')}>{flaggedCount}</p>
          <p className="text-xs text-gray-400 mt-1">Need attention</p>
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
            const count = mockFeedback.filter(f => f.rating === star).length
            const pct = Math.round((count / mockFeedback.length) * 100)
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
                <span className="text-xs text-gray-500 w-12 text-right shrink-0">{count} ({pct}%)</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-48">
          <Input
            placeholder="Search by user or comment..."
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
          <option value="chat">Chat</option>
          <option value="education">Education</option>
          <option value="general">General</option>
        </select>
        <select
          value={thumbFilter}
          onChange={e => setThumbFilter(e.target.value)}
          className="h-11 px-4 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-2 focus:outline-rose-500"
        >
          <option value="all">All ratings</option>
          <option value="up">Positive</option>
          <option value="down">Negative</option>
        </select>
        <button
          onClick={() => setShowFlagged(v => !v)}
          className={cn(
            'inline-flex items-center gap-2 px-4 h-11 rounded-xl border text-sm font-medium transition-all',
            showFlagged ? 'border-red-400 bg-red-50 text-red-700' : 'border-gray-200 bg-white text-gray-600 hover:border-red-200'
          )}
        >
          <Filter className="w-4 h-4" />
          Flagged only
        </button>
      </div>

      {/* Feedback cards */}
      <div className="space-y-3">
        {filtered.map(f => (
          <div key={f.id} className={cn('bg-white rounded-2xl border p-5', f.flagged ? 'border-red-300' : 'border-gray-200')}>
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-xs font-bold text-rose-700 shrink-0">
                  {f.user.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{f.user}</p>
                  <p className="text-xs text-gray-400">{new Date(f.date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {f.flagged && <Badge variant="error" size="sm">Flagged</Badge>}
                <Badge variant={categoryConfig[f.category]?.variant || 'neutral'} size="sm">{categoryConfig[f.category]?.label}</Badge>
                <span className={cn('w-7 h-7 rounded-full flex items-center justify-center', f.thumb === 'up' ? 'bg-green-100' : 'bg-red-100')}>
                  {f.thumb === 'up'
                    ? <ThumbsUp className="w-3.5 h-3.5 text-green-600" />
                    : <ThumbsDown className="w-3.5 h-3.5 text-red-600" />
                  }
                </span>
              </div>
            </div>

            <div className="flex gap-0.5 mb-2">
              {[1, 2, 3, 4, 5].map(n => (
                <Star key={n} className={cn('w-3.5 h-3.5', n <= f.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200')} />
              ))}
            </div>

            <p className="text-sm text-gray-700 leading-relaxed">{f.comment}</p>

            {f.flagged && (
              <div className="mt-3 pt-3 border-t border-red-200 flex items-center justify-between">
                <p className="text-xs text-red-600">This feedback has been flagged for admin review.</p>
                <button className="text-xs text-rose-700 font-semibold hover:underline">Resolve</button>
              </div>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <MessageSquare className="w-10 h-10 text-gray-200 mx-auto mb-2" />
            <p className="text-sm text-gray-400">No feedback matches your filters.</p>
          </div>
        )}
      </div>
    </div>
  )
}
