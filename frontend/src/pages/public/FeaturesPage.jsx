import { Link } from 'react-router-dom'
import {
  MessageCircle, BookOpen, AlertTriangle, Brain, Shield, Baby,
  Globe, Clock, Smartphone, BarChart3, Heart, Users, ArrowRight, CheckCircle, Sparkles,
} from 'lucide-react'
import { Badge } from '@/components/atoms/Badge'
import { Button } from '@/components/atoms/Button'
import { FadeUp, FadeStagger, FadeItem, SlideIn } from '@/components/atoms/FadeUp'
import { ROUTES } from '@/utils/constants'

const coreFeatures = [
  {
    icon: MessageCircle,
    color: 'bg-rose-100 text-rose-700',
    title: 'AI-Powered Chat',
    description: 'Ask any pregnancy question in plain language. MamaGuide understands your concern and gives clear, trustworthy answers instantly, with no jargon and no waiting.',
    highlights: ['Natural language understanding', '92%+ intent accuracy', '500+ health topics', 'Context-aware responses'],
  },
  {
    icon: AlertTriangle,
    color: 'bg-red-100 text-red-700',
    title: 'Emergency Detection',
    description: 'MamaGuide automatically detects danger signs and emergency situations in your messages, and immediately prompts you to seek emergency care.',
    highlights: ['Keyword-level detection', 'Instant emergency banner', 'Emergency numbers shown', 'Escalation guidance'],
  },
  {
    icon: BookOpen,
    color: 'bg-sage-100 text-sage-700',
    title: 'Health Education Library',
    description: 'Access a complete library of maternal health topics, from trimester guides and nutrition to ANC schedules, vaccines, and breastfeeding.',
    highlights: ['10 education modules', 'WHO-based content', 'Easy-to-read format', 'Always available offline'],
  },
  {
    icon: Brain,
    color: 'bg-purple-100 text-purple-700',
    title: 'Confidence Indicators',
    description: 'Every AI response shows a confidence level: high, medium, or low. When confidence is low, MamaGuide recommends consulting a healthcare provider.',
    highlights: ['Transparent AI scoring', 'Encourages professional care', 'Source citations', 'Honest about uncertainty'],
  },
  {
    icon: Baby,
    color: 'bg-pink-100 text-pink-700',
    title: 'Personalised Experience',
    description: 'After onboarding, MamaGuide tailors its suggested topics, prompts, and responses to your pregnancy stage, from first trimester to postpartum.',
    highlights: ['Stage-specific prompts', 'Personalised dashboard', 'Role-based views', 'Language preferences'],
  },
  {
    icon: Shield,
    color: 'bg-amber-100 text-amber-700',
    title: 'Trusted Medical Sources',
    description: 'All information is based on the MOTHER dataset, WHO ANC guidelines, and Federal Ministry of Health Nigeria protocols, verified and clinically sound.',
    highlights: ['WHO ANC guidelines', 'FMOH Nigeria protocols', 'MOTHER dataset', 'Expert-reviewed content'],
  },
]

const secondaryFeatures = [
  { icon: Globe, title: 'Multilingual Support', desc: 'English, Yoruba, Hausa, and Igbo (in development)' },
  { icon: Clock, title: 'Available 24/7', desc: "Get answers any time, even at 2am when you're worried" },
  { icon: Smartphone, title: 'Works on Any Phone', desc: 'Mobile-first design, works on low-end Android devices' },
  { icon: BarChart3, title: 'SUS Evaluation', desc: 'Validated with real users using the System Usability Scale' },
  { icon: Heart, title: 'Private and Secure', desc: 'Your health data stays private. JWT authentication.' },
  { icon: Users, title: 'For Nurses Too', desc: 'Dedicated interface for ANC nurses and healthcare workers' },
]

