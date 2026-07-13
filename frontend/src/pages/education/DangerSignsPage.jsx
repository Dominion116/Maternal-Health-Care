import { Link } from "react-router-dom";
import {
  AlertTriangle,
  Phone,
  ChevronLeft,
  ArrowRight,
  Siren,
} from "lucide-react";
import { ROUTES } from "@/utils/constants";
import { Badge } from "@/components/atoms/Badge";

const dangerSigns = [
  {
    emoji: "🩸",
    title: "Heavy Vaginal Bleeding",
    desc: "Any heavy bleeding from the vagina during pregnancy or after delivery needs immediate attention.",
    severity: "emergency",
    action: "Go to hospital immediately",
  },
  {
    emoji: "🤕",
    title: "Severe Headache",
    desc: "A severe headache that doesn't go away, especially with blurred vision, can be a sign of pre-eclampsia.",
    severity: "emergency",
    action: "Seek emergency care now",
  },
  {
    emoji: "👁️",
    title: "Blurred or Double Vision",
    desc: "Vision changes during pregnancy may be a sign of high blood pressure or pre-eclampsia.",
    severity: "emergency",
    action: "Go to hospital immediately",
  },
  {
    emoji: "🫁",
    title: "Difficulty Breathing",
    desc: "Sudden shortness of breath or difficulty breathing is an emergency sign.",
    severity: "emergency",
    action: "Call 112 now",
  },
  {
    emoji: "🤱",
    title: "Baby Not Moving",
    desc: "If you notice your baby has not moved for several hours (after 28 weeks), this needs urgent attention.",
    severity: "urgent",
    action: "Contact your midwife or hospital",
  },
  {
    emoji: "🤒",
    title: "High Fever",
    desc: "A temperature above 38°C (100.4°F) during pregnancy can be dangerous for you and your baby.",
    severity: "urgent",
    action: "See a doctor today",
  },
  {
    emoji: "😵",
    title: "Fainting or Convulsions",
    desc: "Losing consciousness or having a seizure during pregnancy is a medical emergency.",
    severity: "emergency",
    action: "Call 112 immediately",
  },
  {
    emoji: "🦵",
    title: "Swollen Face, Hands or Feet",
    desc: "Sudden or severe swelling, especially in the face or hands, may indicate pre-eclampsia.",
    severity: "urgent",
    action: "See a doctor urgently",
  },
  {
    emoji: "💊",
    title: "Severe Abdominal Pain",
    desc: "Persistent or severe pain in the belly that doesn't go away needs medical evaluation.",
    severity: "urgent",
    action: "Go to hospital",
  },
  {
    emoji: "💧",
    title: "Leaking Fluid (Waters Breaking)",
    desc: "If your waters break before 37 weeks, contact your healthcare provider immediately.",
    severity: "urgent",
    action: "Contact hospital right away",
  },
];

const severityConfig = {
  emergency: {
    label: "Emergency",
    className: "border-emergency/30 bg-emergency-light",
    badgeVariant: "emergency",
    badgeText: "Emergency: Act Now",
  },
  urgent: {
    label: "Urgent",
    className: "border-warning/30 bg-warning-light",
    badgeVariant: "warning",
    badgeText: "Urgent: See Doctor Today",
  },
};

export default function DangerSignsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Back */}
      <Link
        to={ROUTES.EDUCATION}
        className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-rose-700 transition-colors mb-5"
      >
        <ChevronLeft className="w-4 h-4" /> Back to Education
      </Link>

      {/* Header */}
      <div className="flex items-start gap-3.5 mb-3">
        <span className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center shrink-0">
          <AlertTriangle className="w-6 h-6 text-red-600" aria-hidden />
        </span>
        <div>
          <h1 className="font-display font-bold text-xl text-text-primary">
            Pregnancy Danger Signs
          </h1>
          <p className="text-sm text-text-secondary mt-1 leading-relaxed">
            Know the warning signs that need immediate medical attention.
          </p>
        </div>
      </div>

      {/* Emergency CTA */}
      <div className="bg-emergency text-white rounded-2xl p-4 mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <Siren className="w-6 h-6 shrink-0 animate-pulse-soft" aria-hidden />
          <div>
            <p className="font-bold text-sm">Experiencing an emergency?</p>
            <p className="text-white/80 text-xs">Call for help immediately</p>
          </div>
        </div>
        <a
          href="tel:112"
          className="bg-white text-emergency font-bold px-4 py-2 rounded-xl text-sm hover:bg-white/90 transition-colors whitespace-nowrap"
        >
          Call 112
        </a>
      </div>

      {/* Source badge */}
      <div className="flex items-center gap-2 p-3 bg-sage-50 border border-sage-200 rounded-xl mb-6 text-xs text-sage-700">
        <span aria-hidden>📚</span>
        Based on WHO Safe Motherhood guidelines and FMOH Nigeria ANC protocols
      </div>

      {/* Signs list */}
      <ul className="space-y-3" role="list" aria-label="Pregnancy danger signs">
        {dangerSigns.map((sign) => {
          const config = severityConfig[sign.severity];
          return (
            <li key={sign.title}>
              <div className={`rounded-2xl border p-4 ${config.className}`}>
                <div className="flex items-start gap-3">
                  <span className="text-2xl shrink-0 mt-0.5" aria-hidden>
                    {sign.emoji}
                  </span>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <h2 className="text-sm font-bold text-text-primary">
                        {sign.title}
                      </h2>
                      <Badge variant={config.badgeVariant} size="sm">
                        {config.badgeText}
                      </Badge>
                    </div>
                    <p className="text-sm text-text-secondary leading-relaxed mb-2">
                      {sign.desc}
                    </p>
                    <p className="text-xs font-semibold text-text-primary flex items-center gap-1">
                      <ArrowRight
                        className="w-3.5 h-3.5 text-rose-600"
                        aria-hidden
                      />
                      {sign.action}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Bottom reminder */}
      <div className="mt-6 p-4 bg-rose-50 rounded-2xl border border-rose-200">
        <div className="flex items-center gap-2 mb-2">
          <Phone className="w-4.5 h-4.5 text-rose-600" aria-hidden />
          <p className="font-semibold text-sm text-rose-800">
            Emergency Numbers
          </p>
        </div>
        <div className="space-y-1.5 text-sm text-rose-700">
          <p>
            National Emergency:{" "}
            <a href="tel:112" className="font-bold hover:underline">
              112
            </a>
          </p>
          <p>
            NPHCDA Helpline:{" "}
            <a href="tel:08006722467" className="font-bold hover:underline">
              0800-NPHCDA
            </a>
          </p>
        </div>
      </div>

      {/* Ask MamaGuide */}
      <Link
        to={ROUTES.CHAT}
        className="mt-4 flex items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-border hover:shadow-md transition-all group"
      >
        <div className="flex items-center gap-3">
          <span className="w-9 h-9 rounded-xl bg-brand-gradient flex items-center justify-center shrink-0">
            <span className="text-white text-sm font-bold">M</span>
          </span>
          <div>
            <p className="text-sm font-semibold text-text-primary group-hover:text-rose-700 transition-colors">
              Have a question about a symptom?
            </p>
            <p className="text-xs text-text-muted">
              Ask MamaGuide for guidance
            </p>
          </div>
        </div>
        <ArrowRight
          className="w-4.5 h-4.5 text-text-muted group-hover:text-rose-700 transition-colors shrink-0"
          aria-hidden
        />
      </Link>
    </div>
  );
}
