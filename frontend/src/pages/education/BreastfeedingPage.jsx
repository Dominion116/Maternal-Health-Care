import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Milk,
  CheckCircle,
  MessageCircle,
  AlertTriangle,
} from "lucide-react";
import { Badge } from "@/components/atoms/Badge";
import { ROUTES } from "@/utils/constants";

const benefits = {
  baby: [
    "Provides perfect nutrition tailored exactly to your baby's needs",
    "Contains antibodies that protect against infections and diseases",
    "Reduces risk of SIDS (sudden infant death syndrome)",
    "Lowers risk of diarrhoea, respiratory infections, and ear infections",
    "Supports brain development and intelligence",
    "Reduces risk of obesity, diabetes, and asthma later in life",
  ],
  mum: [
    "Helps your uterus contract and return to normal size faster",
    "Reduces postpartum bleeding",
    "Burns extra calories, which helps with healthy weight loss",
    "Reduces risk of breast cancer and ovarian cancer",
    "Provides natural contraception in the first 6 months (if exclusively breastfeeding)",
    "Strengthens the bond between you and your baby",
  ],
};

const howToLatch = [
  {
    step: "1",
    title: "Hold baby close",
    desc: "Hold your baby tummy-to-tummy with you. Their chin should touch your breast. Nose should be opposite your nipple.",
  },
  {
    step: "2",
    title: "Wait for a wide mouth",
    desc: "Touch your nipple to baby's upper lip. Wait for baby to open their mouth very wide, like a big yawn.",
  },
  {
    step: "3",
    title: "Bring baby to breast",
    desc: "When the mouth is wide open, quickly bring baby's head toward your breast (not your breast toward baby). Aim the nipple toward the roof of their mouth.",
  },
  {
    step: "4",
    title: "Check the latch",
    desc: "Baby's lips should be flanged outward (like a fish), not tucked in. You should see more of the areola below than above the mouth. You should feel drawing (pulling) but NOT pain.",
  },
  {
    step: "5",
    title: "Signs of good feeding",
    desc: "You will hear swallowing sounds. Baby's cheeks will be rounded, not sunken. Baby will seem satisfied after feeding and will release the breast on their own when full.",
  },
];

const commonProblems = [
  {
    problem: "Sore or cracked nipples",
    cause: "Usually caused by poor latch",
    solution:
      "Improve latch technique. Apply breast milk or lanolin cream to nipples after feeding. Ensure nipples dry between feeds.",
  },
  {
    problem: "Engorgement (very full, hard breasts)",
    cause: "Milk coming in suddenly (usually day 3–5 after birth)",
    solution:
      "Feed frequently, at least every 2–3 hours. Apply warm compress before feeding. Cold compress after feeding to reduce swelling.",
  },
  {
    problem: "Low milk supply",
    cause: "Infrequent feeding, poor latch, stress, or dehydration",
    solution:
      "Feed more frequently; supply follows demand. Ensure good latch. Drink plenty of water. Get support and rest.",
  },
  {
    problem: "Baby refusing to latch",
    cause: "Nipple confusion (bottles), tongue tie, or baby's positioning",
    solution:
      "Try skin-to-skin contact. Seek help from a nurse or lactation supporter early.",
  },
  {
    problem: "Mastitis (painful, red, hot breast with fever)",
    cause: "Blocked duct or infection",
    solution:
      "Continue breastfeeding (it helps). Apply warm compress. See a doctor; you may need antibiotics. Do not stop feeding.",
  },
];

const feedingSchedule = [
  {
    age: "0–1 month",
    frequency: "8–12 times per day",
    duration: "10–20 minutes per side",
    signs: "At least 6 wet nappies and 3–4 stools per day",
  },
  {
    age: "1–3 months",
    frequency: "7–9 times per day",
    duration: "10–15 minutes per side",
    signs: "Weight gain of about 150–200g per week",
  },
  {
    age: "3–6 months",
    frequency: "6–8 times per day",
    duration: "10–15 minutes per side",
    signs: "Baby is alert, content, and growing well",
  },
];

