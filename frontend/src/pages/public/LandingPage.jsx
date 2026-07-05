import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import {
  Heart, MessageCircle, BookOpen, Shield, ArrowRight, Star,
  CheckCircle, Sparkles, Baby, AlertTriangle, Brain,
} from 'lucide-react'
import { Button } from '@/components/atoms/Button'
import { Badge } from '@/components/atoms/Badge'
import { FadeUp, FadeStagger, FadeItem, SlideIn } from '@/components/atoms/FadeUp'
import { ChatDemoAnimated } from '@/components/molecules/ChatDemoAnimated'
import { float, floatSlow, pulseRing, heartbeat } from '@/utils/motion'
import { ROUTES } from '@/utils/constants'

const features = [
  {
    icon: MessageCircle,
    color: 'bg-rose-100 text-rose-700',
    title: 'AI Chat Support',
    desc: 'Ask any pregnancy question in plain English. Get clear, trustworthy answers instantly.',
  },
  {
    icon: BookOpen,
    color: 'bg-sage-100 text-sage-700',
    title: 'Health Education',
    desc: 'Learn about ANC schedules, nutrition, danger signs, and birth preparedness.',
  },
  {
    icon: Shield,
    color: 'bg-amber-100 text-amber-700',
    title: 'Trusted Sources',
    desc: 'All information based on WHO guidelines and Nigerian FMOH ANC protocols.',
  },
  {
    icon: AlertTriangle,
    color: 'bg-red-100 text-red-700',
    title: 'Danger Sign Alerts',
    desc: 'Instantly detect emergency symptoms and connect you to real help.',
  },
  {
    icon: Baby,
    color: 'bg-purple-100 text-purple-700',
    title: 'Trimester-by-Trimester',
    desc: 'Personalised guidance for every stage of your pregnancy journey.',
  },
  {
    icon: Brain,
    color: 'bg-blue-100 text-blue-700',
    title: 'Mental Health Support',
    desc: 'Emotional support and mental wellness resources for expectant mothers.',
  },
]

const stats = [
  { value: '500+', label: 'Health topics covered' },
  { value: 'WHO', label: 'Guideline-based' },
  { value: '3', label: 'Nigerian languages' },
  { value: '24/7', label: 'Always available' },
]

const testimonials = [
  {
    name: 'Adaeze O.',
    role: 'Pregnant woman, Enugu',
    text: 'MamaGuide answered all my questions about my first trimester in simple English. I feel much more confident now.',
    stars: 5,
  },
  {
    name: 'Nurse Fatima A.',
    role: 'ANC Nurse, Kano',
    text: 'This tool helps my patients understand what I tell them. They come to appointments better prepared.',
    stars: 5,
  },
  {
    name: 'Chioma K.',
    role: 'Expectant mother, Lagos',
    text: 'I was worried about a symptom at 2am. MamaGuide helped me know it was not an emergency. Very reassuring.',
    stars: 5,
  },
]

// Floating SVG background accent for the hero
function HeroAccents({ reduce }) {
  if (reduce) return null
  return (
    <>
      {/* Top-right rose blob */}
      <div
        className="absolute top-16 right-0 w-72 h-72 bg-rose-100 rounded-full blur-3xl opacity-60 -translate-y-1/2 translate-x-1/3 pointer-events-none"
        aria-hidden
      />
      {/* Bottom-left sage blob */}
      <div
        className="absolute bottom-0 left-0 w-56 h-56 bg-sage-100 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/4 pointer-events-none"
        aria-hidden
      />

      {/* Floating heart top-right */}
      <motion.div
        className="absolute top-24 right-[8%] opacity-20 pointer-events-none hidden md:block"
        animate={float}
        aria-hidden
      >
        <Heart className="w-10 h-10 text-rose-500 fill-rose-400" />
      </motion.div>

      {/* Floating pulse ring — bottom right */}
      <motion.div
        className="absolute bottom-12 right-[12%] pointer-events-none hidden lg:block"
        aria-hidden
      >
        <motion.div
          className="w-16 h-16 rounded-full border-2 border-rose-300 opacity-30"
          animate={pulseRing}
        />
      </motion.div>

      {/* Floating tiny circle — left middle */}
      <motion.div
        className="absolute top-1/2 left-[5%] w-4 h-4 rounded-full bg-sage-300 opacity-40 pointer-events-none hidden lg:block"
        animate={floatSlow}
        aria-hidden
      />
    </>
  )
}

