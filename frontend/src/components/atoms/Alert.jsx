import { cn } from '@/utils/cn'
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X, Siren } from 'lucide-react'

const alertConfig = {
  success: {
    wrapper: 'bg-success-light border-success/30 text-success-dark',
    icon: <CheckCircle2 className="w-5 h-5 text-success" />,
  },
  warning: {
    wrapper: 'bg-warning-light border-warning/30 text-warning-dark',
    icon: <AlertTriangle className="w-5 h-5 text-warning" />,
  },
  error: {
    wrapper: 'bg-error-light border-error/30 text-error-dark',
    icon: <AlertCircle className="w-5 h-5 text-error" />,
  },
  info: {
    wrapper: 'bg-info-light border-info/30 text-info-dark',
    icon: <Info className="w-5 h-5 text-info" />,
  },
  emergency: {
    wrapper: 'bg-emergency-light border-emergency/40 text-emergency-dark',
    icon: <Siren className="w-5 h-5 text-emergency animate-pulse-soft" />,
  },
}

export function Alert({ variant = 'info', title, onDismiss, className, children }) {
  const config = alertConfig[variant]

  return (
    <div
      role={variant === 'error' || variant === 'emergency' ? 'alert' : 'status'}
      className={cn(
        'flex gap-3 p-4 rounded-xl border',
        config.wrapper,
        className
      )}
    >
      <span className="shrink-0 mt-0.5" aria-hidden>{config.icon}</span>
      <div className="flex-1 min-w-0">
        {title && (
          <p className="font-semibold text-sm mb-1">{title}</p>
        )}
        <div className="text-sm leading-relaxed">{children}</div>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
