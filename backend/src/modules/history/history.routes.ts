import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { UpdateSavedDto } from './history.dto';
import * as historyController from './history.controller';

const router = Router();

router.use(authMiddleware as any);

/**
 * @openapi
 * /history/conversations:
 *   get:
 *     tags: [History]
 *     summary: List all conversations for the authenticated user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20, maximum: 50 }
 *     responses:
 *       200:
 *         description: List of conversations
 */
router.get('/conversations', historyController.getConversations as any);

/**
 * @openapi
 * /history/conversations/{id}/messages:
 *   get:
 *     tags: [History]
 *     summary: Get messages for a specific conversation
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: List of messages
 *       404:
 *         description: Conversation not found
 */
router.get('/conversations/:id/messages', historyController.getMessages as any);

/**
 * @openapi
 * /history/conversations/{id}:
 *   delete:
 *     tags: [History]
 *     summary: Delete a conversation and all its messages
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Conversation deleted
 */
router.delete('/conversations/:id', historyController.deleteConversation as any);

/**
 * @openapi
 * /history/conversations/{id}/save:
 *   patch:
 *     tags: [History]
 *     summary: Mark a conversation as saved/unsaved
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
 *             required: [is_saved]
 *             properties:
 *               is_saved: { type: boolean }
 *     responses:
 *       200:
 *         description: Updated conversation
 */
router.patch('/conversations/:id/save', validate(UpdateSavedDto), historyController.setSaved as any);

export default router;