export default function BreastfeedingPage() {
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
        <span className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center shrink-0">
          <Milk className="w-5 h-5 text-pink-700" aria-hidden />
        </span>
        <div>
          <h1 className="font-display font-bold text-xl text-text-primary">
            Breastfeeding Guide
          </h1>
          <p className="text-xs text-text-muted">
            Everything you need to feed your baby
          </p>
        </div>
      </div>
      <p className="text-sm text-text-secondary leading-relaxed mb-4">
        Breast milk is the <strong>perfect food</strong> for your baby. The WHO
        and Nigeria's Federal Ministry of Health recommend{" "}
        <strong>exclusive breastfeeding for the first 6 months</strong> (no
        water, glucose water, or herbal teas), then continuing alongside solid
        foods until 2 years or beyond.
      </p>

      <div className="bg-pink-50 border border-pink-200 rounded-2xl p-4 mb-6">
        <p className="text-sm text-pink-800 leading-relaxed">
          <strong>💗 You can do this.</strong> Breastfeeding is a skill that
          takes practice. Most problems can be solved with the right support.
          Don't give up. Reach out to your nurse, or ask for the lactation
          support available at many Nigerian primary health centres.
        </p>
      </div>

      {/* Benefits */}
      <section className="mb-6">
        <h2 className="font-semibold text-base text-text-primary mb-3">
          Why Breastfeed?
        </h2>
        <div className="grid gap-3">
          <div className="bg-pink-50 border border-pink-200 rounded-2xl p-4">
            <h3 className="font-semibold text-sm text-pink-800 mb-2">
              👶 Benefits for Your Baby
            </h3>
            <ul className="space-y-1.5">
              {benefits.baby.map((b) => (
                <li
                  key={b}
                  className="flex items-start gap-2 text-xs text-text-secondary"
                >
                  <CheckCircle
                    className="w-3.5 h-3.5 text-pink-500 shrink-0 mt-0.5"
                    aria-hidden
                  />
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4">
            <h3 className="font-semibold text-sm text-rose-800 mb-2">
              👩 Benefits for You
            </h3>
            <ul className="space-y-1.5">
              {benefits.mum.map((b) => (
                <li
                  key={b}
                  className="flex items-start gap-2 text-xs text-text-secondary"
                >
                  <CheckCircle
                    className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5"
                    aria-hidden
                  />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* How to latch */}
      <section className="mb-6">
        <h2 className="font-semibold text-base text-text-primary mb-3">
          How to Get a Good Latch
        </h2>
        <div className="space-y-3">
          {howToLatch.map((step) => (
            <div key={step.step} className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-pink-100 border-2 border-pink-300 text-xs font-bold text-pink-700 flex items-center justify-center shrink-0 mt-0.5">
                {step.step}
              </div>
              <div className="flex-1 bg-white rounded-2xl border border-border p-3.5">
                <p className="font-semibold text-sm text-text-primary mb-1">
                  {step.title}
                </p>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Feeding schedule */}
      <section className="mb-6">
        <h2 className="font-semibold text-base text-text-primary mb-3">
          Feeding Frequency by Age
        </h2>
        <div className="space-y-2">
          {feedingSchedule.map((row) => (
            <div
              key={row.age}
              className="bg-white border border-border rounded-xl p-3.5"
            >
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="rose" size="sm">
                  {row.age}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-text-muted">Frequency</p>
                  <p className="font-semibold text-text-primary">
                    {row.frequency}
                  </p>
                </div>
                <div>
                  <p className="text-text-muted">Duration</p>
                  <p className="font-semibold text-text-primary">
                    {row.duration}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-text-muted">Signs of enough milk</p>
                  <p className="font-semibold text-text-primary">{row.signs}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Common problems */}
      <section className="mb-6">
        <h2 className="font-semibold text-base text-text-primary mb-3">
          Common Problems and Solutions
        </h2>
        <div className="space-y-3">
          {commonProblems.map((p) => (
            <div
              key={p.problem}
              className="bg-white rounded-2xl border border-border p-4"
            >
              <p className="font-semibold text-sm text-text-primary mb-1">
                {p.problem}
              </p>
              <p className="text-xs text-text-muted mb-1">
                <span className="font-medium">Cause:</span> {p.cause}
              </p>
              <p className="text-xs text-sage-700">
                <span className="font-medium text-text-primary">Solution:</span>{" "}
                {p.solution}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Warning */}
      <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-5">
        <p className="font-semibold text-sm text-red-800 mb-2 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-600" aria-hidden />
          When to Seek Help Urgently
        </p>
        <ul className="space-y-1 text-xs text-red-700">
          <li>
            • Baby losing weight after the first 5 days (or not back to birth
            weight by 2 weeks)
          </li>
          <li>• Fewer than 6 wet nappies per day after day 4</li>
          <li>• Baby is jaundiced and not feeding well</li>
          <li>
            • You have a fever, very painful breast, or red streaks on breast
            (mastitis)
          </li>
        </ul>
      </div>

      <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200">
        <p className="text-sm font-semibold text-text-primary mb-1">
          Need breastfeeding support?
        </p>
        <p className="text-xs text-text-secondary mb-3">
          Ask MamaGuide any question about feeding your baby.
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
