import { Link } from 'react-router-dom'
import { ArrowLeft, Calendar, CheckCircle, MessageCircle, Shield, AlertTriangle } from 'lucide-react'
import { Badge } from '@/components/atoms/Badge'
import { ROUTES } from '@/utils/constants'

const ancVisits = [
  {
    visit: '1st Visit',
    timing: 'As early as possible (ideally before 12 weeks)',
    gestationalAge: 'Before 12 weeks',
    what: [
      'Confirm pregnancy and due date (ultrasound)',
      'Blood tests — blood group, anaemia, HIV, malaria, syphilis',
      'Blood pressure and weight measurement',
      'Urine test for infection and protein',
      'Start folic acid and iron supplements',
      'Get tetanus toxoid (TT) vaccination',
      'Counselling on nutrition, danger signs, and birth planning',
    ],
    important: 'Register early — the first visit sets the foundation for your entire pregnancy care.',
    badge: { variant: 'rose', text: 'Most Important' },
  },
  {
    visit: '2nd Visit',
    timing: '4 weeks after 1st visit (around 16 weeks)',
    gestationalAge: 'Around 16 weeks',
    what: [
      'Check blood pressure and weight',
      'Urine test for protein and sugar (gestational diabetes check)',
      'Listen to baby\'s heartbeat for the first time',
      'Review blood test results from visit 1',
      'Second TT vaccination (if needed)',
      'Discuss any concerns or symptoms',
    ],
    important: 'You may hear your baby\'s heartbeat for the first time at this visit!',
    badge: { variant: 'sage', text: 'Routine' },
  },
  {
    visit: '3rd Visit',
    timing: 'Around 20 weeks',
    gestationalAge: 'Around 20 weeks',
    what: [
      '20-week anomaly ultrasound scan (most detailed scan)',
      'Check baby\'s growth and position',
      'Blood pressure and weight check',
      'Urine test',
      'Check for signs of pre-eclampsia',
      'Anaemia screening — take iron supplements if needed',
    ],
    important: 'The 20-week scan checks for major physical abnormalities in the baby.',
    badge: { variant: 'info', text: 'Scan Visit' },
  },
  {
    visit: '4th Visit',
    timing: 'Around 26 weeks',
    gestationalAge: 'Around 26 weeks',
    what: [
      'Blood pressure, weight, and urine checks',
      'Check baby\'s position and growth',
      'Test for gestational diabetes',
      'Check for iron deficiency anaemia',
      'Discuss birth preparedness plan',
      'Review danger signs to watch for',
    ],
    important: 'Start thinking about your birth plan and discussing it with your nurse.',
    badge: { variant: 'neutral', text: 'Routine' },
  },
  {
    visit: '5th Visit',
    timing: 'Around 32 weeks',
    gestationalAge: '32 weeks',
    what: [
      'Full check — blood pressure, weight, urine, fundal height',
      'Baby\'s position — check if baby is head-down',
      'Repeat blood tests if needed (anaemia, etc.)',
      'Discuss birth preparedness — signs of labour',
      'Pack your hospital bag (do this by week 36)',
      'Review emergency contacts and hospital route',
    ],
    important: 'Begin actively preparing for birth at this point. Know how to get to the hospital quickly.',
    badge: { variant: 'amber', text: 'Prepare for Birth' },
  },
  {
    visit: '6th–8th Visits',
    timing: 'Every 2 weeks from weeks 36–40',
    gestationalAge: 'Weeks 36–40',
    what: [
      'Frequent monitoring of blood pressure',
      'Baby\'s head engagement into pelvis',
      'Foetal heart rate monitoring',
      'Signs of pre-eclampsia check',
      'Finalise birth plan and hospital registration',
      'Discuss induction if pregnancy goes past 40 weeks',
    ],
    important: 'You are almost there! Attend every appointment — complications can arise quickly near term.',
    badge: { variant: 'rose', text: 'Final Stretch' },
  },
]

const whyAttend = [
  'Detect problems early before they become serious',
  'Monitor baby\'s growth and position',
  'Get essential vaccinations and supplements',
  'Receive personalised education and support',
  'Plan safely for labour and delivery',
  'Reduce risk of maternal and infant death',
]

