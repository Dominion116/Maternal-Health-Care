import { cn } from "@/utils/cn";
import { getInitials } from "@/utils/formatters";

const sizes = {
  xs: "w-6 h-6 text-xs",
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
  xl: "w-16 h-16 text-xl",
  "2xl": "w-20 h-20 text-2xl",
};

export function Avatar({ src, name, size = "md", className, alt }) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt || name || "User avatar"}
        className={cn(
          "rounded-full object-cover shrink-0",
          sizes[size],
          className,
        )}
      />
    );
  }

  return (
    <span
      className={cn(
        "rounded-full bg-rose-100 text-rose-700 font-semibold",
        "inline-flex items-center justify-center shrink-0",
        sizes[size],
        className,
      )}
      aria-label={name || "User"}
    >
      {getInitials(name)}
    </span>
  );
}

export function BotAvatar({ size = "md" }) {
  const sizeMap = {
    xs: "w-6 h-6 text-xs",
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-xl",
  };
  return (
    <span
      className={cn(
        "rounded-full bg-brand-gradient inline-flex items-center justify-center shrink-0 shadow-sm",
        sizeMap[size],
      )}
      aria-label="MamaGuide assistant"
    >
      <span className="text-white font-bold leading-none">M</span>
    </span>
  );
}
