import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  MessageCircle,
  BookOpen,
  AlertTriangle,
  Calendar,
  Baby,
  ArrowRight,
  Heart,
  Sparkles,
  Activity,
  Clock,
  ChevronRight,
  Leaf,
  Star,
  Shield,
  Moon,
  Droplets,
  Package,
} from "lucide-react";
import { Badge } from "@/components/atoms/Badge";
import { Card } from "@/components/atoms/Card";
import { Button } from "@/components/atoms/Button";
import { useAuth } from "@/hooks/useAuth";
import { useConversationHistory } from "@/hooks/useConversationHistory";
import { chatService } from "@/services/chatService";
import { ROUTES, SUGGESTED_PROMPTS } from "@/utils/constants";
import { formatWeeksPregnant, formatRelativeTime } from "@/utils/formatters";
import { cn } from "@/utils/cn";

// Maps the backend's education categories to routes/icons for the
// personalized "Recommended for You" section.
const CATEGORY_META = {
  trimester: {
    icon: Baby,
    route: ROUTES.EDUCATION_TRIMESTER,
    color: "bg-rose-100 text-rose-700",
  },
  nutrition: {
    icon: Leaf,
    route: ROUTES.EDUCATION_NUTRITION,
    color: "bg-green-100 text-green-700",
  },
  "danger-signs": {
    icon: AlertTriangle,
    route: ROUTES.EDUCATION_DANGER_SIGNS,
    color: "bg-red-100 text-red-700",
  },
  anc: {
    icon: Calendar,
    route: ROUTES.EDUCATION_ANC,
    color: "bg-sage-100 text-sage-700",
  },
  vaccines: {
    icon: Shield,
    route: ROUTES.EDUCATION_VACCINES,
    color: "bg-blue-100 text-blue-700",
  },
  "mental-health": {
    icon: Heart,
    route: ROUTES.EDUCATION_MENTAL_HEALTH,
    color: "bg-purple-100 text-purple-700",
  },
  "birth-prep": {
    icon: Package,
    route: ROUTES.EDUCATION_BIRTH_PREP,
    color: "bg-amber-100 text-amber-700",
  },
  postpartum: {
    icon: Moon,
    route: ROUTES.EDUCATION_POSTPARTUM,
    color: "bg-indigo-100 text-indigo-700",
  },
  breastfeeding: {
    icon: Droplets,
    route: ROUTES.EDUCATION_BREASTFEEDING,
    color: "bg-cyan-100 text-cyan-700",
  },
};

const educationCards = [
  {
    icon: Baby,
    label: "Trimester Guide",
    href: ROUTES.EDUCATION_TRIMESTER,
    color: "bg-rose-100 text-rose-700",
    desc: "Week-by-week guidance",
  },
  {
    icon: AlertTriangle,
    label: "Danger Signs",
    href: ROUTES.EDUCATION_DANGER_SIGNS,
    color: "bg-red-100 text-red-700",
    desc: "Know when to act fast",
  },
  {
    icon: Calendar,
    label: "ANC Schedule",
    href: ROUTES.EDUCATION_ANC,
    color: "bg-sage-100 text-sage-700",
    desc: "Don't miss any visit",
  },
  {
    icon: Heart,
    label: "Mental Health",
    href: ROUTES.EDUCATION_MENTAL_HEALTH,
    color: "bg-purple-100 text-purple-700",
    desc: "Emotional wellbeing",
  },
];

const trimesterTips = {
  first: {
    label: "First Trimester",
    weeks: "1–12 weeks",
    color: "bg-blue-50 border-blue-200",
    labelColor: "text-blue-700",
    tips: [
      "Start folic acid if you have not already",
      "Book your first ANC visit before 12 weeks",
      "Avoid alcohol, raw meat, and unpasteurised dairy",
      "Nausea is common; eat small, frequent meals",
    ],
  },
  second: {
    label: "Second Trimester",
    weeks: "13–27 weeks",
    color: "bg-green-50 border-green-200",
    labelColor: "text-green-700",
    tips: [
      "You should feel your baby move around 18–22 weeks",
      "Your anatomy scan ultrasound happens at 18–20 weeks",
      "Iron-rich foods help prevent anaemia at this stage",
      "Begin light exercises approved by your midwife",
    ],
  },
  third: {
    label: "Third Trimester",
    weeks: "28–40 weeks",
    color: "bg-amber-50 border-amber-200",
    labelColor: "text-amber-700",
    tips: [
      "Track fetal movements daily; 10 kicks in 2 hours is reassuring",
      "Prepare your birth plan and hospital bag",
      "Attend all remaining ANC visits; they are critical now",
      "Learn the danger signs that mean labour has started",
    ],
  },
  postpartum: {
    label: "Postpartum",
    weeks: "After birth",
    color: "bg-rose-50 border-rose-200",
    labelColor: "text-rose-700",
    tips: [
      "Breastfeed within the first hour if possible",
      "Postnatal check at 6 weeks is important for your recovery",
      "Postpartum depression is real; tell your midwife if you feel low",
      "Rest and accept help from family and friends",
    ],
  },
};

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function getTrimester(stage) {
  if (stage === "postpartum") return "postpartum";
  if (stage === "first") return "first";
  if (stage === "second") return "second";
  if (stage === "third") return "third";
  return null;
}