export default function ANCSchedulePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Link to={ROUTES.EDUCATION} className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-rose-700 mb-5 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Health Education
      </Link>

      <div className="flex items-center gap-3 mb-2">
        <span className="w-10 h-10 rounded-xl bg-sage-100 flex items-center justify-center shrink-0">
          <Calendar className="w-5 h-5 text-sage-700" aria-hidden />
        </span>
        <div>
          <h1 className="font-display font-bold text-xl text-text-primary">ANC Schedule</h1>
          <p className="text-xs text-text-muted">Antenatal care visit guide</p>
        </div>
      </div>
      <p className="text-sm text-text-secondary leading-relaxed mb-4">
        The WHO recommends at least <strong>8 antenatal care (ANC) visits</strong> during pregnancy. Each visit protects both you and your baby.
      </p>

      <div className="flex items-center gap-2 p-3.5 bg-sage-50 border border-sage-200 rounded-xl mb-6">
        <Shield className="w-4.5 h-4.5 text-sage-600 shrink-0" aria-hidden />
        <p className="text-xs text-sage-700">Based on WHO 2016 ANC recommendations and FMOH Nigeria guidelines.</p>
      </div>

      {/* Why attend */}
      <div className="bg-white rounded-2xl border border-border p-4 mb-6">
        <h2 className="font-semibold text-sm text-text-primary mb-3 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-success" aria-hidden />
          Why ANC Visits Matter
        </h2>
        <ul className="space-y-1.5">
          {whyAttend.map(w => (
            <li key={w} className="flex items-start gap-2 text-sm text-text-secondary">
              <span className="w-1.5 h-1.5 rounded-full bg-sage-400 shrink-0 mt-2" aria-hidden />
              {w}
            </li>
          ))}
        </ul>
      </div>

      {/* Timeline */}
      <h2 className="font-semibold text-base text-text-primary mb-4">Your ANC Visit Timeline</h2>
      <div className="space-y-4">
        {ancVisits.map((visit, i) => (
          <div key={visit.visit} className="flex gap-4">
            {/* Timeline dot */}
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-rose-100 border-2 border-rose-300 flex items-center justify-center text-xs font-bold text-rose-700 shrink-0">
                {i + 1}
              </div>
              {i < ancVisits.length - 1 && (
                <div className="w-0.5 bg-rose-200 flex-1 mt-1 mb-0" style={{ minHeight: '24px' }} />
              )}
            </div>

            {/* Card */}
            <div className="flex-1 bg-white rounded-2xl border border-border p-4 mb-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h3 className="font-semibold text-sm text-text-primary">{visit.visit}</h3>
                  <p className="text-xs text-text-muted mt-0.5">{visit.timing}</p>
                </div>
                <Badge variant={visit.badge.variant} size="sm" className="shrink-0">{visit.badge.text}</Badge>
              </div>

              <ul className="space-y-1.5 mb-3">
                {visit.what.map(item => (
                  <li key={item} className="flex items-start gap-2 text-xs text-text-secondary">
                    <CheckCircle className="w-3.5 h-3.5 text-sage-500 shrink-0 mt-0.5" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="flex items-start gap-2 p-2.5 bg-amber-50 border border-amber-200 rounded-xl">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" aria-hidden />
                <p className="text-xs text-amber-700 leading-relaxed">{visit.important}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reminder */}
      <div className="bg-red-50 rounded-2xl border border-red-200 p-4 mb-5">
        <p className="font-semibold text-sm text-red-800 mb-1">⚠️ Never Miss an ANC Appointment</p>
        <p className="text-xs text-red-700 leading-relaxed">
          Missing visits puts you and your baby at risk. If you cannot attend, contact your health facility to reschedule as soon as possible. Tell your nurse about any symptoms between visits.
        </p>
      </div>

      <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200">
        <p className="text-sm font-semibold text-text-primary mb-1">Questions about your ANC visits?</p>
        <p className="text-xs text-text-secondary mb-3">Ask MamaGuide about what to expect at each visit.</p>
        <Link
          to={ROUTES.CHAT}
          className="inline-flex items-center gap-2 bg-rose-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-rose-800 transition-colors"
        >
          <MessageCircle className="w-4 h-4" aria-hidden />
          Ask MamaGuide
        </Link>
      </div>
    </div>
  )
}
