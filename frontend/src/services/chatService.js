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

  // Personalized dashboard recommendations derived from the intents the
  // classifier assigned to the user's past messages.
  getRecommendations: () => api.get('/chat/recommendations'),
}
