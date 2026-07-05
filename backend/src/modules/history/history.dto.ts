import { z } from 'zod';

export const PaginationDto = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
});

export const UpdateSavedDto = z.object({
  is_saved: z.boolean(),
});

export type PaginationDtoType = z.infer<typeof PaginationDto>;
export type UpdateSavedDtoType = z.infer<typeof UpdateSavedDto>;
