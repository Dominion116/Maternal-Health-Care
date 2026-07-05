import { useState, useRef, useEffect } from "react";
import { cn } from "@/utils/cn";
import { Send, Mic, MicOff, Plus } from "lucide-react";

export function ChatInput({
  onSend,
  disabled = false,
  placeholder,
  className,
}) {
  const [value, setValue] = useState("");
  const [listening, setListening] = useState(false);
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 160) + "px";
  }, [value]);

  function handleSubmit(e) {
    e?.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  function toggleVoice() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-NG";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (e) => {
      setValue((prev) => prev + e.results[0][0].transcript);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }

  const canSend = value.trim().length > 0 && !disabled;

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "relative flex items-end gap-2 p-3 bg-white border-t border-border",
        className,
      )}
    >
      <button
        type="button"
        className="p-2.5 rounded-xl text-text-muted hover:text-rose-700 hover:bg-rose-50 transition-all shrink-0 self-end"
        aria-label="Attach file"
      >
        <Plus className="w-5 h-5" />
      </button>

      <div className="flex-1 relative bg-warm-white border border-border rounded-2xl overflow-hidden focus-within:border-rose-400 focus-within:ring-2 focus-within:ring-rose-600/10 transition-all">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            placeholder || "Ask MamaGuide anything about your pregnancy..."
          }
          disabled={disabled}
          rows={1}
          aria-label="Message input"
          className={cn(
            "w-full resize-none bg-transparent",
            "px-4 py-3 pr-10 text-sm text-text-primary",
            "placeholder:text-text-muted",
            "focus:outline-none",
            "max-h-40 overflow-y-auto",
            disabled && "opacity-60 cursor-not-allowed",
          )}
        />

        <button
          type="button"
          onClick={toggleVoice}
          className={cn(
            "absolute right-2 bottom-2 p-1.5 rounded-lg transition-all",
            listening
              ? "text-error bg-error-light animate-pulse-soft"
              : "text-text-muted hover:text-rose-700 hover:bg-rose-50",
          )}
          aria-label={listening ? "Stop voice input" : "Start voice input"}
          title="Voice input"
        >
          {listening ? (
            <MicOff className="w-4 h-4" />
          ) : (
            <Mic className="w-4 h-4" />
          )}
        </button>
      </div>

      <button
        type="submit"
        disabled={!canSend}
        className={cn(
          "p-3 rounded-2xl font-medium transition-all duration-150 shrink-0 self-end",
          canSend
            ? "bg-rose-700 text-white hover:bg-rose-800 shadow-sm hover:shadow-rose scale-100 hover:scale-105 active:scale-95"
            : "bg-gray-100 text-gray-400 cursor-not-allowed",
        )}
        aria-label="Send message"
      >
        <Send className="w-5 h-5" />
      </button>
    </form>
  );
}
