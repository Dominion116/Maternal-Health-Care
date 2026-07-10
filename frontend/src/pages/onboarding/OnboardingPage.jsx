import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/services/authService";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import {
  ROUTES,
  PREGNANCY_STAGE_LABELS,
  LANGUAGE_LABELS,
  LOCAL_STORAGE_KEYS,
} from "@/utils/constants";
import { cn } from "@/utils/cn";

const STEPS = ["Welcome", "Pregnancy Stage", "Language", "Ready"];

export default function OnboardingPage() {
  const { user } = useAuth();
  const updateLocalUser = useAuthStore((s) => s.updateUser);
  const navigate = useNavigate();
  const [finishing, setFinishing] = useState(false);
  const [, setOnboardingDone] = useLocalStorage(
    LOCAL_STORAGE_KEYS.ONBOARDING_DONE,
    false,
  );

  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    pregnancyStage: user?.pregnancyStage || null,
    pregnancyWeeks: user?.pregnancyWeeks || "",
    language: "en",
  });

  function next() {
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }
  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }

  async function finish() {
    setFinishing(true);
    try {
      // POST /onboarding persists stage + language and flips
      // onboarding_completed server-side, so future logins skip this flow.
      await authService.completeOnboarding({
        pregnancy_stage: data.pregnancyStage || null,
        language: data.language,
      });
      updateLocalUser({
        pregnancyStage: data.pregnancyStage,
        pregnancyWeeks: data.pregnancyWeeks,
        language: data.language,
        onboarding_completed: true,
      });
      setOnboardingDone(true);
      navigate(ROUTES.CHAT);
    } catch {
      toast.error("Could not save your setup. Please try again.");
    } finally {
      setFinishing(false);
    }
  }

  return (
    <div className="min-h-dvh bg-hero-gradient flex flex-col items-center justify-center px-4 py-10">
      {/* Progress */}
      <div className="w-full max-w-md mb-6">
        <div className="flex items-center gap-2">
          {STEPS.map((s, i) => (
            <div
              key={s}
              className="flex items-center gap-2 flex-1 last:flex-none"
            >
              <div
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                  i < step
                    ? "bg-rose-700 text-white"
                    : i === step
                      ? "bg-rose-700 text-white ring-4 ring-rose-200"
                      : "bg-gray-200 text-gray-400",
                )}
              >
                {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-0.5",
                    i < step ? "bg-rose-700" : "bg-gray-200",
                  )}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-text-muted mt-2">
          {STEPS.map((s, i) => (
            <span
              key={s}
              className={cn(i === step && "text-rose-700 font-medium")}
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Step card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 animate-fade-in-up">
        {step === 0 && <WelcomeStep name={user?.name} />}
        {step === 1 && (
          <PregnancyStep
            data={data}
            onChange={(v) => setData((p) => ({ ...p, ...v }))}
            role={user?.role}
          />
        )}
        {step === 2 && (
          <LanguageStep
            data={data}
            onChange={(v) => setData((p) => ({ ...p, ...v }))}
          />
        )}
        {step === 3 && <ReadyStep name={user?.name} />}

        {/* Nav */}
        <div className="flex items-center justify-between mt-8 gap-3">
          {step > 0 ? (
            <Button
              variant="ghost"
              onClick={back}
              icon={<ChevronLeft className="w-4 h-4" />}
              size="sm"
            >
              Back
            </Button>
          ) : (
            <div />
          )}

          {step < STEPS.length - 1 ? (
            <Button
              onClick={next}
              size="md"
              iconRight={<ChevronRight className="w-4 h-4" />}
            >
              Continue
            </Button>
          ) : (
            <Button
              onClick={finish}
              size="md"
              disabled={finishing}
              iconRight={<Check className="w-4 h-4" />}
            >
              {finishing ? "Saving…" : "Let's Go!"}
            </Button>
          )}
        </div>
      </div>

      <button
        onClick={finish}
        disabled={finishing}
        className="mt-4 text-sm text-text-muted hover:text-text-secondary transition-colors disabled:opacity-50"
      >
        Skip setup for now
      </button>
    </div>
  );
}

function WelcomeStep({ name }) {
  return (
    <div className="text-center">
      <div className="text-5xl mb-4" aria-hidden>
        👶
      </div>
      <h2 className="font-display font-bold text-2xl text-text-primary mb-2">
        Welcome, {name?.split(" ")[0] || "there"}!
      </h2>
      <p className="text-text-secondary text-sm leading-relaxed">
        Let's personalise MamaGuide for you. This takes just a minute and helps
        us give you the most relevant guidance.
      </p>
    </div>
  );
}

function PregnancyStep({ data, onChange, role }) {
  const isPregnant = role === "pregnant_woman";
  return (
    <div>
      <h2 className="font-display font-bold text-xl text-text-primary mb-1.5">
        {isPregnant ? "Your pregnancy stage" : "Area of focus"}
      </h2>
      <p className="text-sm text-text-secondary mb-5">
        {isPregnant
          ? "Select your current stage of pregnancy."
          : "Which stage of pregnancy do you primarily work with?"}
      </p>

      <div className="space-y-2.5">
        {Object.entries(PREGNANCY_STAGE_LABELS).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => onChange({ pregnancyStage: value })}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border text-left transition-all",
              data.pregnancyStage === value
                ? "border-rose-400 bg-rose-50 shadow-sm"
                : "border-border hover:border-rose-200 hover:bg-rose-50/50",
            )}
            aria-pressed={data.pregnancyStage === value}
          >
            <span className="text-xl" aria-hidden>
              {value === "first_trimester"
                ? "🌱"
                : value === "second_trimester"
                  ? "🌸"
                  : value === "third_trimester"
                    ? "🌟"
                    : "💕"}
            </span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-text-primary">{label}</p>
            </div>
            {data.pregnancyStage === value && (
              <Check
                className="w-4.5 h-4.5 text-rose-600 shrink-0"
                aria-hidden
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function LanguageStep({ data, onChange }) {
  return (
    <div>
      <h2 className="font-display font-bold text-xl text-text-primary mb-1.5">
        Preferred language
      </h2>
      <p className="text-sm text-text-secondary mb-5">
        Choose your preferred language for health information.
      </p>

      <div className="grid grid-cols-2 gap-2.5">
        {Object.entries(LANGUAGE_LABELS).map(([value, label]) => {
          const isAvailable = value === "en";
          return (
            <button
              key={value}
              type="button"
              onClick={() => isAvailable && onChange({ language: value })}
              className={cn(
                "flex flex-col items-center gap-2 px-3 py-4 rounded-2xl border transition-all",
                data.language === value
                  ? "border-rose-400 bg-rose-50 shadow-sm"
                  : isAvailable
                    ? "border-border hover:border-rose-200 hover:bg-rose-50/50"
                    : "border-border bg-gray-50 opacity-50 cursor-not-allowed",
              )}
              aria-pressed={data.language === value}
              disabled={!isAvailable}
              title={!isAvailable ? "Coming soon" : undefined}
            >
              <span className="text-2xl" aria-hidden>
                {value === "en"
                  ? "🇬🇧"
                  : value === "yo"
                    ? "🇳🇬"
                    : value === "ha"
                      ? "🇳🇬"
                      : "🇳🇬"}
              </span>
              <p className="text-sm font-semibold text-text-primary">{label}</p>
              {!isAvailable && (
                <Badge variant="neutral" size="sm">
                  Soon
                </Badge>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ReadyStep({ name }) {
  return (
    <div className="text-center">
      <div className="text-5xl mb-4 animate-bounce-in" aria-hidden>
        🎉
      </div>
      <h2 className="font-display font-bold text-2xl text-text-primary mb-2">
        You're all set!
      </h2>
      <p className="text-text-secondary text-sm leading-relaxed mb-5">
        MamaGuide is ready to help you, {name?.split(" ")[0] || "there"}. Ask
        any question about your pregnancy anytime.
      </p>
      <div className="text-left bg-rose-50 rounded-2xl p-4 border border-rose-200 space-y-2.5">
        {[
          "💬 Ask pregnancy questions in plain English",
          "📚 Access health education resources",
          "🚨 Emergency detection and escalation",
          "📅 ANC visit reminders and guidance",
        ].map((tip) => (
          <p key={tip} className="text-xs text-rose-800 flex items-start gap-2">
            <span>{tip}</span>
          </p>
        ))}
      </div>
    </div>
  );
}
