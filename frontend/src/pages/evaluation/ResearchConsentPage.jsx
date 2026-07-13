import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, CheckCircle, ChevronDown, ChevronUp, AlertCircle, FileText } from 'lucide-react'
import { ROUTES } from '@/utils/constants'
import { cn } from '@/utils/cn'
import { evaluationService } from '@/services/evaluationService'
import { Alert } from '@/components/atoms/Alert'

const sections = [
  {
    title: 'What is this study about?',
    content: `This study evaluates MamaGuide, a maternal health chatbot designed to provide information and support to pregnant women and healthcare workers in Nigeria. The aim is to understand how useful, safe, and easy to use the system is, so we can improve it.`,
  },
  {
    title: 'Who is running this study?',
    content: `This research is conducted as part of a final-year academic project. It follows ethical guidelines from the university and has been reviewed to protect participant rights.`,
  },
  {
    title: 'What will I be asked to do?',
    content: `If you agree to participate, you will:\n• Use MamaGuide as you normally would for pregnancy-related questions\n• Complete a short usability questionnaire (SUS: 10 questions, about 5 minutes)\n• Optionally submit written feedback about your experience\n\nParticipation is entirely voluntary. You can stop at any time.`,
  },
  {
    title: 'What data will be collected?',
    content: `We will collect:\n• Your conversations with MamaGuide (anonymous; no names stored)\n• Your responses to the usability questionnaire\n• Optional feedback you choose to provide\n\nWe will NOT collect your full name, phone number, or any information that identifies you personally.`,
  },
  {
    title: 'How will my data be used?',
    content: `Your data will be used only for this academic study. It will be anonymised before any analysis. Results will be reported in aggregate, meaning no individual responses will be highlighted. Data will not be sold or shared with third parties.`,
  },
  {
    title: 'Is participation voluntary?',
    content: `Yes. You can choose not to participate, or withdraw at any time without giving a reason. Withdrawing will not affect your access to MamaGuide or any services.`,
  },
  {
    title: 'Are there any risks?',
    content: `There are no significant risks to participating. MamaGuide is an information tool; it does not replace your doctor, midwife, or nurse. In emergencies, please contact a healthcare professional or call 112 directly.`,
  },
  {
    title: 'Who can I contact with questions?',
    content: `If you have any questions about the study or your rights as a participant, please contact the research team via the Contact page. You may also withdraw your consent at any time in Settings > Privacy.`,
  },
]

export default function ResearchConsentPage() {
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState(null)
  const [checkedItems, setCheckedItems] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [apiError, setApiError] = useState('')

  const consentItems = [
    { id: 'understand', text: 'I have read and understand the information above.' },
    { id: 'voluntary', text: 'I understand that my participation is voluntary and I can withdraw at any time.' },
    { id: 'data', text: 'I agree that my anonymised data may be used for this research study.' },
    { id: 'age', text: 'I confirm that I am 18 years of age or older.' },
  ]

  const allChecked = consentItems.every(item => checkedItems[item.id])

  function toggleItem(id) {
    setCheckedItems(p => ({ ...p, [id]: !p[id] }))
  }

  async function handleConsent() {
    if (!allChecked) return
    setSubmitting(true)
    setApiError('')
    try {
      await evaluationService.submitConsent(true)
      navigate(ROUTES.DASHBOARD)
    } catch (err) {
      setApiError(err.response?.data?.error || 'Failed to save consent. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  function handleDecline() {
    // Backend's ConsentDto only accepts consented: true (literal) — declining
    // has no representable backend state, so this stays a local-only action.
    navigate(ROUTES.DASHBOARD)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center mb-3">
          <FileText className="w-5 h-5 text-rose-600" />
        </div>
        <h1 className="font-display font-bold text-2xl text-gray-900">Research Consent</h1>
        <p className="text-sm text-gray-500 mt-1 leading-relaxed">
          Before using MamaGuide as part of our evaluation study, please read this information carefully and let us know if you agree to participate.
        </p>
      </div>

      {/* Highlight box */}
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
        <Shield className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-sm text-rose-800 mb-1">Your privacy is protected</p>
          <p className="text-xs text-rose-700 leading-relaxed">All data is anonymised. We will never share your personal information. You can withdraw at any time in Settings &gt; Privacy.</p>
        </div>
      </div>

      {/* Accordion sections */}
      <div className="space-y-2 mb-6">
        {sections.map((section, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <button
              className="w-full flex items-center justify-between px-5 py-4 text-left gap-3"
              onClick={() => setExpanded(expanded === i ? null : i)}
              aria-expanded={expanded === i}
            >
              <span className="font-semibold text-sm text-gray-900">{section.title}</span>
              {expanded === i
                ? <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" />
                : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
              }
            </button>
            {expanded === i && (
              <div className="px-5 pb-4 border-t border-gray-100">
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line mt-3">{section.content}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Consent checkboxes */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-5">
        <h2 className="font-semibold text-gray-900 text-sm mb-4">Please confirm the following</h2>
        <div className="space-y-3">
          {consentItems.map(item => (
            <label key={item.id} className="flex items-start gap-3 cursor-pointer">
              <button
                type="button"
                onClick={() => toggleItem(item.id)}
                className={cn(
                  'w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all',
                  checkedItems[item.id] ? 'bg-rose-600 border-rose-600' : 'border-gray-300 bg-white'
                )}
                role="checkbox"
                aria-checked={!!checkedItems[item.id]}
                aria-label={item.text}
              >
                {checkedItems[item.id] && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
              <span className="text-sm text-gray-700 leading-relaxed">{item.text}</span>
            </label>
          ))}
        </div>
      </div>

      {!allChecked && (
        <div className="flex items-center gap-2 mb-4 text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <p className="text-xs">Please check all boxes above before you can consent.</p>
        </div>
      )}

      {apiError && <Alert variant="error" onDismiss={() => setApiError('')} className="mb-4">{apiError}</Alert>}

      {/* Action buttons */}
      <div className="flex flex-col gap-3">
        <button
          onClick={handleConsent}
          disabled={!allChecked || submitting}
          className="w-full h-12 bg-rose-700 text-white font-semibold rounded-xl hover:bg-rose-800 transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving consent...
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4" />
              I Agree and Proceed to MamaGuide
            </>
          )}
        </button>

        <button
          onClick={handleDecline}
          className="w-full h-12 border border-gray-200 bg-white text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-colors text-sm"
        >
          No thanks, I prefer not to participate
        </button>

        <p className="text-xs text-gray-400 text-center leading-relaxed">
          Declining will not affect your ability to use MamaGuide. You can change your mind later in Settings &gt; Privacy.
        </p>
      </div>
    </div>
  )
}
