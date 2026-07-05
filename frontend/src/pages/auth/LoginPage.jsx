import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Alert } from "@/components/atoms/Alert";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/utils/constants";
import { isValidEmail } from "@/utils/validators";

export default function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || ROUTES.CHAT;

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  function validate() {
    const e = {};
    if (!form.email) e.email = "Email is required";
    else if (!isValidEmail(form.email)) e.email = "Enter a valid email address";
    if (!form.password) e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setApiError("");
    if (!validate()) return;
    setLoading(true);
    const result = await signIn(form.email, form.password);
    setLoading(false);
    if (result.success) {
      if (!result.user?.onboarding_completed) {
        navigate(ROUTES.ONBOARDING, { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } else {
      setApiError(result.error);
    }
  }

  return (
    <div className="animate-fade-in-up">
      <div className="mb-8">
        <h1 className="font-display font-bold text-2xl text-text-primary mb-1.5">
          Welcome back
        </h1>
        <p className="text-sm text-text-secondary">
          Sign in to your MamaGuide account to continue.
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

        <div>
          <Input
            label="Password"
            type="password"
            icon={<Lock className="w-4 h-4" />}
            placeholder="Enter your password"
            value={form.password}
            onChange={(e) =>
              setForm((p) => ({ ...p, password: e.target.value }))
            }
            error={errors.password}
            required
            autoComplete="current-password"
          />
          <div className="mt-1.5 text-right">
            <Link
              to={ROUTES.FORGOT_PASSWORD}
              className="text-xs text-rose-700 hover:underline font-medium"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          fullWidth
          size="lg"
          loading={loading}
          className="mt-6"
        >
          Sign In
        </Button>
      </form>

      <p className="mt-6 text-sm text-center text-text-secondary">
        Don't have an account?{" "}
        <Link
          to={ROUTES.REGISTER}
          className="text-rose-700 font-semibold hover:underline"
        >
          Create free account
        </Link>
      </p>
    </div>
  );
}
