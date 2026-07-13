import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Phone, Info } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Alert } from "@/components/atoms/Alert";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES, ROLES } from "@/utils/constants";
import { isValidEmail, getPasswordStrength } from "@/utils/validators";
import { cn } from "@/utils/cn";

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
          For pregnant and postpartum women. Free to use, and your data stays
          private and secure.
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

      <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-border bg-white p-3.5">
        <Info className="w-4 h-4 text-text-muted shrink-0 mt-0.5" aria-hidden />
        <p className="text-xs text-text-secondary leading-relaxed">
          <span className="font-semibold text-text-primary">
            Health worker, researcher or administrator?
          </span>{" "}
          Staff accounts are created by invitation only. Ask a MamaGuide super
          admin to send you an email invite.
        </p>
      </div>
    </div>
  );
}
