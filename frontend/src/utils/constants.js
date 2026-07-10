export const APP_NAME = 'MamaGuide'
export const APP_TAGLINE = 'Your trusted maternal health companion'
export const APP_DESCRIPTION =
  'AI-powered maternal health education chatbot for Nigerian pregnant women, nurses, and healthcare workers.'

export const ROLES = {
  PREGNANT_WOMAN: 'pregnant_woman',
  NURSE: 'nurse',
  ADMIN: 'admin',
  RESEARCHER: 'researcher',
}

export const ROLE_LABELS = {
  [ROLES.PREGNANT_WOMAN]: 'Pregnant Woman',
  [ROLES.NURSE]: 'ANC Nurse',
  [ROLES.ADMIN]: 'Administrator',
  [ROLES.RESEARCHER]: 'Researcher',
}

export const PREGNANCY_STAGES = {
  FIRST_TRIMESTER: 'first_trimester',
  SECOND_TRIMESTER: 'second_trimester',
  THIRD_TRIMESTER: 'third_trimester',
  POSTPARTUM: 'postpartum',
}

export const PREGNANCY_STAGE_LABELS = {
  [PREGNANCY_STAGES.FIRST_TRIMESTER]: '1st Trimester (Weeks 1-12)',
  [PREGNANCY_STAGES.SECOND_TRIMESTER]: '2nd Trimester (Weeks 13-26)',
  [PREGNANCY_STAGES.THIRD_TRIMESTER]: '3rd Trimester (Weeks 27-40)',
  [PREGNANCY_STAGES.POSTPARTUM]: 'Postpartum (After Birth)',
}

export const LANGUAGES = {
  EN: 'en',
  YO: 'yo',
  HA: 'ha',
  IG: 'ig',
}

export const LANGUAGE_LABELS = {
  [LANGUAGES.EN]: 'English',
  [LANGUAGES.YO]: 'Yoruba',
  [LANGUAGES.HA]: 'Hausa',
  [LANGUAGES.IG]: 'Igbo',
}

export const MESSAGE_TYPES = {
  USER: 'user',
  BOT: 'bot',
  SYSTEM: 'system',
  EMERGENCY: 'emergency',
}

export const CONFIDENCE_LEVELS = {
  HIGH: 'high',       // > 0.85
  MEDIUM: 'medium',   // 0.65–0.85
  LOW: 'low',         // < 0.65
}

export const EMERGENCY_KEYWORDS = [
  'bleeding', 'bleed', 'severe pain', 'can\'t breathe', 'not moving',
  'baby not moving', 'faint', 'unconscious', 'seizure', 'convulsion',
  'water broke', 'emergency', 'hospital now', 'danger', 'dying',
  'blood pressure', 'swelling', 'vision blurred', 'headache severe',
]

export const SUGGESTED_PROMPTS = {
  [PREGNANCY_STAGES.FIRST_TRIMESTER]: [
    'What foods should I eat in the first trimester?',
    'How many ANC visits do I need?',
    'Is it safe to exercise while pregnant?',
    'What vitamins should I take?',
    'What are the danger signs I should watch for?',
  ],
  [PREGNANCY_STAGES.SECOND_TRIMESTER]: [
    'When will I feel the baby move?',
    'What scans should I have at 20 weeks?',
    'How do I relieve back pain during pregnancy?',
    'What should I eat for my baby\'s development?',
    'How do I know if my baby is growing well?',
  ],
  [PREGNANCY_STAGES.THIRD_TRIMESTER]: [
    'How do I know when labour starts?',
    'What should I pack in my hospital bag?',
    'How many times should my baby kick per day?',
    'What is birth preparedness?',
    'When should I go to the hospital?',
  ],
  [PREGNANCY_STAGES.POSTPARTUM]: [
    'How do I breastfeed properly?',
    'What are signs of postpartum depression?',
    'When can I start family planning?',
    'How do I care for my newborn?',
    'What vaccinations does my baby need?',
  ],
  default: [
    'What is antenatal care?',
    'What are the signs of a healthy pregnancy?',
    'How do I register for ANC?',
    'What are the danger signs during pregnancy?',
    'Tell me about nutrition during pregnancy',
  ],
}

