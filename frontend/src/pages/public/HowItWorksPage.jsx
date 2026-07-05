import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import {
  UserPlus, ClipboardList, MessageCircle, BookOpen, Shield,
  ArrowRight, Heart, Star,
} from 'lucide-react'
import { Badge } from '@/components/atoms/Badge'
import { FadeUp, FadeStagger, FadeItem, SlideIn } from '@/components/atoms/FadeUp'
import { ROUTES } from '@/utils/constants'

const steps = [
  {
    number: '01',
    icon: UserPlus,
    color: 'bg-rose-100 text-rose-700',
    title: 'Create Your Free Account',
    desc: 'Sign up in under 2 minutes with just your name and email. Choose your role — pregnant woman, nurse, or researcher. Your data is private and secure.',
    detail: 'No credit card. No doctor referral. Just sign up and start.',
  },
  {
    number: '02',
    icon: ClipboardList,
    color: 'bg-sage-100 text-sage-700',
    title: 'Complete Quick Onboarding',
    desc: "Tell MamaGuide your pregnancy stage — first trimester, second trimester, third trimester, or postpartum. Select your preferred language. Read and agree to the medical disclaimer.",
    detail: 'Takes about 1 minute. Personalises your whole experience.',
  },
  {
    number: '03',
    icon: MessageCircle,
    color: 'bg-amber-100 text-amber-700',
    title: 'Ask Your Question',
    desc: "Type any pregnancy question in plain language — in English or your local language. MamaGuide's AI reads your message, understands your intent, and prepares a response.",
    detail: 'Try: "What should I eat in my second trimester?" or "What are the danger signs I should watch for?"',
  },
  {
    number: '04',
    icon: Shield,
    color: 'bg-blue-100 text-blue-700',
    title: 'Get a Trusted Answer',
    desc: "MamaGuide searches its knowledge base — built from WHO guidelines, FMOH Nigeria protocols, and the MOTHER dataset — and returns a clear, reliable answer with its confidence level.",
    detail: "Emergency phrases are automatically detected. You'll be directed to call 112 if needed.",
  },
  {
    number: '05',
    icon: BookOpen,
    color: 'bg-purple-100 text-purple-700',
    title: 'Explore Health Topics',
    desc: 'Browse the Health Education library for in-depth guides — trimester by trimester, nutrition, danger signs, ANC schedule, vaccines, mental health, birth prep, postpartum care, and breastfeeding.',
    detail: 'All content is sourced from verified medical guidelines and written in plain language.',
  },
  {
    number: '06',
    icon: Heart,
    color: 'bg-pink-100 text-pink-700',
    title: 'Continue Your Journey',
    desc: "Your conversation history is saved. Come back any time — day or night. MamaGuide is always available to answer your next question, no matter how small.",
    detail: "After using MamaGuide, you'll be invited to complete a 10-question evaluation survey to help improve the system.",
  },
]

const techFlow = [
  'Your message',
  'NLTK tokenisation + lemmatisation',
  'Bag of Words encoding',
  'Feedforward Neural Network',
  'Intent classification',
  'WHO/FMOH knowledge base',
  'Your answer + confidence score',
]

const sources = [
  { label: 'MOTHER Dataset', desc: 'Expert-curated maternal health Q&A pairs' },
  { label: 'WHO Guidelines', desc: '2016 ANC Recommendations and Safe Motherhood' },
  { label: 'FMOH Nigeria', desc: 'Federal Ministry of Health ANC protocols' },
]

