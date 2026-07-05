import { Request, Response, NextFunction } from 'express';
import * as educationService from './education.service';
import { EducationCategory, Language } from './education.types';
import { sendSuccess, sendError } from '../../utils/response';

const VALID_LANGS: Language[] = ['en', 'yo', 'ha', 'ig'];
const VALID_CATEGORIES: EducationCategory[] = [
  'trimester', 'nutrition', 'danger-signs', 'anc',
  'vaccines', 'mental-health', 'birth-prep', 'postpartum', 'breastfeeding',
];

function resolveLang(req: Request): Language {
  const lang = req.query.lang as string;
  return VALID_LANGS.includes(lang as Language) ? (lang as Language) : 'en';
}

export function listCategories(_req: Request, res: Response) {
  return sendSuccess(res, educationService.listCategories());
}

export function listByCategory(req: Request, res: Response, next: NextFunction) {
  const category = req.params.category as EducationCategory;
  if (!VALID_CATEGORIES.includes(category)) return sendError(res, 'Category not found', 404);

  const articles = educationService.listByCategory(category, resolveLang(req));
  if (!articles) return sendError(res, 'Category not found', 404);

  return sendSuccess(res, articles);
}

export function getArticle(req: Request, res: Response, next: NextFunction) {
  const category = req.params.category as EducationCategory;
  const { slug } = req.params;

  if (!VALID_CATEGORIES.includes(category)) return sendError(res, 'Category not found', 404);

  const article = educationService.getArticle(category, slug, resolveLang(req));
  if (!article) return sendError(res, 'Article not found', 404);

  return sendSuccess(res, article);
}

export function search(req: Request, res: Response) {
  const query = (req.query.q as string) ?? '';
  if (!query.trim()) return sendError(res, 'Query parameter "q" is required', 400);

  const results = educationService.search(query, resolveLang(req));
  return sendSuccess(res, results);
}
