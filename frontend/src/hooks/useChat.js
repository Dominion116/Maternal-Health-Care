import { useCallback } from 'react'
import { useChatStore } from '@/store/useChatStore'
import { chatService } from '@/services/chatService'
import { MESSAGE_TYPES } from '@/utils/constants'
import { isEmergencyMessage } from '@/utils/validators'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function useChat() {
  const {
    conversations,
    activeConversationId,
    isTyping,
    isConnected,
    suggestedPrompts,
    startNewConversation,
    setActiveConversation,
    addMessage,
    updateMessage,
    deleteConversation,
    toggleSaveConversation,
    clearCurrentConversation,
    adoptServerId,
    setIsTyping,
    setIsConnected,
    setSuggestedPrompts,
  } = useChatStore()

  const activeConversation = conversations.find(c => c.id === activeConversationId)
  const messages = activeConversation?.messages || []

  const sendMessage = useCallback(async (content) => {
    let convId = activeConversationId
    if (!convId) convId = startNewConversation()

    addMessage({ type: MESSAGE_TYPES.USER, content })

    const emergency = isEmergencyMessage(content)
    if (emergency) {
      addMessage({
        type: MESSAGE_TYPES.EMERGENCY,
        content: 'EMERGENCY_DETECTED',
      })
      return
    }

    setIsTyping(true)
    try {
      // Only pass a conversation_id the backend can actually look up — a
      // fresh local conversation's id (`conv_...`) isn't a server UUID yet.
      const hasServerId = UUID_RE.test(convId)
      const res = await chatService.sendMessage(hasServerId ? convId : undefined, content)
      // Backend wraps every response as { success, data, message }.
      const payload = res.data.data
      const assistantMessage = payload.assistantMessage

      if (!hasServerId) {
        adoptServerId(convId, payload.conversation.id)
      }

      addMessage({
        type: MESSAGE_TYPES.BOT,
        content: assistantMessage.content,
        confidence: assistantMessage.intent_confidence ?? undefined,
        intent: assistantMessage.intent ?? undefined,
      })
    } catch (err) {
      const offline = !navigator.onLine || err.code === 'ECONNABORTED'
      addMessage({
        type: MESSAGE_TYPES.BOT,
        content: offline
          ? 'I\'m unable to connect right now. Please check your internet and try again.'
          : 'I\'m having trouble responding. Please try again.',
        isError: true,
      })
      if (offline) setIsConnected(false)
    } finally {
      setIsTyping(false)
    }
  }, [activeConversationId, startNewConversation, addMessage, adoptServerId, setIsTyping, setIsConnected])

  return {
    conversations,
    activeConversationId,
    activeConversation,
    messages,
    isTyping,
    isConnected,
    suggestedPrompts,
    sendMessage,
    startNewConversation,
    setActiveConversation,
    deleteConversation,
    toggleSaveConversation,
    clearCurrentConversation,
    setSuggestedPrompts,
  }
}
