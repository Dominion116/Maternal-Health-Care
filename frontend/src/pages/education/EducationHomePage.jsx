import { Link } from "react-router-dom";
import {
  Baby,
  Apple,
  AlertTriangle,
  Calendar,
  Syringe,
  Brain,
  Package,
  Droplets,
  Milk,
  ArrowRight,
  BookOpen,
  Shield,
} from "lucide-react";
import { ROUTES } from "@/utils/constants";
import { Badge } from "@/components/atoms/Badge";
import { useAuth } from "@/hooks/useAuth";

// Which modules matter most at each pregnancy stage, in priority order.
// Used to float stage-relevant topics to the top with a "For you now" badge.
const STAGE_PRIORITIES = {
  first_trimester: [
    ROUTES.EDUCATION_TRIMESTER,
    ROUTES.EDUCATION_ANC,
    ROUTES.EDUCATION_NUTRITION,
    ROUTES.EDUCATION_DANGER_SIGNS,
  ],
  second_trimester: [
    ROUTES.EDUCATION_TRIMESTER,
    ROUTES.EDUCATION_NUTRITION,
    ROUTES.EDUCATION_VACCINES,
    ROUTES.EDUCATION_MENTAL_HEALTH,
  ],
  third_trimester: [
    ROUTES.EDUCATION_BIRTH_PREP,
    ROUTES.EDUCATION_DANGER_SIGNS,
    ROUTES.EDUCATION_ANC,
    ROUTES.EDUCATION_BREASTFEEDING,
  ],
  postpartum: [
    ROUTES.EDUCATION_POSTPARTUM,
    ROUTES.EDUCATION_BREASTFEEDING,
    ROUTES.EDUCATION_MENTAL_HEALTH,
    ROUTES.EDUCATION_VACCINES,
  ],
};

const STAGE_LABELS = {
  first_trimester: "first trimester",
  second_trimester: "second trimester",
  third_trimester: "third trimester",
  postpartum: "postpartum period",
};

const educationModules = [
  {
    icon: Baby,
    color: "bg-rose-100 text-rose-700",
    border: "border-rose-200",
    badge: { variant: "rose", text: "Essential" },
    title: "Trimester Guide",
    desc: "Week-by-week development guide for each trimester of your pregnancy",
    href: ROUTES.EDUCATION_TRIMESTER,
    topics: ["Fetal development", "Body changes", "When to worry"],
  },
  {
    icon: Apple,
    color: "bg-green-100 text-green-700",
    border: "border-green-200",
    badge: { variant: "sage", text: "Health" },
    title: "Nutrition",
    desc: "What to eat and avoid during pregnancy for a healthy baby",
    href: ROUTES.EDUCATION_NUTRITION,
    topics: ["Foods to eat", "Foods to avoid", "Supplements"],
  },
  {
    icon: AlertTriangle,
    color: "bg-red-100 text-red-700",
    border: "border-red-200",
    badge: { variant: "error", text: "Critical" },
    title: "Danger Signs",
    desc: "Recognise warning signs that need immediate medical attention",
    href: ROUTES.EDUCATION_DANGER_SIGNS,
    topics: ["Bleeding", "Severe pain", "Baby not moving"],
  },
  {
    icon: Calendar,
    color: "bg-sage-100 text-sage-700",
    border: "border-sage-200",
    badge: { variant: "sage", text: "Routine" },
    title: "ANC Schedule",
    desc: "Understanding antenatal care visits: what happens and when",
    href: ROUTES.EDUCATION_ANC,
    topics: ["Visit timeline", "What to expect", "Tests & scans"],
  },
  {
    icon: Syringe,
    color: "bg-blue-100 text-blue-700",
    border: "border-blue-200",
    badge: { variant: "info", text: "Prevention" },
    title: "Vaccines",
    desc: "Recommended vaccinations during pregnancy and for your newborn",
    href: ROUTES.EDUCATION_VACCINES,
    topics: ["Tetanus toxoid", "Flu vaccine", "Baby vaccines"],
  },
  {
    icon: Brain,
    color: "bg-purple-100 text-purple-700",
    border: "border-purple-200",
    badge: { variant: "neutral", text: "Wellbeing" },
    title: "Mental Health",
    desc: "Emotional support and mental wellness during and after pregnancy",
    href: ROUTES.EDUCATION_MENTAL_HEALTH,
    topics: ["Pregnancy anxiety", "Partner support", "Postpartum depression"],
  },
  {
    icon: Package,
    color: "bg-amber-100 text-amber-700",
    border: "border-amber-200",
    badge: { variant: "amber", text: "Prepare" },
    title: "Birth Preparedness",
    desc: "Get ready for labour, birth, and the first days with your baby",
    href: ROUTES.EDUCATION_BIRTH_PREP,
    topics: ["Hospital bag", "Birth plan", "Labour stages"],
  },
  {
    icon: Droplets,
    color: "bg-teal-100 text-teal-700",
    border: "border-teal-200",
    badge: { variant: "sage", text: "Recovery" },
    title: "Postpartum Care",
    desc: "Recovery after delivery and caring for yourself and your newborn",
    href: ROUTES.EDUCATION_POSTPARTUM,
    topics: ["Recovery tips", "Newborn care", "Postnatal visits"],
  },
  {
    icon: Milk,
    color: "bg-pink-100 text-pink-700",
    border: "border-pink-200",
    badge: { variant: "rose", text: "Feeding" },
    title: "Breastfeeding",
    desc: "Everything you need to know about breastfeeding your baby",
    href: ROUTES.EDUCATION_BREASTFEEDING,
    topics: ["How to latch", "Milk supply", "Common problems"],
  },
];

