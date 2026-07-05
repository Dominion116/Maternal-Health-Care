import { Link } from 'react-router-dom'
import { ArrowLeft, Heart } from 'lucide-react'
import { ROUTES } from '@/utils/constants'

export default function NotFoundPage() {
  return (
    <div className="min-h-dvh bg-hero-gradient flex flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 animate-bounce-in">
        <span className="text-7xl" aria-hidden>🤰</span>
      </div>
      <h1 className="font-display font-extrabold text-6xl text-rose-700 mb-3">404</h1>
      <h2 className="font-display font-bold text-2xl text-text-primary mb-3">Page not found</h2>
      <p className="text-text-secondary text-sm max-w-sm leading-relaxed mb-8">
        This page doesn't exist. Maybe it moved, or perhaps you took a wrong turn. Let's get you back on track.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <Link
          to={ROUTES.HOME}
          className="inline-flex items-center gap-2 bg-rose-700 text-white font-semibold px-6 py-3 rounded-xl hover:bg-rose-800 transition-colors shadow-sm"
        >
          <Heart className="w-4 h-4 fill-white" aria-hidden />
          Go to Home
        </Link>
        <button
          onClick={() => history.back()}
          className="inline-flex items-center gap-2 text-text-secondary hover:text-rose-700 font-medium text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden />
          Go back
        </button>
      </div>
    </div>
  )
}
