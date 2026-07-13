import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Apple,
  CheckCircle,
  XCircle,
  MessageCircle,
  Shield,
} from "lucide-react";
import { Badge } from "@/components/atoms/Badge";
import { ROUTES } from "@/utils/constants";

const foodGroups = [
  {
    emoji: "🥬",
    title: "Leafy Vegetables",
    examples: "Ugwu, spinach, water leaf, bitter leaf",
    benefit: "Iron, folate, and vitamins that support baby's brain and blood",
    frequency: "Daily",
    variant: "sage",
  },
  {
    emoji: "🫘",
    title: "Beans & Legumes",
    examples: "Brown beans, black-eyed peas, lentils, soya",
    benefit: "Protein and iron without the cost of meat",
    frequency: "Daily",
    variant: "sage",
  },
  {
    emoji: "🥚",
    title: "Eggs & Dairy",
    examples: "Eggs, milk, yoghurt, cheese",
    benefit: "Protein and calcium for strong bones",
    frequency: "4–5 times/week",
    variant: "amber",
  },
  {
    emoji: "🐟",
    title: "Fish & Lean Meat",
    examples: "Mackerel (titus), tilapia, chicken, lean beef",
    benefit: "Complete protein and omega-3 fatty acids for baby's brain",
    frequency: "3–4 times/week",
    variant: "amber",
  },
  {
    emoji: "🌾",
    title: "Whole Grains",
    examples: "Brown rice, oats, whole wheat bread, millet",
    benefit: "Sustained energy and fibre to prevent constipation",
    frequency: "Daily",
    variant: "sage",
  },
  {
    emoji: "🍊",
    title: "Fruits",
    examples: "Oranges, pawpaw, banana, mango, tomatoes",
    benefit: "Vitamin C helps absorb iron; antioxidants protect both of you",
    frequency: "Daily",
    variant: "rose",
  },
];

const avoidFoods = [
  {
    emoji: "🍺",
    item: "Alcohol",
    reason:
      "Causes birth defects and low birth weight; no safe amount during pregnancy",
  },
  {
    emoji: "🐟",
    item: "High-mercury fish (shark, swordfish, king mackerel)",
    reason: "Mercury harms baby's developing nervous system",
  },
  {
    emoji: "🥩",
    item: "Raw or undercooked meat and eggs",
    reason:
      "Risk of salmonella and listeria infections, dangerous in pregnancy",
  },
  {
    emoji: "🧀",
    item: "Soft or mould-ripened cheeses (brie, camembert)",
    reason: "Risk of listeria bacteria that can cause miscarriage",
  },
  {
    emoji: "☕",
    item: "Excess caffeine (more than 200mg/day)",
    reason: "Can increase risk of miscarriage and low birth weight",
  },
  {
    emoji: "🌿",
    item: "Herbal teas and local herbs (without medical advice)",
    reason: "Some traditional herbs can trigger contractions or harm the baby",
  },
];

const supplements = [
  {
    name: "Folic Acid (400–800 mcg)",
    timing: "From before pregnancy to week 12",
    purpose: "Prevents neural tube defects (spina bifida)",
  },
  {
    name: "Iron (27 mg daily)",
    timing: "Throughout pregnancy",
    purpose: "Prevents anaemia and supports oxygen delivery to baby",
  },
  {
    name: "Calcium (1000 mg daily)",
    timing: "Throughout pregnancy",
    purpose: "Builds baby's bones and teeth",
  },
  {
    name: "Vitamin D",
    timing: "Throughout pregnancy",
    purpose: "Helps absorb calcium and supports immune system",
  },
  {
    name: "Iodine",
    timing: "Throughout pregnancy",
    purpose: "Essential for baby's brain development",
  },
];

const variantMap = {
  sage: "bg-sage-50 border-sage-200",
  amber: "bg-amber-50 border-amber-200",
  rose: "bg-rose-50 border-rose-200",
};