export default function EducationHomePage() {
  const { user } = useAuth();
  const stage = user?.pregnancyStage;
  const priorities = STAGE_PRIORITIES[stage] || [];

  // Stage-relevant modules first (in priority order), the rest below.
  const sortedModules = priorities.length
    ? [
        ...priorities
          .map((href) => educationModules.find((m) => m.href === href))
          .filter(Boolean),
        ...educationModules.filter((m) => !priorities.includes(m.href)),
      ]
    : educationModules;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-6">
        <div className="flex items-center gap-2.5 mb-2">
          <span className="w-9 h-9 rounded-xl bg-sage-100 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-sage-700" aria-hidden />
          </span>
          <h1 className="font-display font-bold text-xl text-text-primary">
            Health Education
          </h1>
        </div>
        <p className="text-sm text-text-secondary leading-relaxed">
          Evidence-based maternal health information from WHO guidelines and
          Nigerian ANC protocols.
        </p>
      </div>

      {/* WHO badge */}
      <div className="flex items-center gap-2 p-3.5 bg-sage-50 border border-sage-200 rounded-xl mb-6">
        <Shield className="w-4.5 h-4.5 text-sage-600 shrink-0" aria-hidden />
        <p className="text-xs text-sage-700 leading-relaxed">
          <strong>All content</strong> is based on WHO ANC guidelines and
          Federal Ministry of Health Nigeria protocols.
        </p>
      </div>

      {/* Stage-based personalization note */}
      {stage && (
        <p className="text-xs text-text-muted mb-3">
          Ordered for your {STAGE_LABELS[stage]}. Topics marked{" "}
          <span className="font-semibold text-rose-700">For you now</span> are
          the most relevant to your stage.
        </p>
      )}

      {/* Grid of modules */}
      <div className="space-y-3">
        {sortedModules.map((mod) => (
          <Link
            key={mod.href}
            to={mod.href}
            className={`block bg-white rounded-2xl border p-4 hover:shadow-md transition-all duration-200 group ${mod.border}`}
            aria-label={`Learn about ${mod.title}`}
          >
            <div className="flex items-start gap-3.5">
              <span
                className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${mod.color}`}
                aria-hidden
              >
                <mod.icon className="w-5.5 h-5.5" />
              </span>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h2 className="text-sm font-semibold text-text-primary group-hover:text-rose-700 transition-colors">
                    {mod.title}
                  </h2>
                  <Badge variant={mod.badge.variant} size="sm">
                    {mod.badge.text}
                  </Badge>
                  {priorities.includes(mod.href) && (
                    <Badge variant="rose" size="sm">
                      For you now
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-text-secondary leading-relaxed mb-2">
                  {mod.desc}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {mod.topics.map((t) => (
                    <span
                      key={t}
                      className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <ArrowRight
                className="w-4.5 h-4.5 text-text-muted group-hover:text-rose-700 shrink-0 mt-2 transition-colors"
                aria-hidden
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
