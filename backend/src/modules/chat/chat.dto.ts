import { z } from 'zod';

export const SendMessageDto = z.object({
  conversation_id: z.string().uuid().optional(),
  message: z.string().min(1, 'Message cannot be empty').max(2000),
});

export const CreateSessionDto = z.object({
  title: z.string().max(120).optional(),
});

export type SendMessageDtoType = z.infer<typeof SendMessageDto>;
export type CreateSessionDtoType = z.infer<typeof CreateSessionDto>;
