import { useState, useEffect } from "react";
import { BarChart3, Download } from "lucide-react";
import { Badge } from "@/components/atoms/Badge";
import { Spinner } from "@/components/atoms/Spinner";
import { Alert } from "@/components/atoms/Alert";
import { adminService } from "@/services/adminService";
import { downloadCSV } from "@/utils/csv";

const susQuestions = [
  "I think that I would like to use this system frequently.",
  "I found the system unnecessarily complex.",
  "I thought the system was easy to use.",
  "I think that I would need the support of a technical person.",
  "I found the various functions were well integrated.",
  "I thought there was too much inconsistency.",
  "I would imagine most people would learn to use this quickly.",
  "I found the system very cumbersome to use.",
  "I felt very confident using the system.",
  "I needed to learn a lot before I could get going.",
];

function gradeFor(score) {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 50) return "OK";
  return "Poor";
}

const gradeConfig = {
  Excellent: "success",
  Good: "info",
  OK: "warning",
  Poor: "error",
};

export default function AdminSUSPage() {
  const [responses, setResponses] = useState([]);
  const [avgScore, setAvgScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const res = await adminService.getSUS({ limit: 100 });
        setResponses(res.data.data.responses || []);
        setAvgScore(res.data.data.avg_sus_score);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load SUS results");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div className="py-24 flex justify-center"><Spinner size="lg" /></div>;
  if (error) return <Alert variant="error">{error}</Alert>;

  const distribution = [
    { range: "85–100", label: "Excellent", count: responses.filter((s) => s.sus_score >= 85).length },
    { range: "70–84", label: "Good", count: responses.filter((s) => s.sus_score >= 70 && s.sus_score < 85).length },
    { range: "50–69", label: "OK", count: responses.filter((s) => s.sus_score >= 50 && s.sus_score < 70).length },
    { range: "<50", label: "Poor", count: responses.filter((s) => s.sus_score < 50).length },
  ];

  const avgPerQuestion = susQuestions.map((_, qi) => {
    if (responses.length === 0) return 0;
    const total = responses.reduce((sum, s) => sum + (s.scores?.[`q${qi + 1}`] || 0), 0);
    return Math.round((total / responses.length) * 10) / 10;
  });

  function handleExport() {
    downloadCSV(
      "sus-results.csv",
      ["User ID", "SUS Score", "Grade", "Submitted At", ...susQuestions.map((_, i) => `Q${i + 1}`)],
      responses.map((s) => [
        s.user_id,
        s.sus_score,
        gradeFor(s.sus_score),
        s.submitted_at,
        ...Array.from({ length: 10 }, (_, i) => s.scores?.[`q${i + 1}`] ?? ""),
      ]),
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-gray-900">SUS Evaluation Results</h1>
          <p className="text-sm text-gray-500 mt-1">
            System Usability Scale scores from {responses.length} participants
          </p>
        </div>
        <button
          onClick={handleExport}
          disabled={responses.length === 0}
          className="inline-flex items-center gap-2 text-sm text-rose-700 border border-rose-200 bg-rose-50 px-4 py-2 rounded-xl hover:bg-rose-100 transition-colors font-medium disabled:opacity-50"
        >
          <Download className="w-4 h-4" aria-hidden />
          Export CSV
        </button>
      </div>

      {responses.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 py-16 text-center">
          <p className="text-sm text-gray-400">No SUS submissions yet.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border border-gray-200 p-5 col-span-2 lg:col-span-1">
              <p className="text-xs text-gray-500 mb-1">Average SUS Score</p>
              <p className="font-display font-extrabold text-4xl text-gray-900">{avgScore ?? "—"}</p>
              <p className="text-xs text-gray-500 mt-0.5">/ 100</p>
              {avgScore != null && (
                <Badge variant={avgScore >= 85 ? "success" : avgScore >= 70 ? "info" : "warning"} size="sm" className="mt-2">
                  {gradeFor(avgScore)}
                </Badge>
              )}
            </div>
            {distribution.map((d) => (
              <div key={d.range} className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
                <p className="font-display font-extrabold text-3xl text-gray-900">{d.count}</p>
                <p className="text-xs text-gray-500 mt-0.5">{d.label}</p>
                <p className="text-xs text-gray-400">{d.range}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 className="w-4.5 h-4.5 text-rose-600" aria-hidden />
                Score Distribution
              </h2>
              <div className="flex items-end gap-2 h-28">
                {responses.map((s) => (
                  <div key={s.id} className="flex-1 flex flex-col items-center gap-0.5">
                    <span className="text-xs text-gray-500">{s.sus_score}</span>
                    <div
                      className="w-full rounded-t-md bg-rose-500"
                      style={{ height: `${(s.sus_score / 100) * 90}px` }}
                      aria-label={`Score: ${s.sus_score}`}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h2 className="font-semibold text-gray-900 mb-4">Average per Question (1–5 scale)</h2>
              <div className="space-y-2.5">
                {avgPerQuestion.map((avg, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-600 truncate max-w-50">
                        Q{i + 1}: {susQuestions[i].substring(0, 35)}...
                      </span>
                      <span className={`font-bold ml-2 shrink-0 ${avg >= 4 ? "text-green-600" : avg >= 3 ? "text-amber-600" : "text-red-600"}`}>
                        {avg}
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-500 rounded-full" style={{ width: `${(avg / 5) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Individual Submissions</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {["User ID", "Score", "Grade", "Submitted"].map((h) => (
                      <th key={h} className="text-left text-xs font-semibold text-gray-500 px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {responses.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{s.user_id?.slice(0, 8)}…</td>
                      <td className="px-4 py-3">
                        <span className="font-display font-bold text-lg text-gray-900">{s.sus_score}</span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={gradeConfig[gradeFor(s.sus_score)]} size="sm">{gradeFor(s.sus_score)}</Badge>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">{new Date(s.submitted_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
