import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/utils/cn";
import {
  MessageCircle,
  BookOpen,
  User,
  Settings,
  LayoutDashboard,
  Heart,
  History,
  LogOut,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Baby,
  Apple,
  Shield,
  Syringe,
  Brain,
  Package,
  Droplets,
  Milk,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { ROUTES } from "@/utils/constants";
import { useAuth } from "@/hooks/useAuth";
import { useUIStore } from "@/store/useUIStore";
import { Avatar } from "@/components/atoms/Avatar";

const mainNav = [
  { icon: MessageCircle, label: "Chat", href: ROUTES.CHAT },
  { icon: LayoutDashboard, label: "Dashboard", href: ROUTES.DASHBOARD },
  {
    icon: BookOpen,
    label: "Education",
    href: ROUTES.EDUCATION,
    children: [
      {
        icon: Baby,
        label: "Trimester Guide",
        href: ROUTES.EDUCATION_TRIMESTER,
      },
      { icon: Apple, label: "Nutrition", href: ROUTES.EDUCATION_NUTRITION },
      {
        icon: AlertTriangle,
        label: "Danger Signs",
        href: ROUTES.EDUCATION_DANGER_SIGNS,
      },
      { icon: Shield, label: "ANC Schedule", href: ROUTES.EDUCATION_ANC },
      { icon: Syringe, label: "Vaccines", href: ROUTES.EDUCATION_VACCINES },
      {
        icon: Brain,
        label: "Mental Health",
        href: ROUTES.EDUCATION_MENTAL_HEALTH,
      },
      { icon: Package, label: "Birth Prep", href: ROUTES.EDUCATION_BIRTH_PREP },
      {
        icon: Droplets,
        label: "Postpartum",
        href: ROUTES.EDUCATION_POSTPARTUM,
      },
      {
        icon: Milk,
        label: "Breastfeeding",
        href: ROUTES.EDUCATION_BREASTFEEDING,
      },
    ],
  },
];

const bottomNav = [
  { icon: History, label: "Chat History", href: ROUTES.CHAT_HISTORY },
  { icon: User, label: "Profile", href: ROUTES.PROFILE },
  { icon: Settings, label: "Settings", href: ROUTES.SETTINGS },
];

export function AppSidebar() {
  const { user, signOut } = useAuth();
  const {
    sidebarOpen,
    setSidebarOpen,
    sidebarCollapsed,
    toggleSidebarCollapsed,
  } = useUIStore();
  const location = useLocation();

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  function isActive(href) {
    return (
      location.pathname === href || location.pathname.startsWith(href + "/")
    );
  }

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 h-full bg-white border-r border-border z-40",
          "flex flex-col transition-all duration-300 ease-in-out",
          // Width: mobile always w-64; desktop collapses to w-16
          sidebarCollapsed ? "w-64 md:w-16" : "w-64",
          // Visibility: mobile uses transform; desktop always visible
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
        aria-label="Application sidebar"
      >
        {/* ── Header ─────────────────────────────────────────── */}
        <div
          className={cn(
            "flex items-center h-16 border-b border-border shrink-0 transition-all duration-300",
            sidebarCollapsed
              ? "px-4 md:justify-center md:px-0"
              : "justify-between pl-5 pr-2",
          )}
        >
          {/* Full logo — shown when expanded, hidden on desktop when collapsed */}
          <Link
            to={ROUTES.HOME}
            className={cn(
              "flex items-center gap-2.5 shrink-0",
              sidebarCollapsed && "md:hidden",
            )}
            aria-label="MamaGuide home"
          >
            <span className="w-8 h-8 rounded-lg bg-brand-gradient flex items-center justify-center shrink-0">
              <Heart className="w-4 h-4 text-white fill-white" aria-hidden />
            </span>
            <span className="font-bold text-lg text-text-primary font-display">
              Mama<span className="text-rose-700">Guide</span>
            </span>
          </Link>

          {/* Icon-only logo — shown on desktop when collapsed */}
          <Link
            to={ROUTES.HOME}
            className={cn(
              "hidden items-center justify-center",
              sidebarCollapsed && "md:flex",
            )}
            aria-label="MamaGuide home"
            title="MamaGuide"
          >
            <span className="w-8 h-8 rounded-lg bg-brand-gradient flex items-center justify-center">
              <Heart className="w-4 h-4 text-white fill-white" aria-hidden />
            </span>
          </Link>

          {/* Mobile close button */}
          <button
            onClick={() => setSidebarOpen(false)}
            className={cn(
              "p-1.5 rounded-lg text-text-muted hover:bg-rose-50 hover:text-rose-700 transition-colors md:hidden",
              sidebarCollapsed && "hidden",
            )}
            aria-label="Close sidebar"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Desktop collapse toggle (visible only when expanded) */}
          <button
            onClick={toggleSidebarCollapsed}
            className={cn(
              "hidden md:flex p-1.5 rounded-lg text-text-muted hover:bg-rose-50 hover:text-rose-700 transition-colors",
              sidebarCollapsed && "md:hidden",
            )}
            aria-label="Collapse sidebar"
            title="Collapse sidebar"
          >
            <PanelLeftClose className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* ── Main navigation ───────────────────────────────── */}
        <nav
          className="flex-1 overflow-y-auto py-4 px-3"
          aria-label="App navigation"
        >
          <ul className="space-y-0.5" role="list">
            {mainNav.map((item) => (
              <NavItem
                key={item.href}
                item={item}
                isActive={isActive}
                collapsed={sidebarCollapsed}
                onClose={() => setSidebarOpen(false)}
              />
            ))}
          </ul>
        </nav>

        {/* ── Bottom section ────────────────────────────────── */}
        <div className="border-t border-border py-3 px-3 shrink-0">
          <ul className="space-y-0.5 mb-3" role="list">
            {bottomNav.map((item) => (
              <li key={item.href}>
                <Link
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  title={sidebarCollapsed ? item.label : undefined}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                    isActive(item.href)
                      ? "bg-rose-50 text-rose-700"
                      : "text-text-secondary hover:bg-gray-50 hover:text-text-primary",
                    sidebarCollapsed && "md:justify-center md:px-2",
                  )}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  aria-label={item.label}
                >
                  <item.icon className="w-4.5 h-4.5 shrink-0" aria-hidden />
                  <span
                    className={cn("truncate", sidebarCollapsed && "md:hidden")}
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {/* User card */}
          <div
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl bg-rose-50",
              sidebarCollapsed && "md:justify-center md:px-2 md:py-2 md:gap-0",
            )}
          >
            <Avatar name={user?.name} size="sm" className="shrink-0" />
            <div
              className={cn(
                "flex-1 min-w-0 ml-0",
                sidebarCollapsed && "md:hidden",
              )}
            >
              <p className="text-sm font-semibold text-text-primary truncate">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-text-muted truncate capitalize">
                {user?.role?.replace("_", " ")}
              </p>
            </div>
            <button
              onClick={signOut}
              title="Sign out"
              className={cn(
                "p-1.5 rounded-lg text-text-muted hover:text-error hover:bg-error-light transition-all shrink-0",
                sidebarCollapsed && "md:hidden",
              )}
              aria-label="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Expand toggle — only visible on desktop when collapsed */}
          <button
            onClick={toggleSidebarCollapsed}
            title="Expand sidebar"
            aria-label="Expand sidebar"
            className={cn(
              "hidden w-full mt-2 py-2 rounded-xl border border-border text-text-muted",
              "hover:text-rose-700 hover:border-rose-200 hover:bg-rose-50 transition-all",
              "items-center justify-center",
              sidebarCollapsed && "md:flex",
            )}
          >
            <PanelLeftOpen className="w-4 h-4" />
          </button>
        </div>
      </aside>
    </>
  );
}

