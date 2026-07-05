import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Wifi,
  WifiOff,
  Trash2,
  ChevronLeft,
  AlertTriangle,
} from "lucide-react";
import {
  ChatBubble,
  TypingIndicator,
  MedicalDisclaimer,
} from "@/components/molecules/ChatBubble";
import { ChatInput } from "@/components/molecules/ChatInput";
import { SuggestedPrompts } from "@/components/molecules/SuggestedPrompts";
import { Button } from "@/components/atoms/Button";
import { Alert } from "@/components/atoms/Alert";
import { useChat } from "@/hooks/useChat";
import { useAuth } from "@/hooks/useAuth";
import { SUGGESTED_PROMPTS, ROUTES, DISCLAIMER_TEXT } from "@/utils/constants";
import { cn } from "@/utils/cn";

export default function ChatPage() {
  const { user } = useAuth();
  const {
    messages,
    activeConversation,
    isTyping,
    isConnected,
    sendMessage,
    startNewConversation,
    clearCurrentConversation,
    activeConversationId,
  } = useChat();

  const bottomRef = useRef(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const stage = user?.pregnancyStage;
  const prompts = SUGGESTED_PROMPTS[stage] || SUGGESTED_PROMPTS.default;

  // Auto-start conversation on first load
  useEffect(() => {
    if (!activeConversationId) startNewConversation();
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const showWelcome = messages.length === 0;

  return (
    <div className="flex flex-col h-[calc(100dvh-3.5rem)] md:h-dvh bg-warm-white">
      {/* Chat header */}
      <header className="bg-white border-b border-border px-4 py-3 flex items-center gap-3 shrink-0">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <span className="w-9 h-9 rounded-full bg-brand-gradient flex items-center justify-center shadow-sm shrink-0">
            <span className="text-white text-sm font-bold">M</span>
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-text-primary">MamaGuide</p>
            <p
              className={cn(
                "text-xs flex items-center gap-1",
                isConnected ? "text-success" : "text-warning",
              )}
            >
              {isConnected ? (
                <>
                  <Wifi className="w-3 h-3" aria-hidden /> Online
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3" aria-hidden /> Offline
                </>
              )}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {messages.length > 0 && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="p-2 rounded-lg text-text-muted hover:text-error hover:bg-error-light transition-all"
              aria-label="Clear conversation"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <Button
            onClick={startNewConversation}
            variant="secondary"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
          >
            <span className="hidden sm:inline">New Chat</span>
          </Button>
        </div>
      </header>

      {/* Offline banner */}
      {!isConnected && (
        <Alert variant="warning" className="mx-4 mt-3 shrink-0">
          You're offline. Check your internet connection to continue chatting.
        </Alert>
      )}

      {/* Clear confirm */}
      {showClearConfirm && (
        <div className="mx-4 mt-3 shrink-0">
          <Alert
            variant="warning"
            title="Clear conversation?"
            onDismiss={() => setShowClearConfirm(false)}
          >
            <div className="mt-2 flex gap-2">
              <Button
                size="xs"
                variant="danger"
                onClick={() => {
                  clearCurrentConversation();
                  setShowClearConfirm(false);
                }}
              >
                Yes, clear
              </Button>
              <Button
                size="xs"
                variant="ghost"
                onClick={() => setShowClearConfirm(false)}
              >
                Cancel
              </Button>
            </div>
          </Alert>
        </div>
      )}

      {/* Medical disclaimer */}
      <MedicalDisclaimer />

      {/* Messages area */}
      <main
        className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
        id="chat-messages"
        aria-live="polite"
        aria-label="Chat conversation"
      >
        {showWelcome ? (
          <WelcomeScreen user={user} />
        ) : (
          messages.map((msg) => (
            <ChatBubble key={msg.id} message={msg} user={user} />
          ))
        )}

        {isTyping && <TypingIndicator />}
        <div ref={bottomRef} aria-hidden />
      </main>

      {/* Suggested prompts */}
      {showWelcome && (
        <SuggestedPrompts prompts={prompts} onSelect={sendMessage} />
      )}

      {/* Input */}
      <ChatInput
        onSend={sendMessage}
        disabled={!isConnected || isTyping}
        placeholder={
          isTyping
            ? "MamaGuide is typing…"
            : "Ask anything about your pregnancy…"
        }
        className="shrink-0"
      />
    </div>
  );
}

function WelcomeScreen({ user }) {
  const greeting = getGreeting();
  const name = user?.name?.split(" ")[0] || "there";

  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] text-center px-4 animate-fade-in-up">
      <div className="w-16 h-16 rounded-full bg-brand-gradient flex items-center justify-center shadow-rose mb-4 animate-pulse-soft">
        <span className="text-white text-2xl font-bold">M</span>
      </div>
      <h2 className="font-display font-bold text-xl text-text-primary mb-1.5">
        {greeting}, {name}! 👋
      </h2>
      <p className="text-sm text-text-secondary max-w-xs leading-relaxed mb-4">
        I'm MamaGuide, your maternal health assistant. Ask me anything about
        your pregnancy, nutrition, ANC visits, or baby care.
      </p>
      <p className="text-xs text-text-muted max-w-xs leading-relaxed px-4 py-3 bg-amber-50 rounded-xl border border-amber-100">
        <AlertTriangle
          className="w-3.5 h-3.5 text-amber-500 inline mr-1"
          aria-hidden
        />
        {DISCLAIMER_TEXT}
      </p>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}
