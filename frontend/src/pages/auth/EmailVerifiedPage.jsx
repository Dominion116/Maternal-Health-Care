import { Link } from 'react-router-dom'
import { CheckCircle, LogIn, Heart } from 'lucide-react'
import { ROUTES } from '@/utils/constants'

export default function EmailVerifiedPage() {
  return (
    <div className="text-center animate-fade-in-up">
      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-10 h-10 text-green-600" aria-hidden />
      </div>

      <h1 className="font-display font-bold text-2xl text-text-primary mb-2">
        Email verified!
      </h1>
      <p className="text-text-secondary text-sm leading-relaxed mb-3 max-w-xs mx-auto">
        Your MamaGuide account is confirmed and ready to use. Sign in to get started.
      </p>

      <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-rose-50 border border-rose-100 rounded-xl text-xs text-rose-700 mb-8">
        <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-400" aria-hidden />
        Your health information is private and secure.
      </div>

      <Link
        to={ROUTES.LOGIN}
        className="flex items-center justify-center gap-2 bg-rose-700 text-white font-semibold px-6 py-3.5 rounded-2xl hover:bg-rose-800 transition-colors shadow-sm w-full"
      >
        <LogIn className="w-4 h-4" aria-hidden />
        Sign In to MamaGuide
      </Link>
    </div>
  )
}
