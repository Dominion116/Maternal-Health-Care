import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { SendMessageDto, CreateSessionDto } from './chat.dto';
import * as chatController from './chat.controller';

const router = Router();

router.use(authMiddleware as any);

/**
 * @openapi
 * /chat/sessions:
 *   post:
 *     tags: [Chat]
 *     summary: Create a new chat session
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string, maxLength: 120, description: "Optional session title" }
 *     responses:
 *       200:
 *         description: New session object with id, title, created_at, updated_at
 *       401:
 *         description: Unauthorized
 */
router.post('/sessions', validate(CreateSessionDto), chatController.createSession as any);

/**
 * @openapi
 * /chat/message:
 *   post:
 *     tags: [Chat]
 *     summary: Send a chat message to MamaGuide
 *     description: |
 *       If `conversation_id` is omitted, a new session is created automatically
 *       and its id is returned in the response alongside the assistant reply.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [message]
 *             properties:
 *               message: { type: string, maxLength: 2000 }
 *               conversation_id: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Assistant reply and conversation details
 *       401:
 *         description: Unauthorized
 */
router.post('/message', validate(SendMessageDto), chatController.sendMessage as any);

export default router;
