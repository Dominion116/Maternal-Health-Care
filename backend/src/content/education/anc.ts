import { EducationArticle } from '../../modules/education/education.types';

const articles: EducationArticle[] = [
  {
    id: 'anc-overview',
    category: 'anc',
    slug: 'what-is-anc',
    tags: ['ANC', 'antenatal care', 'prenatal visits', 'clinic'],
    source: 'WHO ANC Guidelines 2016, FMOH Nigeria',
    updated_at: '2025-01-01',
    translations: {
      en: {
        title: 'What Is Antenatal Care (ANC)?',
        summary:
          'ANC visits during pregnancy protect both you and your baby. Learn why they matter and how to access them.',
        content: `## What Is ANC?

Antenatal care (ANC) is healthcare you receive during pregnancy from a trained provider (midwife, nurse, or doctor). It is not only for when something is wrong. It is routine monitoring to **keep both you and your baby safe**.

## Why ANC Matters

- Catches problems early, before they become dangerous
- Screens for HIV, syphilis, malaria, anaemia, and pre-eclampsia
- Provides iron and folic acid supplements
- Gives you tetanus toxoid protection
- Prepares you for labour and delivery
- Connects you to a skilled birth attendant

**Women who attend at least 4 ANC visits are significantly less likely to die from pregnancy-related causes.**

## How to Access ANC in Nigeria

- Register at your nearest Primary Health Centre (PHC), General Hospital, or private clinic as soon as you know you are pregnant.
- Bring a valid ID. ANC is provided **free at government facilities** for pregnant women under Nigeria's free maternal health policy in many states.
- You will receive an **ANC card**; carry it to every visit and every health facility visit.

## What Happens at Your First Visit

- Confirmation of pregnancy and calculation of expected due date (EDD)
- Full history and physical examination
- Blood pressure, weight, height
- Blood tests: haemoglobin (anaemia), HIV, syphilis, blood group, rhesus factor
- Urine test
- Start of iron, folic acid, and intermittent preventive treatment for malaria (IPTp)`,
      },
    },
  },
  {
    id: 'anc-schedule',
    category: 'anc',
    slug: 'anc-visit-schedule',
    tags: ['ANC', 'schedule', 'visits', 'FMOH'],
    source: 'FMOH Nigeria ANC Schedule, WHO 2016',
    updated_at: '2025-01-01',
    translations: {
      en: {
        title: 'ANC Visit Schedule',
        summary:
          'The recommended schedule for antenatal care visits in Nigeria, based on WHO and FMOH guidelines.',
        content: `## Recommended ANC Visits

WHO recommends a minimum of **8 ANC contacts** during pregnancy. In Nigeria, the FMOH recommends at least 4 visits, but 8 is the new standard.

| Visit | When | Key Activities |
|-------|------|----------------|
| 1st | Before 12 weeks | Registration, baseline tests, supplements started |
| 2nd | 20 weeks | Anatomy ultrasound, fundal height, check for anaemia |
| 3rd | 26 weeks | Blood pressure, fundal height, IPTp 2nd dose |
| 4th | 30 weeks | Blood pressure, foetal position, birth plan discussion |
| 5th | 34 weeks | Blood pressure, haemoglobin, IPTp 3rd dose |
| 6th | 36 weeks | Confirm foetal position, check for pre-eclampsia |
| 7th | 38 weeks | Blood pressure, foetal movement check |
| 8th | 40 weeks | Final assessment, plan for delivery |

## Do Not Miss Visits

Missing visits means missing:
- Intermittent preventive treatment for malaria (IPTp), given at specific intervals
- Tetanus toxoid doses, which must be given on schedule
- Blood pressure monitoring; hypertensive disorders can develop silently
- Anaemia treatment; anaemia is a leading contributor to maternal death in Nigeria

## If You Miss a Visit

Tell your provider when you next attend. Do not skip the next visit because you missed one. They will assess what you missed and catch up where possible.`,
      },
    },
  },
];

export default articles;
