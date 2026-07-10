import api from './api'

export const evaluationService = {
  // Adapts the questionnaire's numeric keys ({ 1: 4, 2: 3, … }) to the
  // backend's SusSubmitDto shape ({ scores: { q1: 4, q2: 3, … } }).
  submitSUS: (responses) =>
    api.post('/evaluation/sus', {
      scores: Object.fromEntries(
        Object.entries(responses).map(([k, v]) => [k.startsWith('q') ? k : `q${k}`, v])
      ),
    }),

  submitFeedback: (data) =>
    api.post('/evaluation/feedback', data),

  getResearchConsent: () =>
    api.get('/evaluation/consent'),

  // Backend's ConsentDto requires `consented: true` literally (affirmative-only).
  submitConsent: (consented = true) =>
    api.post('/evaluation/consent', { consented }),

  // Sets consented=false on the record (kept as audit trail)
  withdrawConsent: () => api.delete('/evaluation/consent'),
}
