import { EducationArticle } from '../../modules/education/education.types';

const articles: EducationArticle[] = [
  {
    id: 'trimester-first',
    category: 'trimester',
    slug: 'first-trimester',
    tags: ['first trimester', 'early pregnancy', 'weeks 1-12'],
    source: 'WHO ANC Guidelines 2016, FMOH Nigeria',
    updated_at: '2025-01-01',
    translations: {
      en: {
        title: 'First Trimester: Weeks 1 to 12',
        summary:
          'The first 12 weeks of pregnancy bring rapid changes. Learn what to expect, what to take, and your first ANC visit.',
        content: `## What Is Happening

Your baby grows from a single cell to the size of a lime. The heart begins beating around week 6. Major organs (brain, spine, heart, and limbs) form during this period, making it the most critical time for fetal development.

## Common Symptoms

- **Nausea and vomiting**: most common in the morning but can happen any time. Eat small, frequent meals. Ginger tea or plain crackers may help.
- **Fatigue**: your body is working hard. Rest when you can.
- **Breast tenderness**: normal due to hormonal changes.
- **Frequent urination**: your kidneys are working harder.
- **Mood changes**: hormones affect emotions. This is normal.

## What to Start Taking Immediately

- **Folic acid**: 400 mcg daily, reduces risk of neural tube defects. Start before pregnancy if possible.
- **Iron supplements**: as prescribed at your first ANC visit.
- **Avoid alcohol, tobacco, and unprescribed drugs**; these cause serious harm to the baby.

## Your First ANC Visit

Book your first antenatal care (ANC) visit **before 12 weeks**. At this visit, the provider will:
- Confirm your pregnancy and estimate your due date
- Check your blood pressure, weight, and urine
- Screen for anaemia, HIV, syphilis, and malaria
- Give you your ANC card; **keep it safe and bring it to every visit**

## When to Seek Help Immediately

Go to hospital if you experience heavy bleeding, severe abdominal pain, or high fever.`,
      },
    },
  },
  {
    id: 'trimester-second',
    category: 'trimester',
    slug: 'second-trimester',
    tags: ['second trimester', 'weeks 13-26', 'fetal movement'],
    source: 'WHO ANC Guidelines 2016, FMOH Nigeria',
    updated_at: '2025-01-01',
    translations: {
      en: {
        title: 'Second Trimester: Weeks 13 to 26',
        summary:
          'Many women feel better in the second trimester. You will start to feel your baby move and have an important anatomy scan.',
        content: `## What Is Happening

The second trimester is often called the "golden period"; nausea usually eases, energy returns, and your bump becomes visible. Your baby can now hear sounds, and all major organs are formed and growing.

## Feeling Your Baby Move

Most women feel the first movements (**quickening**) between weeks 18 and 22. First-time mothers may notice it later. Movements feel like butterflies, bubbles, or gentle taps. If you are past 22 weeks and have not felt movement, tell your ANC provider.

## The 18–20 Week Anatomy Scan

This ultrasound checks:
- Baby's growth and position
- Heart structure and major organs
- Placenta location
- Amniotic fluid level

**Attend this scan even if you feel well** — it can detect problems that have no symptoms.

## Common Changes

- Backache: wear flat shoes, avoid heavy lifting, sleep on your left side with a pillow between your knees.
- Leg cramps: stretch your calf muscles and stay hydrated.
- Heartburn: eat small meals, avoid lying down immediately after eating.
- Skin changes: darkening of the skin (linea nigra, melasma) are normal and fade after birth.

## ANC Visits This Trimester

Attend ANC at **20 weeks and 26 weeks**. At these visits your provider will measure fundal height to check the baby is growing well and check for anaemia.`,
      },
    },
  },
  {
    id: 'trimester-third',
    category: 'trimester',
    slug: 'third-trimester',
    tags: ['third trimester', 'weeks 27-40', 'labour', 'birth'],
    source: 'WHO ANC Guidelines 2016, FMOH Nigeria',
    updated_at: '2025-01-01',
    translations: {
      en: {
        title: 'Third Trimester: Weeks 27 to 40',
        summary:
          'The final stretch. Learn to count kicks, recognise true labour, and prepare your birth plan.',
        content: `## What Is Happening

Your baby gains most of its weight in these weeks and moves into a head-down position ready for birth. You may feel Braxton Hicks contractions (practice contractions); these are irregular and go away when you change position.

## Kick Counting

From 28 weeks, count fetal movements every day:
- After a meal, lie on your left side
- Count how long it takes to feel **10 movements**
- If it takes more than 2 hours, or movements suddenly decrease, **go to hospital immediately**

## True Labour vs Braxton Hicks

| True Labour | Braxton Hicks |
|---|---|
| Contractions become regular and closer together | Irregular, no pattern |
| Pain increases over time | Stays the same or eases |
| Does not stop with rest or movement | Often stops when you change position |
| Bloody show or waters may break | No fluid |

## When to Go to Hospital

Go **immediately** if:
- Contractions are 5 minutes apart, lasting 60 seconds, for 1 hour
- Your waters break
- Heavy vaginal bleeding
- Baby stops moving
- Severe headache or blurred vision
- Difficulty breathing

## ANC Visits This Trimester

Attend at **30, 34, 36, 38, and 40 weeks**. Do not miss these; your provider monitors blood pressure closely as pre-eclampsia risk rises in late pregnancy.`,
      },
    },
  },
];

export default articles;
