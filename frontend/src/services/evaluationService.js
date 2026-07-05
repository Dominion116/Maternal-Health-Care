import api from './api'

export const evaluationService = {
  submitSUS: (responses) =>
    api.post('/evaluation/sus', { responses }),

  submitFeedback: (data) =>
    api.post('/evaluation/feedback', data),

  getResearchConsent: () =>
    api.get('/evaluation/consent'),

  // Backend's ConsentDto requires `consented: true` literally (affirmative-only).
  submitConsent: (consented = true) =>
    api.post('/evaluation/consent', { consented }),
}
