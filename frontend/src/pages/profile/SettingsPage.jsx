import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Bell,
  Shield,
  Globe,
  Accessibility,
  Loader2,
  Moon,
  Type,
  Contrast,
  Volume2,
  Check,
  Trash2,
  LogOut,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/services/authService";
import { evaluationService } from "@/services/evaluationService";
import { loadAccessibility, saveAccessibility } from "@/utils/accessibility";
import { Badge } from "@/components/atoms/Badge";
import { ROUTES, LANGUAGES, LANGUAGE_LABELS } from "@/utils/constants";
import { cn } from "@/utils/cn";

const tabs = [
  {
    id: "notifications",
    label: "Notifications",
    icon: Bell,
    href: ROUTES.SETTINGS_NOTIFICATIONS,
  },
  {
    id: "privacy",
    label: "Privacy",
    icon: Shield,
    href: ROUTES.SETTINGS_PRIVACY,
  },
  {
    id: "language",
    label: "Language",
    icon: Globe,
    href: ROUTES.SETTINGS_LANGUAGE,
  },
  {
    id: "accessibility",
    label: "Accessibility",
    icon: Accessibility,
    href: ROUTES.SETTINGS_ACCESSIBILITY,
  },
];

const DEFAULT_NOTIFICATIONS = {
  healthReminders: true,
  ancReminders: true,
  weeklyTips: false,
  researchUpdates: false,
};

function Toggle({ on, disabled, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-11 h-6 rounded-full transition-all duration-200 relative shrink-0",
        on ? "bg-rose-600" : "bg-gray-200",
        disabled && "opacity-70 cursor-not-allowed",
      )}
      role="switch"
      aria-checked={on}
    >
      <span
        className={cn(
          "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-200",
          on ? "left-5.5" : "left-0.5",
        )}
      />
    </button>
  );
}

function NotificationsTab({ profile }) {
  const [settings, setSettings] = useState(() => ({
    ...DEFAULT_NOTIFICATIONS,
    ...(profile?.settings?.notifications || {}),
  }));

  async function toggle(key) {
    const previous = settings;
    const next = { ...settings, [key]: !settings[key] };
    setSettings(next);
    try {
      await authService.updateProfile({ settings: { notifications: next } });
    } catch {
      setSettings(previous);
      toast.error(
        "Could not save your notification preference. Please try again.",
      );
    }
  }

  const items = [
    {
      key: "healthReminders",
      label: "Health reminders",
      desc: "Reminders about nutrition, hydration, and rest",
    },
    {
      key: "ancReminders",
      label: "ANC appointment reminders",
      desc: "Remind me about upcoming antenatal care visits",
    },
    {
      key: "emergencyAlerts",
      label: "Emergency alerts",
      desc: "Critical safety notifications, always recommended",
      locked: true,
    },
    {
      key: "weeklyTips",
      label: "Weekly pregnancy tips",
      desc: "Weekly tips based on your trimester",
    },
    {
      key: "researchUpdates",
      label: "Research study updates",
      desc: "Updates about the MamaGuide evaluation study",
    },
  ];

  return (
    <div className="space-y-2">
      <p className="text-xs text-text-muted mb-4">
        Choose which notifications you receive from MamaGuide.
      </p>
      {items.map((item) => (
        <div
          key={item.key}
          className="bg-white rounded-xl border border-border p-4 flex items-center justify-between gap-3"
        >
          <div className="flex-1">
            <p className="text-sm font-semibold text-text-primary">
              {item.label}
            </p>
            <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">
              {item.desc}
            </p>
            {item.locked && (
              <Badge variant="rose" size="sm" className="mt-1">
                Always on
              </Badge>
            )}
          </div>
          <Toggle
            on={item.locked ? true : settings[item.key]}
            disabled={item.locked}
            onClick={() => !item.locked && toggle(item.key)}
          />
        </div>
      ))}
    </div>
  );
}

