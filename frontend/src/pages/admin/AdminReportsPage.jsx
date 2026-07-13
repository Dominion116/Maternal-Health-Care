import { useState, useEffect } from "react";
import {
  Download,
  Calendar,
  BarChart3,
  Users,
  MessageSquare,
  ClipboardCheck,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/atoms/Badge";
import { Spinner } from "@/components/atoms/Spinner";
import { Alert } from "@/components/atoms/Alert";
import { adminService } from "@/services/adminService";
import { downloadCSV } from "@/utils/csv";

export default function AdminReportsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [sus, setSus] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [modelMetrics, setModelMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const [a, s, f, m] = await Promise.all([
          adminService.getAnalytics(),
          adminService.getSUS({ limit: 100 }),
          adminService.getFeedback({ limit: 100 }),
          adminService.getModelMetrics(),
        ]);
        setAnalytics(a.data.data);
        setSus(s.data.data);
        setFeedback(f.data.data);
        setModelMetrics(m.data.data);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load report data");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading)
    return (
      <div className="py-24 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  if (error) return <Alert variant="error">{error}</Alert>;

  const positiveFeedbackPct = feedback.feedback.length
    ? Math.round(
        (feedback.feedback.filter((f) => f.rating >= 4).length /
          feedback.feedback.length) *
          100,
      )
    : null;

  const reports = [
    {
      id: "usage",
      title: "Usage Report",
      description:
        "Totals, daily conversation counts, and top classified intents.",
      icon: BarChart3,
      color: "text-rose-600 bg-rose-100",
      badge: "analytics",
      onExport: () =>
        downloadCSV(
          "usage-report.csv",
          ["Metric", "Value"],
          [
            ["Total Users", analytics.totals.users],
            ["Total Conversations", analytics.totals.conversations],
            ["Total Messages", analytics.totals.messages],
            ["Emergency Messages", analytics.totals.emergency_messages],
            ...analytics.top_intents.map((i) => [
              `Intent: ${i.intent}`,
              i.count,
            ]),
          ],
        ),
    },
    {
      id: "sus",
      title: "SUS Evaluation Report",
      description: "System Usability Scale scores from all participants.",
      icon: ClipboardCheck,
      color: "text-sage-600 bg-sage-100",
      badge: "evaluation",
      onExport: () =>
        downloadCSV(
          "sus-evaluation-report.csv",
          ["User ID", "SUS Score", "Submitted At"],
          sus.responses.map((r) => [r.user_id, r.sus_score, r.submitted_at]),
        ),
    },
    {
      id: "demographics",
      title: "User Demographics Report",
      description: "Breakdown of registered users by role.",
      icon: Users,
      color: "text-blue-600 bg-blue-100",
      badge: "users",
      onExport: () =>
        downloadCSV(
          "user-demographics-report.csv",
          ["Role", "Count"],
          analytics.users_by_role.map((r) => [r.role, r.count]),
        ),
    },
    {
      id: "ai",
      title: "AI Performance Report",
      description:
        "Intent classifier per-class precision/recall/F1 on the held-out test split.",
      icon: TrendingUp,
      color: "text-purple-600 bg-purple-100",
      badge: "ai",
      onExport: () =>
        downloadCSV(
          "ai-performance-report.csv",
          ["Intent", "Precision", "Recall", "F1", "Support"],
          (modelMetrics.metrics?.testEvaluation?.perClass || []).map((c) => [
            c.intent,
            c.precision,
            c.recall,
            c.f1,
            c.support,
          ]),
        ),
    },
    {
      id: "emergency",
      title: "Emergency Escalations Report",
      description: "Recent conversations that triggered emergency detection.",
      icon: MessageSquare,
      color: "text-red-600 bg-red-100",
      badge: "safety",
      onExport: () =>
        downloadCSV(
          "emergency-escalations-report.csv",
          ["Conversation ID", "Flagged Keyword", "Timestamp"],
          analytics.recent_emergencies.map((e) => [
            e.conversation_id,
            e.flagged_keyword,
            e.created_at,
          ]),
        ),
    },
  ];

  const badgeVariants = {
    analytics: "rose",
    evaluation: "sage",
    users: "info",
    ai: "neutral",
    safety: "error",
  };

  const findings = [];
  if (sus.avg_sus_score != null) {
    findings.push({
      text: `Average SUS score is ${sus.avg_sus_score}, which is ${sus.avg_sus_score >= 70 ? 'above the "Good" threshold (70+)' : 'below the "Good" threshold (70)'}`,
      positive: sus.avg_sus_score >= 70,
    });
  }
  if (positiveFeedbackPct != null) {
    findings.push({
      text: `${positiveFeedbackPct}% of feedback submissions rated 4 or 5 stars`,
      positive: positiveFeedbackPct >= 60,
    });
  }
  findings.push({
    text: `${analytics.totals.emergency_messages} emergency-flagged messages detected and handled`,
    positive: true,
  });
  const worstIntent = (modelMetrics.metrics?.testEvaluation?.perClass || [])
    .slice()
    .sort((a, b) => a.f1 - b.f1)[0];
  if (worstIntent) {
    findings.push({
      text: `Weakest classified intent: "${worstIntent.intent.replace(/_/g, " ")}" (F1 ${Math.round(worstIntent.f1 * 100)}%), a candidate for more training patterns`,
      positive: false,
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-gray-900">
          Reports
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Export real study data for the MamaGuide evaluation
        </p>
      </div>

      <div className="bg-linear-to-r from-rose-700 to-rose-500 rounded-2xl p-5 text-white">
        <div className="flex items-center gap-2 mb-1">
          <Calendar className="w-4 h-4 opacity-80" />
          <span className="text-xs font-medium opacity-80">
            Generated {new Date().toLocaleDateString()}
          </span>
        </div>
        <h2 className="font-display font-bold text-xl mb-4">
          Study Summary Snapshot
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Users", value: analytics.totals.users },
            {
              label: "Conversations",
              value: analytics.totals.conversations.toLocaleString(),
            },
            { label: "Avg SUS Score", value: sus.avg_sus_score ?? "N/A" },
            {
              label: "Positive Feedback",
              value:
                positiveFeedbackPct != null ? `${positiveFeedbackPct}%` : "N/A",
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
        <div className="space-y-3">
          <h2 className="font-semibold text-gray-900">Available Reports</h2>
          {reports.map((report) => (
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
                <p className="text-xs text-gray-500 leading-relaxed">
                  {report.description}
                </p>
              </div>
              <button
                onClick={report.onExport}
                className="inline-flex items-center gap-1.5 text-xs text-rose-700 border border-rose-200 bg-rose-50 px-3 py-1.5 rounded-lg hover:bg-rose-100 transition-colors font-medium shrink-0"
                aria-label={`Download ${report.title}`}
              >
                <Download className="w-3.5 h-3.5" />
                CSV
              </button>
            </div>
          ))}
        </div>

        <div>
          <h2 className="font-semibold text-gray-900 mb-3">Key Findings</h2>
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <ul className="space-y-2.5">
              {findings.map((f, i) => (
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
              {findings.length === 0 && (
                <p className="text-xs text-gray-400">
                  Not enough data yet to generate findings.
                </p>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