function NavItem({ item, isActive, collapsed, onClose }) {
  const [expanded, setExpanded] = useState(false);
  const active = isActive(item.href);

  const linkClass = cn(
    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
    active
      ? "bg-rose-50 text-rose-700 shadow-xs"
      : "text-text-secondary hover:bg-gray-50 hover:text-text-primary",
    collapsed && "md:justify-center md:px-2",
  );

  if (!item.children) {
    return (
      <li>
        <Link
          to={item.href}
          onClick={onClose}
          title={collapsed ? item.label : undefined}
          className={linkClass}
          aria-current={active ? "page" : undefined}
          aria-label={item.label}
        >
          <item.icon className="w-4.5 h-4.5 shrink-0" aria-hidden />
          <span className={cn("truncate", collapsed && "md:hidden")}>
            {item.label}
          </span>
        </Link>
      </li>
    );
  }

  return (
    <li>
      <button
        onClick={() => setExpanded((v) => !v)}
        title={collapsed ? item.label : undefined}
        className={cn(linkClass, "w-full")}
        aria-expanded={expanded}
        aria-label={item.label}
      >
        <item.icon className="w-4.5 h-4.5 shrink-0" aria-hidden />
        <span
          className={cn("flex-1 text-left truncate", collapsed && "md:hidden")}
        >
          {item.label}
        </span>
        <ChevronRight
          className={cn(
            "w-4 h-4 transition-transform duration-200 shrink-0",
            expanded && "rotate-90",
            collapsed && "md:hidden",
          )}
          aria-hidden
        />
      </button>

      {/* Sub-items: hidden on collapsed desktop via md:hidden */}
      {expanded && (
        <ul
          className={cn(
            "mt-1 ml-7 space-y-0.5 border-l border-border pl-3",
            collapsed && "md:hidden",
          )}
          role="list"
        >
          {item.children.map((child) => (
            <li key={child.href}>
              <Link
                to={child.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-medium transition-all",
                  isActive(child.href)
                    ? "text-rose-700 bg-rose-50"
                    : "text-text-muted hover:text-text-primary hover:bg-gray-50",
                )}
              >
                <child.icon className="w-3.5 h-3.5 shrink-0" aria-hidden />
                {child.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
