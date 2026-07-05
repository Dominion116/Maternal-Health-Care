import { cn } from "@/utils/cn";
import { Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const variants = {
  primary:
    "bg-rose-700 text-white hover:bg-rose-800 active:bg-rose-900 shadow-sm hover:shadow-rose disabled:opacity-50",
  secondary:
    "bg-white text-rose-700 border border-rose-200 hover:bg-rose-50 active:bg-rose-100 disabled:opacity-50",
  sage: "bg-sage-600 text-white hover:bg-sage-700 active:bg-sage-800 shadow-sm disabled:opacity-50",
  ghost:
    "text-rose-700 hover:bg-rose-50 active:bg-rose-100 disabled:opacity-50",
  danger:
    "bg-error text-white hover:bg-error-dark active:opacity-90 disabled:opacity-50",
  emergency:
    "bg-emergency text-white hover:bg-emergency-dark animate-pulse-soft shadow-lg disabled:opacity-50",
  outline:
    "border border-current text-rose-700 hover:bg-rose-50 disabled:opacity-50",
};

const sizes = {
  xs: "h-7 px-3 text-xs rounded-lg gap-1",
  sm: "h-9 px-4 text-sm rounded-xl gap-1.5",
  md: "h-11 px-5 text-sm rounded-xl gap-2",
  lg: "h-13 px-6 text-base rounded-2xl gap-2",
  xl: "h-14 px-8 text-base rounded-2xl gap-2.5",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  iconRight,
  fullWidth = false,
  className,
  children,
  disabled,
  ...props
}) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (props.as === Link) {
      navigate(props.to);
    }

    if (props.onClick) {
      props.onClick();
    }
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-semibold",
        "transition-all duration-150 cursor-pointer",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600",
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        (disabled || loading) && "pointer-events-none",
        className,
      )}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
      onClick={handleClick}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden />
      ) : icon ? (
        <span className="shrink-0" aria-hidden>
          {icon}
        </span>
      ) : null}
      {children}
      {iconRight && !loading && (
        <span className="shrink-0" aria-hidden>
          {iconRight}
        </span>
      )}
    </button>
  );
}
