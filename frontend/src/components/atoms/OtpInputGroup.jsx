import { cn } from "@/utils/cn";

/**
 * OtpInputGroup — 6 individual digit boxes with full keyboard + paste UX.
 *
 * Props come directly from useOtpInput() hook:
 *   values, refs, handleChange, handleKeyDown, handlePaste
 *
 * Additional:
 *   error    — string | null, shows red border on all boxes
 *   disabled — grey out during submission
 */
export function OtpInputGroup({
  values,
  refs,
  handleChange,
  handleKeyDown,
  handlePaste,
  error,
  disabled = false,
}) {
  return (
    <div
      role="group"
      aria-label="Enter the 6-digit verification code"
      className="flex gap-2.5 sm:gap-3 justify-center"
    >
      {values.map((val, i) => (
        <input
          key={i}
          ref={refs.current[i]}
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={val}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          autoFocus={i === 0}
          autoComplete={i === 0 ? "one-time-code" : "off"}
          aria-label={`Digit ${i + 1} of 6`}
          disabled={disabled}
          className={cn(
            // Base
            "w-11 h-11 sm:w-13 sm:h-16 text-center text-2xl font-bold font-display",
            "rounded border-2 bg-white outline-none",
            "transition-all duration-150 select-none",
            // Caret hidden — only one digit, looks odd
            "caret-transparent",
            // Enabled states
            !disabled &&
              !error && [
                "focus:border-rose-500 focus:ring-2 focus:ring-rose-200 focus:shadow-sm",
                val
                  ? "border-rose-400 bg-rose-50 text-rose-800"
                  : "border-border text-text-primary hover:border-rose-200",
              ],
            // Error state
            error &&
              "border-error bg-red-50 text-error focus:ring-2 focus:ring-red-200",
            // Disabled state
            disabled &&
              "opacity-50 cursor-not-allowed bg-gray-50 border-border text-text-muted",
          )}
        />
      ))}
    </div>
  );
}
