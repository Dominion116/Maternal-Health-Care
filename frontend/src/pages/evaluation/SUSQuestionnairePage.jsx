import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardCheck, Info } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Alert } from "@/components/atoms/Alert";
import { Badge } from "@/components/atoms/Badge";
import { evaluationService } from "@/services/evaluationService";
import { ROUTES } from "@/utils/constants";
import { cn } from "@/utils/cn";

const SUS_QUESTIONS = [
  {
    id: 1,
    text: "I think that I would like to use this system frequently.",
    positive: true,
  },
  { id: 2, text: "I found the system unnecessarily complex.", positive: false },
  { id: 3, text: "I thought the system was easy to use.", positive: true },
  {
    id: 4,
    text: "I think that I would need the support of a technical person to use this system.",
    positive: false,
  },
  {
    id: 5,
    text: "I found the various functions in this system were well integrated.",
    positive: true,
  },
  {
    id: 6,
    text: "I thought there was too much inconsistency in this system.",
    positive: false,
  },
  {
    id: 7,
    text: "I would imagine that most people would learn to use this system very quickly.",
    positive: true,
  },
  {
    id: 8,
    text: "I found the system very cumbersome to use.",
    positive: false,
  },
  { id: 9, text: "I felt very confident using the system.", positive: true },
  {
    id: 10,
    text: "I needed to learn a lot of things before I could get going with this system.",
    positive: false,
  },
];

const SCALE = [
  { value: 1, label: "Strongly Disagree" },
  { value: 2, label: "Disagree" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "Agree" },
  { value: 5, label: "Strongly Agree" },
];

function computeSUSScore(responses) {
  let total = 0;
  SUS_QUESTIONS.forEach((q) => {
    const r = responses[q.id] || 3;
    total += q.positive ? r - 1 : 5 - r;
  });
  return Math.round(total * 2.5);
}

function getSUSGrade(score) {
  if (score >= 85)
    return { grade: "A", label: "Excellent", variant: "success" };
  if (score >= 70) return { grade: "B", label: "Good", variant: "success" };
  if (score >= 50) return { grade: "C", label: "OK", variant: "warning" };
  if (score >= 35) return { grade: "D", label: "Poor", variant: "warning" };
  return { grade: "F", label: "Unacceptable", variant: "error" };
}

