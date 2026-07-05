import { EducationArticle } from '../../modules/education/education.types';

const articles: EducationArticle[] = [
  {
    id: 'postpartum-recovery',
    category: 'postpartum',
    slug: 'postnatal-recovery',
    tags: ['postpartum', 'recovery', 'after birth', 'postnatal', 'lochia'],
    source: 'WHO, FMOH Nigeria Postnatal Care Guidelines',
    updated_at: '2025-01-01',
    translations: {
      en: {
        title: 'Physical Recovery After Birth',
        summary:
          'Your body needs time to recover after delivery. Here is what to expect and how to care for yourself in the weeks after birth.',
        content: `## The First 24 Hours

- **Bleeding (lochia):** Heavy red bleeding is normal immediately after birth. You will be given oxytocin to help the uterus contract and reduce bleeding. Tell your provider immediately if bleeding soaks more than 1 pad per hour.
- **Afterpains:** Cramping as the uterus shrinks back to its normal size. This is stronger and more noticeable in women who have given birth before.
- **Perineum soreness:** If you had a tear or episiotomy, the area will be sore. Keep it clean and dry. Report signs of infection (increasing redness, swelling, pus, bad smell) to your provider.
- **Rest:** You have just done one of the most physically demanding things a human body can do. Rest as much as possible.

## Weeks 1–6

**Lochia (postnatal bleeding):**
- Days 1–4: bright red and heavy
- Days 5–10: pinkish-brown and lighter
- Weeks 2–6: yellowish-white and minimal
- If bleeding becomes heavy again after lightening, rest and contact your provider.

**Uterus:** Returns to its pre-pregnancy size by about 6 weeks.

**Caesarean section recovery:** If you had a C-section, avoid heavy lifting for 6 weeks. Keep the wound clean and dry. Signs of wound infection — redness, pus, opening of the wound — require immediate attention.

**Bowels:** It may take a few days to have a first bowel movement. Drink plenty of water and eat fibre-rich foods. Do not strain.

**Urination:** Some women have difficulty or discomfort urinating after birth. This usually resolves within a few days. If you have burning, fever, or difficulty, it may be a UTI — tell your provider.

## Rest and Support

- Accept help from family with household tasks and older children.
- Sleep when the baby sleeps — recovery requires rest.
- Do not resume heavy physical work for at least 6 weeks.`,
      },
    },
  },
  {
    id: 'postpartum-postnatal-visits',
    category: 'postpartum',
    slug: 'postnatal-care-visits',
    tags: ['postnatal care', 'PNC', 'after birth visits', 'check-up'],
    source: 'WHO Postnatal Care Guidelines 2013, FMOH Nigeria',
    updated_at: '2025-01-01',
    translations: {
      en: {
        title: 'Postnatal Care Visits — Why They Matter',
        summary:
          'Most maternal and newborn deaths happen in the first 48 hours after birth. Postnatal visits catch complications early.',
        content: `## The Recommended Postnatal Visit Schedule

| Visit | When | What Is Checked |
|-------|------|-----------------|
| 1st | Within 24 hours of birth | Bleeding, blood pressure, temperature, baby feeding, cord |
| 2nd | Day 3 (48–72 hours after birth) | Bleeding, breastfeeding, baby weight, jaundice, maternal mood |
| 3rd | Day 7–14 | Wound healing, baby growth, vaccinations, family planning |
| 4th | 6 weeks | Full postnatal check, baby 6-week immunisations, contraception |

**The first 24–48 hours are the highest risk period for both mother and baby.** Do not leave the facility too quickly after birth.

## What Postnatal Visits Include for the Mother

- Blood pressure measurement — hypertension can continue or start after birth
- Checking bleeding and uterus size
- Wound check (perineum or C-section)
- Breastfeeding support
- Mental health screening
- Family planning counselling and provision

## What Postnatal Visits Include for the Baby

- Weight measurement — babies lose up to 10% of birth weight in the first few days; they should regain it by 2 weeks
- Checking the umbilical cord stump — should be kept dry and will fall off in 7–14 days
- Checking for jaundice (yellow skin)
- Newborn hearing screen (available at some facilities)
- First immunisations if not given at birth

## Family Planning at 6 Weeks

Your provider will discuss contraception options. You can become pregnant again as early as 3 weeks after birth — even before your period returns and while breastfeeding. Discuss your preferred method at your 6-week visit.`,
      },
    },
  },
];

export default articles;
