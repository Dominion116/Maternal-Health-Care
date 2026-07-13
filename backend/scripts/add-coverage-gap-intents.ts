/**
 * Adds new intents for topics the Ghana dataset revealed as genuine gaps
 * (healthcare_access, medications, cultural, infections) that the 0.8
 * similarity matcher correctly recognised as not fitting any existing
 * intent. Also appends a few patterns to existing intents where the
 * matcher produced an obvious false negative (e.g. "What if I get
 * malaria?" not clearing 0.8 against the existing "Malaria and Pregnancy"
 * intent, which is a real, close match on inspection).
 *
 * Content rules followed here:
 *  - Ghana-specific place names (Accra, Kumasi, Cape Coast, Tema, Ho, Wa,
 *    Techiman) and institutions (CHPS compounds, Ghana Health Service) are
 *    generalised or replaced with Nigeria-appropriate equivalents (Primary
 *    Health Centres, General Hospitals, NHIA), never copied verbatim.
 *  - Drug/condition interaction questions (medications topic) are NOT
 *    answered with specific interaction facts, that would be fabricating
 *    unverified clinical guidance. The response consistently redirects to
 *    the user's ANC provider, which is the medically correct answer for
 *    "is X safe with my Y condition" regardless of what X and Y are.
 *
 * Run: npx tsx scripts/add-coverage-gap-intents.ts
 */
import * as fs from 'fs';
import * as path from 'path';

const INTENTS_PATH = path.join(__dirname, '..', 'src', 'ml', 'intents.json');

