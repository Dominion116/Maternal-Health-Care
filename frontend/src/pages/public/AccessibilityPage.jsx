import { Link } from 'react-router-dom'
import {
  Eye, Keyboard, Volume2, Smartphone, CheckCircle, Mail, Shield,
  Globe, Wrench, MessageSquare, Monitor, ZoomIn, Contrast,
} from 'lucide-react'
import { TableOfContents } from '@/components/molecules/TableOfContents'
import { PageHero } from '@/components/layout/PageHero'
import { InfoBanner } from '@/components/molecules/InfoBanner'
import { ROUTES } from '@/utils/constants'

const tocSections = [
  { id: 'commitment', title: 'Accessibility Commitment' },
  { id: 'features', title: 'Supported Features' },
  { id: 'keyboard', title: 'Keyboard Navigation' },
  { id: 'screen-reader', title: 'Screen Reader Support' },
  { id: 'colour-contrast', title: 'Colour Contrast' },
  { id: 'language', title: 'Language Accessibility' },
  { id: 'improvements', title: 'Ongoing Improvements' },
  { id: 'contact', title: 'Contact for Accessibility' },
]

function Section({ id, icon: Icon, number, title, children }) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="flex items-start gap-4 mb-5">
        {Icon && (
          <span className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
            <Icon className="w-4.5 h-4.5 text-blue-600" aria-hidden />
          </span>
        )}
        <div>
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">Section {number}</p>
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
          <CheckCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" aria-hidden />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

function KeyboardShortcut({ keys, description }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-border last:border-0">
      <div className="flex items-center gap-1 shrink-0">
        {keys.map((key, i) => (
          <span key={i}>
            <kbd className="inline-flex items-center px-2 py-0.5 rounded-md bg-neutral-100 border border-neutral-300 text-xs font-mono text-text-primary font-semibold">
              {key}
            </kbd>
            {i < keys.length - 1 && <span className="mx-0.5 text-text-muted text-xs">+</span>}
          </span>
        ))}
      </div>
      <span className="text-sm text-text-secondary">{description}</span>
    </div>
  )
}

