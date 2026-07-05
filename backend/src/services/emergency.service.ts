import { Language } from '../types';

// Mirrors EMERGENCY_KEYWORDS in the frontend constants.
// Keyword matching is intentionally broad — false positives are safe,
// false negatives in an emergency are not.
const EMERGENCY_KEYWORDS = [
  'bleeding', 'bleed',
  'severe pain',
  "can't breathe", 'cannot breathe', 'difficulty breathing',
  'not moving', 'baby not moving', 'fetal movement',
  'faint', 'fainting', 'unconscious',
  'seizure', 'convulsion',
  'water broke', 'waters broke',
  'emergency',
  'danger', 'dying',
  'vision blurred', 'blurred vision',
  'severe headache', 'headache severe',
  'heavy bleeding',
  'swelling face', 'swelling hands',
  'chest pain',
];

export interface EmergencyCheck {
  isEmergency: boolean;
  detectedKeyword: string | null;
}

export function checkEmergency(message: string): EmergencyCheck {
  const lower = message.toLowerCase();
  const hit = EMERGENCY_KEYWORDS.find((kw) => lower.includes(kw));
  return { isEmergency: !!hit, detectedKeyword: hit ?? null };
}

// ---------------------------------------------------------------------------
// Pre-built responses — bilingual so they're always understood.
// The model is bypassed entirely for speed and reliability.
// ---------------------------------------------------------------------------

const EMERGENCY_RESPONSE_EN =
  '🚨 **This sounds like a medical emergency.**\n\n' +
  'Please **stop reading and act immediately**:\n\n' +
  '1. **Call emergency services: 112** (Nigeria national emergency line)\n' +
  '2. Go to the **nearest hospital or maternity/labour ward** right now\n' +
  '3. If you cannot go yourself, call someone who can take you immediately\n\n' +
  "_Do not wait for this chat to help you further. Your life and your baby's life matter most._\n\n" +
  '**Other emergency contacts:**\n' +
  '- WHO Nigeria: +234-9-461-7200\n' +
  '- Federal Ministry of Health: 0800-CALL-FMH';

const EMERGENCY_RESPONSES: Record<Language, string> = {
  en: EMERGENCY_RESPONSE_EN,

  yo:
    '🚨 **Eyi dabi ìpayà ìlera tó le gan-an.**\n\n' +
    'Jọwọ **dẹkun kíkà kí o sì ṣe ìgbésẹ lẹ́sẹ̀kẹsẹ̀**:\n\n' +
    '1. **Pe ìpèsẹ ìpayà: 112**\n' +
    '2. Lọ sí **ilé-ìwòsàn tó súnmọ́ rẹ tàbí ẹka ìbímọ** báyìí\n' +
    '3. Tí o kò bá lè lọ, pe ẹnìkan tí yóò mú ọ lọ lẹ́sẹ̀kẹsẹ̀\n\n' +
    '_This sounds like a medical emergency — please call 112 or go to the nearest hospital immediately._',

  ha:
    '🚨 **Wannan na iya zama gaggawa na lafiya.**\n\n' +
    'Don Allah **daina karantawa ka ɗauki matakin yanzu haka**:\n\n' +
    '1. **Kira ayyukan gaggawa: 112**\n' +
    '2. Je zuwa **asibiti ko ɗakin haihuwa mafi kusa** yanzu\n' +
    '3. Idan ba za ka iya zuwa da kanka ba, kira wanda zai kai ka nan da nan\n\n' +
    '_This sounds like a medical emergency — please call 112 or go to the nearest hospital immediately._',

  ig:
    '🚨 **Nke a dị ka ihe mberede ahụike.**\n\n' +
    'Biko **kwụsị ịgụ ma mezie ozugbo**:\n\n' +
    '1. **Kpọọ ọrụ mberede: 112**\n' +
    '2. Gaa **ụlọ ọgwụ ma ọ bụ ọnọdụ ọmụmụ nke dị nso** ugbu a\n' +
    '3. Ọ bụrụ na i enweghị ike iga onwe gị, kpọọ onye ga-ewetara gị ozugbo\n\n' +
    '_This sounds like a medical emergency — please call 112 or go to the nearest hospital immediately._',
};

export function buildEmergencyResponse(language: Language): string {
  return EMERGENCY_RESPONSES[language] ?? EMERGENCY_RESPONSES.en;
}
