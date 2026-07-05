import { useState } from 'react'
import { Search, MessageSquare, AlertTriangle, Clock, Eye, Filter, ChevronDown, ChevronUp } from 'lucide-react'
import { Badge } from '@/components/atoms/Badge'
import { Input } from '@/components/atoms/Input'
import { cn } from '@/utils/cn'

const mockConversations = [
  { id: 'c1', user: 'Adaeze O.', intent: 'Danger signs query', message: 'I have been having severe headaches and I can see spots. Is this dangerous?', response: 'What you are describing — severe headaches with visual disturbances — can be signs of pre-eclampsia. Please go to hospital immediately.', time: '2m ago', emergency: true, confidence: 0.94 },
  { id: 'c2', user: 'Chioma K.', intent: 'Nutrition guidance', message: 'What vegetables should I eat in my second trimester?', response: 'In the second trimester, focus on iron-rich vegetables like ugwu (pumpkin leaf), spinach, and water leaf. These help prevent anaemia.', time: '15m ago', emergency: false, confidence: 0.91 },
  { id: 'c3', user: 'Blessing N.', intent: 'ANC schedule inquiry', message: 'How many ANC visits should I have and when?', response: 'The WHO recommends at least 8 ANC visits. Your first visit should be before 12 weeks. Then at 16, 20, 26, 32, 36, 38, and 40 weeks.', time: '32m ago', emergency: false, confidence: 0.96 },
  { id: 'c4', user: 'Halima M.', intent: 'Baby movement concern', message: 'My baby has not moved in 4 hours. Should I be worried?', response: 'After 28 weeks, your baby should move at least 10 times in 2 hours. If you cannot feel movements, contact your midwife or go to hospital now.', time: '1h ago', emergency: true, confidence: 0.89 },
  { id: 'c5', user: 'Amaka C.', intent: 'Medication safety', message: 'Is it safe to take paracetamol for headaches during pregnancy?', response: 'Paracetamol (acetaminophen) is generally considered safe in pregnancy when used as directed. Always use the lowest effective dose for the shortest time needed.', time: '2h ago', emergency: false, confidence: 0.87 },
  { id: 'c6', user: 'Nurse Fatima', intent: 'Clinical guidance', message: 'What are the criteria for referring a patient for pre-eclampsia?', response: 'Refer if blood pressure >140/90 mmHg with proteinuria, or any severe features: headache, visual disturbances, epigastric pain, or BP >160/110.', time: '3h ago', emergency: false, confidence: 0.92 },
  { id: 'c7', user: 'Adaeze O.', intent: 'Labour signs', message: 'How do I know when I am in labour?', response: 'Signs of labour include regular contractions every 5 minutes, your waters breaking, a "show" of mucus, and persistent lower back pain.', time: '5h ago', emergency: false, confidence: 0.95 },
]

export default function AdminConversationsPage() {
  const [search, setSearch] = useState('')
  const [emergencyOnly, setEmergencyOnly] = useState(false)
  const [expanded, setExpanded] = useState(null)

  const filtered = mockConversations.filter(c => {
    const matchSearch = c.user.toLowerCase().includes(search.toLowerCase()) || c.intent.toLowerCase().includes(search.toLowerCase()) || c.message.toLowerCase().includes(search.toLowerCase())
    const matchEmergency = !emergencyOnly || c.emergency
    return matchSearch && matchEmergency
  })

  const emergencyCount = mockConversations.filter(c => c.emergency).length

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display font-bold text-2xl text-gray-900">Conversations Monitor</h1>
        <p className="text-sm text-gray-500 mt-1">{mockConversations.length} conversations today</p>
      </div>

      {/* Emergency alert */}
      {emergencyCount > 0 && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" aria-hidden />
          <div>
            <p className="font-semibold text-sm text-red-800">{emergencyCount} emergency escalation{emergencyCount !== 1 ? 's' : ''} today</p>
            <p className="text-xs text-red-600 mt-0.5">These conversations triggered emergency detection. Review them below.</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Search by user, intent, or message..."
            icon={<Search className="w-4 h-4" />}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button
          onClick={() => setEmergencyOnly(v => !v)}
          className={cn(
            'inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all',
            emergencyOnly ? 'border-red-400 bg-red-50 text-red-700' : 'border-gray-200 bg-white text-gray-600 hover:border-red-200'
          )}
        >
          <AlertTriangle className="w-4 h-4" aria-hidden />
          Emergency Only
        </button>
      </div>

      {/* Conversations list */}
      <div className="space-y-2">
        {filtered.map(conv => (
          <div key={conv.id} className={cn('bg-white rounded-2xl border overflow-hidden', conv.emergency ? 'border-red-300' : 'border-gray-200')}>
            <div className="p-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-gray-900">{conv.user}</span>
                  {conv.emergency && <Badge variant="error" size="sm">Emergency</Badge>}
                  <Badge variant="neutral" size="sm">{conv.intent}</Badge>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={cn(
                    'text-xs font-semibold px-2 py-0.5 rounded-full',
                    conv.confidence >= 0.9 ? 'bg-green-100 text-green-700' : conv.confidence >= 0.7 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                  )}>
                    {Math.round(conv.confidence * 100)}% confidence
                  </span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {conv.time}
                  </span>
                </div>
              </div>

              <div className={cn('rounded-xl p-3 mb-2', conv.emergency ? 'bg-red-50' : 'bg-gray-50')}>
                <p className="text-xs font-medium text-gray-500 mb-1">User asked:</p>
                <p className="text-sm text-gray-800 leading-relaxed">{conv.message}</p>
              </div>

              <button
                onClick={() => setExpanded(expanded === conv.id ? null : conv.id)}
                className="flex items-center gap-1 text-xs text-rose-700 hover:underline font-medium"
              >
                <Eye className="w-3.5 h-3.5" aria-hidden />
                {expanded === conv.id ? 'Hide response' : 'View response'}
                {expanded === conv.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>

              {expanded === conv.id && (
                <div className="mt-3 bg-rose-50 border border-rose-200 rounded-xl p-3">
                  <p className="text-xs font-medium text-rose-600 mb-1">MamaGuide responded:</p>
                  <p className="text-sm text-gray-800 leading-relaxed">{conv.response}</p>
                </div>
              )}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <MessageSquare className="w-10 h-10 text-gray-200 mx-auto mb-2" />
            <p className="text-sm text-gray-400">No conversations match your filters.</p>
          </div>
        )}
      </div>
    </div>
  )
}
