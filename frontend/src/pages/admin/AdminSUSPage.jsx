import { BarChart3, Download } from "lucide-react";
import { Badge } from "@/components/atoms/Badge";

const susSubmissions = [
  {
    id: "s1",
    user: "Adaeze O.",
    role: "pregnant_woman",
    score: 82,
    grade: "Good",
    date: "2026-05-20",
    responses: [4, 2, 4, 1, 4, 2, 5, 2, 4, 2],
  },
  {
    id: "s2",
    user: "Chioma K.",
    role: "pregnant_woman",
    score: 90,
    grade: "Excellent",
    date: "2026-05-19",
    responses: [5, 1, 5, 1, 5, 1, 5, 1, 5, 2],
  },
  {
    id: "s3",
    user: "Nurse Fatima",
    role: "nurse",
    score: 75,
    grade: "Good",
    date: "2026-05-18",
    responses: [4, 2, 4, 2, 4, 2, 4, 2, 4, 3],
  },
  {
    id: "s4",
    user: "Halima M.",
    role: "pregnant_woman",
    score: 62,
    grade: "OK",
    date: "2026-05-17",
    responses: [3, 3, 3, 2, 4, 3, 3, 3, 3, 3],
  },
  {
    id: "s5",
    user: "Emeka O.",
    role: "nurse",
    score: 87,
    grade: "Excellent",
    date: "2026-05-17",
    responses: [5, 1, 5, 2, 5, 1, 5, 2, 5, 1],
  },
  {
    id: "s6",
    user: "Blessing N.",
    role: "pregnant_woman",
    score: 77,
    grade: "Good",
    date: "2026-05-16",
    responses: [4, 2, 4, 2, 4, 2, 4, 2, 4, 2],
  },
  {
    id: "s7",
    user: "Amaka C.",
    role: "pregnant_woman",
    score: 70,
    grade: "Good",
    date: "2026-05-15",
    responses: [4, 2, 4, 3, 3, 3, 4, 2, 4, 3],
  },
];

const avgScore =
  Math.round(
    (susSubmissions.reduce((s, r) => s + r.score, 0) / susSubmissions.length) *
      10,
  ) / 10;

const distribution = [
  {
    range: "85–100",
    label: "Excellent",
    count: susSubmissions.filter((s) => s.score >= 85).length,
    color: "bg-green-500 border-green-200 bg-green-50 text-green-800",
  },
  {
    range: "70–84",
    label: "Good",
    count: susSubmissions.filter((s) => s.score >= 70 && s.score < 85).length,
    color: "bg-blue-500 border-blue-200 bg-blue-50 text-blue-800",
  },
  {
    range: "50–69",
    label: "OK",
    count: susSubmissions.filter((s) => s.score >= 50 && s.score < 70).length,
    color: "bg-amber-500 border-amber-200 bg-amber-50 text-amber-800",
  },
  {
    range: "<50",
    label: "Poor",
    count: susSubmissions.filter((s) => s.score < 50).length,
    color: "bg-red-500 border-red-200 bg-red-50 text-red-800",
  },
];

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

const avgPerQuestion = susQuestions.map((_, qi) => {
  const total = susSubmissions.reduce((sum, s) => sum + s.responses[qi], 0);
  return Math.round((total / susSubmissions.length) * 10) / 10;
});

const gradeConfig = {
  Excellent: "success",
  Good: "info",
  OK: "warning",
  Poor: "error",
};

export default function AdminSUSPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-gray-900">
            SUS Evaluation Results
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            System Usability Scale scores from {susSubmissions.length}{" "}
            participants
          </p>
        </div>
        <button className="inline-flex items-center gap-2 text-sm text-rose-700 border border-rose-200 bg-rose-50 px-4 py-2 rounded-xl hover:bg-rose-100 transition-colors font-medium">
          <Download className="w-4 h-4" aria-hidden />
          Export CSV
        </button>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-5 col-span-2 lg:col-span-1">
          <p className="text-xs text-gray-500 mb-1">Average SUS Score</p>
          <p className="font-display font-extrabold text-4xl text-gray-900">
            {avgScore}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">/ 100</p>
          <Badge
            variant={
              avgScore >= 85 ? "success" : avgScore >= 70 ? "info" : "warning"
            }
            size="sm"
            className="mt-2"
          >
            {avgScore >= 85 ? "Excellent" : avgScore >= 70 ? "Good" : "OK"}
          </Badge>
        </div>
        {distribution.map((d) => (
          <div
            key={d.range}
            className="bg-white rounded-2xl border border-gray-200 p-4 text-center"
          >
            <p className="font-display font-extrabold text-3xl text-gray-900">
              {d.count}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">{d.label}</p>
            <p className="text-xs text-gray-400">{d.range}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Score distribution bar chart */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-4.5 h-4.5 text-rose-600" aria-hidden />
            Score Distribution
          </h2>
          <div className="flex items-end gap-2 h-28 mb-2">
            {susSubmissions.map((s) => (
              <div
                key={s.id}
                className="flex-1 flex flex-col items-center gap-0.5"
              >
                <span className="text-xs text-gray-500">{s.score}</span>
                <div
                  className="w-full rounded-t-md bg-rose-500"
                  style={{ height: `${(s.score / 100) * 90}px` }}
                  aria-label={`${s.user}: ${s.score}`}
                />
              </div>
            ))}
          </div>
          <div className="flex items-end gap-2">
            {susSubmissions.map((s) => (
              <div key={s.id} className="flex-1 text-center">
                <span className="text-xs text-gray-400 truncate block">
                  {s.user.split(" ")[0]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Average per question */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">
            Average per Question (1–5 scale)
          </h2>
          <div className="space-y-2.5">
            {avgPerQuestion.map((avg, i) => (
              <div key={i}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-600 truncate max-w-50">
                    Q{i + 1}: {susQuestions[i].substring(0, 35)}...
                  </span>
                  <span
                    className={`font-bold ml-2 shrink-0 ${avg >= 4 ? "text-green-600" : avg >= 3 ? "text-amber-600" : "text-red-600"}`}
                  >
                    {avg}
                  </span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-rose-500 rounded-full"
                    style={{ width: `${(avg / 5) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Submissions table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">
            Individual Submissions
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {["Participant", "Role", "Score", "Grade", "Date"].map((h) => (
                  <th
                    key={h}
                    className="text-left text-xs font-semibold text-gray-500 px-4 py-3"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {susSubmissions.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {s.user}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={s.role === "nurse" ? "sage" : "rose"}
                      size="sm"
                    >
                      {s.role === "nurse" ? "Nurse" : "Patient"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-display font-bold text-lg text-gray-900">
                      {s.score}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={gradeConfig[s.grade]} size="sm">
                      {s.grade}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {new Date(s.date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
