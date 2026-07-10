import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShieldCheck, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { Alert } from '@/components/atoms/Alert'
import { authService } from '@/services/authService'
import { ROUTES } from '@/utils/constants'
import { getPasswordStrength } from '@/utils/validators'
import { cn } from '@/utils/cn'

// Supabase's invite link redirects to redirectTo with the session in the URL
// *fragment* (#access_token=...&type=invite), not a query param — this app
// has no Supabase JS client to auto-consume it, so we parse the hash by hand
// and hand the access_token to the backend (same pattern as password reset).
function useInviteToken() {
  return useMemo(() => {
    const hash = window.location.hash?.replace(/^#/, '') || ''
    const params = new URLSearchParams(hash)
    return params.get('access_token') || ''
  }, [])
}

export default function AcceptInvitePage() {
  const navigate = useNavigate()
  const token = useInviteToken()

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
      await authService.acceptInvite(token, form.password)
      navigate(ROUTES.LOGIN, { replace: true })
    } catch (err) {
      setApiError(err.response?.data?.error || 'Failed to activate account. The invite link may have expired.')
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="text-center animate-fade-in-up">
        <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-5">
          <ShieldCheck className="w-8 h-8 text-amber-600" aria-hidden />
        </div>
        <h1 className="font-display font-bold text-2xl text-text-primary mb-2">Invalid Invite Link</h1>
        <p className="text-text-secondary text-sm mb-6 leading-relaxed">
          This invite link is invalid or has expired. Ask a super admin to resend your invite.
        </p>
        <Link
          to={ROUTES.LOGIN}
          className="inline-flex items-center gap-2 bg-rose-700 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-rose-800 transition-colors text-sm"
        >
          Back to Sign In
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
        <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center mb-4">
          <ShieldCheck className="w-6 h-6 text-rose-700" aria-hidden />
        </div>
        <h1 className="font-display font-bold text-2xl text-text-primary mb-1.5">
          Activate your staff account
        </h1>
        <p className="text-sm text-text-secondary leading-relaxed">
          You've been invited to the MamaGuide team. Set a password to finish
          setting up your account — you'll then sign in straight to the admin
          dashboard.
        </p>
      </div>

      {apiError && <Alert variant="error" onDismiss={() => setApiError('')} className="mb-5">{apiError}</Alert>}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <div className="relative">
            <Input
              label="Password"
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
          label="Confirm password"
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
          Activate Account
        </Button>
      </form>
    </div>
  )
}
