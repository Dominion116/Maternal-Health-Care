import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Baby,
  CheckCircle,
  AlertTriangle,
  MessageCircle,
} from "lucide-react";
import { ROUTES } from "@/utils/constants";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/atoms/Badge";
import { cn } from "@/utils/cn";

// Maps the profile's pregnancy_stage to a tab; postpartum mothers see the
// third trimester (closest to their recent experience) by default.
const STAGE_TO_TAB = {
  first_trimester: "first",
  second_trimester: "second",
  third_trimester: "third",
  postpartum: "third",
};

const trimesters = [
  {
    id: "first",
    label: "1st Trimester",
    weeks: "Weeks 1–12",
    color: "rose",
    summary:
      "The first 12 weeks are when your baby's major organs form. You may feel tired, nauseous, and emotional. This is all completely normal.",
    babyDev: [
      "Heart starts beating around week 6",
      "Brain and spinal cord begin forming",
      "Tiny fingers and toes develop by week 10",
      "Baby is about 5–6 cm long by end of week 12",
      "All major internal organs are taking shape",
    ],
    bodyChanges: [
      "Morning sickness (nausea and sometimes vomiting)",
      "Breast tenderness and swelling",
      "Fatigue and need for more sleep",
      "Frequent urination",
      "Mood swings and emotional sensitivity",
      "Food cravings or sudden aversions",
    ],
    warningSigns: [
      "Heavy vaginal bleeding",
      "Severe abdominal pain or cramping",
      "High fever above 38°C",
      "Severe dizziness or fainting",
    ],
    tips: [
      "Start folic acid supplements if not already taking them",
      "Register for antenatal care (ANC) as early as possible",
      "Avoid alcohol, tobacco, and unprescribed drugs",
      "Eat small, frequent meals to manage nausea",
      "Rest when you feel tired; your body is working very hard",
    ],
  },
  {
    id: "second",
    label: "2nd Trimester",
    weeks: "Weeks 13–26",
    color: "sage",
    summary:
      "Many women feel much better in the second trimester. Nausea often eases and your baby grows rapidly. You will start to feel movements.",
    babyDev: [
      "Baby can hear sounds from outside the womb",
      "Movements (kicks) begin, usually felt between weeks 18 and 22",
      "Baby can suck its thumb and swallow",
      "Skin is forming, covered in fine hair called lanugo",
      "Baby weighs about 900g by week 26",
    ],
    bodyChanges: [
      "Baby bump becomes clearly visible",
      "Energy levels usually improve significantly",
      "Back pain may begin as belly grows",
      'Skin changes; some notice a "pregnancy glow"',
      "Stretch marks may appear on belly, breasts, or thighs",
      "Braxton Hicks practice contractions begin",
    ],
    warningSigns: [
      "Vaginal bleeding or fluid leaking",
      "Severe headache or blurred vision",
      "Sudden or severe swelling in face or hands",
      "Painful or burning urination (sign of infection)",
      "Baby not moving after week 20",
    ],
    tips: [
      "Attend your 20-week anomaly ultrasound scan",
      "Start sleeping on your left side for better circulation",
      "Do light exercise like walking or swimming",
      "Eat iron-rich foods: meat, leafy greens, beans, eggs",
      "Talk to your baby; they can hear you from the womb",
      "Begin planning for your hospital bag",
    ],
  },
  {
    id: "third",
    label: "3rd Trimester",
    weeks: "Weeks 27–40",
    color: "amber",
    summary:
      "Your baby is getting ready to be born. The final weeks involve important preparation for both you and your baby. Stay alert to your body.",
    babyDev: [
      "Baby gains weight rapidly, about 200g per week",
      "Lungs mature and prepare for breathing",
      "Baby usually settles head-down for birth by week 36",
      "Brain development continues at a rapid pace",
      "By week 40, baby typically weighs 3–3.5 kg",
    ],
    bodyChanges: [
      "Shortness of breath as baby pushes up on your lungs",
      "Difficulty sleeping; try sleeping with extra pillows",
      "Pelvic pressure and discomfort as baby drops",
      "Frequent urination returns",
      "Braxton Hicks contractions become more frequent",
      "Colostrum (early breast milk) may begin leaking",
    ],
    warningSigns: [
      "Sudden gush of fluid, meaning waters breaking early (before 37 weeks)",
      "Regular painful contractions before 37 weeks",
      "Severe headache, vision changes, or severe swelling (preeclampsia)",
      "Baby moving less than 10 times in 2 hours",
      "Any heavy vaginal bleeding",
    ],
    tips: [
      "Count baby movements daily; expect 10 in 2 hours",
      "Pack your hospital bag by week 36",
      "Attend all remaining ANC appointments without fail",
      "Discuss your birth preferences with your nurse or doctor",
      "Rest as much as possible; labour is hard work",
      "Know the signs of labour: contractions, water breaking, show",
    ],
  },
];

