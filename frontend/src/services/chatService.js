import api from './api'

export const chatService = {
  // conversationId is omitted when the caller doesn't have a real server-side
  // UUID yet (a brand-new local conversation) — the backend creates one and
  // returns it in the response.
  sendMessage: (conversationId, message) =>
    api.post('/chat/message', {
      message,
      ...(conversationId ? { conversation_id: conversationId } : {}),
    }),
}
