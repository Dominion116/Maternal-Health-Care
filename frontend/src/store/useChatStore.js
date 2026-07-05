import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { MESSAGE_TYPES } from '@/utils/constants'

const generateId = () => `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`

export const useChatStore = create(
  persist(
    (set, get) => ({
      conversations: [],
      activeConversationId: null,
      isTyping: false,
      isConnected: true,
      suggestedPrompts: [],

      get activeConversation() {
        const { conversations, activeConversationId } = get()
        return conversations.find(c => c.id === activeConversationId) || null
      },

      get messages() {
        const active = get().activeConversation
        return active ? active.messages : []
      },

      startNewConversation: () => {
        const id = `conv_${Date.now()}`
        const conversation = {
          id,
          title: 'New Conversation',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          messages: [],
          isSaved: false,
        }
        set(state => ({
          conversations: [conversation, ...state.conversations],
          activeConversationId: id,
        }))
        return id
      },

      setActiveConversation: (id) => set({ activeConversationId: id }),

      // Loads a conversation the user opened from History/Saved (server is
      // the source of truth there) into the local cache used by the live
      // chat screen — inserting it if not already present, replacing its
      // messages if it is, so opening a past conversation always shows the
      // real backend thread rather than whatever (possibly empty/stale)
      // local copy happened to exist.
      hydrateConversation: (id, meta, backendMessages) => {
        const messages = backendMessages.map((m) => ({
          id: m.id,
          type: m.role === 'user' ? MESSAGE_TYPES.USER : MESSAGE_TYPES.BOT,
          content: m.content,
          timestamp: m.created_at,
          confidence: m.intent_confidence ?? undefined,
          intent: m.intent ?? undefined,
        }))

        set(state => {
          const exists = state.conversations.some(c => c.id === id)
          const conversation = {
            id,
            title: meta.title || 'Conversation',
            createdAt: meta.created_at,
            updatedAt: meta.updated_at,
            isSaved: !!meta.is_saved,
            messages,
          }
          return {
            conversations: exists
              ? state.conversations.map(c => (c.id === id ? conversation : c))
              : [conversation, ...state.conversations],
            activeConversationId: id,
          }
        })
      },

      // Called after the first message in a new conversation gets a real
      // response — replaces the client-generated temp id (`conv_...`) with
      // the server's UUID so subsequent messages in this thread send the
      // correct conversation_id and multi-turn context actually persists.
      adoptServerId: (localId, serverId) => {
        if (localId === serverId) return
        set(state => ({
          conversations: state.conversations.map(conv =>
            conv.id === localId ? { ...conv, id: serverId } : conv
          ),
          activeConversationId:
            state.activeConversationId === localId ? serverId : state.activeConversationId,
        }))
      },

      addMessage: (message) => {
        const { activeConversationId, conversations } = get()
        if (!activeConversationId) return

        const newMessage = {
          id: generateId(),
          timestamp: new Date().toISOString(),
          ...message,
        }

        const firstUserMsg = message.type === MESSAGE_TYPES.USER && message.content

        set({
          conversations: conversations.map(conv =>
            conv.id === activeConversationId
              ? {
                ...conv,
                messages: [...conv.messages, newMessage],
                updatedAt: new Date().toISOString(),
                title: conv.messages.length === 0 && firstUserMsg
                  ? message.content.slice(0, 60)
                  : conv.title,
              }
              : conv
          ),
        })

        return newMessage
      },

      updateMessage: (messageId, updates) => {
        const { activeConversationId, conversations } = get()
        set({
          conversations: conversations.map(conv =>
            conv.id === activeConversationId
              ? {
                ...conv,
                messages: conv.messages.map(msg =>
                  msg.id === messageId ? { ...msg, ...updates } : msg
                ),
              }
              : conv
          ),
        })
      },

      deleteConversation: (id) => {
        set(state => ({
          conversations: state.conversations.filter(c => c.id !== id),
          activeConversationId:
            state.activeConversationId === id ? null : state.activeConversationId,
        }))
      },

      toggleSaveConversation: (id) => {
        set(state => ({
          conversations: state.conversations.map(conv =>
            conv.id === id ? { ...conv, isSaved: !conv.isSaved } : conv
          ),
        }))
      },

      clearCurrentConversation: () => {
        const { activeConversationId, conversations } = get()
        set({
          conversations: conversations.map(conv =>
            conv.id === activeConversationId
              ? { ...conv, messages: [], updatedAt: new Date().toISOString() }
              : conv
          ),
        })
      },

      setIsTyping: (isTyping) => set({ isTyping }),
      setIsConnected: (isConnected) => set({ isConnected }),
      setSuggestedPrompts: (prompts) => set({ suggestedPrompts: prompts }),
    }),
    {
      name: 'mamaguide-chat',
      partialize: (state) => ({
        conversations: state.conversations.slice(0, 50),
        activeConversationId: state.activeConversationId,
      }),
    }
  )
)
