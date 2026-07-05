import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Package, CheckCircle, MessageCircle, AlertTriangle, Heart } from 'lucide-react'
import { Badge } from '@/components/atoms/Badge'
import { ROUTES } from '@/utils/constants'
import { cn } from '@/utils/cn'

const hospitalBag = [
  {
    category: 'For You (Mum)',
    color: 'rose',
    items: [
      { text: 'Maternity health card and ANC booklet', done: false },
      { text: 'Government-issued ID (NIMC card or voter\'s card)', done: false },
      { text: '2–3 loose, comfortable gowns or wrappers', done: false },
      { text: 'Sanitary pads (maternity size) — at least 2 packs', done: false },
      { text: 'Underwear — loose cotton (3–4 pairs)', done: false },
      { text: 'Toiletries: soap, toothbrush, toothpaste, deodorant', done: false },
      { text: 'Snacks and water bottle for labour', done: false },
      { text: 'Phone and charger', done: false },
      { text: 'Cash for hospital fees and medications', done: false },
    ],
  },
  {
    category: 'For Baby',
    color: 'sage',
    items: [
      { text: '4–6 baby vests or baby grows (newborn size)', done: false },
      { text: '2–3 baby blankets or shawls', done: false },
      { text: 'Newborn nappies (diapers) — one pack', done: false },
      { text: 'Baby hat and socks', done: false },
      { text: 'Baby wipes (unscented, for sensitive skin)', done: false },
      { text: 'Cord care supplies (as recommended by your facility)', done: false },
      { text: 'Going-home outfit for baby', done: false },
    ],
  },
  {
    category: 'Important Documents',
    color: 'amber',
    items: [
      { text: 'ANC booklet / antenatal card', done: false },
      { text: 'Hospital registration card (if already registered)', done: false },
      { text: 'National health insurance (NHIS) card if applicable', done: false },
      { text: 'Emergency contact numbers written down', done: false },
      { text: 'Birth plan (if prepared with your nurse)', done: false },
    ],
  },
]

const labourSigns = [
  { sign: 'Regular Contractions', desc: 'Contractions that come regularly, getting closer together (every 5 minutes or less) and lasting at least 60 seconds. This is the strongest sign of active labour.' },
  { sign: 'Waters Breaking', desc: 'A sudden gush or slow leak of clear or slightly pink fluid from your vagina. Your baby\'s membranes have ruptured. Go to hospital even if contractions haven\'t started.' },
  { sign: 'The "Show" (Mucus Plug)', desc: 'A thick, jelly-like mucus (possibly with a little blood) comes out of the vagina. Labour may be hours or days away — but it\'s beginning.' },
  { sign: 'Strong Back Pain', desc: 'Persistent lower back pain that doesn\'t ease with position changes, often accompanying contractions.' },
]

const labourStages = [
  { stage: 'Stage 1 — Early Labour', desc: 'Cervix opens from 0 to 10 cm. Contractions begin. This can take many hours (longer for first-time mothers). Stay calm, breathe, and time your contractions.' },
  { stage: 'Stage 2 — Active Labour and Pushing', desc: 'Cervix is fully open. You\'ll feel a strong urge to push. Your baby moves through the birth canal. This stage usually lasts 1–2 hours but varies.' },
  { stage: 'Stage 3 — Delivery of Placenta', desc: 'After baby is born, the placenta (afterbirth) is delivered. This usually takes 5–30 minutes. You may feel mild contractions.' },
]

const colorMap = {
  rose: 'border-rose-200 bg-rose-50',
  sage: 'border-sage-200 bg-sage-50',
  amber: 'border-amber-200 bg-amber-50',
}

