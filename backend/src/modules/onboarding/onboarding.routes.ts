import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { OnboardingDto } from './onboarding.dto';
import * as onboardingController from './onboarding.controller';

const router = Router();

router.use(authMiddleware as any);

/**
 * @openapi
 * /onboarding:
 *   post:
 *     tags: [Onboarding]
 *     summary: Complete onboarding after registration
 *     description: |
 *       Called once when a new user finishes the onboarding flow.
 *       Sets `pregnancy_stage`, `language`, and flips `onboarding_completed` to true.
 *       All fields are optional — nurses and researchers may skip `pregnancy_stage`.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pregnancy_stage:
 *                 type: string
 *                 nullable: true
 *                 enum: [first_trimester, second_trimester, third_trimester, postpartum]
 *               language:
 *                 type: string
 *                 enum: [en, yo, ha, ig]
 *                 default: en
 *     responses:
 *       200:
 *         description: Onboarding complete — returns updated profile with onboarding_completed true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { type: object, description: Updated user profile }
 *       401:
 *         description: Unauthorized
 *       422:
 *         description: Validation error
 */
router.post('/', validate(OnboardingDto), onboardingController.completeOnboarding as any);

export default router;