const NEW_INTENTS = [
  // ── healthcare_access ──────────────────────────────────────────────
  {
    tag: 'Choosing Where To Deliver',
    context_set: 'Facility birth vs traditional birth attendant',
    patterns: [
      'Where should I deliver my baby, at home with a traditional birth attendant or at a health facility?',
      'Is it safe to deliver at home?',
      'Should I use a traditional birth attendant?',
      'Can I give birth with a TBA instead of going to hospital?',
      'What are the risks of delivering at home?',
    ],
    responses: [
      "The WHO and Nigeria's Federal Ministry of Health strongly recommend delivering at a health facility with a skilled birth attendant present. A facility can respond immediately to complications like heavy bleeding, obstructed labour, or a baby in distress, which is much harder to manage safely at home. Traditional birth attendants play a valued role in many communities, but for safety, aim to have your delivery at a hospital or Primary Health Centre, and discuss your birth plan with your ANC provider in advance.",
    ],
  },
  {
    tag: 'What Is A Primary Health Centre',
    context_set: 'Local health facility types in Nigeria',
    patterns: [
      'What is a Primary Health Centre and what services do they provide?',
      'What is a PHC?',
      'What services can I get at a health centre near me?',
      'Do I need to go to a big hospital for antenatal care?',
    ],
    responses: [
      'A Primary Health Centre (PHC) is usually the closest and most accessible place for routine antenatal care, immunisations, and normal deliveries in Nigeria. They can handle uncomplicated pregnancies and refer you to a General or Teaching Hospital if you need specialist care or have a high-risk pregnancy. Ask your local PHC what services they offer; most provide free or low-cost ANC visits, tests, and vaccinations.',
    ],
  },
  {
    tag: 'Finding Health Facilities Near Me',
    context_set: 'Locating tests and facilities',
    patterns: [
      'Where can I get a blood test done?',
      'Where can I get tested for HIV?',
      'Where can I find a government hospital near me?',
      'How do I find a health facility near me?',
      'Where can I get a pregnancy test done?',
    ],
    responses: [
      "I don't have information about specific facilities in your area, but your nearest Primary Health Centre or General Hospital can carry out routine pregnancy tests, blood tests, and HIV testing, usually for free or a small fee. If you're not sure where your nearest facility is, ask at your local government area (LGA) health office, or ask a community health worker.",
    ],
  },
  {
    tag: 'Cost of Delivery and Health Insurance in Nigeria',
    context_set: 'Delivery cost and NHIA coverage',
    patterns: [
      'How much does delivery cost?',
      'Is delivery free at government hospitals?',
      'Does health insurance cover pregnancy in Nigeria?',
      'What is NHIA and does it cover maternal care?',
      'How can I pay for antenatal care and delivery?',
    ],
    responses: [
      "Costs vary by state and facility; some states run free or subsidised maternal and child health programmes at government facilities. Nigeria's National Health Insurance Authority (NHIA) and various state health insurance schemes can help cover ANC and delivery costs if you're enrolled. Ask at your local Primary Health Centre or State Ministry of Health about what's available and free in your area, don't assume delivery is free everywhere without checking first.",
    ],
  },
  // ── medications (interaction-safety questions, deliberately generic) ─
  {
    tag: 'Supplement or Medication Safety With Existing Conditions',
    context_set: 'Whether a supplement or medication is safe given a pre-existing condition',
    patterns: [
      'Is it safe to take this supplement with my existing condition?',
      'Is iron safe with high blood pressure?',
      'Is folic acid safe with heart disease?',
      'Do I need more of a supplement because of sickle cell disease?',
      'Is a vitamin safe with thyroid problems?',
      'What medications are safe if I have hepatitis B?',
      'Is a supplement safe with diabetes?',
      'Should my supplement dose change because of a health condition I have?',
    ],
    responses: [
      "Whether a supplement or medication is safe, and at what dose, can genuinely change if you have a condition like sickle cell disease, diabetes, thyroid problems, heart disease, or hepatitis B. This isn't something to guess from general information: bring your full medical history to your ANC visit so your provider can personalise your supplement and medication plan safely.",
    ],
  },
  // ── cultural ──────────────────────────────────────────────────────
  {
    tag: 'Traditional Beliefs About Pregnancy Foods',
    context_set: 'Cultural food taboos during pregnancy',
    patterns: [
      'My mother-in-law says I should not eat eggs during pregnancy. Is this true?',
      'Are there foods I should avoid because of tradition, not medical reasons?',
      'Is it true that certain foods will make delivery difficult?',
      'Should I follow food taboos my family believes in?',
      'Are traditional food restrictions during pregnancy real?',
    ],
    responses: [
      "Many families across Nigeria hold beliefs about foods to avoid in pregnancy, and most of these are cultural rather than medically necessary; eggs, for example, are a safe and valuable source of protein in pregnancy. What matters most medically is eating a varied, balanced diet. If a specific food genuinely causes you discomfort or you're unsure about one, it's fine to raise it with your ANC provider, they can tell you what's medically necessary to avoid versus what's a cultural preference.",
    ],
  },
  {
    tag: 'Postpartum Confinement Traditions',
    context_set: 'Traditional rest periods after birth',
    patterns: [
      'What is the tradition of resting for weeks after birth?',
      'Should I stay indoors for weeks after delivery?',
      'Is the traditional confinement period after birth medically useful?',
      'My family wants me to rest at home for over a month after birth, is that necessary?',
    ],
    responses: [
      'Many Nigerian cultures have a tradition of extended rest and family support in the weeks after birth. This actually lines up well with medical advice: your body needs real rest to recover, and having support with the baby and household matters. The one thing to make sure of is that this tradition doesn\'t delay your postnatal check-ups (at day 3, day 7-10, and 6 weeks) or your baby\'s early vaccinations, those should still happen on schedule even while you\'re resting at home.',
    ],
  },
  {
    tag: 'Naming Ceremonies and Newborn Traditions',
    context_set: 'Naming ceremony timing and newborn health',
    patterns: [
      'When is the naming ceremony usually held?',
      'Will a naming ceremony affect my baby\'s health checks?',
      'How do I balance a naming ceremony with newborn care?',
    ],
    responses: [
      "Naming ceremonies are an important tradition in many Nigerian families, usually held within the first week or two of life depending on your culture. Just make sure the celebration doesn't push back your baby's early postnatal check, cord care, or first vaccinations, those are time-sensitive and worth keeping on schedule even during ceremony preparations.",
    ],
  },
  {
    tag: 'Balancing Traditional Practices and Medical Care',
    context_set: 'General guidance on tradition vs medical advice',
    patterns: [
      "Should I follow my elders' advice about pregnancy?",
      'How do I balance traditional and modern maternal care?',
      'Are traditional practices during pregnancy safe?',
      'Is it okay to combine traditional remedies with hospital care?',
    ],
    responses: [
      "Many traditional practices are safe and culturally meaningful, and there's no need to abandon them. The important thing is to keep attending your ANC visits and not let any single tradition replace medical care, especially anything involving unverified herbal remedies, restrictive diets, or delays in seeking help for danger signs. If you're ever unsure whether something is safe, ask your ANC provider directly, most are happy to discuss cultural practices with you.",
    ],
  },
  // ── infections (genuinely novel ones only; others get pattern appends below) ─
  {
    tag: 'Chickenpox Exposure During Pregnancy',
    context_set: 'Chickenpox exposure risk in pregnancy',
    patterns: [
      'I was exposed to chickenpox during pregnancy, what should I do?',
      'Is chickenpox dangerous during pregnancy?',
      "What happens if I've never had chickenpox and I'm pregnant?",
    ],
    responses: [
      "If you're pregnant and think you've been exposed to chickenpox and are not sure you've had it before, contact your ANC provider promptly. Chickenpox can be more serious during pregnancy for both you and your baby, especially depending on the trimester, and your provider may recommend a test or preventive treatment. Don't wait for a rash to appear before seeking advice.",
    ],
  },
  {
    tag: 'Group B Strep',
    context_set: 'What Group B Strep is and why it is tested for',
    patterns: [
      'What is Group B Strep?',
      'Do I need to be tested for Group B Strep?',
      'How does Group B Strep affect my baby during delivery?',
    ],
    responses: [
      "Group B Streptococcus (GBS) is a common bacterium that many women carry without symptoms, but it can be passed to the baby during delivery and, in rare cases, cause serious infection in a newborn. Ask your ANC provider whether GBS testing is available and recommended for you; if you test positive, antibiotics during labour usually prevent transmission to your baby.",
    ],
  },
  {
    tag: 'COVID Vaccine During Pregnancy',
    context_set: 'COVID-19 vaccination safety in pregnancy',
    patterns: [
      'Is the COVID vaccine safe during pregnancy?',
      'Should I get vaccinated against COVID while pregnant?',
      'Can I take a COVID booster while breastfeeding?',
    ],
    responses: [
      'The WHO recommends COVID-19 vaccination for pregnant women, as pregnancy can increase the risk of severe illness from COVID-19. Vaccination is also considered safe while breastfeeding. Discuss timing and which vaccine is available with your ANC provider.',
    ],
  },
];

