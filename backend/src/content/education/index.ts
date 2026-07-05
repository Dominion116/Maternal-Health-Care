import { EducationArticle, EducationCategory } from '../../modules/education/education.types';
import trimester from './trimester';
import nutrition from './nutrition';
import dangerSigns from './danger-signs';
import anc from './anc';
import vaccines from './vaccines';
import mentalHealth from './mental-health';
import birthPrep from './birth-prep';
import postpartum from './postpartum';
import breastfeeding from './breastfeeding';

const ALL_ARTICLES: EducationArticle[] = [
  ...trimester,
  ...nutrition,
  ...dangerSigns,
  ...anc,
  ...vaccines,
  ...mentalHealth,
  ...birthPrep,
  ...postpartum,
  ...breastfeeding,
];

// Indexed for O(1) lookups at request time
const BY_CATEGORY = new Map<EducationCategory, EducationArticle[]>();
const BY_SLUG = new Map<string, EducationArticle>();

for (const article of ALL_ARTICLES) {
  if (!BY_CATEGORY.has(article.category)) BY_CATEGORY.set(article.category, []);
  BY_CATEGORY.get(article.category)!.push(article);
  BY_SLUG.set(`${article.category}/${article.slug}`, article);
}

export { ALL_ARTICLES, BY_CATEGORY, BY_SLUG };
