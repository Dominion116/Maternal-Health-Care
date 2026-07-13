import { Link } from 'react-router-dom'
import {
  FileText, AlertTriangle, Mail, BookOpen, User, Bot, Shield,
  Scale, Lock, Zap, Cpu, XCircle, RefreshCw, Phone,
} from 'lucide-react'
import { TableOfContents } from '@/components/molecules/TableOfContents'
import { PageHero } from '@/components/layout/PageHero'
import { InfoBanner } from '@/components/molecules/InfoBanner'
import { Badge } from '@/components/atoms/Badge'
import { ROUTES } from '@/utils/constants'

const tocSections = [
  { id: 'acceptance', title: 'Acceptance of Terms' },
  { id: 'medical-disclaimer', title: 'Medical Disclaimer' },
  { id: 'educational-use', title: 'Educational Use Only' },
  { id: 'user-responsibilities', title: 'User Responsibilities' },
  { id: 'ai-limitations', title: 'AI Limitations' },
  { id: 'emergency', title: 'Emergency Situations' },
  { id: 'intellectual-property', title: 'Intellectual Property' },
  { id: 'user-conduct', title: 'User Conduct' },
  { id: 'account-security', title: 'Account Security' },
  { id: 'termination', title: 'Termination' },
  { id: 'liability', title: 'Limitation of Liability' },
  { id: 'governing-law', title: 'Governing Law' },
  { id: 'contact', title: 'Contact Information' },
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
          <p className="text-xs font-semibold text-rose-600 uppercase tracking-wide mb-1">Section {number}</p>
          <h2 className="font-display font-bold text-xl text-text-primary">{title}</h2>
        </div>
      </div>
      <div className="text-sm text-text-secondary leading-relaxed space-y-4">{children}</div>
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

export default function TermsPage() {
  return (
    <div className="bg-warm-white min-h-screen">
      <PageHero
        badge="Legal Document"
        badgeVariant="info"
        icon={FileText}
        iconBg="bg-blue-100"
        iconColor="text-blue-600"
        title="Terms of Service"
        description="Please read these terms carefully before using MamaGuide. By accessing our service, you agree to be bound by these terms and our Privacy Policy."
        meta="Last updated: May 2026 · Governed by Nigerian law"
        gradient
      />

      <div className="max-w-6xl mx-auto px-4 pb-16">
        {/* Critical disclaimer banner */}
        <div className="mb-10">
          <InfoBanner
            variant="error"
            title="Critical Medical Disclaimer: Please Read First"
            icon={AlertTriangle}
          >
            <p>
              <strong>MamaGuide is not a medical device and does not provide medical diagnoses or prescriptions.</strong>{' '}
              All content is for educational and informational purposes only. Always consult a qualified healthcare professional (a doctor, midwife, or nurse) for personal medical advice.
            </p>
            <p className="mt-2">
              <strong>In any pregnancy emergency</strong>, stop using the app and call{' '}
              <a href="tel:112" className="font-bold underline">112</a>{' '}
              or go to your nearest hospital immediately. Do not rely on MamaGuide in emergencies.
            </p>
          </InfoBanner>
        </div>

        <div className="lg:flex lg:gap-12 lg:items-start">
          <div className="flex-1 min-w-0 space-y-10 divide-y divide-border">

            <div className="lg:hidden">
              <TableOfContents sections={tocSections} variant="mobile" />
            </div>

            <div className="space-y-10">
              <Section id="acceptance" number="1" icon={FileText} title="Acceptance of Terms">
                <p>By creating an account or using MamaGuide, you agree to be bound by these Terms of Service ("Terms") and our Privacy Policy. If you do not agree with any part of these Terms, please do not use the service.</p>
                <p>These terms apply to all users, including:</p>
                <Ul items={[
                  'Pregnant women and new mothers using MamaGuide for health education',
                  'Nurses, midwives, and healthcare workers using MamaGuide for clinical reference',
                  'Researchers and academic evaluators participating in the study',
                  'Any other individual who accesses or uses MamaGuide',
                ]} />
                <p>We reserve the right to modify these Terms at any time. Continued use of MamaGuide after changes are posted constitutes acceptance of the revised Terms.</p>
              </Section>

              <Section id="medical-disclaimer" number="2" icon={AlertTriangle} title="Medical Disclaimer">
                <InfoBanner variant="error" title="This is the most important section of these Terms.">
                  MamaGuide is an educational chatbot; it is NOT a substitute for professional medical advice, diagnosis, or treatment.
                </InfoBanner>
                <p className="mt-4">Specifically:</p>
                <Ul items={[
                  'MamaGuide does not diagnose medical conditions, diseases, or pregnancy complications',
                  'MamaGuide does not prescribe medications, supplements, or treatment plans',
                  'MamaGuide does not replace ANC visits, ultrasound scans, or clinical assessments',
                  'Responses from MamaGuide are generated by an AI trained on maternal health literature, so they may not apply to your specific clinical situation',
                  'Always tell your doctor or midwife about any symptoms you experience; do not rely solely on MamaGuide\'s response',
                ]} />
                <p className="mt-2">The creators of MamaGuide accept no medical liability for actions taken based on responses from the system.</p>
              </Section>

              <Section id="educational-use" number="3" icon={BookOpen} title="Educational Use Only">
                <p>MamaGuide is developed as a Final Year Project for academic evaluation purposes. Its purpose is to:</p>
                <Ul items={[
                  'Provide evidence-based maternal health education, based on WHO ANC guidelines and FMOH Nigeria protocols',
                  'Reduce health information gaps for pregnant women in Nigeria who may lack access to timely expert advice',
                  'Demonstrate the potential of AI in maternal healthcare through academic research',
                  'Evaluate usability using the System Usability Scale (SUS) methodology',
                ]} />
                <p className="mt-2">MamaGuide is not a commercial medical product. It is not approved, licensed, or regulated by the Nigerian Medical and Dental Council (MDCN), NAFDAC, or any other health regulatory body.</p>
                <InfoBanner variant="tip" title="How to use MamaGuide correctly">
                  Use MamaGuide to learn about pregnancy topics, understand what to expect at ANC visits, and know which warning signs require urgent care. Then discuss with your healthcare provider.
                </InfoBanner>
              </Section>

              <Section id="user-responsibilities" number="4" icon={User} title="User Responsibilities">
                <p>By using MamaGuide, you agree to:</p>
                <Ul items={[
                  'Provide accurate information during registration, including your role and pregnancy stage',
                  'Maintain the confidentiality of your login credentials',
                  'Use the service only for its intended educational purpose',
                  'Not use MamaGuide to replace professional medical consultations',
                  'Seek immediate medical attention for any symptoms that concern you; do not wait for an AI response',
                  'Report any inaccurate or harmful content you encounter via the feedback or contact feature',
                  'Respect the privacy of others; do not share other users\' information',
                  'Not attempt to hack, reverse-engineer, or disrupt the MamaGuide system',
                ]} />
              </Section>

              <Section id="ai-limitations" number="5" icon={Cpu} title="AI Limitations">
                <p>MamaGuide uses a feedforward neural network trained on the MOTHER dataset and WHO guidelines. You should understand its limitations:</p>
                <Ul items={[
                  'The AI may occasionally produce incorrect, outdated, or incomplete information',
                  'Confidence scores shown in responses indicate the system\'s certainty; lower confidence warrants extra caution',
                  'The AI cannot examine you physically, run laboratory tests, or interpret ultrasound results',
                  'The AI\'s training data is limited to its training period, so very recent medical developments may not be reflected',
                  'The AI responds in English only; Pidgin, Yoruba, Hausa, and Igbo support are planned but not yet available',
                  'Response quality depends on how clearly you phrase your question, so provide as much relevant detail as possible',
                ]} />
                <InfoBanner variant="warning" title="When to be especially cautious">
                  Do not rely on MamaGuide for questions about medications, dosages, allergies, or any symptom that has been worsening. Always escalate to a qualified healthcare professional.
                </InfoBanner>
              </Section>

              <Section id="emergency" number="6" icon={Phone} title="Emergency Situations">
                <p>MamaGuide includes an emergency detection system designed to recognise potential danger signs. However:</p>
                <Ul items={[
                  'MamaGuide\'s emergency detection is not infallible; it may miss emergencies or trigger on non-emergencies',
                  'If you or someone else is in a pregnancy emergency, call 112 immediately; do not wait for MamaGuide',
                  'Danger signs that require immediate medical attention include: heavy vaginal bleeding, severe headache with visual disturbance, no fetal movement after 28 weeks, severe abdominal pain, and loss of consciousness',
                  'Never delay calling emergency services because you are waiting for the chatbot to respond',
                ]} />
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-2xl">
                  <p className="font-bold text-red-800 text-sm mb-2">Emergency Contacts (Nigeria)</p>
                  <ul className="space-y-1 text-sm text-red-700">
                    <li>• Emergency services: <a href="tel:112" className="font-bold underline">112</a></li>
                    <li>• LASAMBUS (Lagos): <a href="tel:08000372867" className="font-bold underline">0800 037 2867</a></li>
                    <li>• Nearest General Hospital emergency unit</li>
                  </ul>
                </div>
              </Section>

              <Section id="intellectual-property" number="7" icon={Shield} title="Intellectual Property">
                <p>MamaGuide and all its content, including the AI model, codebase, design system, and educational content, are the intellectual property of the student developer(s) and the affiliated university.</p>
                <Ul items={[
                  'The MOTHER dataset and WHO guidelines used to train the AI are used under academic and open-access licences',
                  'You may not copy, reproduce, or distribute MamaGuide\'s content or code without explicit written permission',
                  'User-submitted content (chat messages, feedback) remains your property, but you grant us a limited licence to use it for service delivery and academic analysis',
                  'The MamaGuide name and branding may not be used for other projects without permission',
                ]} />
              </Section>

              <Section id="user-conduct" number="8" icon={User} title="User Conduct">
                <p>Users must not use MamaGuide to:</p>
                <Ul items={[
                  'Post content that is harmful, offensive, discriminatory, or in violation of Nigerian law',
                  'Attempt to manipulate the AI into providing harmful or dangerous medical advice',
                  'Create multiple accounts to circumvent restrictions or bans',
                  'Impersonate healthcare professionals without appropriate credentials',
                  'Share misinformation about pregnancy or maternal health through the platform',
                  'Attempt to access other users\' data or accounts',
                  'Conduct automated scraping, crawling, or data harvesting of MamaGuide',
                ]} />
                <p className="mt-2">Violation of these conduct rules may result in immediate account suspension or termination.</p>
              </Section>

              <Section id="account-security" number="9" icon={Lock} title="Account Security">
                <Ul items={[
                  'You are responsible for maintaining the confidentiality of your password and account',
                  'You must notify us immediately if you suspect unauthorised access to your account',
                  'We will never ask for your password via email or chat',
                  'MamaGuide uses secure, hashed password storage, but you should still choose a strong, unique password',
                  'Enabling two-factor authentication is recommended when the feature becomes available',
                  'Shared account usage is not permitted; each user should have their own account',
                ]} />
              </Section>

              <Section id="termination" number="10" icon={XCircle} title="Termination">
                <p>We reserve the right to suspend or terminate your account if you:</p>
                <Ul items={[
                  'Violate any of these Terms of Service',
                  'Attempt to harm the system, other users, or the integrity of the research evaluation',
                  'Provide false information during registration or research participation',
                  'Engage in any conduct that is illegal under Nigerian law',
                ]} />
                <p className="mt-2">You may terminate your own account at any time via Settings &gt; Privacy &gt; Delete Account. Termination removes all your personal data within 30 days.</p>
              </Section>

              <Section id="liability" number="11" icon={Scale} title="Limitation of Liability">
                <p>To the fullest extent permitted by applicable law:</p>
                <Ul items={[
                  'MamaGuide is provided "as is" without warranties of any kind, whether express, implied, or statutory',
                  'We do not guarantee that the service will be uninterrupted, error-free, or medically accurate at all times',
                  'We are not liable for any harm (direct, indirect, incidental, or consequential) arising from use of, or inability to use, MamaGuide',
                  'We are not liable for medical decisions made based on information from MamaGuide',
                  'Our total liability to you for any claim shall not exceed the amount you paid to use the service (which is zero, as MamaGuide is free)',
                ]} />
                <p className="mt-2">Nothing in these Terms limits liability for gross negligence, wilful misconduct, or as otherwise required by applicable Nigerian law.</p>
              </Section>

              <Section id="governing-law" number="12" icon={Scale} title="Governing Law">
                <p>These Terms of Service are governed by and construed in accordance with the laws of the Federal Republic of Nigeria, including:</p>
                <Ul items={[
                  'The Nigeria Data Protection Regulation (NDPR) 2019, for data protection matters',
                  'The Consumer Protection Council Act, for consumer rights matters',
                  'The Cybercrime (Prohibition, Prevention, Etc.) Act 2015, for cybersecurity matters',
                  'Any dispute arising from these Terms shall be subject to the jurisdiction of Nigerian courts',
                  'Academic disputes related to the project evaluation shall follow the university\'s academic regulations',
                ]} />
              </Section>

              <Section id="contact" number="13" icon={Mail} title="Contact Information">
                <p>For questions about these Terms or to report a violation:</p>
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 mt-3">
                  <Ul items={[
                    'Use the Contact page on MamaGuide for all inquiries',
                    'Terms-related queries are responded to within 5 business days',
                    'For legal notices, please contact through the Contact page and indicate "Legal Notice" in your message',
                  ]} />
                </div>
                <p className="mt-3">
                  <Link to={ROUTES.CONTACT} className="text-rose-700 font-semibold hover:underline">
                    Go to Contact page →
                  </Link>
                </p>
              </Section>
            </div>

            {/* Agreement box */}
            <div className="pt-8">
              <div className="bg-sage-50 border border-sage-200 rounded-2xl p-5">
                <p className="font-semibold text-sage-900 text-sm mb-2">By using MamaGuide, you confirm that:</p>
                <ul className="space-y-1.5">
                  {[
                    'You have read and understood these Terms of Service in full',
                    'You understand MamaGuide is an educational tool and not a substitute for medical care',
                    'You are 18 years of age or older',
                    'You agree to seek professional medical advice for personal health concerns',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-sage-800">
                      <span className="text-sage-600 mt-0.5">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <aside className="hidden lg:block w-52 shrink-0 sticky top-24 self-start">
            <TableOfContents sections={tocSections} variant="desktop" />
          </aside>
        </div>

        {/* Footer */}
        <div className="mt-12 flex items-center gap-3 p-5 bg-rose-50 border border-rose-200 rounded-2xl">
          <Mail className="w-5 h-5 text-rose-600 shrink-0" aria-hidden />
          <p className="text-sm text-text-secondary">
            Questions about these Terms?{' '}
            <Link to={ROUTES.CONTACT} className="text-rose-700 font-semibold hover:underline">Contact us</Link>
            {' '}and we will respond within 5 business days.
          </p>
        </div>
      </div>
    </div>
  )
}
