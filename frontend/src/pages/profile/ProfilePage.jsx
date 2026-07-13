import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Edit2,
  Save,
  X,
  Shield,
  Bell,
  Globe,
  Accessibility,
} from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Card } from "@/components/atoms/Card";
import { Badge } from "@/components/atoms/Badge";
import { Avatar } from "@/components/atoms/Avatar";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES, ROLE_LABELS } from "@/utils/constants";

const settingsLinks = [
  {
    icon: Bell,
    label: "Notifications",
    href: ROUTES.SETTINGS_NOTIFICATIONS,
    desc: "Manage ANC reminders",
  },
  {
    icon: Shield,
    label: "Privacy",
    href: ROUTES.SETTINGS_PRIVACY,
    desc: "Control your data",
  },
  {
    icon: Globe,
    label: "Language",
    href: ROUTES.SETTINGS_LANGUAGE,
    desc: "Switch language",
  },
  {
    icon: Accessibility,
    label: "Accessibility",
    href: ROUTES.SETTINGS_ACCESSIBILITY,
    desc: "Font size, contrast",
  },
];

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
  });

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-NG", {
        month: "long",
        year: "numeric",
      })
    : null;

  async function handleSave() {
    if (!form.name.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }
    setSaving(true);
    const result = await updateUser({
      name: form.name.trim(),
      phone: form.phone.trim(),
    });
    setSaving(false);
    if (result.success) {
      toast.success("Profile updated.");
      setEditing(false);
    } else {
      toast.error(result.error);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-5">
      {/* Profile card */}
      <Card>
        <div className="flex items-start gap-4">
          <Avatar name={user?.name} size="xl" />
          <div className="flex-1 min-w-0">
            {editing ? (
              <div className="space-y-3">
                <Input
                  label="Full name"
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  icon={<User className="w-4 h-4" />}
                />
                <Input
                  label="Phone number"
                  type="tel"
                  value={form.phone}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, phone: e.target.value }))
                  }
                  icon={<Phone className="w-4 h-4" />}
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleSave}
                    disabled={saving}
                    icon={<Save className="w-4 h-4" />}
                  >
                    {saving ? "Saving…" : "Save"}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditing(false)}
                    icon={<X className="w-4 h-4" />}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="font-display font-bold text-xl text-text-primary">
                    {user?.name}
                  </h1>
                  <button
                    onClick={() => setEditing(true)}
                    className="p-1.5 rounded-lg text-text-muted hover:text-rose-700 hover:bg-rose-50 transition-colors"
                    aria-label="Edit profile"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <Badge variant="rose" size="sm" className="mb-2.5">
                  {ROLE_LABELS[user?.role] || user?.role}
                </Badge>
                <div className="space-y-1.5 text-sm text-text-secondary">
                  <p className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-text-muted" aria-hidden />
                    {user?.email}
                  </p>
                  {user?.phone && (
                    <p className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-text-muted" aria-hidden />
                      {user.phone}
                    </p>
                  )}
                  {memberSince && (
                    <p className="flex items-center gap-2">
                      <Calendar
                        className="w-4 h-4 text-text-muted"
                        aria-hidden
                      />
                      Member since {memberSince}
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </Card>

      {/* Settings links */}
      <div>
        <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-3 px-1">
          Settings
        </h2>
        <div className="space-y-2">
          {settingsLinks.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="flex items-center gap-3.5 bg-white rounded-2xl border border-border px-4 py-3.5 hover:shadow-sm transition-all group"
            >
              <span className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
                <item.icon className="w-4.5 h-4.5 text-rose-600" aria-hidden />
              </span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-text-primary group-hover:text-rose-700 transition-colors">
                  {item.label}
                </p>
                <p className="text-xs text-text-muted">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Evaluation */}
      <Card className="bg-sage-50 border-sage-200">
        <h2 className="font-semibold text-sm text-sage-900 mb-1">
          Research Participation
        </h2>
        <p className="text-xs text-sage-700 mb-3 leading-relaxed">
          Help improve MamaGuide by completing the System Usability Scale (SUS)
          questionnaire.
        </p>
        <Button
          as={Link}
          to={ROUTES.SUS_QUESTIONNAIRE}
          variant="sage"
          size="sm"
        >
          Complete SUS Evaluation
        </Button>
      </Card>
    </div>
  );
}