export default function AccessibilityPage() {
  return (
    <div className="bg-warm-white min-h-screen">
      <PageHero
        badge="Accessibility"
        badgeVariant="info"
        icon={Eye}
        iconBg="bg-blue-100"
        iconColor="text-blue-600"
        title="Accessibility Statement"
        description="MamaGuide is committed to being accessible to every mother, regardless of ability, device, or connection speed. We aim to meet WCAG 2.1 Level AA guidelines."
        meta="Last reviewed: May 2026 · WCAG 2.1 AA Target"
        gradient
      />

      <div className="max-w-6xl mx-auto px-4 pb-16">
        {/* Commitment summary */}
        <div className="mb-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Eye, label: 'Perceivable', desc: 'All content has text alternatives and meets contrast standards' },
            { icon: Keyboard, label: 'Operable', desc: 'Full keyboard navigation with visible focus indicators' },
            { icon: Volume2, label: 'Understandable', desc: 'Plain language, clear navigation, helpful error messages' },
            { icon: Smartphone, label: 'Robust', desc: 'Works across browsers, devices, and assistive technologies' },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="bg-white rounded-2xl border border-border p-4">
              <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center mb-3">
                <Icon className="w-4.5 h-4.5 text-blue-600" aria-hidden />
              </div>
              <p className="font-semibold text-sm text-text-primary mb-1">{label}</p>
              <p className="text-xs text-text-secondary leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <div className="lg:flex lg:gap-12 lg:items-start">
          <div className="flex-1 min-w-0 space-y-10 divide-y divide-border">

            <div className="lg:hidden">
              <TableOfContents sections={tocSections} variant="mobile" />
            </div>

            <div className="space-y-10">

              <Section id="commitment" number="1" icon={Shield} title="Accessibility Commitment">
                <p>
                  MamaGuide is built on the belief that maternal health information must reach <strong>every mother</strong> — including those with visual impairments, motor disabilities, hearing difficulties, or cognitive differences. Accessibility is a core requirement, not an afterthought.
                </p>
                <p>Our commitment includes:</p>
                <Ul items={[
                  'Targeting WCAG 2.1 Level AA compliance across all public-facing pages',
                  'Designing for low-bandwidth environments common in Nigerian communities',
                  'Testing with assistive technology during development — not just after deployment',
                  'Responding to accessibility feedback within 5 business days',
                  'Publishing regular accessibility updates and known limitation disclosures',
                  'Providing emergency information in accessible formats at all times',
                ]} />
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mt-2">
                  <p className="text-sm text-blue-800">
                    <strong>Why this matters for maternal health:</strong> A mother experiencing a pregnancy complication must be able to access danger sign information quickly — regardless of the device she uses, her literacy level, or any disability she may have.
                  </p>
                </div>
              </Section>

              <Section id="features" number="2" icon={CheckCircle} title="Supported Accessibility Features">
                <p>MamaGuide includes the following built-in accessibility features:</p>
                <div className="grid sm:grid-cols-2 gap-3 mt-2">
                  {[
                    { label: 'Skip to Content Link', desc: 'A hidden link at the top of every page allows screen reader users to skip repeated navigation.' },
                    { label: 'Semantic HTML Structure', desc: 'Proper heading hierarchy (h1–h6), landmark regions, lists, and form labels throughout.' },
                    { label: 'ARIA Labels and Roles', desc: 'All interactive components include descriptive aria-label, aria-expanded, and aria-live attributes.' },
                    { label: 'Visible Focus Indicators', desc: 'Every focusable element shows a clear visible focus ring — not overridden with outline: none.' },
                    { label: 'Responsive Text Sizing', desc: 'Text scales correctly with browser zoom up to 200% without horizontal scrolling.' },
                    { label: 'No Motion Autoplay', desc: 'Animations respect the prefers-reduced-motion media query for users sensitive to movement.' },
                    { label: 'Colour-Independent Meaning', desc: 'No information is conveyed by colour alone — icons, labels, and patterns supplement all colour coding.' },
                    { label: 'Touch Target Sizing', desc: 'All interactive elements are at least 44×44px — meeting WCAG touch target recommendations.' },
                  ].map(({ label, desc }) => (
                    <div key={label} className="bg-white rounded-xl border border-border p-3.5">
                      <p className="font-semibold text-sm text-text-primary mb-1">{label}</p>
                      <p className="text-xs text-text-secondary leading-relaxed">{desc}</p>
                    </div>
                  ))}
                </div>
              </Section>

              <Section id="keyboard" number="3" icon={Keyboard} title="Keyboard Navigation">
                <p>MamaGuide is fully navigable by keyboard. All functionality available with a mouse or touch is also available via keyboard alone.</p>
                <div className="bg-white rounded-2xl border border-border divide-y divide-border mt-3">
                  <KeyboardShortcut keys={['Tab']} description="Move focus to the next interactive element (link, button, input)" />
                  <KeyboardShortcut keys={['Shift', 'Tab']} description="Move focus to the previous interactive element" />
                  <KeyboardShortcut keys={['Enter']} description="Activate a focused button or follow a focused link" />
                  <KeyboardShortcut keys={['Space']} description="Toggle checkboxes; activate buttons" />
                  <KeyboardShortcut keys={['Esc']} description="Close modal dialogs, dropdown menus, and overlays" />
                  <KeyboardShortcut keys={['Arrow keys']} description="Navigate within radio groups, tab panels, and select dropdowns" />
                  <KeyboardShortcut keys={['Enter']} description="Send a chat message in the chat interface (or click the Send button)" />
                  <KeyboardShortcut keys={['Home', 'End']} description="Jump to the beginning or end of a text input" />
                </div>
                <InfoBanner variant="tip" title="Focus management">
                  When a modal or dialog opens, focus moves to it automatically. When it closes, focus returns to the element that opened it — so you never lose your place.
                </InfoBanner>
              </Section>

              <Section id="screen-reader" number="4" icon={Monitor} title="Screen Reader Support">
                <p>MamaGuide has been tested with the following screen readers:</p>
                <div className="grid sm:grid-cols-3 gap-3 mt-2">
                  {[
                    { name: 'NVDA', platform: 'Windows', browser: 'Chrome / Firefox', status: 'Supported' },
                    { name: 'VoiceOver', platform: 'macOS / iOS', browser: 'Safari', status: 'Supported' },
                    { name: 'TalkBack', platform: 'Android', browser: 'Chrome', status: 'Partially supported' },
                  ].map(({ name, platform, browser, status }) => (
                    <div key={name} className="bg-white rounded-xl border border-border p-3.5">
                      <p className="font-semibold text-sm text-text-primary mb-1">{name}</p>
                      <p className="text-xs text-text-muted">{platform}</p>
                      <p className="text-xs text-text-muted">{browser}</p>
                      <span className={`inline-block mt-2 text-xs font-semibold px-2 py-0.5 rounded-full ${status === 'Supported' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {status}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="mt-3">Tips for screen reader users:</p>
                <Ul items={[
                  'Use heading navigation (H key in NVDA/JAWS) to jump between sections quickly',
                  'The chat message list is an aria-live region — new messages are announced automatically',
                  'Form validation errors are announced immediately when you submit a form with errors',
                  'The emergency banner uses role="alert" and will be announced immediately by screen readers',
                  'Use the Send button rather than Enter key for the most reliable chat submission experience',
                ]} />
              </Section>

              <Section id="colour-contrast" number="5" icon={Contrast} title="Colour Contrast">
                <p>All text and interactive elements in MamaGuide meet or exceed WCAG 2.1 AA contrast requirements:</p>
                <div className="mt-3 space-y-2">
                  {[
                    { label: 'Body text on white background', ratio: '9.2:1', status: 'AAA', note: 'Exceeds AA requirement' },
                    { label: 'Secondary text on white background', ratio: '5.8:1', status: 'AA', note: 'Meets AA requirement' },
                    { label: 'Rose primary buttons', ratio: '4.7:1', status: 'AA', note: 'Meets AA requirement' },
                    { label: 'Error messages (red)', ratio: '5.1:1', status: 'AA', note: 'Meets AA requirement' },
                    { label: 'Warning banners (amber)', ratio: '4.6:1', status: 'AA', note: 'Meets AA requirement' },
                    { label: 'Placeholder text in inputs', ratio: '4.5:1', status: 'AA', note: 'Meets AA minimum' },
                  ].map(({ label, ratio, status, note }) => (
                    <div key={label} className="flex items-center justify-between gap-4 bg-white rounded-xl border border-border px-4 py-2.5">
                      <span className="text-sm text-text-secondary">{label}</span>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-sm font-mono font-semibold text-text-primary">{ratio}</span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${status === 'AAA' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                          WCAG {status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <InfoBanner variant="info" title="High contrast mode">
                  MamaGuide respects Windows High Contrast Mode and macOS Increase Contrast settings. System-level colour overrides are honoured without breaking the layout.
                </InfoBanner>
                <InfoBanner variant="tip" title="Browser zoom support">
                  You can zoom to 200% using Ctrl+Plus (Windows) or Cmd+Plus (Mac). The layout adapts without horizontal scrolling or text overflow.
                </InfoBanner>
              </Section>

              <Section id="language" number="6" icon={Globe} title="Language Accessibility">
                <p>MamaGuide is currently available in English, with the following language accessibility features:</p>
                <Ul items={[
                  'The HTML lang attribute is set correctly to "en" — screen readers use the correct pronunciation',
                  'Plain language is used throughout — medical jargon is explained in simple terms',
                  'Reading level targets Grade 8 or below for patient-facing content',
                  'Abbreviations are expanded on first use (e.g., ANC — Antenatal Care)',
                  'Numbers and units are written clearly (e.g., "4.5 kilograms" not "4.5kg")',
                ]} />
                <InfoBanner variant="warning" title="Multilingual support — in development">
                  Yoruba, Hausa, and Igbo language support are currently in development. These languages are spoken by the majority of Nigerian mothers who would benefit most from MamaGuide. We expect to launch Yoruba as the first additional language in a future update.
                </InfoBanner>
                <p>Until multilingual support is available, we recommend:</p>
                <Ul items={[
                  'Using Google Translate in your browser to translate the page (Chrome has built-in translation)',
                  'Asking a healthcare worker to assist with translation if needed',
                  'Contacting us if you need a specific section translated as an urgent request',
                ]} />
              </Section>

              <Section id="improvements" number="7" icon={Wrench} title="Ongoing Improvements">
                <p>We acknowledge the following known limitations and are actively working to address them:</p>
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mt-2">
                  <p className="text-xs font-semibold text-amber-800 uppercase tracking-wide mb-3">Known limitations</p>
                  <ul className="space-y-2.5">
                    {[
                      'TalkBack on Android has partial support — some aria-live announcements may be delayed',
                      'Education library images do not yet include extended text descriptions (alt text covers brief descriptions only)',
                      'Some admin data visualisations (charts) lack full screen reader alternatives',
                      'Multilingual support is English-only — Yoruba, Hausa, and Igbo are in development',
                      'PDF documents linked from the education library are not yet fully tagged for screen reader access',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-amber-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" aria-hidden />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="mt-3">Planned accessibility improvements for upcoming releases:</p>
                <Ul items={[
                  'Extended image descriptions for all education content illustrations',
                  'Full TalkBack compatibility across the chat interface',
                  'Yoruba language support as the first multilingual addition',
                  'Accessible data table alternatives for all chart components',
                  'Live region improvements for real-time chat notifications',
                  'Tagged PDF exports for screen reader accessibility',
                ]} />
              </Section>

              <Section id="contact" number="8" icon={MessageSquare} title="Contact for Accessibility Issues">
                <p>
                  If you encounter any accessibility barriers while using MamaGuide, or if you need content in an alternative format, we want to hear from you. Every accessibility report is taken seriously.
                </p>
                <Ul items={[
                  'Use the Contact page to report any accessibility problem you encounter',
                  'Describe the issue, your device, browser, and any assistive technology you use',
                  'We aim to respond within 5 business days',
                  'For urgent accessibility issues affecting your ability to access emergency information, mark your message as "Urgent"',
                  'We do not require you to create an account to submit an accessibility report',
                ]} />
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-2xl">
                  <p className="font-semibold text-sm text-blue-900 mb-3">Contact us about accessibility</p>
                  <Link
                    to={ROUTES.CONTACT}
                    className="inline-flex items-center gap-2 bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-800 transition-colors text-sm"
                  >
                    <Mail className="w-4 h-4" aria-hidden />
                    Report an Accessibility Issue
                  </Link>
                  <p className="text-xs text-blue-700 mt-3">
                    We welcome feedback from users with disabilities — your experiences directly inform our accessibility roadmap.
                  </p>
                </div>
              </Section>

            </div>
          </div>

          <aside className="hidden lg:block w-52 shrink-0 sticky top-24 self-start">
            <TableOfContents sections={tocSections} variant="desktop" />
          </aside>
        </div>

        {/* Footer */}
        <div className="mt-12 flex items-center gap-3 p-5 bg-blue-50 border border-blue-200 rounded-2xl">
          <Eye className="w-5 h-5 text-blue-600 shrink-0" aria-hidden />
          <p className="text-sm text-text-secondary">
            Accessibility statement last reviewed: May 2026.{' '}
            <Link to={ROUTES.CONTACT} className="text-blue-700 font-semibold hover:underline">Contact us</Link>
            {' '}to report accessibility issues.
          </p>
        </div>
      </div>
    </div>
  )
}
