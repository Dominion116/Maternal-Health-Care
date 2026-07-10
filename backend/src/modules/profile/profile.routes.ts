import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { UpdateProfileDto } from './profile.dto';
import * as profileController from './profile.controller';

const router = Router();

router.use(authMiddleware as any);

/**
 * @openapi
 * /profile:
 *   get:
 *     tags: [Profile]
 *     summary: Get the authenticated user's profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user_id: { type: string }
 *                 full_name: { type: string }
 *                 role: { type: string, enum: [pregnant_woman, nurse, admin, researcher] }
 *                 pregnancy_stage: { type: string, enum: [first_trimester, second_trimester, third_trimester, postpartum] }
 *                 language: { type: string, enum: [en, yo, ha, ig] }
 *                 due_date: { type: string, format: date }
 *                 phone_number: { type: string }
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Profile not found
 */
router.get('/', profileController.getProfile as any);

/**
 * @openapi
 * /profile:
 *   patch:
 *     tags: [Profile]
 *     summary: Update the authenticated user's profile
 *     description: |
 *       All fields are optional. Role cannot be changed here — contact an admin.
 *       `pregnancy_stage` and `due_date` are only relevant for `pregnant_woman` role.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name: { type: string, maxLength: 120 }
 *               language: { type: string, enum: [en, yo, ha, ig] }
 *               pregnancy_stage: { type: string, enum: [first_trimester, second_trimester, third_trimester, postpartum] }
 *               due_date: { type: string, format: date }
 *               phone_number: { type: string }
 *     responses:
 *       200:
 *         description: Updated profile
 *       401:
 *         description: Unauthorized
 *       422:
 *         description: Validation error
 */
router.patch('/', validate(UpdateProfileDto), profileController.updateProfile as any);

/**
 * @openapi
 * /profile/export:
 *   get:
 *     tags: [Profile]
 *     summary: Export all data stored about the authenticated user
 *     description: Returns profile, conversations, messages, research consent and feedback as one JSON document.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Full data export
 *       401:
 *         description: Unauthorized
 */
router.get('/export', profileController.exportData as any);

/**
 * @openapi
 * /profile:
 *   delete:
 *     tags: [Profile]
 *     summary: Permanently delete the authenticated user's account
 *     description: Deletes the auth user; all related data cascades (conversations, messages, consent, feedback).
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account deleted
 *       401:
 *         description: Unauthorized
 */
router.delete('/', profileController.deleteAccount as any);

export default router;
