import { Router } from 'express';
import * as educationController from './education.controller';

// No auth required — education content is publicly accessible
const router = Router();

/**
 * @openapi
 * /education/categories:
 *   get:
 *     tags: [Education]
 *     summary: List all education categories with article counts
 *     security: []
 *     responses:
 *       200:
 *         description: Array of { category, label, article_count }
 */
router.get('/categories', educationController.listCategories);

/**
 * @openapi
 * /education/search:
 *   get:
 *     tags: [Education]
 *     summary: Search articles by keyword
 *     security: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema: { type: string }
 *         description: Search query
 *       - in: query
 *         name: lang
 *         schema: { type: string, enum: [en, yo, ha, ig], default: en }
 *     responses:
 *       200:
 *         description: Matching articles
 *       400:
 *         description: Missing query parameter
 */
router.get('/search', educationController.search);

/**
 * @openapi
 * /education/{category}:
 *   get:
 *     tags: [Education]
 *     summary: List all articles in a category
 *     security: []
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *           enum: [trimester, nutrition, danger-signs, anc, vaccines, mental-health, birth-prep, postpartum, breastfeeding]
 *       - in: query
 *         name: lang
 *         schema: { type: string, enum: [en, yo, ha, ig], default: en }
 *     responses:
 *       200:
 *         description: Array of articles with title, summary, content (markdown)
 *       404:
 *         description: Category not found
 */
router.get('/:category', educationController.listByCategory);

/**
 * @openapi
 * /education/{category}/{slug}:
 *   get:
 *     tags: [Education]
 *     summary: Get a single article by category and slug
 *     security: []
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: slug
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: lang
 *         schema: { type: string, enum: [en, yo, ha, ig], default: en }
 *     responses:
 *       200:
 *         description: Full article with markdown content
 *       404:
 *         description: Article not found
 */
router.get('/:category/:slug', educationController.getArticle);

export default router;
