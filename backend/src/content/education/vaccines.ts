import { EducationArticle } from '../../modules/education/education.types';

const articles: EducationArticle[] = [
  {
    id: 'vaccines-tetanus',
    category: 'vaccines',
    slug: 'tetanus-toxoid',
    tags: ['vaccine', 'tetanus', 'TT', 'tetanus toxoid'],
    source: 'FMOH Nigeria Immunisation Schedule, WHO',
    updated_at: '2025-01-01',
    translations: {
      en: {
        title: 'Tetanus Toxoid Vaccination in Pregnancy',
        summary:
          'Tetanus vaccination during pregnancy protects both you and your newborn from neonatal tetanus, a leading cause of newborn deaths.',
        content: `## Why Tetanus Vaccination Matters

Tetanus is caused by a bacterium that enters through wounds, including the umbilical cord stump after delivery. **Neonatal tetanus kills thousands of Nigerian newborns every year.** Vaccinating the mother during pregnancy passes antibodies to the baby before birth.

## The Tetanus Toxoid (TT) Schedule

| Dose | When to Give | Protection |
|------|-------------|------------|
| TT1 | First ANC visit (as early as possible) | Primes the immune system |
| TT2 | At least 4 weeks after TT1 | 3 years protection |
| TT3 | At least 6 months after TT2 | 5 years protection |
| TT4 | At least 1 year after TT3 | 10 years protection |
| TT5 | At least 1 year after TT4 | Lifetime protection |

**At minimum, you need TT2 before delivery to protect your baby.** Ideally, receive all doses over your lifetime.

## What to Do

- Tell your ANC provider if you have received tetanus vaccines before (childhood or previous pregnancy).
- Carry your vaccination card.
- Complete the full schedule across pregnancies; protection builds with each dose.

## Is It Safe?

Yes. Tetanus toxoid is one of the most studied vaccines in the world and is safe throughout pregnancy. It does not harm the baby.`,
      },
    },
  },
  {
    id: 'vaccines-newborn',
    category: 'vaccines',
    slug: 'newborn-vaccination-schedule',
    tags: ['vaccine', 'newborn', 'immunisation', 'baby', 'schedule'],
    source: 'FMOH Nigeria National Immunisation Schedule 2023',
    updated_at: '2025-01-01',
    translations: {
      en: {
        title: 'Newborn and Infant Vaccination Schedule',
        summary:
          'Nigeria\'s national immunisation schedule protects your baby from 12 preventable diseases. Start at birth.',
        content: `## Why Vaccinate?

Vaccines prevent diseases that killed millions of children before immunisation programmes existed. In Nigeria, routine immunisation is **free at government health facilities**. A vaccinated child is protected from polio, measles, hepatitis B, tuberculosis, and more.

## Nigeria's Routine Immunisation Schedule

| Age | Vaccines |
|-----|---------|
| At birth | BCG (tuberculosis), OPV0 (polio), Hepatitis B birth dose |
| 6 weeks | OPV1, Pentavalent 1 (DPT-HepB-Hib), PCV1, IPV1, Rota 1 |
| 10 weeks | OPV2, Pentavalent 2, PCV2, Rota 2 |
| 14 weeks | OPV3, Pentavalent 3, PCV3, IPV2 |
| 6 months | Vitamin A (1st dose) |
| 9 months | Measles-Rubella (MR) 1, Yellow Fever, Meningococcal A |
| 12 months | Vitamin A (2nd dose) |
| 15 months | MR2 |

**BCG and Hepatitis B must be given at birth or within the first 24 hours.**

## Vaccination Card

Your baby will receive a **Child Health Card (CHC)** at birth. This records all vaccines given.
- Keep it safe; schools and future health visits will ask for it.
- Bring it to every clinic visit.
- If lost, go to the health centre to get a replacement.

## Side Effects

Mild side effects (slight fever, soreness at injection site) are normal and last 1–2 days. Serious reactions are very rare. If your baby develops a high fever, difficulty breathing, or swelling after vaccination, go to hospital.`,
      },
    },
  },
];

export default articles;