// Manual pattern appends for questions that are clear matches to existing
// intents but scored below the 0.8 auto-merge threshold.
const MANUAL_APPENDS: Record<string, string[]> = {
  'Malaria and Pregnancy': [
    'What if I get malaria while pregnant?',
    'How often should I take IPTp for malaria prevention?',
  ],
  'HIV and Pregnancy': ['How is HIV managed during pregnancy?'],
  'Tetanus Toxoid (TT) Injections During Pregnancy': ['Do I need a tetanus vaccine during pregnancy?'],
  'Pain or Burning During Urination': [
    'What are the symptoms of a UTI during pregnancy?',
    'How can I prevent UTIs during pregnancy?',
  ],
};

interface IntentDef {
  tag: string;
  context_set?: string;
  patterns: string[];
  responses: string[];
}

function main() {
  const raw = fs.readFileSync(INTENTS_PATH, 'utf-8');
  const data: { intents: IntentDef[] } = JSON.parse(raw);

  const existingTags = new Set(data.intents.map((i) => i.tag));
  const toAdd = NEW_INTENTS.filter((i) => !existingTags.has(i.tag));
  data.intents.push(...toAdd);

  let appended = 0;
  for (const [tag, patterns] of Object.entries(MANUAL_APPENDS)) {
    const intent = data.intents.find((i) => i.tag === tag);
    if (!intent) {
      console.warn(`WARNING: manual-append target tag not found: ${tag}`);
      continue;
    }
    const existingNorm = new Set(intent.patterns.map((p) => p.trim().toLowerCase()));
    for (const p of patterns) {
      if (!existingNorm.has(p.trim().toLowerCase())) {
        intent.patterns.push(p);
        appended++;
      }
    }
  }

  fs.writeFileSync(INTENTS_PATH, JSON.stringify(data, null, 4), 'utf-8');

  console.log(`Added ${toAdd.length} new coverage-gap intents: ${toAdd.map((i) => i.tag).join(', ')}`);
  console.log(`Appended ${appended} manual patterns to existing intents.`);
  console.log(`Total intents now: ${data.intents.length}`);
}

main();
