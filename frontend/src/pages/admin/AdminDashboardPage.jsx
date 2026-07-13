import { useState, useEffect } from "react";
import {
  Users,
  MessageSquare,
  BarChart3,
  TrendingUp,
  Siren,
  Clock,
} from "lucide-react";
import { Badge } from "@/components/atoms/Badge";
import { Spinner } from "@/components/atoms/Spinner";
import { Alert } from "@/components/atoms/Alert";
import { useAuth } from "@/hooks/useAuth";
import { adminService } from "@/services/adminService";

const SUS_BANDS = [
  { range: "85–100", label: "Excellent", min: 85, max: 100, color: "bg-green-100 text-green-800 border-green-200" },
  { range: "70–84", label: "Good", min: 70, max: 84, color: "bg-blue-100 text-blue-800 border-blue-200" },
  { range: "50–69", label: "OK", min: 50, max: 69, color: "bg-amber-100 text-amber-800 border-amber-200" },
  { range: "<50", label: "Poor", min: 0, max: 49, color: "bg-red-100 text-red-800 border-red-200" },
];

function timeAgo(iso) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [susData, setSusData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const [analyticsRes, susRes] = await Promise.all([
          adminService.getAnalytics(),
          adminService.getSUS({ limit: 100 }),
        ]);
        setAnalytics(analyticsRes.data.data);
        setSusData(susRes.data.data);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return <div className="py-24 flex justify-center"><Spinner size="lg" /></div>;
  }

  if (error) {
    return <Alert variant="error">{error}</Alert>;
  }

  const stats = [
    { label: "Total Users", value: analytics.totals.users, icon: Users, color: "text-rose-600 bg-rose-100" },
    { label: "Conversations", value: analytics.totals.conversations, icon: MessageSquare, color: "text-sage-600 bg-sage-100" },
    { label: "Avg SUS Score", value: susData.avg_sus_score ?? "N/A", icon: BarChart3, color: "text-amber-600 bg-amber-100" },
    { label: "Emergency Flags", value: analytics.totals.emergency_messages, icon: Siren, color: "text-red-600 bg-red-100" },
  ];

  const maxIntentCount = Math.max(1, ...analytics.top_intents.map((i) => i.count));
  const distribution = SUS_BANDS.map((band) => ({
    ...band,
    count: (susData.responses || []).filter((r) => r.sus_score >= band.min && r.sus_score <= band.max).length,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-gray-900">Admin Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome back, {user?.name}. Here's what's happening with MamaGuide.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <span className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`} aria-hidden>
                <stat.icon className="w-5 h-5" />
              </span>
            </div>
            <p className="font-display font-extrabold text-2xl text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4.5 h-4.5 text-rose-600" aria-hidden />
            Top User Intents
          </h2>
          {analytics.top_intents.length === 0 ? (
            <p className="text-sm text-gray-400">No classified messages yet.</p>
          ) : (
            <ul className="space-y-3" role="list">
              {analytics.top_intents.map((item) => (
                <li key={item.intent}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="text-gray-700 font-medium">{item.intent.replace(/_/g, " ")}</span>
                    <span className="text-gray-500 text-xs">{item.count}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-rose-500 rounded-full transition-all"
                      style={{ width: `${(item.count / maxIntentCount) * 100}%` }}
                      role="presentation"
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-4.5 h-4.5 text-rose-600" aria-hidden />
            Recent Emergency Events
          </h2>
          {analytics.recent_emergencies.length === 0 ? (
            <p className="text-sm text-gray-400">No emergency flags recorded.</p>
          ) : (
            <ul className="space-y-3" role="list">
              {analytics.recent_emergencies.map((event, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-red-100 text-red-600" aria-hidden>
                    <Siren className="w-4 h-4" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-red-700">
                      Keyword: "{event.flagged_keyword}"
                      <Badge variant="error" size="sm" className="ml-2">Urgent</Badge>
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{timeAgo(event.created_at)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BarChart3 className="w-4.5 h-4.5 text-rose-600" aria-hidden />
          SUS Score Distribution
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {distribution.map((band) => (
            <div key={band.range} className={`rounded-xl border px-4 py-3 ${band.color}`}>
              <p className="font-display font-extrabold text-2xl">{band.count}</p>
              <p className="text-xs font-medium mt-0.5">{band.label}</p>
              <p className="text-xs opacity-70">{band.range}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
