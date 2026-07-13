import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Droplets,
  MessageCircle,
  AlertTriangle,
} from "lucide-react";
import { Badge } from "@/components/atoms/Badge";
import { ROUTES } from "@/utils/constants";

const maternalRecovery = [
  {
    emoji: "🩹",
    title: "Perineal Care (after vaginal birth)",
    desc: "Keep the area clean and dry. Use warm water to rinse after using the toilet. Change sanitary pads frequently. Pain should improve within a week.",
  },
  {
    emoji: "🔪",
    title: "Caesarean Section Recovery",
    desc: "Avoid heavy lifting for 6 weeks. Keep the wound clean and dry. Watch for signs of infection: redness, swelling, or discharge from the wound.",
  },
  {
    emoji: "🩸",
    title: "Lochia (Postpartum Bleeding)",
    desc: "Normal bleeding after birth lasts 4–6 weeks. It starts bright red, then becomes pink, then white/yellow. Soaking a pad in less than an hour is abnormal; seek help.",
  },
  {
    emoji: "💊",
    title: "Postnatal Vitamins",
    desc: "Continue iron and folic acid supplements. Breastfeeding women need extra nutrition. Your nurse will advise on what to take.",
  },
  {
    emoji: "🛌",
    title: "Rest and Recovery",
    desc: "Sleep when your baby sleeps. Accept help from family. Do not try to do everything yourself in the first weeks; recovery takes time.",
  },
  {
    emoji: "🏃",
    title: "Return to Exercise",
    desc: "Light walking can begin as soon as you feel ready. Wait at least 6 weeks (and get medical clearance) before vigorous exercise or sex.",
  },
];

const newbornCare = [
  {
    emoji: "🍼",
    title: "Feeding",
    desc: "Breastfeed exclusively for the first 6 months, as recommended by the WHO and Nigeria's Federal Ministry of Health. Feed on demand, whenever baby shows hunger cues (rooting, sucking movements). 8–12 feeds per day in the first weeks is normal.",
  },
  {
    emoji: "👶",
    title: "Cord Care",
    desc: "Keep the umbilical cord stump clean and dry. Do not cover it with the nappy. It will fall off in 7–14 days. Do not apply traditional substances such as hot compress, toothpaste, or herbal mixtures; they can cause dangerous infection. Chlorhexidine gel from your health facility is the recommended cord care in Nigeria.",
  },
  {
    emoji: "🛁",
    title: "Bathing",
    desc: "Sponge bath only until the cord stump falls off. Bath water should be warm (not hot). Support the baby's head at all times during bathing.",
  },
  {
    emoji: "😴",
    title: "Safe Sleep",
    desc: "Always place baby on their back to sleep. Use a firm, flat surface. Keep the sleeping area free from pillows, soft toys, and loose bedding.",
  },
  {
    emoji: "🌡️",
    title: "Temperature",
    desc: "Keep baby warm but not overheated. Dress them in one more layer than you are wearing. Check by touching the back of the neck; it should be warm, not sweaty.",
  },
  {
    emoji: "💛",
    title: "Jaundice",
    desc: "Yellowing of skin or eyes in the first week is common. Mild jaundice usually clears on its own with frequent feeding. Severe jaundice needs medical treatment; go to hospital. Avoid unproven remedies like glucose water or exposing baby to direct hot sun.",
  },
];

const warningSignsMum = [
  "Heavy bleeding: soaking more than one pad per hour for 2+ hours",
  "Severe headache, vision changes, or swelling (signs of pre-eclampsia that can happen after birth)",
  "High fever above 38°C, which may indicate infection",
  "Wound that is red, swollen, or producing discharge",
  "Feeling very sad, hopeless, or having thoughts of harming yourself or your baby",
  "Inability to urinate normally within 6 hours of birth",
];

const warningSignsBaby = [
  "Jaundice (yellow skin/eyes) worsening or not improving by day 5",
  "High fever or baby is very cold to touch",
  "Difficulty breathing or fast breathing (more than 60 breaths per minute)",
  "Baby not feeding for more than 4 hours",
  "Umbilical cord showing redness, swelling, or foul smell",
  "Baby appears limp, unresponsive, or has seizures",
];

const postnatalVisits = [
  {
    timing: "Within 24 hours of birth",
    purpose:
      "Check for complications in mum and baby. Vitamin K injection for baby.",
  },
  {
    timing: "3 days after birth",
    purpose:
      "Check feeding, jaundice, and wound healing. Family planning counselling.",
  },
  {
    timing: "7–10 days after birth",
    purpose:
      "Check baby's weight gain and cord healing. Assess for postnatal depression.",
  },
  {
    timing: "6 weeks after birth",
    purpose:
      "Full check for mum and baby. Routine immunisations continue per the NPHCDA schedule. Discuss family planning and return to work.",
  },
];

