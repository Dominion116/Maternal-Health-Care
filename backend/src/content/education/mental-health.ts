import { EducationArticle } from '../../modules/education/education.types';

const articles: EducationArticle[] = [
  {
    id: 'mental-health-emotional-changes',
    category: 'mental-health',
    slug: 'emotional-changes-in-pregnancy',
    tags: ['mental health', 'anxiety', 'mood', 'emotions', 'pregnancy'],
    source: 'WHO Mental Health Gap Action Programme, FMOH Nigeria',
    updated_at: '2025-01-01',
    translations: {
      en: {
        title: 'Emotional Changes During Pregnancy',
        summary:
          'Pregnancy brings emotional highs and lows. Understanding what is normal helps you know when to seek support.',
        content: `## Why Emotions Change in Pregnancy

Hormonal changes (especially oestrogen and progesterone) directly affect brain chemistry. This is why emotions can feel amplified during pregnancy — joy, fear, excitement, and sadness can all feel more intense than usual.

## What Is Normal

- Mood swings, especially in the first and third trimesters
- Anxiety about the baby's health, labour, or finances
- Feeling overwhelmed by the responsibility of becoming a parent
- Mixed feelings about pregnancy, even if it was planned
- Dreams and sleep disturbances

These are common experiences. You are not alone.

## When to Seek Help

Seek support from a health provider if you experience:

- **Persistent sadness or hopelessness** lasting more than 2 weeks
- **Inability to feel pleasure** in things you normally enjoy
- **Severe anxiety or panic attacks**
- **Thoughts of harming yourself or your baby**
- **Not eating or sleeping at all**

These may be signs of **antenatal depression or anxiety**, which affect up to 1 in 5 pregnant women in Nigeria. They are treatable conditions — not weakness.

## What Helps

- **Talk to someone you trust** — a partner, family member, or friend.
- **Tell your ANC provider** — they can refer you to counselling.
- **Rest and gentle movement** — short walks improve mood.
- **Reduce stress where possible** — identify and address practical worries (finances, housing) with support.
- **Faith and community** — prayer, faith communities, and social support are important protective factors.

## For Partners and Family

Your support matters enormously. Listen without judging. Help with household tasks. Accompany her to ANC visits.`,
      },
    },
  },
  {
    id: 'mental-health-ppd',
    category: 'mental-health',
    slug: 'postpartum-depression',
    tags: ['postpartum depression', 'baby blues', 'mental health', 'after birth'],
    source: 'WHO, FMOH Nigeria, Lancet Psychiatry',
    updated_at: '2025-01-01',
    translations: {
      en: {
        title: 'Postpartum Depression — What It Is and What to Do',
        summary:
          'Postpartum depression is real, common, and treatable. It is not a sign of failure as a mother.',
        content: `## Baby Blues vs Postpartum Depression

### Baby Blues (Normal)
In the first 2 weeks after birth, many women experience crying, irritability, and mood swings. This is caused by the sudden drop in hormones after delivery. **Baby blues resolve on their own within 2 weeks** with rest and support.

### Postpartum Depression (Needs Treatment)
If low mood persists beyond 2 weeks, or is severe, it may be postpartum depression (PPD). PPD affects **approximately 1 in 5 new mothers** in Sub-Saharan Africa.

## Signs of Postpartum Depression

- Persistent sadness, emptiness, or hopelessness
- Feeling detached from your baby — unable to bond or feel love
- Extreme fatigue beyond normal new-parent tiredness
- Loss of appetite or overeating
- Difficulty concentrating or making decisions
- Feeling like a bad mother
- **Thoughts of harming yourself or the baby** — seek help immediately

## Why PPD Is Not Weakness

PPD is a medical condition caused by hormonal changes, sleep deprivation, and the enormous adjustment to motherhood. It is not a character flaw, and it does not mean you do not love your baby.

## What to Do

1. **Tell someone** — your partner, a trusted family member, your postnatal provider.
2. **Attend your postnatal visit** — mention your feelings. Providers cannot always see PPD unless you speak up.
3. **Treatment works** — talking therapy and, when needed, medication are effective.
4. **Accept help** — let family help with the baby and household tasks.

## For Family Members

Watch for these signs in the new mother. Do not dismiss it as tiredness. Encourage her to speak to a health provider and give practical support — take shifts with the baby, prepare meals, and listen without judgement.`,
      },
    },
  },
];

export default articles;
