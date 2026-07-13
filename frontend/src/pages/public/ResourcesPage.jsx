import { Link } from 'react-router-dom'
import { ExternalLink, Phone, BookOpen, Globe, Baby, Heart, Shield, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/atoms/Badge'
import { ROUTES } from '@/utils/constants'

const emergencyContacts = [
  { name: 'National Emergency Services', number: '112', desc: 'Call for any medical emergency, available 24/7 across Nigeria' },
  { name: 'NPHCDA Helpline', number: '0800-NPHCDA', desc: 'National Primary Health Care Development Agency helpline' },
  { name: 'WHO Nigeria Office', number: '+234-9-461-7200', desc: 'World Health Organization Nigeria, for health queries' },
]

const healthFacilities = [
  { name: 'General Hospital (Federal)', desc: 'Federal government hospitals provide free or subsidised maternal care' },
  { name: 'Primary Health Care Centres (PHC)', desc: 'Local community facilities for ANC, immunisation, and delivery' },
  { name: 'Teaching Hospitals', desc: 'Major referral hospitals with specialist maternal-foetal care' },
  { name: 'State Hospitals', desc: 'State government facilities; check your local state health board' },
]

const externalResources = [
  {
    category: 'WHO Guidelines',
    icon: Globe,
    color: 'bg-blue-100 text-blue-700',
    items: [
      { title: 'WHO ANC Recommendations 2016', desc: 'The primary guideline behind MamaGuide\'s content' },
      { title: 'WHO Safe Motherhood', desc: 'Global maternal health programme and resources' },
      { title: 'WHO Nutrition for Pregnant Women', desc: 'Evidence-based nutrition guidance during pregnancy' },
    ],
  },
  {
    category: 'Nigeria Health Resources',
    icon: Heart,
    color: 'bg-rose-100 text-rose-700',
    items: [
      { title: 'Federal Ministry of Health (FMOH)', desc: 'Nigeria\'s national maternal health policies and protocols' },
      { title: 'NPHCDA Immunisation Schedule', desc: 'Official Nigeria childhood immunisation calendar' },
      { title: 'NHIS – National Health Insurance Scheme', desc: 'Register for government health insurance coverage' },
    ],
  },
  {
    category: 'Mental Health',
    icon: Baby,
    color: 'bg-purple-100 text-purple-700',
    items: [
      { title: 'Association of Psychiatrists in Nigeria', desc: 'Mental health support and referrals in Nigeria' },
      { title: 'Postpartum Depression Resources', desc: 'Understanding and addressing depression after birth' },
    ],
  },
]

const educationModules = [
  { label: 'Trimester Guide', href: ROUTES.EDUCATION_TRIMESTER, desc: 'Week-by-week pregnancy development' },
  { label: 'Nutrition', href: ROUTES.EDUCATION_NUTRITION, desc: 'What to eat for a healthy pregnancy' },
  { label: 'Danger Signs', href: ROUTES.EDUCATION_DANGER_SIGNS, desc: 'Warning signs that need immediate care' },
  { label: 'ANC Schedule', href: ROUTES.EDUCATION_ANC, desc: 'Antenatal care visit timeline' },
  { label: 'Vaccines', href: ROUTES.EDUCATION_VACCINES, desc: 'Immunisation schedule for mum and baby' },
  { label: 'Mental Health', href: ROUTES.EDUCATION_MENTAL_HEALTH, desc: 'Emotional wellbeing during pregnancy' },
]

export default function ResourcesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 md:py-24">
      {/* Header */}
      <div className="text-center mb-12">
        <Badge variant="sage" size="lg" dot className="mb-4">Helpful Resources</Badge>
        <h1 className="font-display font-extrabold text-4xl text-text-primary mb-4">Resources</h1>
        <p className="text-text-secondary leading-relaxed max-w-2xl mx-auto">
          Emergency contacts, health facilities, official guidelines, and MamaGuide's education library, everything in one place.
        </p>
      </div>

      {/* Emergency contacts */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center">
            <Phone className="w-4 h-4 text-red-600" aria-hidden />
          </div>
          <h2 className="font-display font-bold text-xl text-text-primary">Emergency Contacts</h2>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-2">
          {emergencyContacts.map((c, i) => (
            <div key={c.name} className={`flex items-center justify-between gap-4 p-3.5 rounded-xl ${i < emergencyContacts.length - 1 ? 'border-b border-red-200' : ''}`}>
              <div>
                <p className="font-semibold text-sm text-red-800">{c.name}</p>
                <p className="text-xs text-red-600 mt-0.5">{c.desc}</p>
              </div>
              <a
                href={`tel:${c.number}`}
                className="bg-red-600 text-white text-sm font-bold px-3 py-1.5 rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap"
                aria-label={`Call ${c.name}: ${c.number}`}
              >
                {c.number}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* MamaGuide Education */}
      <section className="mb-10">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sage-100 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-sage-600" aria-hidden />
            </div>
            <h2 className="font-display font-bold text-xl text-text-primary">MamaGuide Education Library</h2>
          </div>
          <Link to={ROUTES.EDUCATION} className="text-xs text-rose-700 hover:underline font-medium flex items-center gap-1">
            See all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          {educationModules.map(m => (
            <Link
              key={m.href}
              to={m.href}
              className="bg-white rounded-xl border border-border p-4 hover:shadow-md hover:-translate-y-0.5 transition-all group"
            >
              <p className="font-semibold text-sm text-text-primary group-hover:text-rose-700 transition-colors mb-1">{m.label}</p>
              <p className="text-xs text-text-secondary leading-relaxed">{m.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Health facilities */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center">
            <Shield className="w-4 h-4 text-blue-600" aria-hidden />
          </div>
          <h2 className="font-display font-bold text-xl text-text-primary">Types of Health Facilities in Nigeria</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {healthFacilities.map(f => (
            <div key={f.name} className="bg-white rounded-xl border border-border p-4">
              <p className="font-semibold text-sm text-text-primary mb-1">{f.name}</p>
              <p className="text-xs text-text-secondary leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-text-muted mt-3">
          To find your nearest facility, ask your local government health coordinator or community health extension worker (CHEW).
        </p>
      </section>

      {/* External resources */}
      <section className="mb-10">
        <h2 className="font-display font-bold text-xl text-text-primary mb-5">External Health Resources</h2>
        <div className="space-y-5">
          {externalResources.map(cat => (
            <div key={cat.category}>
              <div className="flex items-center gap-2 mb-3">
                <span className={`w-8 h-8 rounded-xl flex items-center justify-center ${cat.color}`} aria-hidden>
                  <cat.icon className="w-4 h-4" />
                </span>
                <h3 className="font-semibold text-base text-text-primary">{cat.category}</h3>
              </div>
              <div className="space-y-2">
                {cat.items.map(item => (
                  <div key={item.title} className="bg-white rounded-xl border border-border p-3.5 flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-sm text-text-primary">{item.title}</p>
                      <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-text-muted shrink-0 mt-0.5" aria-hidden />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="bg-brand-gradient rounded-3xl p-6 text-center text-white">
        <h2 className="font-display font-bold text-xl mb-2">Still have questions?</h2>
        <p className="text-white/80 text-sm mb-5">Ask MamaGuide directly; it's free and available 24/7.</p>
        <Link
          to={ROUTES.REGISTER}
          className="inline-flex items-center gap-2 bg-white text-rose-700 font-semibold px-6 py-3 rounded-xl hover:bg-white/90 transition-colors text-sm shadow-sm"
        >
          Start Chatting Free
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