const colorMap = {
  rose: {
    tab: "border-rose-500 text-rose-700 bg-rose-50",
    section: "border-rose-200 bg-rose-50",
  },
  sage: {
    tab: "border-sage-500 text-sage-700 bg-sage-50",
    section: "border-sage-200 bg-sage-50",
  },
  amber: {
    tab: "border-amber-500 text-amber-700 bg-amber-50",
    section: "border-amber-200 bg-amber-50",
  },
};

export default function TrimesterPage() {
  const { user } = useAuth();
  const userTab = STAGE_TO_TAB[user?.pregnancyStage] || null;
  const [active, setActive] = useState(userTab || "first");
  const current = trimesters.find((t) => t.id === active);
  const colors = colorMap[current.color];

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
        <span className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
          <Baby className="w-5 h-5 text-rose-700" aria-hidden />
        </span>
        <div>
          <h1 className="font-display font-bold text-xl text-text-primary">
            Trimester Guide
          </h1>
          <p className="text-xs text-text-muted">
            Week-by-week pregnancy development
          </p>
        </div>
      </div>
      <p className="text-sm text-text-secondary leading-relaxed mb-6">
        Every pregnancy is unique, but understanding each trimester helps you
        know what to expect and when to seek care.
      </p>

      {userTab && (
        <div className="mb-4">
          <Badge variant="rose" size="sm">
            {user?.pregnancyStage === "postpartum"
              ? "You recently gave birth. Showing the 3rd trimester for reference."
              : "Opened at your current stage, based on your profile"}
          </Badge>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {trimesters.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={cn(
              "flex-1 min-w-25 px-3 py-2.5 rounded-xl border text-xs font-semibold text-center transition-all relative",
              active === t.id
                ? colorMap[t.color].tab + " border-current"
                : "border-border bg-white text-text-secondary hover:border-rose-200",
            )}
          >
            <span className="block">
              {t.label}
              {userTab === t.id && user?.pregnancyStage !== "postpartum" && (
                <span className="ml-1" aria-label="Your current stage">
                  📍
                </span>
              )}
            </span>
            <span className="block font-normal opacity-70">{t.weeks}</span>
          </button>
        ))}
      </div>

      <div className="space-y-4 animate-fade-in-up" key={active}>
        {/* Summary */}
        <div className={cn("rounded-2xl border p-4", colors.section)}>
          <p className="text-sm text-text-primary leading-relaxed">
            {current.summary}
          </p>
        </div>

        {/* Baby development */}
        <div className="bg-white rounded-2xl border border-border p-4">
          <h2 className="font-semibold text-sm text-text-primary mb-3">
            👶 Baby's Development
          </h2>
          <ul className="space-y-2">
            {current.babyDev.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2.5 text-sm text-text-secondary"
              >
                <CheckCircle
                  className="w-4 h-4 text-success shrink-0 mt-0.5"
                  aria-hidden
                />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Body changes */}
        <div className="bg-white rounded-2xl border border-border p-4">
          <h2 className="font-semibold text-sm text-text-primary mb-3">
            🌸 Changes in Your Body
          </h2>
          <ul className="space-y-2">
            {current.bodyChanges.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2.5 text-sm text-text-secondary"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0 mt-2"
                  aria-hidden
                />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Warning signs */}
        <div className="bg-red-50 rounded-2xl border border-red-200 p-4">
          <h2 className="font-semibold text-sm text-red-700 mb-3 flex items-center gap-2">
            <AlertTriangle
              className="w-4 h-4 text-red-600 shrink-0"
              aria-hidden
            />
            Warning Signs: Go to Hospital Immediately
          </h2>
          <ul className="space-y-2">
            {current.warningSigns.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2.5 text-sm text-red-700 font-medium"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-2" />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-red-600 font-semibold">
            Call 112 or go to the nearest hospital immediately if you notice any
            of these.
          </p>
        </div>

        {/* Tips */}
        <div className="bg-white rounded-2xl border border-border p-4">
          <h2 className="font-semibold text-sm text-text-primary mb-3">
            💡 Tips for This Trimester
          </h2>
          <ul className="space-y-2">
            {current.tips.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2.5 text-sm text-text-secondary"
              >
                <CheckCircle
                  className="w-4 h-4 text-sage-600 shrink-0 mt-0.5"
                  aria-hidden
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-6 p-4 bg-rose-50 rounded-2xl border border-rose-200">
        <p className="text-sm font-semibold text-text-primary mb-1">
          Have questions about your trimester?
        </p>
        <p className="text-xs text-text-secondary mb-3">
          Ask MamaGuide for personalised guidance based on your stage.
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
