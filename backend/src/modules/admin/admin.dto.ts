import { z } from 'zod';

export const AdminPaginationDto = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export const AdminUsersQueryDto = AdminPaginationDto.extend({
  role: z.enum(['pregnant_woman', 'nurse', 'admin', 'researcher', 'super_admin']).optional(),
});

export const AdminConversationsQueryDto = AdminPaginationDto.extend({
  flagged: z.coerce.boolean().optional(),
  user_id: z.string().uuid().optional(),
});

// Deliberately excludes 'admin' and 'super_admin' — the only way to grant
// admin-tier access is the invite flow (POST /admin/invite, super_admin only)
// or the one-off create-admin bootstrap script. This endpoint only manages
// the three self-registerable roles.
export const UpdateRoleDto = z.object({
  role: z.enum(['pregnant_woman', 'nurse', 'researcher']),
});

export const InviteAdminDto = z.object({
  email: z.string().email(),
  full_name: z.string().min(1).max(120).optional(),
  role: z.enum(['admin', 'super_admin']),
});

export type AdminUsersQueryDtoType = z.infer<typeof AdminUsersQueryDto>;
export type AdminConversationsQueryDtoType = z.infer<typeof AdminConversationsQueryDto>;
export type UpdateRoleDtoType = z.infer<typeof UpdateRoleDto>;
export type InviteAdminDtoType = z.infer<typeof InviteAdminDto>;
