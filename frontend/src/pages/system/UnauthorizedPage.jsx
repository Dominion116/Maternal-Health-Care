import { Link } from 'react-router-dom'
import { ShieldX, ArrowLeft } from 'lucide-react'
import { ROUTES } from '@/utils/constants'

export default function UnauthorizedPage() {
  return (
    <div className="min-h-dvh bg-hero-gradient flex flex-col items-center justify-center px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-5 animate-bounce-in">
        <ShieldX className="w-10 h-10 text-red-600" aria-hidden />
      </div>
      <h1 className="font-display font-bold text-2xl text-text-primary mb-2">Access Denied</h1>
      <p className="text-text-secondary text-sm max-w-sm leading-relaxed mb-6">
        You don't have permission to view this page. If you think this is a mistake, please contact support.
      </p>
      <Link
        to={ROUTES.DASHBOARD}
        className="inline-flex items-center gap-2 bg-rose-700 text-white font-semibold px-6 py-3 rounded-xl hover:bg-rose-800 transition-colors shadow-sm"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden />
        Back to Dashboard
      </Link>
    </div>
  )
}
