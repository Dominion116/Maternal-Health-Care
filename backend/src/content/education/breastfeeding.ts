import { EducationArticle } from '../../modules/education/education.types';

const articles: EducationArticle[] = [
  {
    id: 'breastfeeding-benefits',
    category: 'breastfeeding',
    slug: 'benefits-of-breastfeeding',
    tags: ['breastfeeding', 'benefits', 'breast milk', 'infant feeding'],
    source: 'WHO, UNICEF, FMOH Nigeria',
    updated_at: '2025-01-01',
    translations: {
      en: {
        title: 'Why Breastfeeding Matters',
        summary:
          'Breast milk is the perfect food for your baby. Exclusive breastfeeding for 6 months saves lives.',
        content: `## The Recommendation

**Exclusively breastfeed for the first 6 months** — no water, no formula, no other food. Then continue breastfeeding alongside complementary foods until age 2 or beyond. This is the WHO and FMOH Nigeria recommendation.

## Benefits for Your Baby

- **Protection from infection** — breast milk contains antibodies that protect against diarrhoea, pneumonia, ear infections, and sepsis. These are leading killers of Nigerian children under 5.
- **Perfect nutrition** — all the nutrients, fats, and proteins needed for growth and brain development in the right amounts.
- **Colostrum (first milk)** — the thick, yellowish milk in the first 2–3 days is packed with antibodies and acts as the baby's first vaccine. Do not discard it.
- **Reduced risk of malnutrition** — breastfed babies are less likely to be stunted or underweight.
- **Protection later in life** — reduced risk of obesity, diabetes, and some cancers.

## Benefits for You

- Reduces risk of **postpartum haemorrhage** — oxytocin released during feeding helps the uterus contract.
- Helps your uterus return to normal size faster.
- Reduces your long-term risk of **breast cancer and ovarian cancer**.
- Provides some contraceptive protection in the first 6 months (Lactational Amenorrhoea Method — LAM) if exclusively breastfeeding and your period has not returned. Not 100% reliable alone.
- **Free** — formula costs money every month.

## The First Hour

Put your baby to the breast **within 1 hour of birth**. This:
- Stimulates your milk supply
- Gives your baby colostrum
- Helps bond mother and baby
- Reduces risk of low blood sugar in the newborn`,
      },
    },
  },
  {
    id: 'breastfeeding-how-to',
    category: 'breastfeeding',
    slug: 'how-to-breastfeed',
    tags: ['breastfeeding', 'latch', 'positioning', 'technique'],
    source: 'WHO, UNICEF, La Leche League International',
    updated_at: '2025-01-01',
    translations: {
      en: {
        title: 'How to Breastfeed — Positioning and Latch',
        summary:
          'A good latch prevents nipple pain and ensures your baby gets enough milk. Here is how to get it right.',
        content: `## Comfortable Positions

You can breastfeed in many positions. The most important thing is that **both you and your baby are comfortable and your baby can feed well**.

**Cradle hold:** Baby lies across your body, their head in the crook of your arm, facing your breast. Good for babies who have learned to latch well.

**Cross-cradle hold:** Support your baby's head with the hand opposite to the breast you are feeding from. Gives you more control over head position — useful for newborns.

**Football hold:** Tuck baby under your arm like a rugby ball, their legs behind you. Useful if you have large breasts, had a C-section, or have twins.

**Side-lying:** Lie on your side with the baby facing you. Good for nighttime feeds and C-section recovery.

## Getting a Good Latch

1. Hold your baby so their nose is level with your nipple.
2. Wait for their mouth to open wide — as wide as a yawn.
3. Move baby onto the breast quickly, aiming the nipple to the roof of their mouth.
4. Their lips should be flanged outward (like fish lips), not tucked in.
5. They should have a large mouthful of breast, not just the nipple.

**A good latch:**
- Does not hurt (initial mild discomfort is normal; sharp pain is not)
- You can hear swallowing
- Baby's cheeks are full and rounded, not hollow/sucking in

## How Often to Feed

Newborns feed **8–12 times in 24 hours** — roughly every 2–3 hours. Do not watch the clock — feed on demand whenever the baby shows hunger cues: rooting (turning head, mouth searching), sucking fists, becoming alert.

**Do not wait until the baby cries** — crying is a late hunger sign and a stressed baby latches poorly.

## How Do I Know the Baby Is Getting Enough?

- At least **6–8 wet nappies per day** after day 3
- Regular bowel movements (can be every feed in newborns)
- Baby is gaining weight (expect a return to birth weight by 2 weeks, then 150–200g per week)
- Baby is alert and active when awake`,
      },
    },
  },
  {
    id: 'breastfeeding-challenges',
    category: 'breastfeeding',
    slug: 'common-breastfeeding-challenges',
    tags: ['breastfeeding', 'nipple pain', 'mastitis', 'low supply', 'engorgement'],
    source: 'WHO, La Leche League International, NHS',
    updated_at: '2025-01-01',
    translations: {
      en: {
        title: 'Common Breastfeeding Challenges and Solutions',
        summary:
          'Most breastfeeding difficulties have solutions. Get help early rather than stopping breastfeeding.',
        content: `## Sore or Cracked Nipples

**Cause:** Almost always a poor latch.
**Solution:**
- Correct the latch — see the positioning guide.
- After feeding, rub a drop of your own breast milk onto the nipple and let it air dry.
- Breast milk has natural healing properties.
- A trained lactation counsellor or midwife can observe a feed and correct problems.

**Seek help if:** Pain is severe, nipples are cracked and bleeding, or there is no improvement after correcting the latch.

## Breast Engorgement

**What it is:** Breasts become very full, hard, and uncomfortable — usually around day 3–4 when milk "comes in."
**Solution:**
- Feed frequently — at least every 2–3 hours.
- Before feeding, apply a warm cloth to the breast to help milk flow.
- Hand-express a little milk to soften the areola so the baby can latch.
- After feeding, apply a cold cloth to reduce swelling.

## Mastitis (Breast Infection)

**Signs:** Red, hot, painful area on one breast, flu-like symptoms (fever, body ache).
**What to do:**
- **Keep breastfeeding** — stopping can worsen mastitis by blocking the ducts further.
- Feed frequently from the affected breast first.
- Apply warmth before feeds, cool after.
- See a doctor — you may need antibiotics. Antibiotics for mastitis are safe while breastfeeding.

## Perceived Low Milk Supply

**Reality:** Most women produce enough milk. True low supply is uncommon.
**Signs your supply is actually enough:** 6+ wet nappies per day, baby gaining weight well.
**What helps:**
- Feed more frequently — supply works on demand.
- Ensure the latch is correct — poor latch = poor drainage = reduced supply.
- Do not give formula "top-ups" without medical advice — formula reduces stimulation of your supply.
- Eat well, drink enough water, and rest.

**Seek help if:** Baby is not gaining weight, has fewer than 6 wet nappies, or seems constantly hungry despite frequent feeding.`,
      },
    },
  },
];

export default articles;
