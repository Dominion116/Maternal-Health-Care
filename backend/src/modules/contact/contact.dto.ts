import { z } from 'zod';

export const ContactDto = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  subject: z.string().min(1).max(200).optional(),
  message: z.string().min(10).max(2000),
});

export type ContactDtoType = z.infer<typeof ContactDto>;
