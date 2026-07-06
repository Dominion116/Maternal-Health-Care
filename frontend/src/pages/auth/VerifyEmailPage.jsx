/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MailCheck, RefreshCw, CheckCircle } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { OtpInputGroup } from "@/components/atoms/OtpInputGroup";
import { useOtpInput } from "@/hooks/useOtpInput";
import { useResendCooldown } from "@/hooks/useResendCooldown";
import { authService } from "@/services/authService";
import { ROUTES, LOCAL_STORAGE_KEYS } from "@/utils/constants";
import { cn } from "@/utils/cn";

const ERROR_MAP = {
  invalid_otp: {
    main: "That code is incorrect.",
    hint: "Double-check the digits and try again.",
  },
  expired_otp: {
    main: "This code has expired.",
    hint: "Request a new code using the button below.",
  },
  too_many_attempts: {
    main: "Too many incorrect attempts.",
    hint: "Please wait a moment, then request a new code.",
  },
};

function parseError(err) {
  const code = err.response?.data?.code || "";
  const msg = (err.response?.data?.error || "").toLowerCase();
  if (ERROR_MAP[code]) return ERROR_MAP[code];
  if (
    msg.includes("invalid") ||
    msg.includes("incorrect") ||
    msg.includes("wrong")
  )
    return ERROR_MAP.invalid_otp;
  if (msg.includes("expir")) return ERROR_MAP.expired_otp;
  if (msg.includes("attempt") || msg.includes("many"))
    return ERROR_MAP.too_many_attempts;
  if (!err.response)
    return {
      main: "Couldn't connect.",
      hint: "Check your internet connection and try again.",
    };
  return {
    main: "Something went wrong.",
    hint: "Please try again or request a new code.",
  };
}

export default function VerifyEmailPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || "";

  const {
    values,
    refs,
    otp,
    isComplete,
    handleChange,
    handleKeyDown,
    handlePaste,
    reset,
  } = useOtpInput(6);

  const { secondsLeft, canResend, startCooldown } = useResendCooldown(
    LOCAL_STORAGE_KEYS.OTP_COOLDOWN_VERIFY,
  );

  const [verifyStatus, setVerifyStatus] = useState("idle"); // idle | verifying | success
  const [resendStatus, setResendStatus] = useState("idle"); // idle | sending | sent
  const [error, setError] = useState(null); // { main, hint } | null

  const didMount = useRef(false);

  // Start cooldown on first arrival (OTP was just sent by registration)
  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      if (canResend) startCooldown();
    }
  }, []);

  // Clear error when user edits the OTP. Schedule state update to avoid
  // synchronous setState within effect which can cause cascading renders.
  useEffect(() => {
    if (error && otp.length > 0) {
      const id = setTimeout(() => setError(null), 0);
      return () => clearTimeout(id);
    }
    return undefined;
  }, [error, otp]);

  async function handleVerify(e) {
    e?.preventDefault();
    if (!isComplete || verifyStatus === "verifying") return;
    setError(null);
    setVerifyStatus("verifying");
    try {
      await authService.verifyEmailOtp(email, otp);
      setVerifyStatus("success");
      setTimeout(() => navigate(ROUTES.EMAIL_VERIFIED, { replace: true }), 1400);
    } catch (err) {
      setVerifyStatus("idle");
      setError(parseError(err));
      reset();
    }
  }

  async function handleResend() {
    if (!canResend || resendStatus === "sending") return;
    setResendStatus("sending");
    setError(null);
    try {
      await authService.resendEmailOtp(email);
      setResendStatus("sent");
      startCooldown();
      reset();
      setTimeout(() => setResendStatus("idle"), 4000);
    } catch (err) {
      setResendStatus("idle");
      setError(parseError(err));
    }
  }

  const isVerifying = verifyStatus === "verifying";
  const isSuccess = verifyStatus === "success";

  return (
    <div className="animate-fade-in-up">
      {/* Back link */}
      {/* <Link
        to={ROUTES.REGISTER}
        className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-rose-700 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to registration
      </Link> */}

      {/* Icon */}
      <div
        className={cn(
          "w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 transition-all duration-500",
          isSuccess ? "bg-green-100" : "bg-rose-100",
        )}
      >
        {isSuccess ? (
          <CheckCircle className="w-8 h-8 text-green-600" aria-hidden />
        ) : (
          <MailCheck className="w-8 h-8 text-rose-700" aria-hidden />
        )}
      </div>

      {/* Heading */}
      <div className="text-center mb-7">
        <h1 className="font-display font-bold text-2xl text-text-primary mb-2">
          {isSuccess ? "Email verified!" : "Verify your email"}
        </h1>
        {isSuccess ? (
          <p className="text-sm text-text-secondary">Taking you to setup…</p>
        ) : (
          <p className="text-sm text-text-secondary leading-relaxed">
            We sent a 6-digit code to{" "}
            {email ? (
              <strong className="text-text-primary break-all">{email}</strong>
            ) : (
              "your email address"
            )}
            .
            <br />
            Enter the code below to confirm your account.
          </p>
        )}
      </div>

      {/* OTP form */}
      {!isSuccess && (
        <form onSubmit={handleVerify} noValidate>
          <OtpInputGroup
            values={values}
            refs={refs}
            handleChange={handleChange}
            handleKeyDown={handleKeyDown}
            handlePaste={handlePaste}
            error={error ? true : false}
            disabled={isVerifying}
          />

          {/* Error message */}
          {error && (
            <div
              role="alert"
              className="mt-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm"
            >
              <p className="font-semibold text-error">{error.main}</p>
              <p className="text-red-600/80 mt-0.5">{error.hint}</p>
            </div>
          )}

          {/* Resend sent feedback */}
          {resendStatus === "sent" && (
            <p
              role="status"
              className="mt-3 text-center text-sm text-green-700 font-medium"
            >
              New code sent — check your inbox.
            </p>
          )}

          {/* Submit */}
          <Button
            type="submit"
            fullWidth
            size="lg"
            loading={isVerifying}
            disabled={!isComplete || isVerifying}
            className="mt-5"
          >
            {isVerifying ? "Verifying…" : "Verify Code"}
          </Button>

          {/* Resend section */}
          <div className="mt-5 text-center">
            <p className="text-sm text-text-secondary mb-2">
              Didn't receive the code?
            </p>
            {canResend ? (
              <button
                type="button"
                onClick={handleResend}
                disabled={resendStatus === "sending"}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-rose-700 hover:text-rose-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <RefreshCw
                  className={cn(
                    "w-3.5 h-3.5",
                    resendStatus === "sending" && "animate-spin",
                  )}
                />
                {resendStatus === "sending" ? "Sending…" : "Resend code"}
              </button>
            ) : (
              <p className="text-sm text-text-muted tabular-nums">
                Resend code in{" "}
                <span className="font-semibold text-text-primary">
                  {secondsLeft}s
                </span>
              </p>
            )}
          </div>
        </form>
      )}

      {/* Footer note */}
      <p className="mt-6 text-xs text-text-muted text-center leading-relaxed">
        Already verified?{" "}
        <Link
          to={ROUTES.LOGIN}
          className="text-rose-700 hover:underline font-medium"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
