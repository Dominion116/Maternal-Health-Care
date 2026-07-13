import { Link } from 'react-router-dom'
import {
  Shield, Lock, Eye, Trash2, Download, Mail, Database, UserCheck,
  Globe, Clock, Baby, Scale, RefreshCw, Cookie, Server, AlertCircle,
} from 'lucide-react'
import { Badge } from '@/components/atoms/Badge'
import { TableOfContents } from '@/components/molecules/TableOfContents'
import { PageHero } from '@/components/layout/PageHero'
import { InfoBanner } from '@/components/molecules/InfoBanner'
import { ROUTES } from '@/utils/constants'

const tocSections = [
  { id: 'introduction', title: 'Introduction' },
  { id: 'info-collect', title: 'Information We Collect' },
  { id: 'how-we-use', title: 'How We Use Information' },
  { id: 'health-data', title: 'Health Data Handling' },
  { id: 'user-consent', title: 'User Consent' },
  { id: 'data-security', title: 'Data Security' },
  { id: 'cookies', title: 'Cookies & Tracking' },
  { id: 'third-party', title: 'Third-Party Services' },
  { id: 'user-rights', title: 'Your Rights' },
  { id: 'data-retention', title: 'Data Retention' },
  { id: 'children', title: "Children's Privacy" },
  { id: 'nigeria-compliance', title: 'Nigerian Healthcare Compliance' },
  { id: 'contact', title: 'Contact Information' },
  { id: 'updates', title: 'Updates to Policy' },
]

function Section({ id, icon: Icon, number, title, children }) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="flex items-start gap-4 mb-5">
        {Icon && (
          <span className="w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center shrink-0 mt-0.5">
            <Icon className="w-4.5 h-4.5 text-rose-600" aria-hidden />
          </span>
        )}
        <div>
          {number && <p className="text-xs font-semibold text-rose-600 uppercase tracking-wide mb-1">Section {number}</p>}
          <h2 className="font-display font-bold text-xl text-text-primary">{title}</h2>
        </div>
      </div>
      <div className="text-sm text-text-secondary leading-relaxed space-y-4 pl-0">{children}</div>
    </section>
  )
}

