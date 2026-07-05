import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Phone } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Alert } from "@/components/atoms/Alert";
import { Badge } from "@/components/atoms/Badge";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES, ROLES, ROLE_LABELS } from "@/utils/constants";
import { isValidEmail, getPasswordStrength } from "@/utils/validators";
import { cn } from "@/utils/cn";

const roleOptions = [
  {
    value: ROLES.PREGNANT_WOMAN,
    emoji: "🤰",
    desc: "I am pregnant or planning a pregnancy",
  },
  {
    value: ROLES.NURSE,
    emoji: "👩‍⚕️",
    desc: "I am a nurse or healthcare worker",
  },
  {
    value: ROLES.RESEARCHER,
    emoji: "🔬",
    desc: "I am a researcher or administrator",
  },
];

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    full_name: "",
    role: ROLES.PREGNANT_WOMAN,
    phone_number: "",
    consentAgreed: false,
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const strength = getPasswordStrength(form.password);

  function validate() {
    const e = {};
    if (!form.full_name.trim()) e.full_name = "Full name is required";
    if (!form.email) e.email = "Email is required";
    else if (!isValidEmail(form.email)) e.email = "Enter a valid email address";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 8)
      e.password = "Password must be at least 8 characters";
    if (!form.consentAgreed)
      e.consent = "You must accept the terms to continue";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setApiError("");
    if (!validate()) return;
    setLoading(true);
    const result = await register(form);
    setLoading(false);
    if (result.success) {
      navigate(ROUTES.VERIFY_EMAIL, { state: { email: form.email } });
    } else {
      setApiError(result.error);
    }
  }

  return (
    <div className="animate-fade-in-up">
      <div className="mb-6">
        <h1 className="font-display font-bold text-2xl text-text-primary mb-1.5">
          Create your account
        </h1>
        <p className="text-sm text-text-secondary">
          Free to use. Your data stays private and secure.
        </p>
      </div>

      {apiError && (
        <Alert
          variant="error"
          onDismiss={() => setApiError("")}
          className="mb-5"
        >
          {apiError}
        </Alert>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Role selection */}
        <div>
          <p className="text-sm font-medium text-text-primary mb-2.5">
            I am a…{" "}
            <span className="text-error" aria-hidden>
              *
            </span>
          </p>
          <div className="grid grid-cols-1 gap-2">
            {roleOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setForm((p) => ({ ...p, role: opt.value }))}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all",
                  form.role === opt.value
                    ? "border-rose-400 bg-rose-50 text-rose-800 shadow-sm"
                    : "border-border bg-white text-text-secondary hover:border-rose-200 hover:bg-rose-50/50",
                )}
                aria-pressed={form.role === opt.value}
              >
                <span className="text-xl" aria-hidden>
                  {opt.emoji}
                </span>
                <div>
                  <p className="text-sm font-semibold">
                    {ROLE_LABELS[opt.value]}
                  </p>
                  <p className="text-xs opacity-70">{opt.desc}</p>
                </div>
                {form.role === opt.value && (
                  <Badge variant="rose" size="sm" className="ml-auto shrink-0">
                    Selected
                  </Badge>
                )}
              </button>
            ))}
          </div>
        </div>

        <Input
          label="Full name"
          icon={<User className="w-4 h-4" />}
          placeholder="e.g. Adaeze Okonkwo"
          value={form.full_name}
          onChange={(e) =>
            setForm((p) => ({ ...p, full_name: e.target.value }))
          }
          error={errors.name}
          required
          autoComplete="name"
        />

        <Input
          label="Email address"
          type="email"
          icon={<Mail className="w-4 h-4" />}
          placeholder="you@example.com"
          value={form.email}
          onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
          error={errors.email}
          required
          autoComplete="email"
        />

        <Input
          label="Phone number (optional)"
          type="tel"
          icon={<Phone className="w-4 h-4" />}
          placeholder="+234 800 000 0000"
          value={form.phone_number}
          onChange={(e) =>
            setForm((p) => ({ ...p, phone_number: e.target.value }))
          }
          hint="Nigerian number format. Used for emergency alerts only."
          autoComplete="tel"
        />

        <div>
          <Input
            label="Password"
            type="password"
            icon={<Lock className="w-4 h-4" />}
            placeholder="At least 8 characters"
            value={form.password}
            onChange={(e) =>
              setForm((p) => ({ ...p, password: e.target.value }))
            }
            error={errors.password}
            required
            autoComplete="new-password"
          />
          {form.password && (
            <div className="mt-2 space-y-1.5">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex-1 h-1.5 rounded-full transition-all",
                      i <= strength.score ? strength.color : "bg-gray-100",
                    )}
                  />
                ))}
              </div>
              <p className="text-xs text-text-muted">
                Password strength:{" "}
                <span className="font-medium">{strength.label}</span>
              </p>
            </div>
          )}
        </div>

        {/* Consent */}
        <div className="rounded-xl border border-border bg-white p-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.consentAgreed}
              onChange={(e) =>
                setForm((p) => ({ ...p, consentAgreed: e.target.checked }))
              }
              className="mt-0.5 w-4 h-4 rounded border-border text-rose-700 accent-rose-700"
              required
            />
            <span className="text-xs text-text-secondary leading-relaxed">
              I agree to the{" "}
              <Link
                to={ROUTES.TERMS}
                className="text-rose-700 hover:underline"
                target="_blank"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                to={ROUTES.PRIVACY}
                className="text-rose-700 hover:underline"
                target="_blank"
              >
                Privacy Policy
              </Link>
              . I understand MamaGuide provides educational information only and
              is not a substitute for professional medical advice.
            </span>
          </label>
          {errors.consent && (
            <p className="text-xs text-error mt-1.5 ml-7">{errors.consent}</p>
          )}
        </div>

        <Button type="submit" fullWidth size="lg" loading={loading}>
          Create Account
        </Button>
      </form>

      <p className="mt-5 text-sm text-center text-text-secondary">
        Already have an account?{" "}
        <Link
          to={ROUTES.LOGIN}
          className="text-rose-700 font-semibold hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