export default function LandingPage() {
  const reduce = useReducedMotion()

  return (
    <div className="overflow-x-hidden">
      {/* Skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 bg-rose-700 text-white px-4 py-2 rounded-lg z-999 font-medium"
      >
        Skip to main content
      </a>

      {/* ── HERO ──────────────────────────────────────────── */}
      <section
        id="main-content"
        className="bg-hero-gradient pt-24 pb-16 md:pt-32 md:pb-24 px-4 relative overflow-hidden"
      >
        <HeroAccents reduce={reduce} />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <FadeUp delay={0}>
            <Badge variant="rose" size="lg" dot className="mb-5">
              Final Year Project · Nigerian Maternal Health
            </Badge>
          </FadeUp>

          <FadeUp delay={0.08}>
            <h1 className="font-display font-extrabold text-4xl md:text-5xl lg:text-6xl text-text-primary leading-tight tracking-tight mb-5">
              Your trusted{' '}
              <span className="text-rose-700 relative inline-block">
                maternal health
                {/* Animated underline */}
                <motion.svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 300 8"
                  fill="none"
                  aria-hidden
                  initial={reduce ? {} : { pathLength: 0, opacity: 0 }}
                  animate={reduce ? {} : { pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <motion.path
                    d="M1 6C50 2 150 2 299 6"
                    stroke="#f83b6e"
                    strokeWidth="3"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                  />
                </motion.svg>
              </span>{' '}
              companion
            </h1>
          </FadeUp>

          <FadeUp delay={0.16}>
            <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed mb-8">
              AI-powered chatbot for pregnant women, ANC nurses, and healthcare workers.
              Get clear, trustworthy answers based on{' '}
              <strong className="text-text-primary">WHO guidelines</strong> and{' '}
              <strong className="text-text-primary">Nigerian ANC protocols</strong>.
            </p>
          </FadeUp>

          <FadeUp delay={0.22}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
              <Button
                as={Link}
                to={ROUTES.REGISTER}
                size="xl"
                iconRight={<ArrowRight className="w-5 h-5" />}
              >
                Start Chatting Free
              </Button>
              <Button as={Link} to={ROUTES.HOW_IT_WORKS} variant="secondary" size="xl">
                How it works
              </Button>
            </div>
          </FadeUp>

          {/* Stats */}
          <FadeStagger className="flex flex-wrap items-center justify-center gap-6" stagger={0.07}>
            {stats.map(s => (
              <FadeItem key={s.label} className="text-center">
                <p className="font-display font-extrabold text-2xl text-rose-700">{s.value}</p>
                <p className="text-xs text-text-muted mt-0.5">{s.label}</p>
              </FadeItem>
            ))}
          </FadeStagger>
        </div>
      </section>

      {/* ── CHAT DEMO ─────────────────────────────────────── */}
      <section className="py-16 md:py-24 px-4 bg-white" aria-labelledby="demo-heading">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">

            {/* Animated chat demo */}
            <SlideIn from="left" className="order-2 md:order-1">
              <ChatDemoAnimated />
            </SlideIn>

            {/* Copy */}
            <SlideIn from="right" delay={0.08} className="order-1 md:order-2">
              <Badge variant="sage" size="md" className="mb-4">
                Simple &amp; Reassuring
              </Badge>
              <h2
                id="demo-heading"
                className="font-display font-bold text-3xl md:text-4xl text-text-primary mb-4 leading-snug"
              >
                Get answers in seconds, not weeks
              </h2>
              <p className="text-text-secondary leading-relaxed mb-6">
                Stop waiting for your next ANC appointment to get answers. MamaGuide is
                available 24/7 to answer your pregnancy questions with care and clarity.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Plain English answers — no medical jargon',
                  'Emergency detection and escalation',
                  'Backed by WHO & FMOH guidelines',
                  'Works on any Android phone',
                ].map(item => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-text-primary">
                    <CheckCircle className="w-5 h-5 text-success shrink-0" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
              <Button
                as={Link}
                to={ROUTES.REGISTER}
                size="lg"
                iconRight={<ArrowRight className="w-4 h-4" />}
              >
                Try MamaGuide Free
              </Button>
            </SlideIn>
          </div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────── */}
      <section className="py-16 md:py-24 px-4 bg-warm-white" aria-labelledby="features-heading">
        <div className="max-w-6xl mx-auto">
          <FadeUp className="text-center mb-12">
            <Badge variant="amber" size="md" className="mb-4">
              What MamaGuide Can Do
            </Badge>
            <h2
              id="features-heading"
              className="font-display font-bold text-3xl md:text-4xl text-text-primary mb-4"
            >
              Everything you need for a healthy pregnancy
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto leading-relaxed">
              From first trimester to postpartum care, MamaGuide guides you through every
              stage of your maternal journey.
            </p>
          </FadeUp>

          <FadeStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" stagger={0.07}>
            {features.map(f => (
              <FadeItem key={f.title}>
                <div className="bg-white rounded-2xl p-6 border border-border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full group">
                  <span
                    className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${f.color} group-hover:scale-110 transition-transform duration-300`}
                    aria-hidden
                  >
                    <f.icon className="w-5.5 h-5.5" />
                  </span>
                  <h3 className="font-semibold text-text-primary text-base mb-2">{f.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{f.desc}</p>
                </div>
              </FadeItem>
            ))}
          </FadeStagger>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────── */}
      <section className="py-16 md:py-24 px-4 bg-white" aria-labelledby="testimonials-heading">
        <div className="max-w-6xl mx-auto">
          <FadeUp className="text-center mb-12">
            <Badge variant="rose" size="md" className="mb-4">
              User Stories
            </Badge>
            <h2
              id="testimonials-heading"
              className="font-display font-bold text-3xl text-text-primary mb-3"
            >
              Trusted by mothers &amp; nurses
            </h2>
          </FadeUp>

          <FadeStagger className="grid md:grid-cols-3 gap-5" stagger={0.1}>
            {testimonials.map(t => (
              <FadeItem key={t.name}>
                <figure className="bg-warm-white rounded-2xl p-6 border border-border hover:shadow-md transition-shadow duration-300 h-full flex flex-col">
                  <div className="flex mb-3" aria-label={`${t.stars} out of 5 stars`}>
                    {Array.from({ length: t.stars }, (_, i) => (
                      <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" aria-hidden />
                    ))}
                  </div>
                  <blockquote className="text-sm text-text-secondary leading-relaxed mb-4 flex-1">
                    "{t.text}"
                  </blockquote>
                  <figcaption>
                    <p className="text-sm font-semibold text-text-primary">{t.name}</p>
                    <p className="text-xs text-text-muted">{t.role}</p>
                  </figcaption>
                </figure>
              </FadeItem>
            ))}
          </FadeStagger>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className="py-16 md:py-20 px-4 bg-brand-gradient relative overflow-hidden" aria-labelledby="cta-heading">
        {/* Subtle floating accent */}
        {!reduce && (
          <motion.div
            className="absolute right-[10%] top-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-white/10 pointer-events-none hidden md:block"
            animate={floatSlow}
            aria-hidden
          />
        )}

        <FadeUp className="max-w-2xl mx-auto text-center relative z-10">
          <motion.div
            animate={reduce ? {} : heartbeat}
            className="inline-block mb-4"
            aria-hidden
          >
            <Sparkles className="w-10 h-10 text-white/80 mx-auto" />
          </motion.div>
          <h2
            id="cta-heading"
            className="font-display font-bold text-3xl md:text-4xl text-white mb-4"
          >
            Start your healthy pregnancy journey today
          </h2>
          <p className="text-white/80 text-lg mb-8 leading-relaxed">
            Free to use. No doctor visit needed. Available 24/7 on any phone.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              as={Link}
              to={ROUTES.REGISTER}
              variant="secondary"
              size="xl"
              iconRight={<ArrowRight className="w-5 h-5" />}
            >
              Create Free Account
            </Button>
            <Button
              as={Link}
              to={ROUTES.LOGIN}
              size="xl"
              className="bg-white/20 text-white border border-white/30 hover:bg-white/30"
            >
              Sign In
            </Button>
          </div>
        </FadeUp>
      </section>
    </div>
  )
}