function Ul({ items }) {
  return (
    <ul className="space-y-2 mt-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0 mt-2" aria-hidden />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

function SubHeading({ children }) {
  return <p className="font-semibold text-text-primary mt-4 mb-1">{children}</p>
}

export default function PrivacyPage() {
  return (
    <div className="bg-warm-white min-h-screen">
      {/* Hero */}
      <PageHero
        badge="Legal Document"
        badgeVariant="sage"
        icon={Shield}
        iconBg="bg-sage-100"
        iconColor="text-sage-700"
        title="Privacy Policy"
        description="MamaGuide is committed to protecting your privacy and the confidentiality of your health information. This policy explains exactly what we collect, how we use it, and the rights you have over your data."
        meta="Last updated: May 2026 · Effective from project launch"
        gradient
      />

      {/* Summary cards */}
      <div className="max-w-6xl mx-auto px-4 pb-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {[
            { icon: Lock, color: 'bg-sage-100 text-sage-700', title: 'Data is encrypted', desc: 'JWT auth + HTTPS on all transmissions' },
            { icon: Eye, color: 'bg-blue-100 text-blue-700', title: 'Never sold', desc: 'Your data is never sold to advertisers' },
            { icon: Trash2, color: 'bg-red-100 text-red-700', title: 'Delete anytime', desc: 'Permanently erase your account in Settings' },
            { icon: Shield, color: 'bg-amber-100 text-amber-700', title: 'Research optional', desc: 'Evaluation study participation is voluntary' },
          ].map(item => (
            <div key={item.title} className="bg-white rounded-2xl border border-border p-4 flex items-start gap-3">
              <span className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${item.color}`} aria-hidden>
                <item.icon className="w-4.5 h-4.5" />
              </span>
              <div>
                <p className="font-semibold text-sm text-text-primary">{item.title}</p>
                <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Two-column: Content + TOC */}
        <div className="lg:flex lg:gap-12 lg:items-start">
          {/* Main content */}
          <div className="flex-1 min-w-0 space-y-10 divide-y divide-border">

            {/* Mobile TOC (hidden on desktop) */}
            <div className="lg:hidden">
              <TableOfContents sections={tocSections} variant="mobile" />
            </div>

            <div className="space-y-10">
              <Section id="introduction" number="1" icon={Shield} title="Introduction">
                <p>MamaGuide is a maternal health education chatbot developed as a Final Year Project. We understand that pregnancy is a deeply personal experience, and the health information you share with us is sensitive. This Privacy Policy governs how we handle all personal data collected through our platform.</p>
                <p>By creating an account and using MamaGuide, you agree to the practices described in this policy. If you do not agree, please do not use the service. We encourage you to read this policy in full.</p>
                <InfoBanner variant="health" title="Our core commitment">
                  Your health data is used only to provide you with accurate maternal health guidance. It is never used for commercial purposes, never sold, and never shared without your knowledge.
                </InfoBanner>
              </Section>

              <Section id="info-collect" number="2" icon={Database} title="Information We Collect">
                <SubHeading>Information you provide directly:</SubHeading>
                <Ul items={[
                  'Account information: your name, email address, and optional phone number provided at registration',
                  'Profile information: your pregnancy stage (1st/2nd/3rd trimester or postpartum) and language preference',
                  'Chat messages: the questions you send to MamaGuide and the responses you receive, stored to enable chat history',
                  'Survey responses: SUS questionnaire answers if you voluntarily participate in the research evaluation',
                  'Feedback: written comments or ratings you submit through the feedback form',
                ]} />
                <SubHeading>Information collected automatically:</SubHeading>
                <Ul items={[
                  'Usage data: which pages you visit and features you use, to improve MamaGuide\'s content and navigation',
                  'Device information: browser type and operating system; we do not collect your device\'s unique identity',
                  'Session data: login timestamps, stored securely on our servers using JWT tokens',
                  'Interaction patterns: how long you engage with education modules, used to improve content quality',
                ]} />
              </Section>

              <Section id="how-we-use" number="3" icon={UserCheck} title="How We Use Information">
                <p>We use your information strictly for purposes that benefit you or advance the academic goals of this project. Specifically, we use your data to:</p>
                <Ul items={[
                  'Provide and personalise the MamaGuide service based on your pregnancy stage',
                  'Process your questions and generate AI-powered responses using the MOTHER dataset and WHO guidelines',
                  'Save and display your conversation history so you can review past advice',
                  'Send account notifications such as email verification and password reset links',
                  'Analyse anonymised usage patterns to improve the system\'s accuracy and usability',
                  'Conduct academic research evaluation of the system, but only with your explicit prior consent',
                  'Improve education content recommendations based on what topics users engage with most',
                ]} />
                <InfoBanner variant="tip" title="We do not use your data for:">
                  Advertising, remarketing, profiling for commercial purposes, training commercial AI models, or any purpose not described in this policy.
                </InfoBanner>
              </Section>

              <Section id="health-data" number="4" icon={AlertCircle} title="Health Data Handling">
                <p>MamaGuide processes health-related information, including pregnancy stage, symptoms described in chat, and medical questions. We treat this data with the highest level of care.</p>
                <SubHeading>How we protect your health data:</SubHeading>
                <Ul items={[
                  'Health information is stored server-side, encrypted at rest, and never transmitted in plain text',
                  'Chat conversations containing health details are only accessible to you and authorised administrators',
                  'Administrators can view conversations only for safety monitoring, not for commercial analysis',
                  'Emergency-flagged conversations are reviewed to ensure the AI response was appropriate and safe',
                  'Health data is not used to train external AI models or sold to pharmaceutical or insurance companies',
                ]} />
                <InfoBanner variant="warning" title="Important health data reminder">
                  MamaGuide does not provide medical diagnoses. Your health data is used to improve our educational responses. Always consult a qualified healthcare professional for personal medical advice.
                </InfoBanner>
              </Section>

              <Section id="user-consent" number="5" icon={UserCheck} title="User Consent">
                <p>We rely on your informed consent before collecting or using your data in ways beyond the core service. Here is how consent works in MamaGuide:</p>
                <SubHeading>Implied consent (by using the service):</SubHeading>
                <Ul items={[
                  'Creating an account and using the chat implies consent to store your messages for service delivery',
                  'Using education modules implies consent to track anonymous engagement metrics',
                ]} />
                <SubHeading>Explicit consent (you choose):</SubHeading>
                <Ul items={[
                  'Research participation: you choose during onboarding whether to join the evaluation study',
                  'Survey submission: completing the SUS questionnaire is always optional',
                  'Marketing communications: we currently send no marketing emails',
                ]} />
                <p className="mt-2">You can withdraw consent for research participation at any time via Settings &gt; Privacy &gt; Research participation.</p>
              </Section>

              <Section id="data-security" number="6" icon={Lock} title="Data Security">
                <p>We implement multiple layers of security to protect your data:</p>
                <Ul items={[
                  'JWT (JSON Web Token) authentication: your session is cryptographically signed and verified on every request',
                  'bcrypt password hashing: your password is hashed with a salt factor of 12; we never store plain-text passwords',
                  'HTTPS/TLS encryption: all data between your browser and our servers is encrypted in transit',
                  'Role-based access control: only administrators can view conversation data; regular users see only their own data',
                  'Input sanitisation: all user inputs are validated to prevent injection attacks',
                  'Regular code reviews: security is reviewed throughout the development process as part of academic practice',
                ]} />
                <InfoBanner variant="info" title="Reporting a security issue">
                  If you discover a security vulnerability, please contact us immediately via the Contact page. We take all security reports seriously and will respond within 24 hours.
                </InfoBanner>
              </Section>

              <Section id="cookies" number="7" icon={Cookie} title="Cookies & Tracking">
                <p>MamaGuide uses minimal local storage and no third-party tracking:</p>
                <SubHeading>What we store locally (in your browser):</SubHeading>
                <Ul items={[
                  'Your authentication token (JWT), so you remain logged in across sessions',
                  'Your UI preferences, such as sidebar state, stored in localStorage',
                  'Your language preference, saved locally and on our server',
                ]} />
                <SubHeading>What we do NOT use:</SubHeading>
                <Ul items={[
                  'No Google Analytics or similar tracking services',
                  'No advertising cookies or remarketing pixels',
                  'No social media tracking (Facebook Pixel, Twitter tag, etc.)',
                  'No third-party cookies of any kind',
                ]} />
                <p className="mt-2">You can clear all local storage at any time via your browser settings. This will log you out of MamaGuide.</p>
              </Section>

              <Section id="third-party" number="8" icon={Globe} title="Third-Party Services">
                <p>MamaGuide is a self-contained academic system. We use minimal external services:</p>
                <Ul items={[
                  'Hosting infrastructure: the application is hosted on academic/personal infrastructure; no major cloud providers store your data',
                  'No third-party AI APIs: our AI model runs locally on our server; your chat data does not pass through OpenAI, Google, or similar services',
                  'No payment processors: MamaGuide is free; we collect no payment information',
                  'No social logins: we do not use "Sign in with Google/Facebook"; we build and manage our own authentication',
                ]} />
              </Section>

              <Section id="user-rights" number="9" icon={UserCheck} title="Your Rights">
                <p>Under applicable data protection principles (aligned with GDPR best practices and Nigerian data protection guidelines), you have the following rights:</p>
                <Ul items={[
                  'Right of access: view all your profile data and chat history within the app at any time',
                  'Right to rectification: update your name, email, and profile information in Settings',
                  'Right to erasure: permanently delete your account and all data via Settings > Privacy > Delete Account',
                  'Right to withdraw consent: opt out of research participation at any time via Settings > Privacy',
                  'Right to data portability: request a copy of your conversation history via Settings > Privacy > Export my data',
                  'Right to object: object to any processing of your data by contacting us through the Contact page',
                ]} />
              </Section>

              <Section id="data-retention" number="10" icon={Clock} title="Data Retention">
                <Ul items={[
                  'Your account and all associated data are retained while your account is active',
                  'If you delete your account, all personal data is permanently and irreversibly removed within 30 days',
                  'Anonymised, aggregated research statistics (e.g., average SUS scores) may be retained for academic publication; no individual data is identifiable in these summaries',
                  'Accounts inactive for 12 or more consecutive months may be deleted after 30 days\' prior email notice',
                  'Emergency escalation logs are retained for 12 months for safety audit purposes, then deleted',
                ]} />
              </Section>

              <Section id="children" number="11" icon={Baby} title="Children's Privacy">
                <p>MamaGuide is designed exclusively for:</p>
                <Ul items={[
                  'Pregnant women and new mothers aged 18 and above',
                  'Registered nurses and midwives in professional practice',
                  'Academic researchers and evaluators participating in the study',
                ]} />
                <p className="mt-2">We do not knowingly collect data from anyone under 18 years of age. If you believe a minor has created an account, please contact us immediately and we will remove the account and all associated data within 48 hours.</p>
              </Section>

              <Section id="nigeria-compliance" number="12" icon={Scale} title="Nigerian Healthcare Compliance">
                <p>MamaGuide is developed with awareness of the Nigerian healthcare landscape and data protection environment:</p>
                <Ul items={[
                  'Nigeria Data Protection Regulation (NDPR) 2019: we align our data practices with NDPR principles of lawfulness, fairness, and transparency',
                  'Federal Ministry of Health (FMOH) guidelines: our health content is based on FMOH maternal health protocols',
                  'NDPR requires that personal data collected must be for specific, legitimate purposes, and we comply with this requirement',
                  'We do not transfer your data outside Nigeria without adequate safeguards and your explicit consent',
                  'As an academic project, we are registered under university ethics approval which sets additional data protection standards',
                ]} />
              </Section>

              <Section id="contact" number="13" icon={Mail} title="Contact Information">
                <p>For any privacy-related questions, data requests, or concerns:</p>
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 mt-3">
                  <p className="font-semibold text-sm text-rose-800 mb-2">How to reach us:</p>
                  <Ul items={[
                    'Use the Contact page on MamaGuide for the fastest response',
                    'Privacy requests are typically handled within 2–3 business days',
                    'For urgent privacy matters (e.g., data breach concerns), we aim to respond within 24 hours',
                    'For account deletion requests via email, provide your registered email address for verification',
                  ]} />
                </div>
                <p className="mt-3">
                  <Link to={ROUTES.CONTACT} className="text-rose-700 font-semibold hover:underline">
                    Go to Contact page →
                  </Link>
                </p>
              </Section>

              <Section id="updates" number="14" icon={RefreshCw} title="Updates to This Policy">
                <p>We may update this Privacy Policy as MamaGuide develops or as legal requirements change. Our commitment to your privacy, however, will not change.</p>
                <Ul items={[
                  'Current version: May 2026',
                  'Significant changes will be communicated by email to all registered users',
                  'Minor clarifications may be made without direct notification, but the "Last updated" date will change',
                  'Continued use of MamaGuide after policy updates constitutes acceptance of the revised policy',
                  'Previous versions of the policy are available on request via our Contact page',
                ]} />
              </Section>
            </div>
          </div>

          {/* Desktop sticky TOC sidebar */}
          <aside className="hidden lg:block w-52 shrink-0 sticky top-24 self-start">
            <TableOfContents sections={tocSections} variant="desktop" />
          </aside>
        </div>

        {/* Footer CTA */}
        <div className="mt-12 flex items-center gap-3 p-5 bg-rose-50 border border-rose-200 rounded-2xl">
          <Mail className="w-5 h-5 text-rose-600 shrink-0" aria-hidden />
          <p className="text-sm text-text-secondary">
            Questions about this Privacy Policy?{' '}
            <Link to={ROUTES.CONTACT} className="text-rose-700 font-semibold hover:underline">Contact us</Link>
            {' '}and we will respond within 2–3 business days.
          </p>
        </div>
      </div>
    </div>
  )
}
