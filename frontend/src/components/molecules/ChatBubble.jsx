import { cn } from "@/utils/cn";
import { formatTime } from "@/utils/formatters";
import { MESSAGE_TYPES } from "@/utils/constants";
import { formatConfidence } from "@/utils/formatters";
import { BotAvatar, Avatar } from "@/components/atoms/Avatar";
import {
  ThumbsUp,
  ThumbsDown,
  Copy,
  Siren,
  BookOpen,
  AlertTriangle,
} from "lucide-react";
import { useState } from "react";

export function ChatBubble({ message, user }) {
  const [copied, setCopied] = useState(false);
  const isUser = message.type === MESSAGE_TYPES.USER;
  const isBot = message.type === MESSAGE_TYPES.BOT;
  const isEmergency = message.type === MESSAGE_TYPES.EMERGENCY;

  function handleCopy() {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  if (isEmergency) return <EmergencyCard />;

  return (
    <div
      className={cn(
        "flex gap-2.5 max-w-full animate-fade-in-up",
        isUser ? "flex-row-reverse" : "flex-row",
      )}
    >
      {isBot && <BotAvatar size="sm" />}
      {isUser && <Avatar name={user?.name} size="sm" />}

      <div
        className={cn(
          "flex flex-col gap-1",
          isUser ? "items-end" : "items-start",
          "max-w-[85%] md:max-w-[75%]",
        )}
      >
        <div
          className={cn(
            "px-4 py-3 text-sm leading-relaxed",
            isUser ? "chat-bubble-user" : "chat-bubble-bot",
            message.isError && "border-error/30 bg-error-light text-error-dark",
          )}
        >
          {isBot && message.isError ? (
            <span className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {message.content}
            </span>
          ) : (
            <div className="health-content whitespace-pre-wrap wrap-break-word">
              {message.content}
            </div>
          )}
        </div>

        {/* Bot message footer — sources + confidence */}
        {isBot && !message.isError && (
          <div className="flex flex-wrap items-center gap-2 px-1">
            {message.confidence !== undefined && (
              <ConfidencePill score={message.confidence} />
            )}

            {message.sources?.length > 0 && (
              <button className="flex items-center gap-1 text-xs text-text-muted hover:text-sage-600 transition-colors">
                <BookOpen className="w-3 h-3" />
                {message.sources.length} source
                {message.sources.length > 1 ? "s" : ""}
              </button>
            )}

            <div className="flex items-center gap-1 ml-auto">
              <button
                onClick={handleCopy}
                className="p-1 rounded text-text-muted hover:text-text-primary transition-colors"
                aria-label="Copy message"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              {copied && <span className="text-xs text-success">Copied!</span>}
              <button
                className="p-1 rounded text-text-muted hover:text-success transition-colors"
                aria-label="Helpful"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
              </button>
              <button
                className="p-1 rounded text-text-muted hover:text-error transition-colors"
                aria-label="Not helpful"
              >
                <ThumbsDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        <time className="text-xs text-text-muted px-1">
          {formatTime(message.timestamp)}
        </time>
      </div>
    </div>
  );
}

function ConfidencePill({ score }) {
  const { color } = formatConfidence(score);
  return (
    <span className={cn("text-xs font-medium", color)}>
      {Math.round(score * 100)}% confidence
    </span>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex gap-2.5 animate-fade-in">
      <BotAvatar size="sm" />
      <div className="chat-bubble-bot px-4 py-3">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={cn(
                "w-2 h-2 rounded-full bg-rose-300 animate-typing-dot typing-dot",
              )}
              style={{ animationDelay: `${i * 200}ms` }}
            />
          ))}
          <span className="sr-only">MamaGuide is typing</span>
        </div>
      </div>
    </div>
  );
}

function EmergencyCard() {
  return (
    <div
      role="alert"
      className="bg-emergency-light border border-emergency/40 rounded-2xl p-4 mx-auto w-full max-w-sm animate-fade-in"
    >
      <div className="flex items-center gap-2 mb-2">
        <Siren className="w-5 h-5 text-emergency animate-pulse-soft" />
        <p className="font-bold text-emergency-dark text-sm">
          Emergency Detected
        </p>
      </div>
      <p className="text-sm text-emergency-dark/80 mb-3 leading-relaxed">
        You may be describing an emergency situation. Please contact emergency
        services immediately.
      </p>
      <div className="flex flex-col gap-2">
        <a
          href="tel:112"
          className="flex items-center justify-center gap-2 bg-emergency text-white font-semibold py-2.5 rounded-xl text-sm hover:bg-emergency-dark transition-colors"
        >
          Call Emergency: 112
        </a>
        <a
          href="tel:08006722467"
          className="flex items-center justify-center gap-2 border border-emergency/30 text-emergency-dark font-medium py-2 rounded-xl text-sm hover:bg-emergency-light transition-colors"
        >
          NPHCDA Helpline
        </a>
      </div>
    </div>
  );
}

export function MedicalDisclaimer() {
  return (
    <div className="flex items-start gap-2 px-4 py-2.5 bg-amber-50 border-y border-amber-100">
      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
      <p className="text-xs text-amber-800 leading-relaxed">
        <strong>Disclaimer:</strong> MamaGuide provides educational information
        only. Always consult your healthcare provider.
      </p>
    </div>
  );
}
