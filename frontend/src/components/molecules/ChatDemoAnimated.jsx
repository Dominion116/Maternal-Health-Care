import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView, useReducedMotion } from 'framer-motion'
import { CheckCircle, Heart, Sparkles } from 'lucide-react'

const ease = [0.22, 1, 0.36, 1]

// ms timestamps for each phase
const T = {
  BOT_1: 350,
  USER_TYPING: 1800,
  USER_MSG: 2700,
  BOT_TYPING: 3300,
  BOT_MSG: 5400,
  PROMPTS: 6000,
  BADGE: 6500,
  DONE: 10500, // restart after this
}

const SUGGESTED = [
  'What should I eat?',
  'How many ANC visits?',
  'Is spotting normal?',
]

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-3.5 py-3">
      {[0, 1, 2].map(i => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 bg-text-muted rounded-full"
          animate={{ opacity: [0.25, 1, 0.25] }}
          transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.22, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

function BotBubble({ children, confidence, source }) {
  return (
    <motion.div
      className="flex gap-2 max-w-[92%]"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease }}
    >
      <span className="w-7 h-7 rounded-full bg-brand-gradient flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
        <span className="text-white text-xs font-bold">M</span>
      </span>
      <div>
        <div className="chat-bubble-bot px-3.5 py-2.5 text-sm leading-relaxed">
          {children}
          {source && (
            <span className="block mt-1.5 text-xs text-text-muted">
              Source: {source}
            </span>
          )}
        </div>
        {confidence && (
          <motion.div
            className="mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 border border-green-200 rounded-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.3, ease }}
          >
            <CheckCircle className="w-3 h-3 text-green-600" aria-hidden />
            <span className="text-xs font-semibold text-green-700">{confidence}% confidence</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

function UserBubble({ children }) {
  return (
    <motion.div
      className="flex justify-end"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease }}
    >
      <div className="chat-bubble-user px-3.5 py-2.5 text-sm leading-relaxed max-w-[85%]">
        {children}
      </div>
    </motion.div>
  )
}

function BotTypingRow() {
  return (
    <motion.div
      className="flex gap-2"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease }}
    >
      <span className="w-7 h-7 rounded-full bg-brand-gradient flex items-center justify-center shrink-0 shadow-sm">
        <span className="text-white text-xs font-bold">M</span>
      </span>
      <div className="chat-bubble-bot">
        <TypingDots />
      </div>
    </motion.div>
  )
}

// The inner demo — re-mounts each loop cycle via key
function DemoInner({ onDone, reduce }) {
  const [phase, setPhase] = useState(reduce ? 99 : 0)

  useEffect(() => {
    if (reduce) return
    const timers = [
      setTimeout(() => setPhase(1), T.BOT_1),
      setTimeout(() => setPhase(2), T.USER_TYPING),
      setTimeout(() => setPhase(3), T.USER_MSG),
      setTimeout(() => setPhase(4), T.BOT_TYPING),
      setTimeout(() => setPhase(5), T.BOT_MSG),
      setTimeout(() => setPhase(6), T.PROMPTS),
      setTimeout(() => setPhase(7), T.BADGE),
      setTimeout(onDone, T.DONE),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  const showBot1 = phase >= 1 || phase === 99
  const showUserTyping = phase === 2
  const showUser = phase >= 3 || phase === 99
  const showBotTyping = phase === 4
  const showBot2 = phase >= 5 || phase === 99
  const showPrompts = phase >= 6 || phase === 99
  const showBadge = phase >= 7 || phase === 99

  return (
    <div className="p-4 space-y-3 min-h-[220px]">
      <AnimatePresence>
        {showBot1 && (
          <BotBubble key="bot1">
            Hello! I am MamaGuide. What pregnancy question can I help you with today?
          </BotBubble>
        )}
        {showUserTyping && (
          <motion.div
            key="user-typing"
            className="flex justify-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="chat-bubble-user">
              <TypingDots />
            </div>
          </motion.div>
        )}
        {showUser && (
          <UserBubble key="user">
            What are the danger signs during pregnancy?
          </UserBubble>
        )}
        {showBotTyping && <BotTypingRow key="bot-typing" />}
        {showBot2 && (
          <BotBubble
            key="bot2"
            confidence={showBadge ? 94 : undefined}
            source="WHO ANC Guidelines"
          >
            Important danger signs include:{' '}
            <strong>heavy bleeding</strong>, severe headache with blurred vision,
            baby not moving after 28 weeks, and fever above 38°C.
            If you notice any of these, please go to the hospital immediately.
          </BotBubble>
        )}
      </AnimatePresence>
    </div>
  )
}

export function ChatDemoAnimated() {
  const wrapperRef = useRef(null)
  const isInView = useInView(wrapperRef, { once: false, margin: '-120px' })
  const reduce = useReducedMotion()

  const [cycle, setCycle] = useState(0)
  const [running, setRunning] = useState(false)

  useEffect(() => {
    if (isInView && !running) setRunning(true)
    if (!isInView) setRunning(false)
  }, [isInView])

  return (
    <div
      ref={wrapperRef}
      className="bg-warm-white rounded-3xl border border-border shadow-xl overflow-hidden"
    >
      {/* Chat header */}
      <div className="bg-white px-4 py-3.5 border-b border-border flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-brand-gradient flex items-center justify-center shadow-sm">
          <Heart className="w-4 h-4 text-white fill-white" aria-hidden />
        </div>
        <div>
          <p className="text-sm font-semibold text-text-primary">MamaGuide</p>
          <p className="text-xs text-success flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-success rounded-full" aria-hidden />
            Online · AI-powered
          </p>
        </div>
        <div className="ml-auto">
          <span className="text-xs px-2 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-full font-medium flex items-center gap-1">
            <Sparkles className="w-3 h-3" aria-hidden />
            Live demo
          </span>
        </div>
      </div>

      {/* Chat messages */}
      {running ? (
        <DemoInner
          key={cycle}
          reduce={reduce}
          onDone={() => {
            setTimeout(() => setCycle(c => c + 1), 1800)
          }}
        />
      ) : (
        <div className="p-4 min-h-[220px] flex items-center justify-center">
          <p className="text-xs text-text-muted">Scroll to see demo</p>
        </div>
      )}

      {/* Suggested prompts */}
      <div className="px-4 pb-3 flex flex-wrap gap-2 min-h-[44px]">
        <AnimatePresence>
          {running && (
            <>
              {SUGGESTED.map((q, i) => (
                <motion.span
                  key={q}
                  className="text-xs px-3 py-1.5 bg-white border border-rose-200 text-rose-700 rounded-full font-medium cursor-default select-none"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 + 0.2, duration: 0.35, ease }}
                >
                  {q}
                </motion.span>
              ))}
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Input bar */}
      <div className="p-3 border-t border-border bg-white">
        <div className="flex items-center gap-2 bg-warm-white rounded-xl px-4 py-3 border border-border">
          <span className="text-sm text-text-muted flex-1 select-none">
            Ask about your pregnancy…
          </span>
          <span className="w-8 h-8 rounded-xl bg-rose-700 flex items-center justify-center shrink-0">
            <Heart className="w-4 h-4 text-white fill-white" aria-hidden />
          </span>
        </div>
      </div>
    </div>
  )
}
