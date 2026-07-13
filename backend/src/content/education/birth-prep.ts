import { EducationArticle } from '../../modules/education/education.types';

const articles: EducationArticle[] = [
  {
    id: 'birth-prep-plan',
    category: 'birth-prep',
    slug: 'birth-preparedness-plan',
    tags: ['birth plan', 'birth preparedness', 'labour', 'delivery'],
    source: 'FMOH Nigeria, WHO',
    updated_at: '2025-01-01',
    translations: {
      en: {
        title: 'Making a Birth Preparedness Plan',
        summary:
          'A birth preparedness plan helps you and your family know what to do when labour starts. Make yours before 36 weeks.',
        content: `## What Is a Birth Preparedness Plan?

A birth preparedness plan (also called a complication readiness plan) is a set of decisions you make in advance so that when labour begins, or if an emergency occurs, everyone knows what to do. **Discuss it with your family and your ANC provider by 36 weeks.**

## Your Plan Should Answer These Questions

### Where will you give birth?
- Choose a health facility with a skilled birth attendant (midwife, nurse, or doctor).
- Identify the facility and know how to get there.
- Know the back-up facility if the first is full or cannot help.

### Who will go with you?
- A birth companion (partner, mother, trusted person) reduces complications and improves experience.
- Tell them in advance; they should be reachable any time of day or night.

### How will you get there?
- Arrange transport in advance. Identify two options (e.g., a neighbour with a car + a motorcycle taxi).
- Labour often starts at night. Have the driver's phone number saved.

### Who will care for your other children?
- Arrange childcare in advance so it is not a source of panic during labour.

### Do you have money set aside?
- Even at free government facilities, you may need money for medications, transport, or unexpected items.
- Many states have a Basic Health Care Provision Fund; ask your ANC provider what is covered.

### Do you have blood donors identified?
- Blood transfusion can save lives in postpartum haemorrhage.
- Identify 1–2 family members who can donate blood if needed. Know their blood group.

## Pack Your Bag Early

Pack your hospital bag by **36 weeks**. See the 'What to Pack in Your Hospital Bag' article.`,
      },
    },
  },
  {
    id: 'birth-prep-hospital-bag',
    category: 'birth-prep',
    slug: 'hospital-bag',
    tags: ['hospital bag', 'labour', 'delivery', 'what to pack'],
    source: 'FMOH Nigeria, NHS',
    updated_at: '2025-01-01',
    translations: {
      en: {
        title: 'What to Pack in Your Hospital Bag',
        summary:
          'Pack your bag by 36 weeks. This list covers everything you and your baby will need.',
        content: `## For You (the Mother)

**Documents**
- ANC card (most important; do not forget this)
- National ID or voter's card
- Health insurance card (if you have one)

**Clothing**
- 2–3 loose, comfortable gowns or wrappers for labour and recovery
- Underwear (old ones you do not mind disposing of)
- Comfortable footwear (flip-flops)
- Warm shawl or light cardigan

**Hygiene**
- Sanitary pads (maternity/heavy flow); you will need many
- Toiletries: soap, sponge, toothbrush, toothpaste
- Small towel

**Food and Water**
- Light snacks and water for labour (facilities may not provide meals immediately)
- Money for any expenses

## For Your Baby

- 3–5 baby vests or onesies (newborn size)
- 2–3 baby blankets or wraps
- Nappies (or soft cloths)
- Baby hat and socks (newborns lose heat quickly)
- Baby soap and cotton wool

## What NOT to Bring

- Expensive jewellery or large amounts of cash
- Items you cannot afford to lose

## Tips

- Pack the bag and tell your birth companion where it is stored.
- The ANC card must be in the bag immediately; do not add it at the last minute.
- Review the bag at 36 weeks and again at 38 weeks.`,
      },
    },
  },
  {
    id: 'birth-prep-signs-of-labour',
    category: 'birth-prep',
    slug: 'signs-of-labour',
    tags: ['labour', 'contractions', 'signs of labour', 'waters breaking'],
    source: 'FMOH Nigeria, WHO, Royal College of Obstetricians',
    updated_at: '2025-01-01',
    translations: {
      en: {
        title: 'Signs of Labour: When to Go to Hospital',
        summary:
          'Knowing the difference between true labour and false alarms helps you act at the right time.',
        content: `## Early Signs That Labour May Be Near

These signs mean labour could start in hours or days, not necessarily that you need to go to hospital right now:

- **Lightening**: the baby drops lower in your pelvis. You may breathe more easily but need to urinate more.
- **Bloody show**: a pink or blood-tinged mucus discharge as the cervical plug loosens. Normal.
- **Loose stools**: the body sometimes clears itself before labour.
- **Nesting urge**: a sudden burst of energy and desire to prepare the home.

## Signs That Labour Has Started: Go to Hospital

### Regular Contractions
Contractions that:
- Come at regular intervals and get **closer together**
- Last **45–60 seconds or longer**
- Get **stronger over time** and do not ease with changing position or walking
- The rule: contractions **5 minutes apart, lasting 60 seconds, for 1 hour**

### Waters Breaking (Rupture of Membranes)
A gush or trickle of clear or pale yellow fluid from the vagina. This is the amniotic sac breaking.
- **Go to hospital immediately**, even if you have no contractions yet.
- Note the time, colour (should be clear or pale, not green or brown), and smell.
- Green or brown fluid means the baby has passed meconium; tell the hospital staff immediately on arrival.

### Bloody Show With Contractions
Blood-tinged mucus with regular contractions means active labour is starting.

## Go to Hospital IMMEDIATELY (Even Without Contractions) If

- Your waters break
- You have heavy bleeding (more than a period)
- The baby stops moving
- You have a severe headache, blurred vision, or fits`,
      },
    },
  },
];

export default articles;
