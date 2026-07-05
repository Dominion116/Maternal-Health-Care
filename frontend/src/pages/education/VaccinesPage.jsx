import { Link } from 'react-router-dom'
import { ArrowLeft, Syringe, CheckCircle, Shield, MessageCircle, Info } from 'lucide-react'
import { Badge } from '@/components/atoms/Badge'
import { ROUTES } from '@/utils/constants'

const maternalVaccines = [
  {
    name: 'Tetanus Toxoid (TT)',
    when: '2 doses during pregnancy (at least 4 weeks apart)',
    protects: 'You and your baby against tetanus — a life-threatening infection',
    sideEffects: 'Mild soreness at injection site, slight fever — normal and temporary',
    important: true,
    badge: { variant: 'rose', text: 'Essential' },
  },
  {
    name: 'Influenza (Flu) Vaccine',
    when: 'Any trimester, preferably before flu season',
    protects: 'Against severe flu complications — flu during pregnancy can be serious',
    sideEffects: 'Mild soreness or low-grade fever for 1–2 days',
    important: false,
    badge: { variant: 'sage', text: 'Recommended' },
  },
  {
    name: 'Hepatitis B Vaccine',
    when: 'If not previously vaccinated (3-dose series)',
    protects: 'Against hepatitis B — can be passed to baby during birth',
    sideEffects: 'Soreness at injection site — generally very safe',
    important: false,
    badge: { variant: 'info', text: 'Recommended' },
  },
]

const babyVaccines = [
  {
    age: 'At Birth',
    vaccines: [
      { name: 'BCG', protects: 'Tuberculosis (TB)' },
      { name: 'OPV-0 (Oral Polio)', protects: 'Poliomyelitis' },
      { name: 'Hepatitis B (Birth dose)', protects: 'Hepatitis B virus' },
    ],
  },
  {
    age: '6 Weeks Old',
    vaccines: [
      { name: 'OPV-1', protects: 'Polio' },
      { name: 'Penta-1 (DTP-HepB-Hib)', protects: 'Diphtheria, Tetanus, Whooping Cough, Hepatitis B, Hib' },
      { name: 'Pneumococcal-1 (PCV)', protects: 'Pneumonia and meningitis' },
      { name: 'Rotavirus-1', protects: 'Severe diarrhoea' },
    ],
  },
  {
    age: '10 Weeks Old',
    vaccines: [
      { name: 'OPV-2', protects: 'Polio' },
      { name: 'Penta-2', protects: 'Diphtheria, Tetanus, Whooping Cough, Hepatitis B, Hib' },
      { name: 'Pneumococcal-2 (PCV)', protects: 'Pneumonia and meningitis' },
      { name: 'Rotavirus-2', protects: 'Severe diarrhoea' },
    ],
  },
  {
    age: '14 Weeks Old',
    vaccines: [
      { name: 'OPV-3', protects: 'Polio' },
      { name: 'Penta-3', protects: 'Diphtheria, Tetanus, Whooping Cough, Hepatitis B, Hib' },
      { name: 'Pneumococcal-3 (PCV)', protects: 'Pneumonia and meningitis' },
      { name: 'IPV', protects: 'Polio (inactivated)' },
    ],
  },
  {
    age: '6 Months Old',
    vaccines: [
      { name: 'Vitamin A', protects: 'Vision and immune system' },
      { name: 'Meningococcal (MenA)', protects: 'Meningitis' },
    ],
  },
  {
    age: '9 Months Old',
    vaccines: [
      { name: 'Measles (MCV1)', protects: 'Measles — a serious childhood illness' },
      { name: 'Yellow Fever', protects: 'Yellow fever (required for travel)' },
      { name: 'Meningococcal Booster', protects: 'Meningitis' },
    ],
  },
]

