import { ALL_ARTICLES, BY_CATEGORY, BY_SLUG } from '../../content/education';
import {
  EducationArticle,
  EducationCategory,
  Language,
  CATEGORY_LABELS,
} from './education.types';

function resolveTranslation(article: EducationArticle, lang: Language) {
  const t = article.translations[lang] ?? article.translations.en;
  return {
    id: article.id,
    category: article.category,
    slug: article.slug,
    tags: article.tags,
    source: article.source,
    updated_at: article.updated_at,
    lang_served: article.translations[lang] ? lang : 'en',
    ...t,
  };
}

export function listCategories() {
  return (Object.keys(CATEGORY_LABELS) as EducationCategory[]).map((cat) => ({
    category: cat,
    label: CATEGORY_LABELS[cat],
    article_count: BY_CATEGORY.get(cat)?.length ?? 0,
  }));
}

export function listByCategory(category: EducationCategory, lang: Language) {
  const articles = BY_CATEGORY.get(category);
  if (!articles) return null;
  return articles.map((a) => resolveTranslation(a, lang));
}

export function getArticle(category: EducationCategory, slug: string, lang: Language) {
  return BY_SLUG.get(`${category}/${slug}`)
    ? resolveTranslation(BY_SLUG.get(`${category}/${slug}`)!, lang)
    : null;
}

export function search(query: string, lang: Language) {
  const q = query.toLowerCase();
  return ALL_ARTICLES.filter((a) => {
    const t = a.translations[lang] ?? a.translations.en;
    return (
      t.title.toLowerCase().includes(q) ||
      t.summary.toLowerCase().includes(q) ||
      a.tags.some((tag) => tag.includes(q))
    );
  }).map((a) => resolveTranslation(a, lang));
}
