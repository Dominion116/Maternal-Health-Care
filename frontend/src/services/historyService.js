import api from './api'

export const historyService = {
  getConversations: (page = 1, limit = 20) =>
    api.get('/history/conversations', { params: { page, limit } }),

  getMessages: (conversationId, page = 1, limit = 50) =>
    api.get(`/history/conversations/${conversationId}/messages`, { params: { page, limit } }),

  deleteConversation: (conversationId) =>
    api.delete(`/history/conversations/${conversationId}`),

  setSaved: (conversationId, isSaved) =>
    api.patch(`/history/conversations/${conversationId}/save`, { is_saved: isSaved }),
}
