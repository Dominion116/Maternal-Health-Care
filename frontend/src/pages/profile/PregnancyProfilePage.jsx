import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Baby, Calendar, Edit2, Save, X, AlertTriangle, CheckCircle, Heart } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Badge } from '@/components/atoms/Badge'
import { ROUTES, PREGNANCY_STAGES, PREGNANCY_STAGE_LABELS } from '@/utils/constants'
import { cn } from '@/utils/cn'

const milestones = {
  first_trimester: [
    { week: 6, label: 'Heartbeat begins', done: true },
    { week: 8, label: 'Major organs forming', done: true },
    { week: 10, label: 'Fingers and toes visible', done: true },
    { week: 12, label: 'First trimester complete', done: true },
    { week: 16, label: '2nd ANC visit', done: false },
    { week: 20, label: '20-week anomaly scan', done: false },
  ],
  second_trimester: [
    { week: 16, label: '2nd ANC visit', done: true },
    { week: 18, label: 'Baby movements (quickening)', done: true },
    { week: 20, label: '20-week anomaly scan', done: true },
    { week: 24, label: 'Viability milestone', done: false },
    { week: 26, label: '4th ANC visit', done: false },
    { week: 28, label: 'Third trimester begins', done: false },
  ],
  third_trimester: [
    { week: 28, label: 'Third trimester begins', done: true },
    { week: 32, label: '5th ANC visit', done: true },
    { week: 36, label: 'Pack hospital bag', done: false },
    { week: 37, label: 'Baby considered full term', done: false },
    { week: 38, label: 'Final ANC visits', done: false },
    { week: 40, label: 'Expected due date', done: false },
  ],
  postpartum: [
    { week: 0, label: 'Baby born!', done: true },
    { week: 0, label: 'First breastfeed within 1 hour', done: true },
    { week: 1, label: 'Day 3 postnatal visit', done: true },
    { week: 2, label: 'Day 7–10 postnatal visit', done: false },
    { week: 6, label: '6-week postnatal check', done: false },
    { week: 6, label: 'Begin family planning discussion', done: false },
  ],
}

const stageInfo = {
  first_trimester: { weeks: 'Weeks 1–12', color: 'rose', emoji: '🌱', desc: 'Your baby\'s organs are forming. Focus on nutrition, rest, and early ANC registration.' },
  second_trimester: { weeks: 'Weeks 13–26', color: 'sage', emoji: '🌿', desc: 'Energy returns and your bump grows. Baby movements begin. Attend your 20-week scan.' },
  third_trimester: { weeks: 'Weeks 27–40', color: 'amber', emoji: '🌷', desc: 'Final preparations. Pack your hospital bag and know the signs of labour.' },
  postpartum: { weeks: 'After birth', color: 'purple', emoji: '👶', desc: 'Recovery and newborn care. Breastfeed, rest, and attend postnatal visits.' },
}

const colorClasses = {
  rose: 'bg-rose-100 text-rose-700 border-rose-200',
  sage: 'bg-sage-100 text-sage-700 border-sage-200',
  amber: 'bg-amber-100 text-amber-700 border-amber-200',
  purple: 'bg-purple-100 text-purple-700 border-purple-200',
}