export default function PostpartumPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <Link
        to={ROUTES.EDUCATION}
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-rose-700 mb-5 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Health Education
      </Link>

      <div className="flex items-center gap-3 mb-2">
        <span className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center shrink-0">
          <Droplets className="w-5 h-5 text-teal-700" aria-hidden />
        </span>
        <div>
          <h1 className="font-display font-bold text-xl text-text-primary">
            Postpartum Care
          </h1>
          <p className="text-xs text-text-muted">
            Recovery after birth, for you and your baby
          </p>
        </div>
      </div>
      <p className="text-sm text-text-secondary leading-relaxed mb-6">
        The weeks after birth (the "fourth trimester") are a critical time. Your
        body is healing and you are learning to care for your newborn. Be gentle
        with yourself.
      </p>

      {/* Reassurance */}
      <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4 mb-6">
        <p className="text-sm text-teal-800 leading-relaxed">
          <strong>💙 You did something incredible.</strong> Your body needs time
          to recover. It is normal to feel overwhelmed, tired, and emotional in
          the weeks after birth. This is the hardest and most beautiful
          transition of your life.
        </p>
      </div>

      {/* Mum recovery */}
      <section className="mb-6">
        <h2 className="font-semibold text-base text-text-primary mb-3">
          Your Recovery After Birth
        </h2>
        <div className="space-y-2">
          {maternalRecovery.map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-xl border border-border p-3.5"
            >
              <div className="flex items-start gap-2.5">
                <span className="text-xl shrink-0" aria-hidden>
                  {item.emoji}
                </span>
                <div>
                  <p className="font-semibold text-sm text-text-primary">
                    {item.title}
                  </p>
                  <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newborn care */}
      <section className="mb-6">
        <h2 className="font-semibold text-base text-text-primary mb-3">
          Caring for Your Newborn
        </h2>
        <div className="space-y-2">
          {newbornCare.map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-xl border border-border p-3.5"
            >
              <div className="flex items-start gap-2.5">
                <span className="text-xl shrink-0" aria-hidden>
                  {item.emoji}
                </span>
                <div>
                  <p className="font-semibold text-sm text-text-primary">
                    {item.title}
                  </p>
                  <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Postnatal visits */}
      <section className="mb-6">
        <h2 className="font-semibold text-base text-text-primary mb-3">
          Postnatal Check-Up Schedule
        </h2>
        <p className="text-xs text-text-muted mb-3">
          This is the schedule recommended by the WHO and Nigeria's Federal
          Ministry of Health. Visits are available at primary health centres
          across Nigeria.
        </p>
        <div className="space-y-2">
          {postnatalVisits.map((v) => (
            <div
              key={v.timing}
              className="bg-sage-50 border border-sage-200 rounded-xl p-3.5"
            >
              <Badge variant="sage" size="sm" className="mb-1">
                {v.timing}
              </Badge>
              <p className="text-xs text-text-secondary leading-relaxed mt-1">
                {v.purpose}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Warning signs */}
      <section className="mb-6">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-3">
          <h2 className="font-semibold text-sm text-red-800 mb-2 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600" aria-hidden />
            Warning Signs for Mum (Seek Help Immediately)
          </h2>
          <ul className="space-y-1.5">
            {warningSignsMum.map((w) => (
              <li
                key={w}
                className="flex items-start gap-2 text-xs text-red-700"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-1.5" />
                {w}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4">
          <h2 className="font-semibold text-sm text-orange-800 mb-2 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-600" aria-hidden />
            Warning Signs for Baby (Go to Hospital Immediately)
          </h2>
          <ul className="space-y-1.5">
            {warningSignsBaby.map((w) => (
              <li
                key={w}
                className="flex items-start gap-2 text-xs text-orange-700"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0 mt-1.5" />
                {w}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-orange-700 font-semibold">
            In an emergency, call 112 (Nigeria's toll-free emergency line) or
            go to the nearest hospital.
          </p>
        </div>
      </section>

      <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200">
        <p className="text-sm font-semibold text-text-primary mb-1">
          Questions about recovery or your newborn?
        </p>
        <p className="text-xs text-text-secondary mb-3">
          Ask MamaGuide any postpartum question. We are here for you.
        </p>
        <Link
          to={ROUTES.CHAT}
          className="inline-flex items-center gap-2 bg-rose-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-rose-800 transition-colors"
        >
          <MessageCircle className="w-4 h-4" aria-hidden />
          Ask MamaGuide
        </Link>
      </div>
    </div>
  );
}
