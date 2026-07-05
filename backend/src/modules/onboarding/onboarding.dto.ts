import { z } from 'zod';

export const OnboardingDto = z.object({
  pregnancy_stage: z
    .enum(['first_trimester', 'second_trimester', 'third_trimester', 'postpartum'])
    .nullable()
    .optional(),
  language: z.enum(['en', 'yo', 'ha', 'ig']).optional(),
});

export type OnboardingDtoType = z.infer<typeof OnboardingDto>;
