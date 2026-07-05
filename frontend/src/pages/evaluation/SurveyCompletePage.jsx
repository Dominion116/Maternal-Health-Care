import { Link } from 'react-router-dom'
import { CheckCircle, Star, MessageSquare, Home, ClipboardCheck } from 'lucide-react'
import { ROUTES } from '@/utils/constants'

export default function SurveyCompletePage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      {/* Success icon */}
      <div className="relative inline-flex mb-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <div className="absolute -top-1 -right-1 w-7 h-7 bg-rose-100 rounded-full flex items-center justify-center border-2 border-white">
          <ClipboardCheck className="w-3.5 h-3.5 text-rose-600" />
        </div>
      </div>

      <h1 className="font-display font-bold text-2xl text-gray-900 mb-2">Survey Complete!</h1>
      <p className="text-gray-500 text-sm leading-relaxed mb-2">
        Thank you for completing the MamaGuide usability survey. Your responses have been recorded.
      </p>
      <p className="text-gray-400 text-xs leading-relaxed mb-8">
        Your feedback is incredibly valuable and will directly help us improve MamaGuide for pregnant women and nurses across Nigeria.
      </p>

      {/* What happens next */}
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 mb-6 text-left">
        <h2 className="font-semibold text-rose-800 text-sm mb-3">What happens next?</h2>
        <ul className="space-y-2.5">
          {[
            { icon: ClipboardCheck, text: 'Your SUS score has been recorded alongside other participants\' responses.' },
            { icon: Star, text: 'Responses are anonymised and will be used only for this academic research.' },
            { icon: MessageSquare, text: 'You can still use MamaGuide anytime for pregnancy questions and support.' },
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <div className="w-6 h-6 bg-rose-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                <item.icon className="w-3.5 h-3.5 text-rose-600" />
              </div>
              <p className="text-xs text-rose-700 leading-relaxed">{item.text}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Optional feedback prompt */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-8 text-left">
        <h2 className="font-semibold text-gray-900 text-sm mb-1">Would you like to add written feedback?</h2>
        <p className="text-xs text-gray-500 mb-4 leading-relaxed">
          You can share comments about your experience — what worked well, what could be better. This is optional but very helpful.
        </p>
        <Link
          to={ROUTES.FEEDBACK}
          className="inline-flex items-center gap-2 text-sm text-rose-700 font-semibold border border-rose-200 bg-rose-50 px-4 py-2 rounded-xl hover:bg-rose-100 transition-colors"
        >
          <MessageSquare className="w-4 h-4" />
          Share written feedback
        </Link>
      </div>

      {/* Primary CTA */}
      <Link
        to={ROUTES.DASHBOARD}
        className="flex items-center justify-center gap-2 w-full h-12 bg-rose-700 text-white font-semibold rounded-xl hover:bg-rose-800 transition-colors text-sm mb-3"
      >
        <Home className="w-4 h-4" />
        Return to MamaGuide
      </Link>

      <p className="text-xs text-gray-400 leading-relaxed">
        If you have any concerns about the study, please visit the{' '}
        <Link to={ROUTES.CONTACT} className="text-rose-600 hover:underline">Contact page</Link>
        {' '}or review the{' '}
        <Link to={ROUTES.RESEARCH_CONSENT} className="text-rose-600 hover:underline">Research Consent</Link>.
      </p>
    </div>
  )
}
