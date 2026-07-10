import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { ConsentDto, SusSubmitDto, FeedbackSubmitDto } from './evaluation.dto';
import * as evaluationController from './evaluation.controller';

const router = Router();

router.use(authMiddleware as any);

// ── Consent ────────────────────────────────────────────────────────────────

/**
 * @openapi
 * /evaluation/consent:
 *   get:
 *     tags: [Evaluation]
 *     summary: Check whether the user has already consented to research participation
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Consent record or null
 */
router.get('/consent', evaluationController.getConsent as any);

/**
 * @openapi
 * /evaluation/consent:
 *   post:
 *     tags: [Evaluation]
 *     summary: Record research participation consent
 *     description: Idempotent — re-submitting updates the existing record.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [consented]
 *             properties:
 *               consented:
 *                 type: boolean
 *                 enum: [true]
 *                 description: Must be true — only affirmative consent is accepted
 *               consent_version:
 *                 type: string
 *                 default: v1
 *     responses:
 *       201:
 *         description: Consent recorded
 *       422:
 *         description: Validation error (consented must be true)
 */
router.post('/consent', validate(ConsentDto), evaluationController.submitConsent as any);

/**
 * @openapi
 * /evaluation/consent:
 *   delete:
 *     tags: [Evaluation]
 *     summary: Withdraw research participation consent
 *     description: Sets consented=false on the existing record (kept as an audit trail). No-op if never consented.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Consent withdrawn
 */
router.delete('/consent', evaluationController.withdrawConsent as any);

// ── SUS ────────────────────────────────────────────────────────────────────

/**
 * @openapi
 * /evaluation/sus:
 *   get:
 *     tags: [Evaluation]
 *     summary: Get the user's SUS response (null if not yet submitted)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: SUS response with computed sus_score, or null
 */
router.get('/sus', evaluationController.getSusResponse as any);

/**
 * @openapi
 * /evaluation/sus:
 *   post:
 *     tags: [Evaluation]
 *     summary: Submit SUS questionnaire (one submission per user)
 *     description: |
 *       Server computes the SUS score using the standard formula.
 *       Odd questions (q1,q3…q9): contribution = response − 1.
 *       Even questions (q2,q4…q10): contribution = 5 − response.
 *       Total × 2.5 → score on 0–100 scale.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [scores]
 *             properties:
 *               scores:
 *                 type: object
 *                 description: q1–q10, each 1 (Strongly Disagree) to 5 (Strongly Agree)
 *                 required: [q1,q2,q3,q4,q5,q6,q7,q8,q9,q10]
 *                 properties:
 *                   q1: { type: integer, minimum: 1, maximum: 5 }
 *                   q2: { type: integer, minimum: 1, maximum: 5 }
 *                   q3: { type: integer, minimum: 1, maximum: 5 }
 *                   q4: { type: integer, minimum: 1, maximum: 5 }
 *                   q5: { type: integer, minimum: 1, maximum: 5 }
 *                   q6: { type: integer, minimum: 1, maximum: 5 }
 *                   q7: { type: integer, minimum: 1, maximum: 5 }
 *                   q8: { type: integer, minimum: 1, maximum: 5 }
 *                   q9: { type: integer, minimum: 1, maximum: 5 }
 *                   q10: { type: integer, minimum: 1, maximum: 5 }
 *     responses:
 *       201:
 *         description: SUS response saved with computed sus_score
 *       409:
 *         description: Already submitted
 *       422:
 *         description: Validation error
 */
router.post('/sus', validate(SusSubmitDto), evaluationController.submitSus as any);

// ── Feedback ───────────────────────────────────────────────────────────────

/**
 * @openapi
 * /evaluation/feedback:
 *   get:
 *     tags: [Evaluation]
 *     summary: Get all feedback the user has submitted
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Array of feedback records
 */
router.get('/feedback', evaluationController.getFeedback as any);

/**
 * @openapi
 * /evaluation/feedback:
 *   post:
 *     tags: [Evaluation]
 *     summary: Submit feedback
 *     description: Multiple submissions allowed — users can submit feedback more than once.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [rating, category]
 *             properties:
 *               rating: { type: integer, minimum: 1, maximum: 5 }
 *               category: { type: string, enum: [bug, suggestion, praise, other] }
 *               comment: { type: string, maxLength: 1000 }
 *     responses:
 *       201:
 *         description: Feedback saved
 *       422:
 *         description: Validation error
 */
router.post('/feedback', validate(FeedbackSubmitDto), evaluationController.submitFeedback as any);

export default router;