const myths = [
  { myth: 'Vaccines cause autism', fact: 'This has been thoroughly disproven by hundreds of scientific studies. Vaccines are safe.' },
  { myth: 'My baby is too small or weak for vaccines', fact: 'Premature and small babies need vaccines even more urgently — they are at higher risk.' },
  { myth: 'Vaccines contain harmful ingredients', fact: 'All vaccine ingredients are tested for safety. The benefits far outweigh any very rare risks.' },
  { myth: 'Natural immunity is better than vaccine immunity', fact: 'Getting the disease is far more dangerous than getting the vaccine. Don\'t risk your baby\'s life.' },
]

export default function VaccinesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Link to={ROUTES.EDUCATION} className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-rose-700 mb-5 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Health Education
      </Link>

      <div className="flex items-center gap-3 mb-2">
        <span className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
          <Syringe className="w-5 h-5 text-blue-700" aria-hidden />
        </span>
        <div>
          <h1 className="font-display font-bold text-xl text-text-primary">Vaccinations Guide</h1>
          <p className="text-xs text-text-muted">Protect yourself and your baby</p>
        </div>
      </div>
      <p className="text-sm text-text-secondary leading-relaxed mb-4">
        Vaccines are one of the most effective ways to protect your baby from dangerous diseases. Most vaccines are <strong>free at government health facilities</strong> in Nigeria.
      </p>

      <div className="flex items-center gap-2 p-3.5 bg-sage-50 border border-sage-200 rounded-xl mb-6">
        <Shield className="w-4.5 h-4.5 text-sage-600 shrink-0" aria-hidden />
        <p className="text-xs text-sage-700">Based on Nigeria National Immunisation Schedule (NIS) and WHO recommendations.</p>
      </div>

      {/* Vaccines during pregnancy */}
      <section className="mb-6">
        <h2 className="font-semibold text-base text-text-primary mb-3 flex items-center gap-2">
          <Syringe className="w-4 h-4 text-rose-600" aria-hidden />
          Vaccines During Pregnancy
        </h2>
        <div className="space-y-3">
          {maternalVaccines.map(v => (
            <div key={v.name} className="bg-white rounded-2xl border border-border p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-semibold text-sm text-text-primary">{v.name}</h3>
                <Badge variant={v.badge.variant} size="sm" className="shrink-0">{v.badge.text}</Badge>
              </div>
              <div className="space-y-1.5 text-xs">
                <p className="text-text-secondary"><span className="font-medium text-text-primary">When:</span> {v.when}</p>
                <p className="text-text-secondary"><span className="font-medium text-text-primary">Protects against:</span> {v.protects}</p>
                <p className="text-text-muted"><span className="font-medium text-text-primary">Side effects:</span> {v.sideEffects}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Baby vaccine schedule */}
      <section className="mb-6">
        <h2 className="font-semibold text-base text-text-primary mb-3 flex items-center gap-2">
          <span aria-hidden>👶</span>
          Nigeria Baby Immunisation Schedule
        </h2>
        <div className="space-y-3">
          {babyVaccines.map(age => (
            <div key={age.age} className="bg-white rounded-2xl border border-border p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">{age.age}</span>
              </div>
              <ul className="space-y-2">
                {age.vaccines.map(v => (
                  <li key={v.name} className="flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-success shrink-0 mt-0.5" aria-hidden />
                    <div>
                      <span className="text-xs font-semibold text-text-primary">{v.name}</span>
                      <span className="text-xs text-text-muted ml-1">— {v.protects}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Myths */}
      <section className="mb-6">
        <h2 className="font-semibold text-base text-text-primary mb-3 flex items-center gap-2">
          <Info className="w-4 h-4 text-amber-600" aria-hidden />
          Common Myths About Vaccines
        </h2>
        <div className="space-y-2">
          {myths.map(m => (
            <div key={m.myth} className="bg-amber-50 border border-amber-200 rounded-xl p-3.5">
              <p className="text-xs font-bold text-red-700 mb-1">❌ Myth: "{m.myth}"</p>
              <p className="text-xs text-text-secondary leading-relaxed">✅ Fact: {m.fact}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200">
        <p className="text-sm font-semibold text-text-primary mb-1">Questions about vaccines?</p>
        <p className="text-xs text-text-secondary mb-3">Ask MamaGuide for more information about any vaccination.</p>
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
