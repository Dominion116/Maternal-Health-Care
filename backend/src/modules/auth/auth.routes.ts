import { Router } from 'express';
import { validate } from '../../middlewares/validate.middleware';
import { RegisterDto, LoginDto, ForgotPasswordDto, ResetPasswordDto, VerifyOtpDto, ResendOtpDto, AcceptInviteDto } from './auth.dto';
import * as authController from './auth.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user (pregnant women only)
 *     description: |
 *       Creates the Supabase auth user and the matching `user_profiles` row in one call.
 *       Self-registration always produces a `pregnant_woman` account — staff roles
 *       (admin, super_admin, researcher) are created via the invite flow and nurses
 *       via an admin role change. `language` and `pregnancy_stage` are not set here —
 *       they are collected during the onboarding flow and saved via `PATCH /api/profile`.
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: adaeze@example.com
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 example: MyPassword1!
 *               full_name:
 *                 type: string
 *                 maxLength: 120
 *                 example: Adaeze Okonkwo
 *               role:
 *                 type: string
 *                 enum: [pregnant_woman]
 *                 default: pregnant_woman
 *                 description: |
 *                   Optional and always `pregnant_woman`. Staff roles are granted via
 *                   `POST /api/admin/invite` (admin, super_admin, researcher) or
 *                   `PATCH /api/admin/users/:id/role` (nurse).
 *               phone_number:
 *                 type: string
 *                 maxLength: 20
 *                 example: "+2348001234567"
 *                 description: Optional. Nigerian format recommended. Used for emergency alerts.
 *     responses:
 *       201:
 *         description: User and profile created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: object
 *                   properties:
 *                     user: { type: object, description: Supabase auth user object }
 *                     session: { type: object, description: JWT session — null if email confirmation is required }
 *       422:
 *         description: Validation error (e.g. invalid role, password too short)
 *       400:
 *         description: Supabase auth error (e.g. email already registered)
 */
router.post('/register', validate(RegisterDto), authController.register);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login and receive JWT
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: JWT token returned
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', validate(LoginDto), authController.login);

/**
 * @openapi
 * /auth/forgot-password:
 *   post:
 *     tags: [Auth]
 *     summary: Request a password reset OTP
 *     description: |
 *       Sends a 6-digit OTP to the given email address.
 *       Step 1 of 3 in the password reset flow:
 *       1. POST /auth/forgot-password — receive OTP by email
 *       2. POST /auth/verify-otp { type: "recovery" } — exchange OTP for session
 *       3. POST /auth/reset-password { access_token, new_password } — set new password
 *       Always returns 200 — the response never reveals whether the email is registered.
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: adaeze@example.com
 *     responses:
 *       200:
 *         description: OTP sent (or silently ignored if email not found)
 *       422:
 *         description: Validation error
 */
router.post('/forgot-password', validate(ForgotPasswordDto), authController.forgotPassword);

/**
 * @openapi
 * /auth/reset-password:
 *   post:
 *     tags: [Auth]
 *     summary: Set a new password using the session from verify-otp
 *     description: |
 *       Step 3 of the password reset flow. Pass the `access_token` returned by
 *       `POST /auth/verify-otp` (with type "recovery") along with the new password.
 *       The token is single-use and expires after 1 hour.
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [access_token, new_password]
 *             properties:
 *               access_token:
 *                 type: string
 *                 description: The access_token from the verify-otp response session
 *               new_password:
 *                 type: string
 *                 minLength: 8
 *                 example: NewPassword1!
 *     responses:
 *       200:
 *         description: Password updated — user can now log in with the new password
 *       401:
 *         description: Invalid or expired token
 *       422:
 *         description: Validation error (e.g. password too short)
 */
router.post('/reset-password', validate(ResetPasswordDto), authController.resetPassword);

/**
 * @openapi
 * /auth/verify-otp:
 *   post:
 *     tags: [Auth]
 *     summary: Verify the OTP sent to the user's email after registration
 *     description: |
 *       Called from the `/auth/verify-email` screen after the user enters their 6-digit code.
 *       On success returns a full session (access_token + refresh_token) so the user is
 *       immediately logged in after verification.
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, token]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: adaeze@example.com
 *               token:
 *                 type: string
 *                 minLength: 6
 *                 maxLength: 6
 *                 example: "483920"
 *                 description: 6-digit OTP from the confirmation email
 *               type:
 *                 type: string
 *                 enum: [signup, recovery, email]
 *                 default: signup
 *     responses:
 *       200:
 *         description: Verified — returns session with access_token
 *       401:
 *         description: Invalid or expired OTP
 *       422:
 *         description: Validation error
 */
router.post('/verify-otp', validate(VerifyOtpDto), authController.verifyOtp);

/**
 * @openapi
 * /auth/accept-invite:
 *   post:
 *     tags: [Auth]
 *     summary: Complete an admin invite by setting a password
 *     description: |
 *       Step 2 of the admin invite flow (POST /admin/invite is step 1, super_admin only).
 *       Pass the `access_token` from the invite link's redirect URL fragment along with
 *       a new password. Activates the account with the role set at invite time.
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [access_token, password]
 *             properties:
 *               access_token:
 *                 type: string
 *                 description: Extracted from the invite link's URL fragment
 *               password:
 *                 type: string
 *                 minLength: 8
 *     responses:
 *       200:
 *         description: Account activated
 *       401:
 *         description: Invalid or expired invite link
 *       422:
 *         description: Validation error
 */
router.post('/accept-invite', validate(AcceptInviteDto), authController.acceptInvite);

/**
 * @openapi
 * /auth/resend-otp:
 *   post:
 *     tags: [Auth]
 *     summary: Resend the email verification OTP
 *     description: |
 *       Called when the user clicks "Resend code" on the `/auth/verify-email` screen.
 *       Always returns 200 to avoid leaking whether the email is registered.
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: adaeze@example.com
 *               type:
 *                 type: string
 *                 enum: [signup, email]
 *                 default: signup
 *     responses:
 *       200:
 *         description: Code resent (or silently ignored if email not found / already confirmed)
 *       422:
 *         description: Validation error
 */
router.post('/resend-otp', validate(ResendOtpDto), authController.resendOtp);

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Log out and invalidate the current session
 *     description: |
 *       Invalidates the user's access token on the Supabase side.
 *       The client should discard the token after calling this endpoint.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 *       401:
 *         description: Missing or invalid token
 */
router.post('/logout', authMiddleware, authController.logout);

export default router;
