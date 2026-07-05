import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  Bell, Shield, Globe, Accessibility, ChevronRight, ChevronLeft,
  Moon, Sun, Type, Contrast, Volume2, Check, Trash2, LogOut,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Badge } from '@/components/atoms/Badge'
import { ROUTES, LANGUAGES, LANGUAGE_LABELS } from '@/utils/constants'
import { cn } from '@/utils/cn'

const tabs = [
  { id: 'notifications', label: 'Notifications', icon: Bell, href: ROUTES.SETTINGS_NOTIFICATIONS },
  { id: 'privacy', label: 'Privacy', icon: Shield, href: ROUTES.SETTINGS_PRIVACY },
  { id: 'language', label: 'Language', icon: Globe, href: ROUTES.SETTINGS_LANGUAGE },
  { id: 'accessibility', label: 'Accessibility', icon: Accessibility, href: ROUTES.SETTINGS_ACCESSIBILITY },
]

function NotificationsTab() {
  const [settings, setSettings] = useState({
    healthReminders: true,
    ancReminders: true,
    emergencyAlerts: true,
    weeklyTips: false,
    researchUpdates: false,
  })
  function toggle(key) { setSettings(p => ({ ...p, [key]: !p[key] })) }

  const items = [
    { key: 'healthReminders', label: 'Health reminders', desc: 'Reminders about nutrition, hydration, and rest' },
    { key: 'ancReminders', label: 'ANC appointment reminders', desc: 'Remind me about upcoming antenatal care visits' },
    { key: 'emergencyAlerts', label: 'Emergency alerts', desc: 'Critical safety notifications — always recommended', locked: true },
    { key: 'weeklyTips', label: 'Weekly pregnancy tips', desc: 'Weekly tips based on your trimester' },
    { key: 'researchUpdates', label: 'Research study updates', desc: 'Updates about the MamaGuide evaluation study' },
  ]

  return (
    <div className="space-y-2">
      <p className="text-xs text-text-muted mb-4">Choose which notifications you receive from MamaGuide.</p>
      {items.map(item => (
        <div key={item.key} className="bg-white rounded-xl border border-border p-4 flex items-center justify-between gap-3">
          <div className="flex-1">
            <p className="text-sm font-semibold text-text-primary">{item.label}</p>
            <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">{item.desc}</p>
            {item.locked && <Badge variant="rose" size="sm" className="mt-1">Always on</Badge>}
          </div>
          <button
            onClick={() => !item.locked && toggle(item.key)}
            disabled={item.locked}
            className={cn(
              'w-11 h-6 rounded-full transition-all duration-200 relative shrink-0',
              settings[item.key] ? 'bg-rose-600' : 'bg-gray-200',
              item.locked && 'opacity-70 cursor-not-allowed'
            )}
            role="switch"
            aria-checked={settings[item.key]}
          >
            <span className={cn(
              'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-200',
              settings[item.key] ? 'left-5.5' : 'left-0.5'
            )} />
          </button>
        </div>
      ))}
    </div>
  )
}