function PregnancyProgress({ weeks }) {
  if (!weeks || weeks <= 0) return null;
  const total = 40;
  const clamped = Math.min(weeks, total);
  const pct = Math.round((clamped / total) * 100);
  const trimester = weeks <= 12 ? "First" : weeks <= 27 ? "Second" : "Third";

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between text-xs mb-1.5">
        <span className="text-white/70">Pregnancy progress</span>
        <span className="font-semibold text-white">{pct}% complete</span>
      </div>
      <div className="h-2 bg-white/20 rounded-full overflow-hidden">
        <div
          className="h-full bg-white/80 rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Pregnancy ${pct}% complete`}
        />
      </div>
      <p className="text-white/60 text-xs mt-1.5">
        {trimester} trimester · Week {clamped} of {total}
      </p>
    </div>
  );
}

function RecentConversations({ conversations, onOpen }) {
  const recent = conversations.slice(0, 3);
  if (recent.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-base text-text-primary flex items-center gap-2">
          <Clock className="w-4.5 h-4.5 text-rose-600" aria-hidden />
          Recent Conversations
        </h2>
        <Link
          to={ROUTES.CHAT_HISTORY}
          className="text-xs text-rose-700 hover:underline font-medium flex items-center gap-1"
        >
          View all <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
      <div className="space-y-2">
        {recent.map((conv) => (
          <button
            key={conv.id}
            onClick={() => onOpen(conv.id)}
            className="w-full flex items-center gap-3 bg-white rounded-2xl border border-border p-3.5 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200 group text-left"
            aria-label={`Open conversation: ${conv.title || "Conversation"}`}
          >
            <span className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
              <MessageCircle
                className="w-4.5 h-4.5 text-rose-500"
                aria-hidden
              />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate group-hover:text-rose-700 transition-colors">
                {conv.title || "Conversation"}
              </p>
              <p className="text-xs text-text-muted mt-0.5">
                {formatRelativeTime(conv.updated_at)} · {conv.message_count}{" "}
                message{conv.message_count !== 1 ? "s" : ""}
              </p>
            </div>
            <ChevronRight
              className="w-4 h-4 text-text-muted shrink-0"
              aria-hidden
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  // Server-side conversation list — the same source Chat History uses, so
  // counts and previews reflect reality rather than this device's cache.
  const { conversations, openConversation } = useConversationHistory();
  const [recommendations, setRecommendations] = useState(null);
  const name = user?.name?.split(" ")[0] || "there";
  const stage = user?.pregnancyStage;
  const weeks = user?.pregnancyWeeks;
  const trimester = getTrimester(stage);
  const trimesterInfo = trimester ? trimesterTips[trimester] : null;
  const weekPrompts = SUGGESTED_PROMPTS[stage] || SUGGESTED_PROMPTS.default;

  useEffect(() => {
    let cancelled = false;
    chatService
      .getRecommendations()
      .then((res) => {
        if (!cancelled) setRecommendations(res.data.data);
      })
      .catch(() => {
        // Personalization is a progressive enhancement — fall back to the
        // static stage-based content silently if the request fails.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const recommendedCategories = recommendations?.recommended_categories ?? [];
  // Personalized follow-up questions when the user has chat history;
  // otherwise the static stage-based prompts.
  const promptChips = recommendations?.suggested_questions?.length
    ? recommendations.suggested_questions
    : weekPrompts;

  const totalMessages = conversations.reduce(
    (a, c) => a + (c.message_count || 0),
    0,
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Greeting hero */}
      <div className="bg-brand-gradient rounded-3xl p-6 text-white relative overflow-hidden">
        <div
          className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full pointer-events-none"
          aria-hidden
        />
        <div
          className="absolute -right-4 -bottom-8 w-24 h-24 bg-white/10 rounded-full pointer-events-none"
          aria-hidden
        />
        <div className="relative z-10">
          <p className="text-white/80 text-sm mb-1">{getGreeting()}</p>
          <h1 className="font-display font-bold text-2xl mb-2">{name} 👋</h1>
          {stage && (
            <Badge
              variant="rose"
              size="sm"
              className="bg-white/20 text-white border-white/20 mb-3"
            >
              {formatWeeksPregnant(weeks)}
            </Badge>
          )}
          {weeks && <PregnancyProgress weeks={weeks} />}
        </div>
      </div>

      {/* Quick action — Chat */}
      <Card padding={false} className="overflow-hidden">
        <div className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-10 h-10 rounded-xl bg-brand-gradient flex items-center justify-center shadow-sm shrink-0">
              <MessageCircle className="w-5 h-5 text-white" aria-hidden />
            </span>
            <div>
              <h2 className="font-semibold text-base text-text-primary">
                Chat with MamaGuide
              </h2>
              <p className="text-xs text-text-muted">
                Ask any pregnancy question
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {promptChips.slice(0, 3).map((q, i) => (
              <Link
                key={i}
                to={ROUTES.CHAT}
                state={{ initialMessage: q }}
                className="text-xs px-3 py-1.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-full font-medium hover:bg-rose-100 transition-colors flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" aria-hidden />
                {q}
              </Link>
            ))}
          </div>

          <Button
            as={Link}
            to={ROUTES.CHAT}
            fullWidth
            iconRight={<ArrowRight className="w-4 h-4" />}
          >
            Start Chatting
          </Button>
        </div>
      </Card>

      {/* Personalized recommendations from conversation history */}
      {recommendedCategories.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-base text-text-primary flex items-center gap-2">
              <Sparkles className="w-4.5 h-4.5 text-rose-600" aria-hidden />
              Recommended for You
            </h2>
            <span className="text-xs text-text-muted">
              Based on your conversations
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {recommendedCategories.map((rec) => {
              const meta = CATEGORY_META[rec.category];
              if (!meta) return null;
              const Icon = meta.icon;
              return (
                <Link
                  key={rec.category}
                  to={meta.route}
                  className="bg-white rounded-2xl border border-border p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
                  aria-label={rec.label}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${meta.color}`}
                      aria-hidden
                    >
                      <Icon className="w-5 h-5" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-text-primary group-hover:text-rose-700 transition-colors">
                        {rec.label}
                      </p>
                      <p className="text-xs text-text-muted mt-0.5">
                        {rec.reason}
                      </p>
                    </div>
                    <ChevronRight
                      className="w-4 h-4 text-text-muted shrink-0 mt-1"
                      aria-hidden
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Trimester tips */}
      {trimesterInfo && (
        <div className={cn("rounded-2xl border p-4", trimesterInfo.color)}>
          <div className="flex items-center gap-2 mb-3">
            <Leaf
              className={cn("w-4 h-4", trimesterInfo.labelColor)}
              aria-hidden
            />
            <span
              className={cn(
                "text-xs font-bold uppercase tracking-wide",
                trimesterInfo.labelColor,
              )}
            >
              {trimesterInfo.label} · {trimesterInfo.weeks}
            </span>
          </div>
          <ul className="space-y-2">
            {trimesterInfo.tips.map((tip, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-xs text-text-secondary"
              >
                <Star
                  className={cn(
                    "w-3.5 h-3.5 shrink-0 mt-0.5",
                    trimesterInfo.labelColor,
                  )}
                  aria-hidden
                />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Education quick access */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-base text-text-primary flex items-center gap-2">
            <BookOpen className="w-4.5 h-4.5 text-rose-600" aria-hidden />
            Learn About Pregnancy
          </h2>
          <Link
            to={ROUTES.EDUCATION}
            className="text-xs text-rose-700 hover:underline font-medium flex items-center gap-1"
          >
            See all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {educationCards.map((card) => (
            <Link
              key={card.href}
              to={card.href}
              className="bg-white rounded-2xl border border-border p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
              aria-label={card.label}
            >
              <span
                className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${card.color}`}
                aria-hidden
              >
                <card.icon className="w-5 h-5" />
              </span>
              <p className="text-sm font-semibold text-text-primary group-hover:text-rose-700 transition-colors">
                {card.label}
              </p>
              <p className="text-xs text-text-muted mt-0.5">{card.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent conversations */}
      <RecentConversations
        conversations={conversations}
        onOpen={openConversation}
      />

      {/* Activity stats */}
      <Card className="bg-sage-50 border-sage-200">
        <h2 className="font-semibold text-sm text-sage-900 mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4 text-sage-600" aria-hidden />
          Your Activity
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="font-display font-bold text-2xl text-sage-700">
              {conversations.length}
            </p>
            <p className="text-xs text-sage-600">Conversations</p>
          </div>
          <div>
            <p className="font-display font-bold text-2xl text-sage-700">
              {totalMessages}
            </p>
            <p className="text-xs text-sage-600">Messages exchanged</p>
          </div>
          <div>
            <p className="font-display font-bold text-2xl text-sage-700">
              {weeks ? `${Math.max(0, 40 - weeks)}` : "N/A"}
            </p>
            <p className="text-xs text-sage-600">Weeks remaining</p>
          </div>
        </div>
      </Card>

      {/* Emergency reminder */}
      <div className="flex items-start gap-3 px-4 py-3.5 bg-emergency-light rounded-2xl border border-emergency/20">
        <AlertTriangle
          className="w-5 h-5 text-emergency mt-0.5 shrink-0"
          aria-hidden
        />
        <div>
          <p className="text-sm font-semibold text-emergency-dark">
            Experiencing an emergency?
          </p>
          <p className="text-xs text-emergency-dark/80 mt-0.5">
            Call{" "}
            <a href="tel:112" className="font-bold underline">
              112
            </a>{" "}
            immediately for any pregnancy emergency. Do not wait; go to the
            nearest hospital.
          </p>
        </div>
      </div>
    </div>
  );
}
