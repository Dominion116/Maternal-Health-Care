import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ThumbsUp, ThumbsDown, Star, Send, MessageSquare, CheckCircle } from 'lucide-react'
import { ROUTES } from '@/utils/constants'
import { cn } from '@/utils/cn'

const categories = [
  { id: 'ease', label: 'Ease of use' },
  { id: 'accuracy', label: 'Accuracy of information' },
  { id: 'safety', label: 'Safety & trust' },
  { id: 'language', label: 'Clarity of language' },
  { id: 'speed', label: 'Speed of responses' },
]

export default function FeedbackPage() {
  const navigate = useNavigate()
  const [thumb, setThumb] = useState(null)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [categoryRatings, setCategoryRatings] = useState({})
  const [comment, setComment] = useState('')
  const [recommend, setRecommend] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  function setCatRating(id, val) {
    setCategoryRatings(p => ({ ...p, [id]: val }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!thumb || !rating) return
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 1000))
    setSubmitting(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="font-display font-bold text-2xl text-gray-900 mb-2">Thank you!</h1>
        <p className="text-gray-500 text-sm leading-relaxed mb-6">
          Your feedback helps us make MamaGuide better for mothers across Nigeria. We really appreciate you taking the time.
        </p>
        <button
          onClick={() => navigate(ROUTES.DASHBOARD)}
          className="px-6 py-3 bg-rose-700 text-white font-semibold rounded-xl hover:bg-rose-800 transition-colors text-sm"
        >
          Back to Home
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center mb-3">
          <MessageSquare className="w-5 h-5 text-rose-600" />
        </div>
        <h1 className="font-display font-bold text-2xl text-gray-900">Share Your Feedback</h1>
        <p className="text-sm text-gray-500 mt-1">Help us improve MamaGuide for mothers everywhere. This takes about 2 minutes.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Overall thumbs */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="font-semibold text-gray-900 text-sm mb-1">Overall, did MamaGuide help you?</p>
          <p className="text-xs text-gray-500 mb-4">Your honest answer helps us improve.</p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setThumb('up')}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-semibold text-sm transition-all',
                thumb === 'up' ? 'border-green-400 bg-green-50 text-green-700' : 'border-gray-200 bg-white text-gray-500 hover:border-green-200'
              )}
            >
              <ThumbsUp className={cn('w-4.5 h-4.5', thumb === 'up' && 'fill-green-600')} />
              Yes, it helped
            </button>
            <button
              type="button"
              onClick={() => setThumb('down')}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-semibold text-sm transition-all',
                thumb === 'down' ? 'border-red-400 bg-red-50 text-red-700' : 'border-gray-200 bg-white text-gray-500 hover:border-red-200'
              )}
            >
              <ThumbsDown className={cn('w-4.5 h-4.5', thumb === 'down' && 'fill-red-600')} />
              Not really
            </button>
          </div>
        </div>

        {/* Star rating */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="font-semibold text-gray-900 text-sm mb-1">How would you rate MamaGuide overall?</p>
          <p className="text-xs text-gray-500 mb-4">1 = very poor, 5 = excellent</p>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(n => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                onMouseEnter={() => setHoverRating(n)}
                onMouseLeave={() => setHoverRating(0)}
                className="w-12 h-12 rounded-xl flex items-center justify-center transition-all"
                aria-label={`Rate ${n} out of 5`}
              >
                <Star
                  className={cn(
                    'w-8 h-8 transition-all',
                    n <= (hoverRating || rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'
                  )}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-xs text-gray-500 mt-2">
              {rating === 5 ? 'Excellent!' : rating === 4 ? 'Good!' : rating === 3 ? 'OK' : rating === 2 ? 'Needs improvement' : 'Very poor'}
            </p>
          )}
        </div>

        {/* Category ratings */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="font-semibold text-gray-900 text-sm mb-1">Rate specific aspects</p>
          <p className="text-xs text-gray-500 mb-4">Optional — tap a star for each area</p>
          <div className="space-y-3">
            {categories.map(cat => (
              <div key={cat.id} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{cat.label}</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(n => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setCatRating(cat.id, n)}
                      aria-label={`Rate ${cat.label} ${n} out of 5`}
                    >
                      <Star
                        className={cn(
                          'w-5 h-5 transition-colors',
                          n <= (categoryRatings[cat.id] || 0) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommend */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="font-semibold text-gray-900 text-sm mb-4">Would you recommend MamaGuide to other pregnant women or nurses?</p>
          <div className="flex gap-3">
            {['Yes, definitely', 'Maybe', 'No'].map(opt => (
              <button
                key={opt}
                type="button"
                onClick={() => setRecommend(opt)}
                className={cn(
                  'flex-1 py-2.5 rounded-xl border text-xs font-semibold transition-all',
                  recommend === opt ? 'border-rose-400 bg-rose-50 text-rose-700' : 'border-gray-200 bg-white text-gray-500 hover:border-rose-200'
                )}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Comment */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <label htmlFor="feedback-comment" className="block font-semibold text-gray-900 text-sm mb-1">
            Any comments or suggestions?
          </label>
          <p className="text-xs text-gray-500 mb-3">Optional — tell us what worked well or what we can improve</p>
          <textarea
            id="feedback-comment"
            value={comment}
            onChange={e => setComment(e.target.value)}
            rows={4}
            placeholder="e.g. I wish the chatbot could understand Pidgin English better..."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-2 focus:outline-rose-500 resize-none leading-relaxed"
          />
          <p className="text-xs text-gray-400 mt-1 text-right">{comment.length}/500</p>
        </div>

        <button
          type="submit"
          disabled={!thumb || !rating || submitting}
          className="w-full h-12 bg-rose-700 text-white font-semibold rounded-xl hover:bg-rose-800 transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Submit Feedback
            </>
          )}
        </button>

        {(!thumb || !rating) && (
          <p className="text-xs text-gray-400 text-center">Please rate overall and select thumbs up/down to submit</p>
        )}
      </form>
    </div>
  )
}
