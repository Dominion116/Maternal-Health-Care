import api from './api'

export const evaluationService = {
  submitSUS: (responses) =>
    api.post('/evaluation/sus', { responses }),

  submitFeedback: (data) =>
    api.post('/evaluation/feedback', data),

  getResearchConsent: () =>
    api.get('/evaluation/consent'),

  submitConsent: (agreed) =>
    api.post('/evaluation/consent', { agreed }),

  getAdminSUSResults: (params) =>
    api.get('/admin/sus-results', { params }),

  exportReport: (format = 'pdf') =>
    api.get('/admin/reports/export', {
      params: { format },
      responseType: 'blob',
    }),
}