export default function SUSQuestionnairePage() {
  const navigate = useNavigate();
  const [responses, setResponses] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [score, setScore] = useState(null);

  const answered = Object.keys(responses).length;
  const progress = (answered / SUS_QUESTIONS.length) * 100;
  const allAnswered = answered === SUS_QUESTIONS.length;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!allAnswered) {
      setError("Please answer all 10 questions before submitting.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await evaluationService.submitSUS(responses);
      const s = computeSUSScore(responses);
      setScore(s);
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted && score !== null) {
    const grade = getSUSGrade(score);
    return (
      <div className="max-w-lg mx-auto px-4 py-10 text-center animate-fade-in-up">
        <div className="w-20 h-20 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-5">
          <ClipboardCheck className="w-10 h-10 text-rose-700" aria-hidden />
        </div>
        <Badge variant={grade.variant} size="lg" className="mb-4">
          SUS Score: {score} / 100, {grade.label}
        </Badge>
        <h1 className="font-display font-bold text-2xl text-text-primary mb-2">
          Thank you for your feedback!
        </h1>
        <p className="text-text-secondary text-sm leading-relaxed mb-6">
          Your evaluation has been recorded. Your input helps improve MamaGuide
          for all users.
        </p>
        <div className="bg-warm-white rounded-2xl border border-border p-5 mb-6 text-left">
          <p className="text-sm font-semibold text-text-primary mb-1">
            What your score means:
          </p>
          <p className="text-sm text-text-secondary leading-relaxed">
            {score >= 70
              ? "The system usability is rated Good to Excellent. Users find MamaGuide easy and intuitive to use."
              : score >= 50
                ? "The system usability is acceptable but has room for improvement."
                : "The system needs significant usability improvements."}
          </p>
        </div>
        <Button onClick={() => navigate(ROUTES.CHAT)}>Return to Chat</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2.5 mb-2">
          <span className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
            <ClipboardCheck className="w-5 h-5 text-rose-700" aria-hidden />
          </span>
          <div>
            <h1 className="font-display font-bold text-xl text-text-primary">
              System Usability Scale
            </h1>
            <p className="text-xs text-text-muted">
              Standard SUS Questionnaire (John Brooke, 1986)
            </p>
          </div>
        </div>
        <p className="text-sm text-text-secondary leading-relaxed">
          Please rate your experience using MamaGuide. Your honest feedback
          helps improve the system.
        </p>
      </div>

      {/* Progress */}
      <div className="mb-5">
        <div className="flex items-center justify-between text-xs text-text-muted mb-2">
          <span>
            {answered} of {SUS_QUESTIONS.length} answered
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-border rounded-full overflow-hidden">
          <div
            className="h-full bg-rose-600 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={answered}
            aria-valuemin={0}
            aria-valuemax={SUS_QUESTIONS.length}
            aria-label="Survey progress"
          />
        </div>
      </div>

      <Alert variant="info" className="mb-5">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 shrink-0 mt-0.5" aria-hidden />
          <p>
            Rate each statement from 1 (Strongly Disagree) to 5 (Strongly
            Agree). There are no right or wrong answers.
          </p>
        </div>
      </Alert>

      {error && (
        <Alert variant="error" onDismiss={() => setError("")} className="mb-4">
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <fieldset>
          <legend className="sr-only">System Usability Scale Questions</legend>
          <ol className="space-y-5">
            {SUS_QUESTIONS.map((q, i) => (
              <li key={q.id}>
                <div className="bg-white rounded-2xl border border-border p-4">
                  <p className="text-sm font-medium text-text-primary mb-4">
                    <span className="text-rose-600 font-bold mr-2">
                      {i + 1}.
                    </span>
                    {q.text}
                  </p>

                  <div
                    role="radiogroup"
                    aria-labelledby={`q${q.id}-label`}
                    className="flex flex-col gap-2 sm:flex-row sm:gap-0 sm:justify-between"
                  >
                    <span id={`q${q.id}-label`} className="sr-only">
                      {q.text}
                    </span>
                    {SCALE.map((s) => (
                      <label
                        key={s.value}
                        className={cn(
                          "flex sm:flex-col items-center gap-3 sm:gap-1.5 cursor-pointer",
                          "px-3 py-2.5 sm:px-2 rounded-xl sm:rounded-none transition-all",
                          responses[q.id] === s.value
                            ? "bg-rose-50 sm:bg-transparent"
                            : "hover:bg-gray-50 sm:hover:bg-transparent",
                        )}
                      >
                        <input
                          type="radio"
                          name={`q${q.id}`}
                          value={s.value}
                          checked={responses[q.id] === s.value}
                          onChange={() =>
                            setResponses((p) => ({ ...p, [q.id]: s.value }))
                          }
                          className="w-4 h-4 text-rose-700 accent-rose-700"
                          aria-label={`${s.label} (${s.value})`}
                        />
                        <div className="text-center">
                          <p
                            className={cn(
                              "text-sm font-bold",
                              responses[q.id] === s.value
                                ? "text-rose-700"
                                : "text-text-secondary",
                            )}
                          >
                            {s.value}
                          </p>
                          <p className="text-xs text-text-muted hidden sm:block leading-tight max-w-15">
                            {s.label}
                          </p>
                          <p className="text-xs text-text-secondary sm:hidden">
                            {s.label}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </fieldset>

        <div className="mt-6 pb-6">
          <Button
            type="submit"
            fullWidth
            size="lg"
            loading={loading}
            disabled={!allAnswered}
          >
            Submit Evaluation
          </Button>
          {!allAnswered && (
            <p className="text-center text-xs text-text-muted mt-2">
              Please answer all questions to submit
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
