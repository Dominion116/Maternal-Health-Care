import { EducationArticle } from '../../modules/education/education.types';

const articles: EducationArticle[] = [
  {
    id: 'nutrition-essentials',
    category: 'nutrition',
    slug: 'essential-nutrients',
    tags: ['nutrition', 'iron', 'folic acid', 'calcium', 'protein'],
    source: 'WHO, FMOH Nigeria Nutrition Guidelines',
    updated_at: '2025-01-01',
    translations: {
      en: {
        title: 'Essential Nutrients During Pregnancy',
        summary:
          'Your body needs more of certain nutrients during pregnancy. Here is what matters most and where to find them.',
        content: `## Folic Acid

**Why:** Prevents neural tube defects (brain and spine problems) in the baby.
**When:** Start before pregnancy and continue through the first 12 weeks.
**How much:** 400 mcg daily (your provider may prescribe 5 mg if you are at higher risk).
**Food sources:** Green leafy vegetables (ugu, efo), beans, groundnuts, fortified flour.

## Iron

**Why:** Prevents anaemia, which causes fatigue and increases risk of complications at birth.
**How much:** 30–60 mg daily (from supplements prescribed at ANC).
**Food sources:** Red meat, liver (in moderation), beans, dark leafy greens. Eat with vitamin C (orange, tomato) to improve absorption. Avoid tea or coffee with iron-rich meals.

## Calcium

**Why:** Builds your baby's bones and teeth; protects your own bone strength.
**How much:** 1,000–1,300 mg daily.
**Food sources:** Milk, yoghurt, crayfish, eggshell powder (used in many Nigerian soups), sardines with bones, soy milk.

## Protein

**Why:** Builds the baby's muscles, organs, and brain.
**How much:** Aim for at least 2–3 portions of protein-rich food per day.
**Food sources:** Eggs, fish, chicken, beans, lentils, groundnuts, soy.

## Iodine

**Why:** Essential for brain development. Severe deficiency causes intellectual disability.
**Source:** Use iodised salt. Seafood and fish are also good sources.

## Vitamin D

**Why:** Works with calcium for bone development. Also supports immune function.
**Source:** Sunlight (15–20 minutes daily), fatty fish, eggs, fortified milk.`,
      },
    },
  },
  {
    id: 'nutrition-foods-to-eat',
    category: 'nutrition',
    slug: 'foods-to-eat',
    tags: ['nutrition', 'diet', 'Nigerian foods', 'pregnancy diet'],
    source: 'WHO, FMOH Nigeria',
    updated_at: '2025-01-01',
    translations: {
      en: {
        title: 'Best Foods to Eat During Pregnancy',
        summary:
          'A balanced Nigerian diet can provide almost everything you need in pregnancy. Here is a practical guide.',
        content: `## Eat More of These

**Legumes and beans** — black-eyed beans, brown beans, lentils. High in protein, iron, and folic acid. Add to soups, rice, or eat as moi-moi and akara.

**Dark green vegetables** — ugwu (fluted pumpkin), bitter leaf, waterleaf, spinach. Rich in iron, calcium, and folic acid. Cook with a little oil to help absorb fat-soluble nutrients.

**Whole grains** — oats, ofada rice, whole wheat bread. Provide energy and fibre to reduce constipation.

**Eggs** — excellent source of protein, choline (brain development), and vitamin D. Eat fully cooked.

**Fatty fish** — mackerel (titus), salmon, sardines. Rich in omega-3 fatty acids which support the baby's brain and eye development. Eat 2–3 portions per week.

**Dairy** — milk, yoghurt, wara (local cheese). Good source of calcium and protein.

**Fruits** — oranges, pawpaw, banana, mango, guava. Provide vitamins, fibre, and help absorb iron from other foods.

**Water** — drink at least 8–10 glasses per day. Dehydration can cause preterm contractions.

## Practical Tips

- Eat small meals every 3–4 hours if nausea is a problem.
- Do not skip breakfast.
- Wash all fruits and vegetables thoroughly.
- Cook meat and fish fully; no raw or undercooked protein.`,
      },
    },
  },
  {
    id: 'nutrition-foods-to-avoid',
    category: 'nutrition',
    slug: 'foods-to-avoid',
    tags: ['nutrition', 'food safety', 'avoid', 'pregnancy risks'],
    source: 'WHO, FMOH Nigeria, NHS',
    updated_at: '2025-01-01',
    translations: {
      en: {
        title: 'Foods and Substances to Avoid in Pregnancy',
        summary:
          'Some foods and substances can harm your baby. This guide lists what to avoid and why.',
        content: `## Alcohol

**Avoid completely.** There is no safe amount. Alcohol crosses the placenta and can cause miscarriage, stillbirth, and fetal alcohol syndrome (permanent brain damage).

## Unpasteurised Dairy and Raw Eggs

Raw or unpasteurised milk and soft cheeses can contain Listeria bacteria, which causes severe infection and miscarriage. Always boil local milk. Cook eggs fully.

## Undercooked Meat and Fish

Can contain Toxoplasma, Salmonella, and other pathogens. Cook all meat until juices run clear. Avoid suya that may not be cooked through.

## High-Mercury Fish

Avoid shark, swordfish, and king mackerel. These accumulate mercury which damages the baby's developing nervous system. Titus (mackerel), tilapia, and catfish are safe.

## Liver in Large Amounts

Liver is nutritious but very high in vitamin A. Too much vitamin A (from food, not supplements) can cause birth defects. Eat liver occasionally, not daily.

## Caffeine

**Limit to under 200 mg per day** (roughly 1–2 cups of tea or one small cup of coffee). High caffeine increases risk of low birth weight and miscarriage.

## Herbal Preparations

Many traditional herbal drinks and concoctions have not been tested in pregnancy and some are known to cause miscarriage or preterm labour. **Tell your ANC provider about any herbs you are using.**

## Tobacco and Secondhand Smoke

Smoking reduces oxygen to the baby and increases risk of miscarriage, preterm birth, and low birth weight. Avoid smoking and enclosed spaces where others are smoking.`,
      },
    },
  },
];

export default articles;