export default function NutritionPage() {
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
        <span className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
          <Apple className="w-5 h-5 text-green-700" aria-hidden />
        </span>
        <div>
          <h1 className="font-display font-bold text-xl text-text-primary">
            Nutrition During Pregnancy
          </h1>
          <p className="text-xs text-text-muted">
            What to eat for a healthy baby
          </p>
        </div>
      </div>
      <p className="text-sm text-text-secondary leading-relaxed mb-4">
        Good nutrition during pregnancy gives your baby the best start. You
        don't need to eat for two, just eat <strong>well</strong>.
      </p>

      <div className="flex items-center gap-2 p-3.5 bg-sage-50 border border-sage-200 rounded-xl mb-6">
        <Shield className="w-4.5 h-4.5 text-sage-600 shrink-0" aria-hidden />
        <p className="text-xs text-sage-700">
          Based on WHO nutrition guidelines and FMOH Nigeria maternal health
          protocols.
        </p>
      </div>

      {/* Foods to eat */}
      <section className="mb-6">
        <h2 className="font-semibold text-base text-text-primary mb-3 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-success" aria-hidden />
          Foods to Eat Every Week
        </h2>
        <div className="space-y-3">
          {foodGroups.map((food) => (
            <div
              key={food.title}
              className={`rounded-2xl border p-4 ${variantMap[food.variant]}`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl shrink-0" aria-hidden>
                  {food.emoji}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-semibold text-sm text-text-primary">
                      {food.title}
                    </h3>
                    <Badge variant="neutral" size="sm">
                      {food.frequency}
                    </Badge>
                  </div>
                  <p className="text-xs text-text-muted mb-1">
                    <em>Examples: {food.examples}</em>
                  </p>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {food.benefit}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Foods to avoid */}
      <section className="mb-6">
        <h2 className="font-semibold text-base text-text-primary mb-3 flex items-center gap-2">
          <XCircle className="w-5 h-5 text-error" aria-hidden />
          Foods and Drinks to Avoid
        </h2>
        <div className="space-y-2">
          {avoidFoods.map((food) => (
            <div
              key={food.item}
              className="bg-red-50 rounded-xl border border-red-200 p-3.5"
            >
              <div className="flex items-start gap-2.5">
                <span className="text-lg shrink-0" aria-hidden>
                  {food.emoji}
                </span>
                <div>
                  <p className="text-sm font-semibold text-red-800">
                    {food.item}
                  </p>
                  <p className="text-xs text-red-600 mt-0.5 leading-relaxed">
                    {food.reason}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Supplements */}
      <section className="mb-6">
        <h2 className="font-semibold text-base text-text-primary mb-3">
          💊 Important Supplements
        </h2>
        <p className="text-xs text-text-secondary mb-3">
          Always take supplements as recommended by your doctor or nurse. Do not
          self-prescribe.
        </p>
        <div className="space-y-2">
          {supplements.map((s) => (
            <div
              key={s.name}
              className="bg-white rounded-xl border border-border p-3.5"
            >
              <p className="font-semibold text-sm text-text-primary">
                {s.name}
              </p>
              <p className="text-xs text-text-muted mt-0.5">{s.timing}</p>
              <p className="text-xs text-text-secondary mt-1">{s.purpose}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Hydration */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6">
        <p className="font-semibold text-sm text-blue-800 mb-1">
          💧 Stay Hydrated
        </p>
        <p className="text-xs text-blue-700 leading-relaxed">
          Drink at least <strong>8–10 glasses of clean water</strong> every day.
          Proper hydration prevents urinary infections, reduces swelling, and
          helps carry nutrients to your baby. Avoid sugary drinks and sodas.
        </p>
      </div>

      {/* Ask CTA */}
      <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200">
        <p className="text-sm font-semibold text-text-primary mb-1">
          Questions about what to eat?
        </p>
        <p className="text-xs text-text-secondary mb-3">
          MamaGuide can give you personalised nutrition tips based on your
          trimester.
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
