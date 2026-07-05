import { cn } from '@/utils/cn'
import { AlertCircle, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

export function Input({
  label,
  hint,
  error,
  icon,
  iconRight,
  type = 'text',
  fullWidth = true,
  className,
  inputClassName,
  required,
  id,
  ...props
}) {
  const inputId = id || `input-${Math.random().toString(36).slice(2)}`
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const resolvedType = isPassword ? (showPassword ? 'text' : 'password') : type

  return (
    <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full', className)}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-text-primary"
        >
          {label}
          {required && <span className="text-error ml-1" aria-hidden>*</span>}
        </label>
      )}

      <div className="relative">
        {icon && (
          <span
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
            aria-hidden
          >
            {icon}
          </span>
        )}

        <input
          id={inputId}
          type={resolvedType}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          aria-invalid={!!error}
          required={required}
          className={cn(
            'w-full rounded-xl border bg-white text-text-primary',
            'px-4 py-3 text-sm leading-snug',
            'transition-all duration-150',
            'placeholder:text-text-muted',
            'focus:outline-none focus:ring-2 focus:ring-rose-600/20 focus:border-rose-600',
            error
              ? 'border-error focus:ring-error/20 focus:border-error'
              : 'border-border hover:border-rose-300',
            icon && 'pl-10',
            (iconRight || isPassword) && 'pr-10',
            inputClassName
          )}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(v => !v)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}

        {iconRight && !isPassword && (
          <span
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted"
            aria-hidden
          >
            {iconRight}
          </span>
        )}
      </div>

      {error && (
        <p id={`${inputId}-error`} role="alert" className="flex items-center gap-1 text-xs text-error">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {error}
        </p>
      )}

      {hint && !error && (
        <p id={`${inputId}-hint`} className="text-xs text-text-muted">
          {hint}
        </p>
      )}
    </div>
  )
}

export function Textarea({
  label,
  hint,
  error,
  fullWidth = true,
  className,
  textareaClassName,
  required,
  id,
  rows = 3,
  ...props
}) {
  const inputId = id || `textarea-${Math.random().toString(36).slice(2)}`

  return (
    <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full', className)}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-text-primary">
          {label}
          {required && <span className="text-error ml-1" aria-hidden>*</span>}
        </label>
      )}

      <textarea
        id={inputId}
        rows={rows}
        aria-describedby={error ? `${inputId}-error` : undefined}
        aria-invalid={!!error}
        required={required}
        className={cn(
          'w-full rounded-xl border bg-white text-text-primary',
          'px-4 py-3 text-sm leading-relaxed resize-y',
          'transition-all duration-150',
          'placeholder:text-text-muted',
          'focus:outline-none focus:ring-2 focus:ring-rose-600/20 focus:border-rose-600',
          error
            ? 'border-error focus:ring-error/20 focus:border-error'
            : 'border-border hover:border-rose-300',
          textareaClassName
        )}
        {...props}
      />

      {error && (
        <p id={`${inputId}-error`} role="alert" className="flex items-center gap-1 text-xs text-error">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {error}
        </p>
      )}

      {hint && !error && (
        <p className="text-xs text-text-muted">{hint}</p>
      )}
    </div>
  )
}
