import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { adminMiddleware } from '../../middlewares/admin.middleware';
import { superAdminMiddleware } from '../../middlewares/super-admin.middleware';
import * as adminController from './admin.controller';

const router = Router();

// Both middlewares run on every admin route
router.use(authMiddleware as any, adminMiddleware as any);

// ── Invite ─────────────────────────────────────────────────────────────────

/**
 * @openapi
 * /admin/invite:
 *   post:
 *     tags: [Admin]
 *     summary: Invite a new admin, super_admin or researcher by email (super_admin only)
 *     description: |
 *       Uses Supabase's built-in invite flow — no password is set here. The
 *       recipient receives an email with a link to /auth/accept-invite where
 *       they set their password and the account is activated with the given
 *       role and onboarding already completed (staff skip the patient
 *       onboarding wizard).
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, role]
 *             properties:
 *               email: { type: string, format: email }
 *               full_name: { type: string, maxLength: 120 }
 *               role: { type: string, enum: [admin, super_admin, researcher] }
 *     responses:
 *       201: { description: Invite sent }
 *       403: { description: Super admin access required }
 *       422: { description: Validation error }
 */
router.post('/invite', superAdminMiddleware as any, adminController.inviteAdmin);

// ── Users ──────────────────────────────────────────────────────────────────

/**
 * @openapi
 * /admin/users:
 *   get:
 *     tags: [Admin]
 *     summary: List all users with their profiles
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20, maximum: 100 }
 *       - in: query
 *         name: role
 *         schema: { type: string, enum: [pregnant_woman, nurse, admin, researcher] }
 *     responses:
 *       200: { description: Array of user + profile objects }
 *       403: { description: Admin access required }
 */
router.get('/users', adminController.listUsers);

/**
 * @openapi
 * /admin/users/{id}:
 *   get:
 *     tags: [Admin]
 *     summary: Get a single user with their profile
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: User + profile object }
 *       403: { description: Admin access required }
 */
router.get('/users/:id', adminController.getUserById);

/**
 * @openapi
 * /admin/users/{id}/role:
 *   patch:
 *     tags: [Admin]
 *     summary: Change a user's role (patient-facing roles only)
 *     description: Dashboard-tier roles (admin, super_admin, researcher) are granted via POST /admin/invite instead.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [role]
 *             properties:
 *               role: { type: string, enum: [pregnant_woman, nurse] }
 *     responses:
 *       200: { description: Updated profile }
 *       403: { description: Admin access required }
 *       422: { description: Validation error }
 */
router.patch('/users/:id/role', adminController.updateUserRole);

// ── Conversations ──────────────────────────────────────────────────────────

/**
 * @openapi
 * /admin/conversations:
 *   get:
 *     tags: [Admin]
 *     summary: List all conversations (optionally filter by flagged or user)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: flagged
 *         schema: { type: boolean }
 *         description: If true, return only conversations containing emergency-flagged messages
 *       - in: query
 *         name: user_id
 *         schema: { type: string, format: uuid }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200: { description: List of conversations }
 *       403: { description: Admin access required }
 */
router.get('/conversations', adminController.listConversations);

/**
 * @openapi
 * /admin/conversations/{id}/messages:
 *   get:
 *     tags: [Admin]
 *     summary: Get all messages in a conversation (including flagged)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Array of messages }
 *       403: { description: Admin access required }
 */
router.get('/conversations/:id/messages', adminController.getConversationMessages);

// ── Analytics ──────────────────────────────────────────────────────────────

/**
 * @openapi
 * /admin/analytics:
 *   get:
 *     tags: [Admin]
 *     summary: Platform-wide statistics
 *     description: Returns totals, users by role, and the 10 most recent emergency events.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: Analytics object }
 *       403: { description: Admin access required }
 */
router.get('/analytics', adminController.getAnalytics);

// ── SUS ────────────────────────────────────────────────────────────────────

/**
 * @openapi
 * /admin/sus:
 *   get:
 *     tags: [Admin]
 *     summary: List SUS questionnaire responses with average score
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200: { description: SUS responses + avg_sus_score }
 *       403: { description: Admin access required }
 */
router.get('/sus', adminController.listSusResponses);

// ── Feedback ───────────────────────────────────────────────────────────────

/**
 * @openapi
 * /admin/feedback:
 *   get:
 *     tags: [Admin]
 *     summary: List user feedback with ratings breakdown
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200: { description: Feedback list + avg_rating + by_category }
 *       403: { description: Admin access required }
 */
router.get('/feedback', adminController.listFeedback);

// ── Model metrics ────────────────────────────────────────────────────────

/**
 * @openapi
 * /admin/model-metrics:
 *   get:
 *     tags: [Admin]
 *     summary: Intent classifier training metrics + knowledge base coverage
 *     description: |
 *       Reads the FFNN's saved training/evaluation metrics (accuracy, precision,
 *       recall, F1, confusion matrix from the held-out test split) plus the
 *       intents.json knowledge base's tag/pattern-count/source list.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: Model metrics + intent coverage }
 *       403: { description: Admin access required }
 */
router.get('/model-metrics', adminController.getModelMetrics);

export default router;