export const DISCLAIMER_TEXT =
  'MamaGuide provides educational information based on WHO guidelines and Nigerian ANC protocols. It does NOT replace professional medical advice. Always consult your healthcare provider for personal medical decisions.'

export const EMERGENCY_CONTACTS = {
  NATIONAL_EMERGENCY: '112',
  NPHCDA: '0800-NPHCDA',
  WHO_NIGERIA: '+234-9-461-7200',
}

export const LOCAL_STORAGE_KEYS = {
  AUTH_TOKEN: 'mamaguide_auth_token',
  USER: 'mamaguide_user',
  LANGUAGE: 'mamaguide_language',
  ONBOARDING_DONE: 'mamaguide_onboarding',
  THEME: 'mamaguide_theme',
  CHAT_HISTORY: 'mamaguide_chat_history',
  OTP_COOLDOWN_VERIFY: 'mamaguide_otp_cd_verify',
  OTP_COOLDOWN_RESET: 'mamaguide_otp_cd_reset',
  ACCESSIBILITY: 'mamaguide_accessibility',
}

export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

export const ROUTES = {
  // Public
  HOME: '/',
  ABOUT: '/about',
  FEATURES: '/features',
  HOW_IT_WORKS: '/how-it-works',
  RESOURCES: '/resources',
  FAQ: '/faq',
  CONTACT: '/contact',
  PRIVACY: '/privacy',
  TERMS: '/terms',
  ACCESSIBILITY: '/accessibility',

  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  VERIFY_EMAIL: '/auth/verify-email',
  EMAIL_VERIFIED: '/auth/email-verified',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  ACCEPT_INVITE: '/auth/accept-invite',
  PASSWORD_SUCCESS: '/auth/password-success',
  SESSION_EXPIRED: '/auth/session-expired',
  UNAUTHORIZED: '/auth/unauthorized',

  // Onboarding
  ONBOARDING: '/onboarding',
  ONBOARDING_ROLE: '/onboarding/role',
  ONBOARDING_PREGNANCY: '/onboarding/pregnancy',
  ONBOARDING_LANGUAGE: '/onboarding/language',
  ONBOARDING_NOTIFICATIONS: '/onboarding/notifications',
  ONBOARDING_CONSENT: '/onboarding/consent',

  // App
  DASHBOARD: '/app/dashboard',
  CHAT: '/app/chat',
  CHAT_HISTORY: '/app/chat/history',

  // Education
  EDUCATION: '/app/education',
  EDUCATION_TRIMESTER: '/app/education/trimester',
  EDUCATION_NUTRITION: '/app/education/nutrition',
  EDUCATION_DANGER_SIGNS: '/app/education/danger-signs',
  EDUCATION_ANC: '/app/education/anc',
  EDUCATION_VACCINES: '/app/education/vaccines',
  EDUCATION_MENTAL_HEALTH: '/app/education/mental-health',
  EDUCATION_BIRTH_PREP: '/app/education/birth-prep',
  EDUCATION_POSTPARTUM: '/app/education/postpartum',
  EDUCATION_BREASTFEEDING: '/app/education/breastfeeding',

  // Profile
  PROFILE: '/app/profile',
  PREGNANCY_PROFILE: '/app/profile/pregnancy',
  SETTINGS: '/app/settings',
  SETTINGS_NOTIFICATIONS: '/app/settings/notifications',
  SETTINGS_PRIVACY: '/app/settings/privacy',
  SETTINGS_LANGUAGE: '/app/settings/language',
  SETTINGS_ACCESSIBILITY: '/app/settings/accessibility',

  // Admin
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/users',
  ADMIN_CONVERSATIONS: '/admin/conversations',
  ADMIN_ANALYTICS: '/admin/analytics',
  ADMIN_SUS: '/admin/sus',
  ADMIN_FEEDBACK: '/admin/feedback',
  ADMIN_KNOWLEDGE: '/admin/knowledge',
  ADMIN_REPORTS: '/admin/reports',

  // Evaluation
  SUS_QUESTIONNAIRE: '/evaluation/sus',
  FEEDBACK: '/evaluation/feedback',
  RESEARCH_CONSENT: '/evaluation/consent',
  SURVEY_COMPLETE: '/evaluation/complete',

  // System
  NOT_FOUND: '/404',
  MAINTENANCE: '/maintenance',
  ERROR: '/error',
}
