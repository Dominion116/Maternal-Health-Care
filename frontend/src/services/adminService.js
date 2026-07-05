import api from './api'

export const adminService = {
  getUsers: (params = {}) => api.get('/admin/users', { params }),

  getUser: (id) => api.get(`/admin/users/${id}`),

  updateUserRole: (id, role) => api.patch(`/admin/users/${id}/role`, { role }),

  inviteAdmin: (email, role, fullName) =>
    api.post('/admin/invite', { email, role, full_name: fullName }),

  getConversations: (params = {}) => api.get('/admin/conversations', { params }),

  getConversationMessages: (id) => api.get(`/admin/conversations/${id}/messages`),

  getAnalytics: () => api.get('/admin/analytics'),

  getSUS: (params = {}) => api.get('/admin/sus', { params }),

  getFeedback: (params = {}) => api.get('/admin/feedback', { params }),
}
