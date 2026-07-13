import { EducationArticle } from '../../modules/education/education.types';

const articles: EducationArticle[] = [
  {
    id: 'danger-signs-pregnancy',
    category: 'danger-signs',
    slug: 'pregnancy-danger-signs',
    tags: ['danger signs', 'emergency', 'complications', 'warning signs'],
    source: 'WHO, FMOH Nigeria Safe Motherhood',
    updated_at: '2025-01-01',
    translations: {
      en: {
        title: 'Danger Signs During Pregnancy',
        summary:
          'Know these warning signs. If you experience any of them, go to a hospital immediately; do not wait.',
        content: `## Go to Hospital IMMEDIATELY for Any of These

### Heavy Vaginal Bleeding
Any bleeding heavier than a period, with or without pain. Can signal placenta praevia, placental abruption, or miscarriage.

### Severe Abdominal Pain
Constant, severe pain that does not ease. Different from normal stretching or Braxton Hicks.

### Severe Headache
A sudden, very severe headache, especially with visual disturbances, can be a sign of pre-eclampsia or stroke.

### Swelling of Face or Hands
Some ankle swelling is normal late in pregnancy. But sudden swelling of the face or hands, especially with headache or blurred vision, is a danger sign of pre-eclampsia.

### Blurred Vision or Seeing Spots
A symptom of dangerously high blood pressure (pre-eclampsia/eclampsia). Call for help immediately.

### Convulsions or Fits
Seizures in pregnancy (eclampsia) are a life-threatening emergency. Lay the woman on her left side and get to hospital immediately.

### Fever With or Without Chills
High fever can indicate severe malaria, urinary tract infection, or other serious infections that can cause preterm labour.

### Difficulty Breathing or Chest Pain
Can indicate severe anaemia, pulmonary embolism, or heart problems.

### Baby Has Stopped Moving
From 28 weeks, if you count fewer than 10 movements in 2 hours after a meal, go to hospital. Do not wait until the next day.

### Leaking Fluid From the Vagina Before 37 Weeks
May indicate premature rupture of membranes, with risk of cord prolapse and infection.

## What to Do

1. **Do not wait**; these signs can worsen rapidly.
2. Go to the nearest hospital with maternity services.
3. Bring your **ANC card**.
4. If you cannot get to hospital, call **112** (Nigeria national emergency line).`,
      },
    },
  },
  {
    id: 'danger-signs-postpartum',
    category: 'danger-signs',
    slug: 'postpartum-danger-signs',
    tags: ['postpartum', 'danger signs', 'after birth', 'emergency'],
    source: 'WHO, FMOH Nigeria',
    updated_at: '2025-01-01',
    translations: {
      en: {
        title: 'Danger Signs After Birth',
        summary:
          'Complications can develop in the first days and weeks after delivery. Know these signs and act immediately.',
        content: `## Danger Signs in the Mother

### Heavy Bleeding (Postpartum Haemorrhage)
Soaking more than one pad per hour, passing large clots, or feeling faint. **Most maternal deaths in Nigeria occur from postpartum haemorrhage.** Go to hospital immediately.

### High Fever (Above 38°C / 100.4°F)
In the first week after birth, fever often indicates uterine infection (endometritis) or wound infection. Do not ignore it.

### Foul-Smelling Vaginal Discharge
Normal lochia (postnatal bleeding) is red for a few days then becomes pink and then yellowish-white. If it smells foul, infection is likely.

### Swollen, Red, or Painful Legs
Deep vein thrombosis (DVT), a blood clot, can occur after delivery. One leg more swollen or painful than the other is a warning sign.

### Difficulty Urinating or Burning When Urinating
Urinary tract infections are common after birth. Treat promptly; untreated UTIs can reach the kidneys.

### Signs of Pre-eclampsia Continuing After Birth
Headache, blurred vision, or high blood pressure can persist up to 6 weeks postpartum. Attend your postnatal visits.

## Danger Signs in the Newborn

- Not breathing or breathing very fast (more than 60 breaths per minute)
- Skin colour is blue or very pale
- Not feeding at all after 2 attempts
- Convulsions or fits
- Very high or very low body temperature
- Yellow skin (jaundice) appearing in the first 24 hours or very deep yellow at any time
- Umbilical cord area is red, swollen, or smells bad

**Any of these in a newborn requires immediate hospital care.**`,
      },
    },
  },
];

export default articles;
