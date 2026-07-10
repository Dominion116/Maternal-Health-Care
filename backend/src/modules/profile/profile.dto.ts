import { z } from 'zod';

export const UpdateProfileDto = z.object({
  full_name: z.string().min(1).max(120).optional(),
  language: z.enum(['en', 'yo', 'ha', 'ig']).optional(),
  pregnancy_stage: z
    .enum(['first_trimester', 'second_trimester', 'third_trimester', 'postpartum'])
    .nullable()
    .optional(),
  due_date: z.string().date().nullable().optional(),
  phone_number: z.string().max(20).nullable().optional(),
  // UI preferences (notification toggles etc). Replaced wholesale on update —
  // clients send the full object, not a partial patch.
  settings: z
    .object({
      notifications: z
        .object({
          healthReminders: z.boolean().optional(),
          ancReminders: z.boolean().optional(),
          weeklyTips: z.boolean().optional(),
          researchUpdates: z.boolean().optional(),
        })
        .optional(),
    })
    .optional(),
});

export type UpdateProfileDtoType = z.infer<typeof UpdateProfileDto>;
