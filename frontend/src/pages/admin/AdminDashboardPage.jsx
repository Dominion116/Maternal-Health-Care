import {
  Users,
  MessageSquare,
  BarChart3,
  TrendingUp,
  ArrowUpRight,
  Activity,
  Clock,
  CheckCircle,
} from "lucide-react";
import { Badge } from "@/components/atoms/Badge";
import { useAuth } from "@/hooks/useAuth";

const mockStats = [
  {
    label: "Total Users",
    value: "248",
    change: "+12%",
    icon: Users,
    color: "text-rose-600 bg-rose-100",
  },
  {
    label: "Conversations",
    value: "1,892",
    change: "+8%",
    icon: MessageSquare,
    color: "text-sage-600 bg-sage-100",
  },
  {
    label: "Avg SUS Score",
    value: "74.5",
    change: "+2.1",
    icon: BarChart3,
    color: "text-amber-600 bg-amber-100",
  },
  {
    label: "Active Today",
    value: "43",
    change: "+15%",
    icon: Activity,
    color: "text-blue-600 bg-blue-100",
  },
];

const recentActivity = [
  {
    type: "user",
    text: "New user registered: Adaeze O.",
    time: "2m ago",
    icon: Users,
  },
  {
    type: "chat",
    text: "Emergency escalation triggered",
    time: "14m ago",
    icon: MessageSquare,
    urgent: true,
  },
  {
    type: "eval",
    text: "SUS evaluation submitted (score: 82)",
    time: "1h ago",
    icon: CheckCircle,
  },
  {
    type: "chat",
    text: "24 new conversations started today",
    time: "2h ago",
    icon: MessageSquare,
  },
];

const topIntents = [
  { intent: "Danger signs query", count: 312, pct: 78 },
  { intent: "ANC schedule inquiry", count: 289, pct: 72 },
  { intent: "Nutrition guidance", count: 256, pct: 64 },
  { intent: "Baby movement concern", count: 198, pct: 50 },
  { intent: "Postpartum question", count: 145, pct: 36 },
];

export default function AdminDashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="font-display font-bold text-2xl text-gray-900">
          Admin Dashboard
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome back, {user?.name}. Here's what's happening with MamaGuide.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {mockStats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl border border-gray-200 p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <span
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}
                aria-hidden
              >
                <stat.icon className="w-5 h-5" />
              </span>
              <Badge variant="success" size="sm" dot>
                <ArrowUpRight className="w-3 h-3" aria-hidden />
                {stat.change}
              </Badge>
            </div>
            <p className="font-display font-extrabold text-2xl text-gray-900">
              {stat.value}
            </p>
            <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Top intents */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4.5 h-4.5 text-rose-600" aria-hidden />
            Top User Intents
          </h2>
          <ul className="space-y-3" role="list">
            {topIntents.map((item) => (
              <li key={item.intent}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="text-gray-700 font-medium">
                    {item.intent}
                  </span>
                  <span className="text-gray-500 text-xs">{item.count}</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-rose-500 rounded-full transition-all"
                    style={{ width: `${item.pct}%` }}
                    role="presentation"
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Recent activity */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-4.5 h-4.5 text-rose-600" aria-hidden />
            Recent Activity
          </h2>
          <ul className="space-y-3" role="list">
            {recentActivity.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${item.urgent ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-500"}`}
                  aria-hidden
                >
                  <item.icon className="w-4 h-4" />
                </span>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm ${item.urgent ? "font-semibold text-red-700" : "text-gray-700"}`}
                  >
                    {item.text}
                    {item.urgent && (
                      <Badge variant="error" size="sm" className="ml-2">
                        Urgent
                      </Badge>
                    )}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* SUS scores summary */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BarChart3 className="w-4.5 h-4.5 text-rose-600" aria-hidden />
          SUS Score Distribution
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              range: "85–100",
              label: "Excellent",
              count: 12,
              color: "bg-green-100 text-green-800 border-green-200",
            },
            {
              range: "70–84",
              label: "Good",
              count: 31,
              color: "bg-blue-100 text-blue-800 border-blue-200",
            },
            {
              range: "50–69",
              label: "OK",
              count: 8,
              color: "bg-amber-100 text-amber-800 border-amber-200",
            },
            {
              range: "<50",
              label: "Poor",
              count: 2,
              color: "bg-red-100 text-red-800 border-red-200",
            },
          ].map((band) => (
            <div
              key={band.range}
              className={`rounded-xl border px-4 py-3 ${band.color}`}
            >
              <p className="font-display font-extrabold text-2xl">
                {band.count}
              </p>
              <p className="text-xs font-medium mt-0.5">{band.label}</p>
              <p className="text-xs opacity-70">{band.range}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