export default function PregnancyProfilePage() {
  const { user, updateUser } = useAuth()
  const [editing, setEditing] = useState(false)
  const [stage, setStage] = useState(user?.pregnancyStage || PREGNANCY_STAGES.FIRST_TRIMESTER)
  const [weeks, setWeeks] = useState(user?.pregnancyWeeks || '')
  const [dueDate, setDueDate] = useState(user?.dueDate || '')
  const [saving, setSaving] = useState(false)

  const currentStage = stage || 'first_trimester'
  const info = stageInfo[currentStage]
  const stageMilestones = milestones[currentStage] || []

  async function handleSave() {
    setSaving(true)
    // Backend's PATCH /profile expects snake_case; pregnancyWeeks has no
    // backing column (not in user_profiles) so it stays local/optimistic only,
    // same as the onboarding wizard's handling of this same field.
    await updateUser({
      pregnancy_stage: stage,
      due_date: dueDate || null,
      pregnancyWeeks: weeks,
    })
    setSaving(false)
    setEditing(false)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Link to={ROUTES.PROFILE} className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-rose-700 mb-5 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        My Profile
      </Link>

      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
            <Baby className="w-5 h-5 text-rose-700" aria-hidden />
          </span>
          <div>
            <h1 className="font-display font-bold text-xl text-text-primary">Pregnancy Profile</h1>
            <p className="text-xs text-text-muted">Your pregnancy journey at a glance</p>
          </div>
        </div>
        <button
          onClick={() => editing ? handleSave() : setEditing(true)}
          disabled={saving}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-rose-700 hover:text-rose-800 transition-colors"
        >
          {editing ? (
            saving ? <span className="animate-spin w-4 h-4 border-2 border-rose-600 border-t-transparent rounded-full" /> : <><Save className="w-4 h-4" /> Save</>
          ) : (
            <><Edit2 className="w-4 h-4" /> Edit</>
          )}
        </button>
      </div>

      {/* Current stage card */}
      <div className={cn('rounded-2xl border p-5 mb-5', colorClasses[info.color])}>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl" aria-hidden>{info.emoji}</span>
          <div>
            <p className="font-display font-bold text-lg text-text-primary">
              {PREGNANCY_STAGE_LABELS[currentStage]}
            </p>
            <p className="text-xs text-text-muted">{info.weeks}</p>
          </div>
        </div>
        <p className="text-sm text-text-secondary leading-relaxed">{info.desc}</p>
      </div>

      {/* Editable details */}
      <div className="bg-white rounded-2xl border border-border p-4 mb-5">
        <h2 className="font-semibold text-sm text-text-primary mb-3">Pregnancy Details</h2>
        {editing ? (
          <div className="space-y-3">
            <div>
              <p className="text-xs font-medium text-text-primary mb-2">Current Stage</p>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(PREGNANCY_STAGE_LABELS).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setStage(value)}
                    className={cn(
                      'px-3 py-2 rounded-xl border text-xs font-semibold text-left transition-all',
                      stage === value ? 'border-rose-400 bg-rose-50 text-rose-800' : 'border-border bg-white text-text-secondary hover:border-rose-200'
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-text-primary block mb-1.5">
                Current week of pregnancy
              </label>
              <input
                type="number"
                min="1"
                max="42"
                value={weeks}
                onChange={e => setWeeks(e.target.value)}
                placeholder="e.g. 24"
                className="w-full h-10 px-3 rounded-xl border border-border text-sm focus:outline-2 focus:outline-rose-500"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-text-primary block mb-1.5">
                Expected due date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-border text-sm focus:outline-2 focus:outline-rose-500"
              />
            </div>
            <button
              onClick={() => setEditing(false)}
              className="text-sm text-text-muted hover:text-text-primary flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" /> Cancel
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-muted">Stage</span>
              <span className="font-medium text-text-primary">{PREGNANCY_STAGE_LABELS[currentStage]}</span>
            </div>
            {weeks && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-muted">Current Week</span>
                <span className="font-medium text-text-primary">Week {weeks}</span>
              </div>
            )}
            {dueDate && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-muted">Due Date</span>
                <span className="font-medium text-text-primary">{new Date(dueDate).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
            )}
            {!weeks && !dueDate && (
              <p className="text-xs text-text-muted italic">Tap Edit to add your week and due date.</p>
            )}
          </div>
        )}
      </div>

      {/* Milestones */}
      <div className="bg-white rounded-2xl border border-border p-4 mb-5">
        <h2 className="font-semibold text-sm text-text-primary mb-3 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-rose-600" aria-hidden />
          Key Milestones
        </h2>
        <ul className="space-y-2.5">
          {stageMilestones.map((m, i) => (
            <li key={i} className="flex items-center gap-3">
              <div className={cn('w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0',
                m.done ? 'border-success bg-success' : 'border-border bg-white'
              )}>
                {m.done && <CheckCircle className="w-3.5 h-3.5 text-white" aria-hidden />}
              </div>
              <span className={cn('text-xs flex-1', m.done ? 'text-text-muted line-through' : 'text-text-primary')}>
                {m.label}
              </span>
              {m.week > 0 && (
                <span className="text-xs text-text-muted">Wk {m.week}</span>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          to={ROUTES.EDUCATION_TRIMESTER}
          className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 hover:bg-rose-100 transition-colors"
        >
          <Baby className="w-5 h-5 text-rose-600 mb-1.5" aria-hidden />
          <p className="font-semibold text-xs text-rose-800">Trimester Guide</p>
          <p className="text-xs text-rose-600 mt-0.5">Week-by-week info</p>
        </Link>
        <Link
          to={ROUTES.EDUCATION_DANGER_SIGNS}
          className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 hover:bg-amber-100 transition-colors"
        >
          <AlertTriangle className="w-5 h-5 text-amber-600 mb-1.5" aria-hidden />
          <p className="font-semibold text-xs text-amber-800">Danger Signs</p>
          <p className="text-xs text-amber-600 mt-0.5">Know when to act</p>
        </Link>
      </div>
    </div>
  )
}
