import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, ArrowLeft, KeyRound, RefreshCw, CheckCircle } from 'lucide-react'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { Alert } from '@/components/atoms/Alert'
import { OtpInputGroup } from '@/components/atoms/OtpInputGroup'
import { useOtpInput } from '@/hooks/useOtpInput'
import { useResendCooldown } from '@/hooks/useResendCooldown'
import { authService } from '@/services/authService'
import { ROUTES, LOCAL_STORAGE_KEYS } from '@/utils/constants'
import { isValidEmail } from '@/utils/validators'
import { cn } from '@/utils/cn'

const ERROR_MAP = {
  invalid_otp:       { main: 'That code is incorrect.', hint: 'Double-check the digits and try again.' },
  expired_otp:       { main: 'This code has expired.', hint: 'Request a new code using the button below.' },
  too_many_attempts: { main: 'Too many incorrect attempts.', hint: 'Please wait a moment, then request a new code.' },
  user_not_found:    { main: 'No account found with that email.', hint: 'Check for a typo or create a new account.' },
}

function parseError(err) {
  const code = err.response?.data?.code || ''
  const msg  = (err.response?.data?.error || '').toLowerCase()
  if (ERROR_MAP[code]) return ERROR_MAP[code]
  if (msg.includes('not found') || msg.includes('no account') || msg.includes('user'))
    return ERROR_MAP.user_not_found
  if (msg.includes('invalid') || msg.includes('incorrect') || msg.includes('wrong'))
    return ERROR_MAP.invalid_otp
  if (msg.includes('expir'))
    return ERROR_MAP.expired_otp
  if (msg.includes('attempt') || msg.includes('many'))
    return ERROR_MAP.too_many_attempts
  if (!err.response)
    return { main: "Couldn't connect.", hint: 'Check your internet connection and try again.' }
  return { main: 'Something went wrong.', hint: 'Please try again.' }
}