export default function BirthPrepPage() {
  const [checkedItems, setCheckedItems] = useState({})

  function toggle(cat, i) {
    setCheckedItems(prev => ({
      ...prev,
      [`${cat}-${i}`]: !prev[`${cat}-${i}`],
    }))
  }

  const total = hospitalBag.reduce((sum, cat) => sum + cat.items.length, 0)
  const checked = Object.values(checkedItems).filter(Boolean).length

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Link to={ROUTES.EDUCATION} className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-rose-700 mb-5 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Health Education
      </Link>

      <div className="flex items-center gap-3 mb-2">
        <span className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
          <Package className="w-5 h-5 text-amber-700" aria-hidden />
        </span>
        <div>
          <h1 className="font-display font-bold text-xl text-text-primary">Birth Preparedness</h1>
          <p className="text-xs text-text-muted">Get ready for labour and delivery</p>
        </div>
      </div>
      <p className="text-sm text-text-secondary leading-relaxed mb-6">
        Being prepared for birth reduces fear and helps you stay calm. Start getting ready from <strong>week 34–36</strong> of your pregnancy.
      </p>

      {/* Signs of labour */}
      <section className="mb-6">
        <h2 className="font-semibold text-base text-text-primary mb-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600" aria-hidden />
          Signs That Labour Has Started
        </h2>
        <div className="space-y-2">
          {labourSigns.map(s => (
            <div key={s.sign} className="bg-amber-50 border border-amber-200 rounded-xl p-3.5">
              <p className="font-semibold text-sm text-amber-800 mb-1">{s.sign}</p>
              <p className="text-xs text-text-secondary leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-xs text-red-700 font-semibold">Go to hospital immediately if: waters break, bleeding occurs, baby stops moving, or contractions are 5 minutes apart.</p>
        </div>
      </section>

      {/* Labour stages */}
      <section className="mb-6">
        <h2 className="font-semibold text-base text-text-primary mb-3">The Three Stages of Labour</h2>
        <div className="space-y-3">
          {labourStages.map((s, i) => (
            <div key={s.stage} className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-rose-100 border-2 border-rose-300 text-xs font-bold text-rose-700 flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </div>
              <div className="flex-1 bg-white rounded-2xl border border-border p-3.5">
                <p className="font-semibold text-sm text-text-primary mb-1">{s.stage}</p>
                <p className="text-xs text-text-secondary leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Hospital bag checklist */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-base text-text-primary">Hospital Bag Checklist</h2>
          <span className="text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-full">
            {checked}/{total} packed
          </span>
        </div>

        {checked > 0 && (
          <div className="mb-4 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-rose-500 rounded-full transition-all duration-300"
              style={{ width: `${(checked / total) * 100}%` }}
            />
          </div>
        )}

        <div className="space-y-4">
          {hospitalBag.map(cat => (
            <div key={cat.category} className={cn('rounded-2xl border p-4', colorMap[cat.color])}>
              <h3 className="font-semibold text-sm text-text-primary mb-3">{cat.category}</h3>
              <ul className="space-y-2">
                {cat.items.map((item, i) => {
                  const key = `${cat.category}-${i}`
                  const isDone = checkedItems[key]
                  return (
                    <li key={i}>
                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!isDone}
                          onChange={() => toggle(cat.category, i)}
                          className="mt-0.5 w-4 h-4 rounded border-gray-300 text-rose-700 accent-rose-700"
                        />
                        <span className={cn('text-sm', isDone ? 'line-through text-text-muted' : 'text-text-secondary')}>
                          {item.text}
                        </span>
                      </label>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Emergency plan */}
      <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-5">
        <p className="font-semibold text-sm text-red-800 mb-2">📋 Your Emergency Birth Plan</p>
        <ul className="space-y-1.5 text-xs text-red-700">
          <li className="flex items-start gap-1.5"><CheckCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-red-500" /> Know the address and phone number of your nearest maternity hospital</li>
          <li className="flex items-start gap-1.5"><CheckCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-red-500" /> Have transport arranged for labour — do not plan to walk or use okada</li>
          <li className="flex items-start gap-1.5"><CheckCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-red-500" /> Have 2–3 people who know your due date and can help at any time</li>
          <li className="flex items-start gap-1.5"><CheckCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-red-500" /> Have money saved for hospital costs before labour starts</li>
          <li className="flex items-start gap-1.5"><CheckCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-red-500" /> Save emergency contact: 112 (national) or your midwife's number</li>
        </ul>
      </div>

      <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200">
        <p className="text-sm font-semibold text-text-primary mb-1">Questions about preparing for birth?</p>
        <p className="text-xs text-text-secondary mb-3">Ask MamaGuide anything about labour and delivery.</p>
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
