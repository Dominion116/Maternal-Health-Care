import { z } from 'zod';

const scoreField = z.number().int().min(1).max(5);

// All 10 SUS questions must be answered, each scored 1–5
export const SusSubmitDto = z.object({
  scores: z.object({
    q1: scoreField,
    q2: scoreField,
    q3: scoreField,
    q4: scoreField,
    q5: scoreField,
    q6: scoreField,
    q7: scoreField,
    q8: scoreField,
    q9: scoreField,
    q10: scoreField,
  }),
});

export const FeedbackSubmitDto = z.object({
  rating: z.number().int().min(1).max(5),
  category: z.enum(['bug', 'suggestion', 'praise', 'other']),
  comment: z.string().max(1000).optional(),
});

// Must explicitly consent — `false` is rejected
export const ConsentDto = z.object({
  consented: z.literal(true, { errorMap: () => ({ message: 'Consent must be accepted' }) }),
  consent_version: z.string().default('v1'),
});

export type SusSubmitDtoType = z.infer<typeof SusSubmitDto>;
export type FeedbackSubmitDtoType = z.infer<typeof FeedbackSubmitDto>;
export type ConsentDtoType = z.infer<typeof ConsentDto>;
