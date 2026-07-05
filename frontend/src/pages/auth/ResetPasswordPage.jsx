import { useState } from 'react'
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom'
import { Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { Alert } from '@/components/atoms/Alert'
import { authService } from '@/services/authService'
import { ROUTES } from '@/utils/constants'
import { getPasswordStrength } from '@/utils/validators'
import { cn } from '@/utils/cn'

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  // Accept token from OTP flow (navigation state) OR legacy URL param
  const token = location.state?.resetToken || searchParams.get('token') || ''

  const [form, setForm] = useState({ password: '', confirm: '' })
  const [showPw, setShowPw] = useState(false)
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)

  const strength = getPasswordStrength(form.password)

  function validate() {
    const e = {}
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 8) e.password = 'Password must be at least 8 characters'
    if (!form.confirm) e.confirm = 'Please confirm your password'
    else if (form.password !== form.confirm) e.confirm = 'Passwords do not match'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setApiError('')
    if (!validate()) return
    setLoading(true)
    try {
      await authService.resetPassword(token, form.password)
      navigate(ROUTES.PASSWORD_SUCCESS)
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to reset password. The link may have expired.')
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="text-center animate-fade-in-up">
        <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-5">
          <Lock className="w-8 h-8 text-amber-600" aria-hidden />
        </div>
        <h1 className="font-display font-bold text-2xl text-text-primary mb-2">Invalid Link</h1>
        <p className="text-text-secondary text-sm mb-6 leading-relaxed">
          This password reset link is invalid or has expired. Please request a new one.
        </p>
        <Link
          to={ROUTES.FORGOT_PASSWORD}
          className="inline-flex items-center gap-2 bg-rose-700 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-rose-800 transition-colors text-sm"
        >
          Request New Link
        </Link>
      </div>
    )
  }

  return (
    <div className="animate-fade-in-up">
      <Link to={ROUTES.LOGIN} className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-rose-700 transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Sign In
      </Link>

      <div className="mb-6">
        <h1 className="font-display font-bold text-2xl text-text-primary mb-1.5">Set new password</h1>
        <p className="text-sm text-text-secondary leading-relaxed">
          Choose a strong password for your MamaGuide account.
        </p>
      </div>

      {apiError && <Alert variant="error" onDismiss={() => setApiError('')} className="mb-5">{apiError}</Alert>}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <div className="relative">
            <Input
              label="New password"
              type={showPw ? 'text' : 'password'}
              icon={<Lock className="w-4 h-4" />}
              placeholder="At least 8 characters"
              value={form.password}
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              error={errors.password}
              required
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPw(v => !v)}
              className="absolute right-3 top-9 text-text-muted hover:text-text-primary"
              aria-label={showPw ? 'Hide password' : 'Show password'}
            >
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {form.password && (
            <div className="mt-2 space-y-1.5">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(i => (
                  <div
                    key={i}
                    className={cn('flex-1 h-1.5 rounded-full transition-all', i <= strength.score ? strength.color : 'bg-gray-100')}
                  />
                ))}
              </div>
              <p className="text-xs text-text-muted">
                Password strength: <span className="font-medium">{strength.label}</span>
              </p>
            </div>
          )}
        </div>

        <Input
          label="Confirm new password"
          type="password"
          icon={<Lock className="w-4 h-4" />}
          placeholder="Repeat your password"
          value={form.confirm}
          onChange={e => setForm(p => ({ ...p, confirm: e.target.value }))}
          error={errors.confirm}
          required
          autoComplete="new-password"
        />

        <Button type="submit" fullWidth size="lg" loading={loading} className="mt-6">
          Set New Password
        </Button>
      </form>
    </div>
  )
}