// ── Step 1: Email entry ───────────────────────────────────────────────────────
function EmailStep({ onSent }) {
  const [email,    setEmail]    = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!email.trim())        { setError('Email is required'); return }
    if (!isValidEmail(email)) { setError('Enter a valid email address'); return }
    setLoading(true)
    try {
      await authService.forgotPassword(email.trim())
      onSent(email.trim())
    } catch (err) {
      const parsed = parseError(err)
      setError(parsed.main + ' ' + parsed.hint)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="animate-fade-in-up">
      <Link
        to={ROUTES.LOGIN}
        className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-rose-700 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Sign In
      </Link>

      <div className="mb-6">
        <h1 className="font-display font-bold text-2xl text-text-primary mb-1.5">
          Forgot password?
        </h1>
        <p className="text-sm text-text-secondary leading-relaxed">
          Enter your email and we'll send you a 6-digit code to reset your password.
        </p>
      </div>

      {error && (
        <Alert variant="error" onDismiss={() => setError('')} className="mb-5">
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Input
          label="Email address"
          type="email"
          icon={<Mail className="w-4 h-4" />}
          placeholder="you@example.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <Button type="submit" fullWidth size="lg" loading={loading}>
          Send Reset Code
        </Button>
      </form>
    </div>
  )
}

// ── Step 2: OTP entry ─────────────────────────────────────────────────────────
function OtpStep({ email, onBack, onVerified }) {
  const navigate = useNavigate()

  const { values, refs, otp, isComplete, handleChange, handleKeyDown, handlePaste, reset } =
    useOtpInput(6)

  const { secondsLeft, canResend, startCooldown } =
    useResendCooldown(LOCAL_STORAGE_KEYS.OTP_COOLDOWN_RESET)

  const [verifyStatus, setVerifyStatus] = useState('idle') // idle | verifying | success
  const [resendStatus, setResendStatus] = useState('idle') // idle | sending | sent
  const [error, setError]               = useState(null)

  const didMount = useRef(false)

  // Cooldown starts when user arrives here (OTP was just sent in step 1)
  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true
      if (canResend) startCooldown()
    }
  }, [])

  // Clear error on any digit change
  useEffect(() => {
    if (error && otp.length > 0) setError(null)
  }, [otp])

  async function handleVerify(e) {
    e?.preventDefault()
    if (!isComplete || verifyStatus === 'verifying') return
    setError(null)
    setVerifyStatus('verifying')
    try {
      const { data } = await authService.verifyResetOtp(email, otp)
      setVerifyStatus('success')
      // Backend wraps every response as { success, data, message }; verifyOtp's
      // `data` is the raw Supabase { user, session } — the reset token is the
      // session's access_token, not a top-level `token` field.
      const resetToken = data?.data?.session?.access_token
      // Navigate to reset password, passing the short-lived token via state
      setTimeout(() => navigate(ROUTES.RESET_PASSWORD, {
        replace: true,
        state: { resetToken, email },
      }), 1200)
    } catch (err) {
      setVerifyStatus('idle')
      setError(parseError(err))
      reset()
    }
  }

  async function handleResend() {
    if (!canResend || resendStatus === 'sending') return
    setResendStatus('sending')
    setError(null)
    try {
      await authService.forgotPassword(email)
      setResendStatus('sent')
      startCooldown()
      reset()
      setTimeout(() => setResendStatus('idle'), 4000)
    } catch (err) {
      setResendStatus('idle')
      setError(parseError(err))
    }
  }

  const isVerifying = verifyStatus === 'verifying'
  const isSuccess   = verifyStatus === 'success'

  return (
    <div className="animate-fade-in-up">
      {/* Back */}
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-rose-700 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Change email
      </button>

      {/* Icon */}
      <div className={cn(
        'w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 transition-all duration-500',
        isSuccess ? 'bg-green-100' : 'bg-rose-100',
      )}>
        {isSuccess
          ? <CheckCircle className="w-8 h-8 text-green-600" aria-hidden />
          : <KeyRound className="w-8 h-8 text-rose-700" aria-hidden />
        }
      </div>

      <div className="text-center mb-7">
        <h1 className="font-display font-bold text-2xl text-text-primary mb-2">
          {isSuccess ? 'Code verified!' : 'Enter your reset code'}
        </h1>
        {isSuccess ? (
          <p className="text-sm text-text-secondary">Redirecting to set your new password…</p>
        ) : (
          <p className="text-sm text-text-secondary leading-relaxed">
            We sent a 6-digit code to{' '}
            <strong className="text-text-primary break-all">{email}</strong>.
            <br />
            Enter it below to continue.
          </p>
        )}
      </div>

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

          {/* Error */}
          {error && (
            <div role="alert" className="mt-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm">
              <p className="font-semibold text-error">{error.main}</p>
              <p className="text-red-600/80 mt-0.5">{error.hint}</p>
            </div>
          )}

          {/* Resend sent feedback */}
          {resendStatus === 'sent' && (
            <p role="status" className="mt-3 text-center text-sm text-green-700 font-medium">
              New code sent. Check your inbox.
            </p>
          )}

          <Button
            type="submit"
            fullWidth
            size="lg"
            loading={isVerifying}
            disabled={!isComplete || isVerifying}
            className="mt-5"
          >
            {isVerifying ? 'Verifying…' : 'Verify Code'}
          </Button>

          {/* Resend */}
          <div className="mt-5 text-center">
            <p className="text-sm text-text-secondary mb-2">Didn't receive the code?</p>
            {canResend ? (
              <button
                type="button"
                onClick={handleResend}
                disabled={resendStatus === 'sending'}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-rose-700 hover:text-rose-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <RefreshCw className={cn('w-3.5 h-3.5', resendStatus === 'sending' && 'animate-spin')} />
                {resendStatus === 'sending' ? 'Sending…' : 'Resend code'}
              </button>
            ) : (
              <p className="text-sm text-text-muted tabular-nums">
                Resend code in{' '}
                <span className="font-semibold text-text-primary">{secondsLeft}s</span>
              </p>
            )}
          </div>
        </form>
      )}
    </div>
  )
}

// ── Page orchestrator ─────────────────────────────────────────────────────────
export default function ForgotPasswordPage() {
  const [step,  setStep]  = useState('email') // 'email' | 'otp'
  const [email, setEmail] = useState('')

  function handleEmailSent(sentEmail) {
    setEmail(sentEmail)
    setStep('otp')
  }

  if (step === 'otp') {
    return (
      <OtpStep
        email={email}
        onBack={() => setStep('email')}
        onVerified={() => {}}
      />
    )
  }

  return <EmailStep onSent={handleEmailSent} />
}
