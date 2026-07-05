export type EducationCategory =
  | 'trimester'
  | 'nutrition'
  | 'danger-signs'
  | 'anc'
  | 'vaccines'
  | 'mental-health'
  | 'birth-prep'
  | 'postpartum'
  | 'breastfeeding';

export type Language = 'en' | 'yo' | 'ha' | 'ig';

export interface ArticleTranslation {
  title: string;
  summary: string;
  content: string; // markdown
}

export interface EducationArticle {
  id: string;
  category: EducationCategory;
  slug: string;
  tags: string[];
  source: string;
  updated_at: string;
  translations: {
    en: ArticleTranslation;
    yo?: ArticleTranslation;
    ha?: ArticleTranslation;
    ig?: ArticleTranslation;
  };
}

export const CATEGORY_LABELS: Record<EducationCategory, string> = {
  trimester: 'Pregnancy Trimesters',
  nutrition: 'Nutrition & Diet',
  'danger-signs': 'Danger Signs',
  anc: 'Antenatal Care (ANC)',
  vaccines: 'Vaccinations',
  'mental-health': 'Mental Health',
  'birth-prep': 'Birth Preparedness',
  postpartum: 'Postpartum Recovery',
  breastfeeding: 'Breastfeeding',
};
