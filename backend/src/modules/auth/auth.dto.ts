import { z } from 'zod';

// Self-registration is for pregnant women only. Every other role is granted
// by staff: admin/super_admin/researcher via the invite flow (POST
// /admin/invite, super_admin only) or the one-off create-admin bootstrap
// script; nurse via an admin changing a registered user's role.
export const RegisterDto = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  full_name: z.string().min(1).max(120).optional(),
  role: z.literal('pregnant_woman').default('pregnant_woman'),
  phone_number: z.string().max(20).optional(),
  // language and pregnancy_stage are set during the onboarding flow via PATCH /profile
});

export const LoginDto = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const ForgotPasswordDto = z.object({
  email: z.string().email(),
});

export const ResetPasswordDto = z.object({
  access_token: z.string().min(1),
  new_password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const VerifyOtpDto = z.object({
  email: z.string().email(),
  token: z.string().min(6).max(6, 'OTP must be 6 digits'),
  type: z.enum(['signup', 'recovery', 'email']).default('signup'),
});

export const ResendOtpDto = z.object({
  email: z.string().email(),
  type: z.enum(['signup', 'email_change']).default('signup'),
});

// Step 2 of the admin invite flow — the access_token comes from the invite
// link Supabase emails (POST /admin/invite triggers it), same shape as the
// password-reset access_token.
export const AcceptInviteDto = z.object({
  access_token: z.string().min(1),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type RegisterDtoType = z.infer<typeof RegisterDto>;
export type LoginDtoType = z.infer<typeof LoginDto>;
export type ForgotPasswordDtoType = z.infer<typeof ForgotPasswordDto>;
export type ResetPasswordDtoType = z.infer<typeof ResetPasswordDto>;
export type VerifyOtpDtoType = z.infer<typeof VerifyOtpDto>;
export type ResendOtpDtoType = z.infer<typeof ResendOtpDto>;
export type LogoutDtoType = z.infer<typeof LogoutDto>;
export type AcceptInviteDtoType = z.infer<typeof AcceptInviteDto>;

export const LogoutDto = z.object({});
