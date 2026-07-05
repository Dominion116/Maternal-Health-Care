import {
  Download,
  FileText,
  Calendar,
  BarChart3,
  Users,
  MessageSquare,
  ClipboardCheck,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/atoms/Badge";

const reportSummary = {
  period: "May 2026",
  generatedAt: "2026-05-24",
  totalUsers: 248,
  totalConversations: 1892,
  avgSUSScore: 78.1,
  emergencyEscalations: 23,
  activeModules: 9,
  satisfactionRate: 84,
};

const reportTypes = [
  {
    id: "r1",
    title: "Monthly Usage Report",
    description:
      "Conversation volumes, unique users, peak hours, and engagement trends for the reporting period.",
    icon: BarChart3,
    color: "text-rose-600 bg-rose-100",
    lastGenerated: "2026-05-01",
    badge: "analytics",
  },
  {
    id: "r2",
    title: "SUS Evaluation Report",
    description:
      "System Usability Scale scores, grade distribution, and per-question analysis from all participants.",
    icon: ClipboardCheck,
    color: "text-sage-600 bg-sage-100",
    lastGenerated: "2026-05-20",
    badge: "evaluation",
  },
  {
    id: "r3",
    title: "User Demographics Report",
    description:
      "Breakdown of registered users by role, pregnancy stage, activity level, and geographic location.",
    icon: Users,
    color: "text-blue-600 bg-blue-100",
    lastGenerated: "2026-05-15",
    badge: "users",
  },
  {
    id: "r4",
    title: "AI Performance Report",
    description:
      "Confidence score distribution, intent accuracy, response times, and model performance metrics.",
    icon: TrendingUp,
    color: "text-purple-600 bg-purple-100",
    lastGenerated: "2026-05-22",
    badge: "ai",
  },
  {
    id: "r5",
    title: "Emergency Escalations Report",
    description:
      "All conversations that triggered emergency detection, with timestamps and resolution status.",
    icon: MessageSquare,
    color: "text-red-600 bg-red-100",
    lastGenerated: "2026-05-24",
    badge: "safety",
  },
  {
    id: "r6",
    title: "Education Module Engagement",
    description:
      "View counts, dwell time, and user feedback for each education module in the library.",
    icon: FileText,
    color: "text-amber-600 bg-amber-100",
    lastGenerated: "2026-05-18",
    badge: "education",
  },
];

const badgeVariants = {
  analytics: "rose",
  evaluation: "sage",
  users: "info",
  ai: "neutral",
  safety: "error",
  education: "warning",
};

const milestones = [
  { label: "Study launch", date: "2026-03-01", done: true },
  { label: "First 50 users", date: "2026-03-20", done: true },
  { label: "Baseline SUS collection", date: "2026-04-15", done: true },
  { label: "200 users enrolled", date: "2026-05-10", done: true },
  { label: "Mid-study SUS collection", date: "2026-05-24", done: true },
  { label: "Final SUS & feedback", date: "2026-06-30", done: false },
  { label: "Final report submission", date: "2026-07-15", done: false },
];

export default function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-gray-900">
            Reports
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Generate and export reports for the MamaGuide evaluation study
          </p>
        </div>
        <button className="inline-flex items-center gap-2 text-sm text-rose-700 border border-rose-200 bg-rose-50 px-4 py-2 rounded-xl hover:bg-rose-100 transition-colors font-medium">
          <Download className="w-4 h-4" aria-hidden />
          Export All Data
        </button>
      </div>

      {/* Period summary banner */}
      <div className="bg-linear-to-r from-rose-700 to-rose-500 rounded-2xl p-5 text-white">
        <div className="flex items-center gap-2 mb-1">
          <Calendar className="w-4 h-4 opacity-80" />
          <span className="text-xs font-medium opacity-80">
            Reporting Period: {reportSummary.period}
          </span>
        </div>
        <h2 className="font-display font-bold text-xl mb-4">
          Study Summary Snapshot
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Users", value: reportSummary.totalUsers },
            {
              label: "Conversations",
              value: reportSummary.totalConversations.toLocaleString(),
            },
            { label: "Avg SUS Score", value: reportSummary.avgSUSScore },
            {
              label: "Satisfaction Rate",
              value: `${reportSummary.satisfactionRate}%`,
            },
          ].map((item) => (
            <div key={item.label}>
              <p className="font-display font-extrabold text-2xl">
                {item.value}
              </p>
              <p className="text-xs opacity-75">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Report cards */}
        <div className="space-y-3">
          <h2 className="font-semibold text-gray-900">Available Reports</h2>
          {reportTypes.map((report) => (
            <div
              key={report.id}
              className="bg-white rounded-2xl border border-gray-200 p-4 flex items-start gap-3"
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${report.color}`}
              >
                <report.icon className="w-5 h-5" aria-hidden />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <p className="text-sm font-semibold text-gray-900">
                    {report.title}
                  </p>
                  <Badge
                    variant={badgeVariants[report.badge] || "neutral"}
                    size="sm"
                  >
                    {report.badge}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed mb-2">
                  {report.description}
                </p>
                <p className="text-xs text-gray-400">
                  Last generated:{" "}
                  {new Date(report.lastGenerated).toLocaleDateString()}
                </p>
              </div>
              <button
                className="inline-flex items-center gap-1.5 text-xs text-rose-700 border border-rose-200 bg-rose-50 px-3 py-1.5 rounded-lg hover:bg-rose-100 transition-colors font-medium shrink-0"
                aria-label={`Download ${report.title}`}
              >
                <Download className="w-3.5 h-3.5" />
                CSV
              </button>
            </div>
          ))}
        </div>

        {/* Study timeline */}
        <div>
          <h2 className="font-semibold text-gray-900 mb-3">Study Milestones</h2>
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="relative">
              <div
                className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-gray-200"
                aria-hidden
              />
              <div className="space-y-4">
                {milestones.map((m, i) => (
                  <div key={i} className="flex items-center gap-4 relative">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center z-10 shrink-0 ${m.done ? "bg-green-500" : "bg-gray-200 border-2 border-white"}`}
                    >
                      {m.done && (
                        <svg
                          className="w-3.5 h-3.5 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 flex items-center justify-between gap-2">
                      <p
                        className={`text-sm font-medium ${m.done ? "text-gray-900" : "text-gray-400"}`}
                      >
                        {m.label}
                      </p>
                      <span
                        className={`text-xs shrink-0 ${m.done ? "text-gray-400" : "text-rose-600 font-semibold"}`}
                      >
                        {new Date(m.date).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Key findings */}
          <div className="mt-4 bg-white rounded-2xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-3 text-sm">
              Key Findings (May 2026)
            </h3>
            <ul className="space-y-2.5">
              {[
                {
                  text: 'SUS score of 78.1 — above the "Good" threshold (70+)',
                  positive: true,
                },
                {
                  text: "84% of users rated the system positively",
                  positive: true,
                },
                {
                  text: "23 emergency escalations handled safely by the system",
                  positive: true,
                },
                {
                  text: "Mental health intent confidence below threshold (82%)",
                  positive: false,
                },
                {
                  text: "Partner guidance gap identified — no training data yet",
                  positive: false,
                },
              ].map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-xs">
                  <span
                    className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${f.positive ? "bg-green-100 text-green-600" : "bg-amber-100 text-amber-700"}`}
                  >
                    {f.positive ? "✓" : "!"}
                  </span>
                  <span className="text-gray-700 leading-relaxed">
                    {f.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