export default function HowItWorksPage() {
  const reduce = useReducedMotion()

  return (
    <div className="overflow-x-hidden">

      {/* Hero */}
      <section className="bg-hero-gradient pt-20 pb-16 md:pt-28 md:pb-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <FadeUp>
            <Badge variant="amber" size="lg" dot className="mb-4">Step by Step</Badge>
          </FadeUp>
          <FadeUp delay={0.08}>
            <h1 className="font-display font-extrabold text-4xl md:text-5xl text-text-primary mb-4 leading-tight">
              How MamaGuide works
            </h1>
          </FadeUp>
          <FadeUp delay={0.14}>
            <p className="text-text-secondary text-lg leading-relaxed max-w-2xl mx-auto">
              From signing up to getting your first answer — here's everything you need to know
              about using MamaGuide safely and confidently.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 md:py-24 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-8">
            {steps.map((step, i) => (
              <FadeUp key={step.number} delay={Math.min(i * 0.05, 0.3)}>
                <div className="flex gap-5 md:gap-8">
                  {/* Left: number + connector */}
                  <div className="flex flex-col items-center">
                    <motion.div
                      className="w-12 h-12 rounded-2xl bg-rose-700 text-white font-display font-extrabold text-lg flex items-center justify-center shrink-0 shadow-rose"
                      whileHover={reduce ? {} : { scale: 1.05, rotate: -3 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                    >
                      {step.number}
                    </motion.div>
                    {i < steps.length - 1 && (
                      <div className="w-0.5 bg-rose-200 flex-1 mt-3" style={{ minHeight: '40px' }} />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${step.color}`} aria-hidden>
                        <step.icon className="w-5 h-5" />
                      </span>
                      <h2 className="font-display font-bold text-xl text-text-primary">{step.title}</h2>
                    </div>
                    <p className="text-text-secondary leading-relaxed mb-3">{step.desc}</p>
                    <div className="inline-flex items-start gap-2 px-3 py-2 bg-warm-white rounded-xl border border-border text-xs text-text-muted">
                      <Star className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5 fill-amber-400" aria-hidden />
                      {step.detail}
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Tech explanation */}
      <section className="py-16 md:py-20 px-4 bg-warm-white">
        <div className="max-w-4xl mx-auto">
          <FadeUp className="text-center mb-10">
            <Badge variant="sage" size="md" className="mb-3">Under the Hood</Badge>
            <h2 className="font-display font-bold text-2xl text-text-primary mb-3">
              How the AI processes your question
            </h2>
            <p className="text-text-secondary text-sm max-w-xl mx-auto">
              MamaGuide uses a Feedforward Neural Network with NLP processing to understand your
              questions and match them to verified health information.
            </p>
          </FadeUp>

          {/* Flow pipeline */}
          <FadeStagger
            className="flex flex-col md:flex-row items-center justify-center flex-wrap"
            stagger={0.07}
          >
            {techFlow.map((item, i) => (
              <FadeItem key={item} className="flex items-center">
                <div className="px-3 py-2 bg-white border border-border rounded-xl text-xs font-medium text-text-primary text-center shadow-xs m-1.5 hover:border-rose-300 hover:shadow-sm transition-all duration-200">
                  {item}
                </div>
                {i < techFlow.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-rose-400 shrink-0 mx-1 hidden md:block" aria-hidden />
                )}
              </FadeItem>
            ))}
          </FadeStagger>

          <FadeStagger className="mt-8 grid sm:grid-cols-3 gap-4" stagger={0.08}>
            {sources.map(s => (
              <FadeItem key={s.label}>
                <div className="bg-white rounded-2xl border border-border p-4 text-center hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                  <p className="font-semibold text-sm text-text-primary mb-1">{s.label}</p>
                  <p className="text-xs text-text-secondary">{s.desc}</p>
                </div>
              </FadeItem>
            ))}
          </FadeStagger>
        </div>
      </section>

      {/* Medical disclaimer */}
      <FadeUp>
        <section className="py-10 px-4 bg-amber-50 border-y border-amber-200">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-start gap-3">
              <Shield className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" aria-hidden />
              <div>
                <p className="font-semibold text-sm text-amber-800 mb-1">Important Medical Disclaimer</p>
                <p className="text-xs text-amber-700 leading-relaxed">
                  MamaGuide provides <strong>educational information only</strong>. It does not diagnose,
                  treat, or replace professional medical advice. Always consult your doctor or ANC nurse
                  for personal medical decisions. In an emergency, call <strong>112</strong> immediately.
                </p>
              </div>
            </div>
          </div>
        </section>
      </FadeUp>

      {/* CTA */}
      <section className="py-16 md:py-20 px-4 bg-brand-gradient">
        <FadeUp className="max-w-2xl mx-auto text-center">
          <h2 className="font-display font-bold text-3xl text-white mb-4">
            Start your first conversation
          </h2>
          <p className="text-white/80 mb-8">Free to use. No doctor visit needed. Ready in 2 minutes.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to={ROUTES.REGISTER}
              className="inline-flex items-center gap-2 bg-white text-rose-700 font-semibold px-8 py-3.5 rounded-2xl hover:bg-white/90 transition-colors shadow-sm"
            >
              Create Free Account
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to={ROUTES.FAQ}
              className="inline-flex items-center gap-2 bg-white/20 text-white border border-white/30 font-semibold px-6 py-3.5 rounded-2xl hover:bg-white/30 transition-colors"
            >
              Read FAQ
            </Link>
          </div>
        </FadeUp>
      </section>

    </div>
  )
}