function PrivacyTab() {
  const { signOut } = useAuth();
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const [showDelete, setShowDelete] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [consent, setConsent] = useState(null);
  const [withdrawing, setWithdrawing] = useState(false);

  useEffect(() => {
    let alive = true;
    evaluationService
      .getResearchConsent()
      .then(({ data }) => {
        if (alive) setConsent(data.data);
      })
      .catch(() => {
        /* consent status is optional context — fail quietly */
      });
    return () => {
      alive = false;
    };
  }, []);

  async function handleExport() {
    setExporting(true);
    try {
      const { data } = await authService.exportData();
      const blob = new Blob([JSON.stringify(data.data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `mamaguide-data-export-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success("Your data export has been downloaded.");
    } catch {
      toast.error("Could not export your data. Please try again.");
    } finally {
      setExporting(false);
    }
  }

  async function handleWithdraw() {
    setWithdrawing(true);
    try {
      const { data } = await evaluationService.withdrawConsent();
      setConsent(data.data ?? { consented: false });
      toast.success("You have withdrawn from the evaluation study.");
    } catch {
      toast.error("Could not withdraw from the study. Please try again.");
    } finally {
      setWithdrawing(false);
    }
  }

  async function handleDeleteAccount() {
    setDeleting(true);
    try {
      await authService.deleteAccount();
      // Local logout only — the server session is already gone with the account
      logout();
      toast.success("Your account and all your data have been deleted.");
      navigate(ROUTES.HOME);
    } catch {
      toast.error("Could not delete your account. Please try again.");
      setDeleting(false);
    }
  }

  const isEnrolled = consent?.consented === true;

  const privacyItems = [
    {
      label: "Conversation data",
      desc: "Your chat messages are stored securely on our server",
      action: "Manage",
      onClick: () => navigate(ROUTES.CHAT_HISTORY),
    },
    {
      label: "Research participation",
      desc: isEnrolled
        ? "You are currently enrolled in the evaluation study"
        : consent
          ? "You have withdrawn from the evaluation study"
          : "You are not enrolled in the evaluation study",
      action: withdrawing ? "Withdrawing…" : "Withdraw",
      onClick: handleWithdraw,
      disabled: !isEnrolled || withdrawing,
    },
    {
      label: "Export my data",
      desc: "Download a copy of your conversation history",
      action: exporting ? "Exporting…" : "Export",
      onClick: handleExport,
      disabled: exporting,
    },
  ];

  return (
    <div className="space-y-4">
      <p className="text-xs text-text-muted">
        Control how MamaGuide stores and uses your data.
      </p>
      <div className="space-y-2">
        {privacyItems.map((item) => (
          <div
            key={item.label}
            className="bg-white rounded-xl border border-border p-4 flex items-center justify-between gap-3"
          >
            <div>
              <p className="text-sm font-semibold text-text-primary">
                {item.label}
              </p>
              <p className="text-xs text-text-secondary mt-0.5">{item.desc}</p>
            </div>
            <button
              onClick={item.onClick}
              disabled={item.disabled}
              className="text-xs text-rose-700 font-semibold hover:underline shrink-0 disabled:opacity-40 disabled:no-underline disabled:cursor-not-allowed"
            >
              {item.action}
            </button>
          </div>
        ))}
      </div>

      <Link
        to={ROUTES.PRIVACY}
        className="block text-xs text-rose-700 hover:underline font-medium"
      >
        Read our Privacy Policy →
      </Link>

      <div className="border-t border-border pt-4 space-y-2">
        <button
          onClick={async () => {
            await signOut();
            navigate(ROUTES.LOGIN);
          }}
          className="w-full flex items-center gap-3 px-4 py-3.5 bg-white rounded-xl border border-border hover:bg-gray-50 text-left transition-colors"
        >
          <LogOut className="w-4 h-4 text-text-muted" aria-hidden />
          <span className="text-sm text-text-primary font-medium">
            Sign out of MamaGuide
          </span>
        </button>

        <button
          onClick={() => setShowDelete(true)}
          className="w-full flex items-center gap-3 px-4 py-3.5 bg-red-50 rounded-xl border border-red-200 hover:bg-red-100 text-left transition-colors"
        >
          <Trash2 className="w-4 h-4 text-error" aria-hidden />
          <div>
            <p className="text-sm text-error font-semibold">
              Delete my account
            </p>
            <p className="text-xs text-red-500">
              Permanently delete all your data
            </p>
          </div>
        </button>
      </div>

      {showDelete && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
          <p className="font-semibold text-sm text-red-800 mb-2">
            Are you sure?
          </p>
          <p className="text-xs text-red-700 mb-3">
            Type <strong>DELETE</strong> below to confirm. This cannot be
            undone.
          </p>
          <input
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="Type DELETE to confirm"
            className="w-full h-10 px-3 rounded-xl border border-red-300 text-sm mb-3 focus:outline-2 focus:outline-red-500"
          />
          <div className="flex gap-2">
            <button
              disabled={confirmText !== "DELETE" || deleting}
              onClick={handleDeleteAccount}
              className="px-4 py-2 bg-error text-white text-xs font-bold rounded-lg disabled:opacity-40 flex items-center gap-1.5"
            >
              {deleting && (
                <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden />
              )}
              {deleting ? "Deleting…" : "Delete Account"}
            </button>
            <button
              onClick={() => {
                setShowDelete(false);
                setConfirmText("");
              }}
              className="px-4 py-2 text-xs text-text-muted hover:text-text-primary"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function LanguageTab({ profile }) {
  const [selected, setSelected] = useState(profile?.language || LANGUAGES.EN);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await authService.updateProfile({ language: selected });
      setSaved(true);
      toast.success("Language preference saved.");
      setTimeout(() => setSaved(false), 2000);
    } catch {
      toast.error("Could not save your language preference. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-text-muted">
        Select your preferred language for MamaGuide responses and content.
      </p>
      <div className="space-y-2">
        {Object.entries(LANGUAGE_LABELS).map(([code, label]) => {
          const isAvailable = code === LANGUAGES.EN;
          return (
            <button
              key={code}
              onClick={() => isAvailable && setSelected(code)}
              disabled={!isAvailable}
              className={cn(
                "w-full flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl border text-left transition-all",
                selected === code
                  ? "border-rose-400 bg-rose-50"
                  : "border-border bg-white",
                !isAvailable && "opacity-60 cursor-not-allowed",
              )}
            >
              <div>
                <p
                  className={cn(
                    "text-sm font-semibold",
                    selected === code ? "text-rose-800" : "text-text-primary",
                  )}
                >
                  {label}
                </p>
                {!isAvailable && (
                  <p className="text-xs text-text-muted mt-0.5">Coming soon</p>
                )}
                {isAvailable && selected !== code && (
                  <p className="text-xs text-text-muted mt-0.5">
                    Available now
                  </p>
                )}
              </div>
              {selected === code && (
                <Check className="w-4 h-4 text-rose-600 shrink-0" aria-hidden />
              )}
              {!isAvailable && (
                <Badge variant="neutral" size="sm">
                  Soon
                </Badge>
              )}
            </button>
          );
        })}
      </div>
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full h-11 bg-rose-700 text-white font-semibold rounded-xl hover:bg-rose-800 transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-60"
      >
        {saving ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden /> Saving…
          </>
        ) : saved ? (
          <>
            <Check className="w-4 h-4" /> Saved!
          </>
        ) : (
          "Save Language Preference"
        )}
      </button>
    </div>
  );
}

function AccessibilityTab() {
  const [settings, setSettings] = useState(() => loadAccessibility());

  function update(key, val) {
    const next = { ...settings, [key]: val };
    setSettings(next);
    // Applies to the document immediately and persists across sessions
    saveAccessibility(next);
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-text-muted">
        Customise MamaGuide for your accessibility needs. Changes apply
        immediately and are remembered on this device.
      </p>

      {/* Font size */}
      <div className="bg-white rounded-xl border border-border p-4">
        <p className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
          <Type className="w-4 h-4 text-rose-600" aria-hidden />
          Text Size
        </p>
        <div className="flex gap-2">
          {["small", "medium", "large", "xl"].map((size) => (
            <button
              key={size}
              onClick={() => update("fontSize", size)}
              className={cn(
                "flex-1 py-2 rounded-lg border text-xs font-semibold capitalize transition-all",
                settings.fontSize === size
                  ? "border-rose-400 bg-rose-50 text-rose-700"
                  : "border-border bg-white text-text-secondary",
              )}
            >
              {size === "xl"
                ? "X-Large"
                : size.charAt(0).toUpperCase() + size.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Toggles */}
      {[
        {
          key: "highContrast",
          icon: Contrast,
          label: "High contrast mode",
          desc: "Increases colour contrast for better readability",
        },
        {
          key: "reduceMotion",
          icon: Moon,
          label: "Reduce motion",
          desc: "Disables animations and transitions",
        },
        {
          key: "screenReader",
          icon: Volume2,
          label: "Screen reader optimised",
          desc: "Enhances ARIA labels and focus management",
        },
      ].map((item) => (
        <div
          key={item.key}
          className="bg-white rounded-xl border border-border p-4 flex items-center justify-between gap-3"
        >
          <div className="flex items-start gap-3">
            <span className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center shrink-0">
              <item.icon className="w-4 h-4 text-rose-600" aria-hidden />
            </span>
            <div>
              <p className="text-sm font-semibold text-text-primary">
                {item.label}
              </p>
              <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">
                {item.desc}
              </p>
            </div>
          </div>
          <Toggle
            on={settings[item.key]}
            onClick={() => update(item.key, !settings[item.key])}
          />
        </div>
      ))}

      <Link
        to={ROUTES.ACCESSIBILITY}
        className="block text-xs text-rose-700 hover:underline font-medium"
      >
        Read our Accessibility Statement →
      </Link>
    </div>
  );
}

const tabComponents = {
  notifications: NotificationsTab,
  privacy: PrivacyTab,
  language: LanguageTab,
  accessibility: AccessibilityTab,
};

// notifications + language initialise from the server profile; the others don't
const tabNeedsProfile = { notifications: true, language: true };

export default function SettingsPage() {
  const { tab = "notifications" } = useParams();
  const navigate = useNavigate();
  const currentTab = tabs.find((t) => t.id === tab) || tabs[0];
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    let alive = true;
    authService
      .getProfile()
      .then(({ data }) => {
        if (alive) setProfile(data.data);
      })
      .catch(() => {
        if (alive) toast.error("Could not load your saved settings.");
      })
      .finally(() => {
        if (alive) setLoadingProfile(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const TabContent = tabComponents[currentTab.id];
  const waitingOnProfile = tabNeedsProfile[currentTab.id] && loadingProfile;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="font-display font-bold text-xl text-text-primary mb-5">
        Settings
      </h1>

      <div className="flex gap-4">
        {/* Sidebar tabs (desktop) */}
        <nav
          className="hidden sm:flex flex-col gap-1 w-44 shrink-0"
          aria-label="Settings sections"
        >
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => navigate(`/app/settings/${t.id}`)}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-all",
                currentTab.id === t.id
                  ? "bg-rose-50 text-rose-700 border border-rose-200"
                  : "text-text-secondary hover:bg-gray-50",
              )}
              aria-current={currentTab.id === t.id ? "page" : undefined}
            >
              <t.icon className="w-4 h-4 shrink-0" aria-hidden />
              {t.label}
            </button>
          ))}
        </nav>

        {/* Mobile tabs */}
        <div className="sm:hidden w-full mb-4">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => navigate(`/app/settings/${t.id}`)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all",
                  currentTab.id === t.id
                    ? "bg-rose-50 text-rose-700 border border-rose-200"
                    : "text-text-secondary border border-border bg-white",
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
              <currentTab.icon
                className="w-4.5 h-4.5 text-rose-600"
                aria-hidden
              />
              {currentTab.label}
            </h2>
          </div>
          {waitingOnProfile ? (
            <div className="flex items-center justify-center py-12 text-text-muted">
              <Loader2
                className="w-5 h-5 animate-spin"
                aria-label="Loading settings"
              />
            </div>
          ) : (
            // key remounts the tab so its state re-initialises from the loaded profile
            <TabContent key={currentTab.id} profile={profile} />
          )}
        </div>
      </div>
    </div>
  );
}
