/**
 * Personalized dashboard recommendations.
 *
 * Uses what the intent classifier has already learned about a user's
 * conversations (the `intent` column stored on every assistant message) to
 * suggest education categories to read and follow-up questions to ask.
 * No extra ML at request time — this is aggregation over classified history.
 */
import { supabaseAdmin } from '../config/supabase';
import { getIntents } from '../ml/knowledgeBase';
import { BY_CATEGORY } from '../content/education';
import { CATEGORY_LABELS, EducationCategory } from '../modules/education/education.types';

// Keyword rules mapping a free-text intent tag to an education category.
// Checked in order — more specific topics first, broad pregnancy topics last.
const CATEGORY_RULES: Array<{ category: EducationCategory; pattern: RegExp }> = [
  { category: 'breastfeeding', pattern: /breastfeed|breast milk|colostrum|latch|wean|mastitis|nipple|areola|milk production|expressing milk/ },
  { category: 'mental-health', pattern: /depress|mood|emotion|stress|anxiet|mental|grief|griev|mourn|well-being|wellbeing|violence|sad/ },
  { category: 'vaccines', pattern: /vaccin|immuni|tetanus|toxoid|flu|pertussis|rubella|measles|chickenpox|zika|cmv|cytomegalovirus|whooping|parvovirus/ },
  { category: 'postpartum', pattern: /postpartum|after birth|newborn|baby|c-section|caesarean|lochia|birth control|contracept|implant|iud|family planning|crying|colic|pacifier|diaper|sids|infant|toddler|child/ },
  { category: 'danger-signs', pattern: /bleed|preeclampsia|eclampsia|emergenc|danger|miscarriage|ectopic|seizure|convulsion|swell|swollen|severe|blood pressure|glucose|faint|conscious|hemorrhage|rupture|complicat|preterm|premature|fever|malaria|vomit|urinary tract|burning during urination/ },
  { category: 'birth-prep', pattern: /labor|labour|birth|deliver|contraction|epidural|hospital|push|placenta|induc|episiotomy|breech|vbac|water|membrane|mucus plug|midwife|doula/ },
  { category: 'nutrition', pattern: /food|eat|nutri|diet|vitamin|folic|iron|calcium|supplement|caffeine|alcohol|fish|seafood|dairy|protein|vegetable|fruit|snack|craving|aversion|weight|drink|tea|coffee|sweetener|legume|grain|omega|fibre|fiber|appetite|lactose|cheese|meat|poultry|egg|soy|herb/ },
  { category: 'anc', pattern: /antenatal|prenatal|anc|visit|appointment|check|screening|ultrasound|scan|blood test|urine|swab|trisomy|x-ray|dental|monitoring|clinic/ },
  { category: 'trimester', pattern: /trimester|week|fetal|fetus|embryo|develop|movement|kick|amniotic|uterus|cervix|ovul|menstrual|conceiv|fertili|implantation|due date|hormon|skin|stretch|pregnan|body|physical change|fatigue|tired|weak|nausea|morning sickness|discomfort|cramp|heartburn|constipation|hemorrhoid|varicose|back pain|headache|sweat|exercise|activity|travel|work|sex/ },
];

export function mapIntentToCategory(tag: string): EducationCategory | null {
  const lower = tag.toLowerCase();
  const rule = CATEGORY_RULES.find((r) => r.pattern.test(lower));
  return rule?.category ?? null;
}

export interface RecommendedCategory {
  category: EducationCategory;
  label: string;
  reason: string;
  matched_count: number;
  articles: Array<{ title: string; slug: string; summary: string }>;
}

export interface DashboardRecommendations {
  top_intents: Array<{ intent: string; count: number }>;
  recommended_categories: RecommendedCategory[];
  suggested_questions: string[];
}

const EMPTY: DashboardRecommendations = {
  top_intents: [],
  recommended_categories: [],
  suggested_questions: [],
};

export async function getDashboardRecommendations(
  userId: string,
): Promise<DashboardRecommendations> {
  // 1. The user's recent conversations
  const { data: convs } = await supabaseAdmin
    .from('conversations')
    .select('id')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
    .limit(50);

  const convIds = (convs ?? []).map((c) => c.id);
  if (convIds.length === 0) return EMPTY;

  // 2. Classified intents from those conversations (stored on assistant messages)
  const { data: rows } = await supabaseAdmin
    .from('messages')
    .select('intent')
    .in('conversation_id', convIds)
    .not('intent', 'is', null)
    .order('created_at', { ascending: false })
    .limit(200);

  const intentCounts = new Map<string, number>();
  for (const row of rows ?? []) {
    if (!row.intent || row.intent === 'unknown') continue;
    intentCounts.set(row.intent, (intentCounts.get(row.intent) ?? 0) + 1);
  }
  if (intentCounts.size === 0) return EMPTY;

  const topIntents = Array.from(intentCounts.entries())
    .map(([intent, count]) => ({ intent, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // 3. Aggregate intent counts into education-category scores
  const categoryScores = new Map<
    EducationCategory,
    { count: number; topIntent: string; topIntentCount: number }
  >();
  for (const [intent, count] of intentCounts) {
    const category = mapIntentToCategory(intent);
    if (!category) continue;
    const entry = categoryScores.get(category) ?? { count: 0, topIntent: intent, topIntentCount: 0 };
    entry.count += count;
    if (count > entry.topIntentCount) {
      entry.topIntent = intent;
      entry.topIntentCount = count;
    }
    categoryScores.set(category, entry);
  }

  const recommendedCategories: RecommendedCategory[] = Array.from(categoryScores.entries())
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 4)
    .map(([category, { count, topIntent }]) => ({
      category,
      label: CATEGORY_LABELS[category],
      reason: `Because you asked about ${humanizeIntent(topIntent)}`,
      matched_count: count,
      articles: (BY_CATEGORY.get(category) ?? []).slice(0, 2).map((a) => ({
        title: a.translations.en.title,
        slug: a.slug,
        summary: a.translations.en.summary,
      })),
    }));

  // 4. Suggested follow-up questions: pattern texts from intents in the
  // user's recommended categories that they haven't already asked about.
  const recommendedSet = new Set(recommendedCategories.map((r) => r.category));
  const asked = new Set(intentCounts.keys());
  const questionsByCategory = new Map<EducationCategory, string[]>();

  for (const intentDef of getIntents()) {
    if (asked.has(intentDef.tag) || intentDef.patterns.length === 0) continue;
    const category = mapIntentToCategory(intentDef.tag);
    if (!category || !recommendedSet.has(category)) continue;
    const list = questionsByCategory.get(category) ?? [];
    if (list.length < 3) list.push(intentDef.patterns[0]);
    questionsByCategory.set(category, list);
  }

  // Round-robin across categories for variety, cap at 5.
  const suggestedQuestions: string[] = [];
  for (let i = 0; i < 3 && suggestedQuestions.length < 5; i++) {
    for (const rec of recommendedCategories) {
      const q = questionsByCategory.get(rec.category)?.[i];
      if (q && !suggestedQuestions.includes(q) && suggestedQuestions.length < 5) {
        suggestedQuestions.push(q);
      }
    }
  }

  return {
    top_intents: topIntents,
    recommended_categories: recommendedCategories,
    suggested_questions: suggestedQuestions,
  };
}

function humanizeIntent(tag: string): string {
  return tag.replace(/_/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
}