export default function FeaturesPage() {
  return (
    <div className="overflow-x-hidden">

      {/* Hero */}
      <section className="bg-hero-gradient pt-20 pb-16 md:pt-28 md:pb-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <FadeUp>
            <Badge variant="rose" size="lg" dot className="mb-4">What MamaGuide Can Do</Badge>
          </FadeUp>
          <FadeUp delay={0.08}>
            <h1 className="font-display font-extrabold text-4xl md:text-5xl text-text-primary mb-4 leading-tight">
              Features built for <span className="text-rose-700">Nigerian mothers</span>
            </h1>
          </FadeUp>
          <FadeUp delay={0.14}>
            <p className="text-text-secondary text-lg leading-relaxed max-w-2xl mx-auto mb-8">
              Every feature in MamaGuide was designed with one goal: helping pregnant women in
              Nigeria stay informed, safe, and supported throughout their journey.
            </p>
          </FadeUp>
          <FadeUp delay={0.2}>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to={ROUTES.REGISTER}
                className="inline-flex items-center justify-center gap-2 bg-rose-700 text-white font-semibold px-6 py-3.5 rounded-2xl hover:bg-rose-800 transition-colors shadow-sm"
              >
                <Sparkles className="w-4 h-4" />
                Try Free Now
              </Link>
              <Link
                to={ROUTES.HOW_IT_WORKS}
                className="inline-flex items-center justify-center gap-2 bg-white text-rose-700 border border-rose-200 font-semibold px-6 py-3.5 rounded-2xl hover:bg-rose-50 transition-colors"
              >
                How it works
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Core features */}
      <section className="py-16 md:py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <FadeUp className="text-center mb-12">
            <Badge variant="sage" size="md" className="mb-3">Core Capabilities</Badge>
            <h2 className="font-display font-bold text-3xl text-text-primary mb-3">
              Six features that change everything
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto">
              Built around the real needs of pregnant women and healthcare workers in Nigeria.
            </p>
          </FadeUp>

          <FadeStagger className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" stagger={0.08}>
            {coreFeatures.map(f => (
              <FadeItem key={f.title}>
                <div className="bg-warm-white rounded-2xl border border-border p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full group">
                  <span
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${f.color} group-hover:scale-110 transition-transform duration-300`}
                    aria-hidden
                  >
                    <f.icon className="w-6 h-6" />
                  </span>
                  <h3 className="font-semibold text-base text-text-primary mb-2">{f.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed mb-4">{f.description}</p>
                  <ul className="space-y-1.5">
                    {f.highlights.map(h => (
                      <li key={h} className="flex items-center gap-2 text-xs text-text-secondary">
                        <CheckCircle className="w-3.5 h-3.5 text-success shrink-0" aria-hidden />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeItem>
            ))}
          </FadeStagger>
        </div>
      </section>

      {/* Secondary features */}
      <section className="py-16 md:py-20 px-4 bg-warm-white">
        <div className="max-w-5xl mx-auto">
          <FadeUp className="text-center mb-10">
            <h2 className="font-display font-bold text-2xl text-text-primary mb-2">And much more</h2>
            <p className="text-text-secondary text-sm">Additional capabilities that make MamaGuide complete.</p>
          </FadeUp>

          <FadeStagger className="grid grid-cols-2 md:grid-cols-3 gap-4" stagger={0.07}>
            {secondaryFeatures.map(f => (
              <FadeItem key={f.title}>
                <div className="bg-white rounded-2xl border border-border p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 h-full">
                  <span className="w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center mb-3" aria-hidden>
                    <f.icon className="w-4.5 h-4.5 text-rose-600" />
                  </span>
                  <p className="font-semibold text-sm text-text-primary mb-1">{f.title}</p>
                  <p className="text-xs text-text-secondary leading-relaxed">{f.desc}</p>
                </div>
              </FadeItem>
            ))}
          </FadeStagger>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 px-4 bg-brand-gradient">
        <FadeUp className="max-w-2xl mx-auto text-center">
          <h2 className="font-display font-bold text-3xl text-white mb-4">
            Ready to experience MamaGuide?
          </h2>
          <p className="text-white/80 mb-8">Free to use. No appointment needed. Available 24/7 on any phone.</p>
          <Link
            to={ROUTES.REGISTER}
            className="inline-flex items-center gap-2 bg-white text-rose-700 font-semibold px-8 py-3.5 rounded-2xl hover:bg-white/90 transition-colors shadow-sm"
          >
            Create Free Account
            <ArrowRight className="w-4 h-4" />
          </Link>
        </FadeUp>
      </section>

    </div>
  )
}
