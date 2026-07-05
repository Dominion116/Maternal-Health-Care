import { Link } from 'react-router-dom'
import { ArrowLeft, Heart, MessageCircle, CheckCircle, Phone, AlertTriangle } from 'lucide-react'
import { Badge } from '@/components/atoms/Badge'
import { ROUTES } from '@/utils/constants'

const commonFeelings = [
  { emoji: '😟', feeling: 'Anxiety and worry', desc: 'Worrying about your baby\'s health, labour, or parenting is very common — you are not alone.' },
  { emoji: '😢', feeling: 'Mood swings', desc: 'Hormonal changes during pregnancy can cause sudden shifts in mood. This is normal.' },
  { emoji: '😔', feeling: 'Sadness or feeling low', desc: 'Some women experience depression during pregnancy (antenatal depression), not just after birth.' },
  { emoji: '😴', feeling: 'Exhaustion and stress', desc: 'Being tired all the time can affect your mood and feelings — rest is not a luxury, it\'s essential.' },
  { emoji: '💭', feeling: 'Fear about the future', desc: 'First-time mothers and women with previous pregnancy loss often feel increased fear — seek support.' },
]

const selfCareStrategies = [
  { emoji: '🚶', title: 'Stay gently active', desc: 'Light walking, prenatal yoga, or swimming releases feel-good hormones. Aim for 20–30 minutes most days.' },
  { emoji: '🛌', title: 'Prioritise sleep and rest', desc: 'Sleep on your left side from mid-pregnancy. Use pillows for support. Rest is not laziness — it is healing.' },
  { emoji: '🗣️', title: 'Talk about your feelings', desc: 'Share how you feel with your partner, a trusted friend, your nurse, or MamaGuide. Silence makes it worse.' },
  { emoji: '🙏', title: 'Practise relaxation', desc: 'Deep breathing, prayer, or gentle meditation can reduce anxiety. Even 5 minutes a day helps.' },
  { emoji: '🥗', title: 'Nourish your body', desc: 'Good nutrition supports mental health too. Omega-3-rich foods (fish, eggs) are linked to lower depression risk.' },
  { emoji: '👥', title: 'Build your support system', desc: 'Identify who will help you after birth. A support network is protective against postpartum depression.' },
]

const postpartumWarning = [
  'Feeling sad, hopeless, or empty most of the day for more than 2 weeks',
  'Difficulty bonding with your baby after birth',
  'Thoughts of harming yourself or your baby',
  'Inability to eat, sleep, or care for yourself',
  'Feeling detached from reality or having hallucinations',
  'Extreme irritability or rage that you cannot control',
]

const partnerSupport = [
  'Listen without judging — sometimes she just needs to be heard',
  'Help with household chores without being asked',
  'Attend ANC visits together when possible',
  'Learn about pregnancy changes so you can understand what she\'s going through',
  'Encourage her to rest and eat well',
  'Take her mental health concerns seriously — do not dismiss her feelings',
]

export default function MentalHealthPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Link to={ROUTES.EDUCATION} className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-rose-700 mb-5 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Health Education
      </Link>

      <div className="flex items-center gap-3 mb-2">
        <span className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
          <Heart className="w-5 h-5 text-purple-700" aria-hidden />
        </span>
        <div>
          <h1 className="font-display font-bold text-xl text-text-primary">Mental Health Support</h1>
          <p className="text-xs text-text-muted">Your emotional wellbeing matters</p>
        </div>
      </div>
      <p className="text-sm text-text-secondary leading-relaxed mb-6">
        Taking care of your mental health is just as important as your physical health during pregnancy. <strong>You are not alone</strong> — many women experience emotional challenges at this time.
      </p>

      {/* Reassurance banner */}
      <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 mb-6">
        <p className="text-sm text-purple-800 leading-relaxed">
          <span className="font-bold">💜 Remember:</span> Asking for help is a sign of strength, not weakness. Your feelings are valid. With the right support, you can and will feel better.
        </p>
      </div>

      {/* Common feelings */}
      <section className="mb-6">
        <h2 className="font-semibold text-base text-text-primary mb-3">Common Feelings During Pregnancy</h2>
        <div className="space-y-2">
          {commonFeelings.map(f => (
            <div key={f.feeling} className="bg-white rounded-xl border border-border p-3.5">
              <div className="flex items-start gap-2.5">
                <span className="text-xl shrink-0" aria-hidden>{f.emoji}</span>
                <div>
                  <p className="font-semibold text-sm text-text-primary">{f.feeling}</p>
                  <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Self-care */}
      <section className="mb-6">
        <h2 className="font-semibold text-base text-text-primary mb-3">How to Care for Your Mental Health</h2>
        <div className="space-y-3">
          {selfCareStrategies.map(s => (
            <div key={s.title} className="bg-white rounded-2xl border border-border p-4">
              <div className="flex items-start gap-2.5">
                <span className="text-xl shrink-0" aria-hidden>{s.emoji}</span>
                <div>
                  <p className="font-semibold text-sm text-text-primary">{s.title}</p>
                  <p className="text-xs text-text-secondary mt-1 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Postpartum depression warning */}
      <section className="mb-6">
        <div className="bg-red-50 rounded-2xl border border-red-200 p-4">
          <h2 className="font-semibold text-sm text-red-800 mb-2 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600" aria-hidden />
            Warning Signs — Seek Help Immediately
          </h2>
          <p className="text-xs text-red-700 mb-3">Tell your nurse, doctor, or a trusted person if you experience any of these:</p>
          <ul className="space-y-1.5">
            {postpartumWarning.map(w => (
              <li key={w} className="flex items-start gap-2 text-xs text-red-700">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-1.5" aria-hidden />
                {w}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* For partners */}
      <section className="mb-6">
        <div className="bg-blue-50 rounded-2xl border border-blue-200 p-4">
          <h2 className="font-semibold text-sm text-blue-800 mb-3">👨‍👩‍👧 For Partners and Family</h2>
          <ul className="space-y-2">
            {partnerSupport.map(s => (
              <li key={s} className="flex items-start gap-2 text-xs text-blue-700">
                <CheckCircle className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" aria-hidden />
                {s}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Emergency contacts */}
      <div className="bg-rose-50 rounded-2xl border border-rose-200 p-4 mb-5">
        <p className="font-semibold text-sm text-rose-800 mb-2 flex items-center gap-2">
          <Phone className="w-4 h-4" aria-hidden />
          Need to Talk?
        </p>
        <p className="text-xs text-rose-700 mb-2">If you are in crisis or having thoughts of harming yourself:</p>
        <p className="text-sm font-bold text-rose-800">Call 112 — National Emergency</p>
        <p className="text-xs text-rose-600 mt-1">Tell your ANC nurse or doctor at your next visit — they can help.</p>
      </div>

      <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200">
        <p className="text-sm font-semibold text-text-primary mb-1">Need someone to talk to right now?</p>
        <p className="text-xs text-text-secondary mb-3">MamaGuide is here to listen and support you, any time of day.</p>
        <Link
          to={ROUTES.CHAT}
          className="inline-flex items-center gap-2 bg-rose-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-rose-800 transition-colors"
        >
          <MessageCircle className="w-4 h-4" aria-hidden />
          Chat with MamaGuide
        </Link>
      </div>
    </div>
  )
}