function PrivacyTab() {
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const [showDelete, setShowDelete] = useState(false)
  const [confirmText, setConfirmText] = useState('')

  const privacyItems = [
    { label: 'Conversation data', desc: 'Your chat messages are stored securely on our server', action: 'Manage' },
    { label: 'Research participation', desc: 'You are currently enrolled in the evaluation study', action: 'Withdraw' },
    { label: 'Export my data', desc: 'Download a copy of your conversation history', action: 'Export' },
  ]

  return (
    <div className="space-y-4">
      <p className="text-xs text-text-muted">Control how MamaGuide stores and uses your data.</p>
      <div className="space-y-2">
        {privacyItems.map(item => (
          <div key={item.label} className="bg-white rounded-xl border border-border p-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-text-primary">{item.label}</p>
              <p className="text-xs text-text-secondary mt-0.5">{item.desc}</p>
            </div>
            <button className="text-xs text-rose-700 font-semibold hover:underline shrink-0">
              {item.action}
            </button>
          </div>
        ))}
      </div>

      <Link to={ROUTES.PRIVACY} className="block text-xs text-rose-700 hover:underline font-medium">
        Read our Privacy Policy →
      </Link>

      <div className="border-t border-border pt-4 space-y-2">
        <button
          onClick={() => { signOut?.(); navigate(ROUTES.LOGIN) }}
          className="w-full flex items-center gap-3 px-4 py-3.5 bg-white rounded-xl border border-border hover:bg-gray-50 text-left transition-colors"
        >
          <LogOut className="w-4 h-4 text-text-muted" aria-hidden />
          <span className="text-sm text-text-primary font-medium">Sign out of MamaGuide</span>
        </button>

        <button
          onClick={() => setShowDelete(true)}
          className="w-full flex items-center gap-3 px-4 py-3.5 bg-red-50 rounded-xl border border-red-200 hover:bg-red-100 text-left transition-colors"
        >
          <Trash2 className="w-4 h-4 text-error" aria-hidden />
          <div>
            <p className="text-sm text-error font-semibold">Delete my account</p>
            <p className="text-xs text-red-500">Permanently delete all your data</p>
          </div>
        </button>
      </div>

      {showDelete && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
          <p className="font-semibold text-sm text-red-800 mb-2">Are you sure?</p>
          <p className="text-xs text-red-700 mb-3">Type <strong>DELETE</strong> below to confirm. This cannot be undone.</p>
          <input
            value={confirmText}
            onChange={e => setConfirmText(e.target.value)}
            placeholder="Type DELETE to confirm"
            className="w-full h-10 px-3 rounded-xl border border-red-300 text-sm mb-3 focus:outline-2 focus:outline-red-500"
          />
          <div className="flex gap-2">
            <button
              disabled={confirmText !== 'DELETE'}
              className="px-4 py-2 bg-error text-white text-xs font-bold rounded-lg disabled:opacity-40"
            >
              Delete Account
            </button>
            <button onClick={() => { setShowDelete(false); setConfirmText('') }} className="px-4 py-2 text-xs text-text-muted hover:text-text-primary">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function LanguageTab() {
  const [selected, setSelected] = useState(LANGUAGES.EN)
  const [saved, setSaved] = useState(false)

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-text-muted">Select your preferred language for MamaGuide responses and content.</p>
      <div className="space-y-2">
        {Object.entries(LANGUAGE_LABELS).map(([code, label]) => {
          const isAvailable = code === LANGUAGES.EN
          return (
            <button
              key={code}
              onClick={() => isAvailable && setSelected(code)}
              disabled={!isAvailable}
              className={cn(
                'w-full flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl border text-left transition-all',
                selected === code ? 'border-rose-400 bg-rose-50' : 'border-border bg-white',
                !isAvailable && 'opacity-60 cursor-not-allowed'
              )}
            >
              <div>
                <p className={cn('text-sm font-semibold', selected === code ? 'text-rose-800' : 'text-text-primary')}>{label}</p>
                {!isAvailable && <p className="text-xs text-text-muted mt-0.5">Coming soon</p>}
                {isAvailable && selected !== code && <p className="text-xs text-text-muted mt-0.5">Available now</p>}
              </div>
              {selected === code && <Check className="w-4 h-4 text-rose-600 shrink-0" aria-hidden />}
              {!isAvailable && <Badge variant="neutral" size="sm">Soon</Badge>}
            </button>
          )
        })}
      </div>
      <button
        onClick={handleSave}
        className="w-full h-11 bg-rose-700 text-white font-semibold rounded-xl hover:bg-rose-800 transition-colors text-sm flex items-center justify-center gap-2"
      >
        {saved ? <><Check className="w-4 h-4" /> Saved!</> : 'Save Language Preference'}
      </button>
    </div>
  )
}

function AccessibilityTab() {
  const [settings, setSettings] = useState({ fontSize: 'medium', highContrast: false, reduceMotion: false, screenReader: false })
  function update(key, val) { setSettings(p => ({ ...p, [key]: val })) }

  return (
    <div className="space-y-4">
      <p className="text-xs text-text-muted">Customise MamaGuide for your accessibility needs.</p>

      {/* Font size */}
      <div className="bg-white rounded-xl border border-border p-4">
        <p className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
          <Type className="w-4 h-4 text-rose-600" aria-hidden />
          Text Size
        </p>
        <div className="flex gap-2">
          {['small', 'medium', 'large', 'xl'].map(size => (
            <button
              key={size}
              onClick={() => update('fontSize', size)}
              className={cn(
                'flex-1 py-2 rounded-lg border text-xs font-semibold capitalize transition-all',
                settings.fontSize === size ? 'border-rose-400 bg-rose-50 text-rose-700' : 'border-border bg-white text-text-secondary'
              )}
            >
              {size === 'xl' ? 'X-Large' : size.charAt(0).toUpperCase() + size.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Toggles */}
      {[
        { key: 'highContrast', icon: Contrast, label: 'High contrast mode', desc: 'Increases colour contrast for better readability' },
        { key: 'reduceMotion', icon: Moon, label: 'Reduce motion', desc: 'Disables animations and transitions' },
        { key: 'screenReader', icon: Volume2, label: 'Screen reader optimised', desc: 'Enhances ARIA labels and focus management' },
      ].map(item => (
        <div key={item.key} className="bg-white rounded-xl border border-border p-4 flex items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center shrink-0">
              <item.icon className="w-4 h-4 text-rose-600" aria-hidden />
            </span>
            <div>
              <p className="text-sm font-semibold text-text-primary">{item.label}</p>
              <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">{item.desc}</p>
            </div>
          </div>
          <button
            onClick={() => update(item.key, !settings[item.key])}
            className={cn('w-11 h-6 rounded-full transition-all duration-200 relative shrink-0', settings[item.key] ? 'bg-rose-600' : 'bg-gray-200')}
            role="switch"
            aria-checked={settings[item.key]}
          >
            <span className={cn('absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-200', settings[item.key] ? 'left-5.5' : 'left-0.5')} />
          </button>
        </div>
      ))}

      <Link to={ROUTES.ACCESSIBILITY} className="block text-xs text-rose-700 hover:underline font-medium">
        Read our Accessibility Statement →
      </Link>
    </div>
  )
}

const tabContent = {
  notifications: <NotificationsTab />,
  privacy: <PrivacyTab />,
  language: <LanguageTab />,
  accessibility: <AccessibilityTab />,
}

export default function SettingsPage() {
  const { tab = 'notifications' } = useParams()
  const navigate = useNavigate()
  const currentTab = tabs.find(t => t.id === tab) || tabs[0]

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="font-display font-bold text-xl text-text-primary mb-5">Settings</h1>

      <div className="flex gap-4">
        {/* Sidebar tabs (desktop) */}
        <nav className="hidden sm:flex flex-col gap-1 w-44 shrink-0" aria-label="Settings sections">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => navigate(`/app/settings/${t.id}`)}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-all',
                currentTab.id === t.id ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'text-text-secondary hover:bg-gray-50'
              )}
              aria-current={currentTab.id === t.id ? 'page' : undefined}
            >
              <t.icon className="w-4 h-4 shrink-0" aria-hidden />
              {t.label}
            </button>
          ))}
        </nav>

        {/* Mobile tabs */}
        <div className="sm:hidden w-full mb-4">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => navigate(`/app/settings/${t.id}`)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all',
                  currentTab.id === t.id ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'text-text-secondary border border-border bg-white'
                )}
              >
                <t.icon className="w-3.5 h-3.5" aria-hidden />
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="mb-4">
            <h2 className="font-semibold text-base text-text-primary flex items-center gap-2">
              <currentTab.icon className="w-4.5 h-4.5 text-rose-600" aria-hidden />
              {currentTab.label}
            </h2>
          </div>
          {tabContent[currentTab.id] || tabContent['notifications']}
        </div>
      </div>
    </div>
  )
}
