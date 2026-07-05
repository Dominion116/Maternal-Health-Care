import { Router } from 'express';
import { validate } from '../../middlewares/validate.middleware';
import { ContactDto } from './contact.dto';
import * as contactController from './contact.controller';

const router = Router();

/**
 * @openapi
 * /contact:
 *   post:
 *     tags: [Contact]
 *     summary: Submit a contact form message
 *     description: |
 *       Stores the submission in the `contact_submissions` table.
 *       No authentication required — anyone can reach the support team.
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, message]
 *             properties:
 *               name:
 *                 type: string
 *                 maxLength: 120
 *                 example: Adaeze Okonkwo
 *               email:
 *                 type: string
 *                 format: email
 *                 example: adaeze@example.com
 *               subject:
 *                 type: string
 *                 maxLength: 200
 *                 example: Question about pregnancy tracking
 *               message:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 2000
 *                 example: I would like to know how to update my due date.
 *     responses:
 *       201:
 *         description: Message saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: object
 *                   properties:
 *                     id: { type: string, format: uuid }
 *                     created_at: { type: string, format: date-time }
 *                 message: { type: string, example: Message received — we will get back to you shortly }
 *       422:
 *         description: Validation error (e.g. message too short, invalid email)
 */
router.post('/', validate(ContactDto), contactController.submitContactForm);

export default router;
