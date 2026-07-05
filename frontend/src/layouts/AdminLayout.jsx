import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { ScrollRestorer } from "@/components/atoms/ScrollRestorer";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  BarChart3,
  ClipboardCheck,
  ThumbsUp,
  Database,
  FileText,
  Heart,
  LogOut,
  ChevronRight,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  X,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { ROUTES } from "@/utils/constants";
import { useAuth } from "@/hooks/useAuth";
import { Avatar } from "@/components/atoms/Avatar";

const adminNav = [
  { icon: LayoutDashboard, label: "Dashboard", href: ROUTES.ADMIN_DASHBOARD },
  { icon: Users, label: "Users", href: ROUTES.ADMIN_USERS },
  {
    icon: MessageSquare,
    label: "Conversations",
    href: ROUTES.ADMIN_CONVERSATIONS,
  },
  { icon: BarChart3, label: "Analytics", href: ROUTES.ADMIN_ANALYTICS },
  { icon: ClipboardCheck, label: "SUS Evaluation", href: ROUTES.ADMIN_SUS },
  { icon: ThumbsUp, label: "Feedback", href: ROUTES.ADMIN_FEEDBACK },
  { icon: Database, label: "Knowledge Base", href: ROUTES.ADMIN_KNOWLEDGE },
  { icon: FileText, label: "Reports", href: ROUTES.ADMIN_REPORTS },
];

const getLocalBool = (key, fallback = false) => {
  try {
    const v = localStorage.getItem(key);
    return v === null ? fallback : v === "true";
  } catch {
    return fallback;
  }
};

export function AdminLayout() {
  const { user, signOut } = useAuth();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(() =>
    getLocalBool("admin_sidebar_collapsed", false),
  );
  const [mobileOpen, setMobileOpen] = useState(false);

  function toggleCollapsed() {
    const next = !collapsed;
    setCollapsed(next);
    try {
      localStorage.setItem("admin_sidebar_collapsed", next);
    } catch {
      console.warn("admin_sidebar_collapsed not saved");
    }
  }

  function isActive(href) {
    return (
      location.pathname === href || location.pathname.startsWith(href + "/")
    );
  }

  // Readable page name from URL for breadcrumb
  const pageName =
    location.pathname.split("/").pop()?.replace(/-/g, " ") || "Dashboard";

  return (
    <div className="min-h-dvh flex bg-gray-50">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
      )}

      {/* ── Admin sidebar ──────────────────────────────────── */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full bg-slate-900 z-40 flex flex-col",
          "transition-all duration-300 ease-in-out",
          // Desktop width
          collapsed ? "w-16" : "w-64",
          // Mobile: drawer
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
        aria-label="Admin navigation"
      >
        {/* Header */}
        <div
          className={cn(
            "flex items-center h-16 border-b border-white/10 shrink-0 transition-all duration-300",
            collapsed ? "justify-center px-0" : "justify-between px-5",
          )}
        >
          {/* Full logo */}
          <Link
            to={ROUTES.HOME}
            onClick={() => setMobileOpen(false)}
            className={cn(
              "flex items-center gap-2 shrink-0",
              collapsed && "hidden",
            )}
            aria-label="MamaGuide home"
          >
            <span className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center shrink-0">
              <Heart className="w-4 h-4 text-white fill-white" aria-hidden />
            </span>
            <span className="font-bold text-white font-display truncate">
              MamaGuide
            </span>
          </Link>

          {/* Icon logo when collapsed */}
          <Link
            to={ROUTES.HOME}
            onClick={() => setMobileOpen(false)}
            className={cn(
              "hidden items-center justify-center",
              collapsed && "flex",
            )}
            aria-label="MamaGuide home"
            title="MamaGuide Admin"
          >
            <span className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center">
              <Heart className="w-4 h-4 text-white fill-white" aria-hidden />
            </span>
          </Link>

          {/* Desktop collapse toggle (shown when expanded) */}
          <button
            onClick={toggleCollapsed}
            className={cn(
              "p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all",
              collapsed && "hidden",
            )}
            aria-label="Collapse sidebar"
            title="Collapse sidebar"
          >
            <PanelLeftClose className="w-4.5 h-4.5" />
          </button>

          {/* Mobile close */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav items */}
        <nav
          className="flex-1 py-4 px-3 overflow-y-auto"
          aria-label="Admin menu"
        >
          <ul className="space-y-0.5" role="list">
            {adminNav.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    title={collapsed ? item.label : undefined}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                      active
                        ? "bg-rose-600/20 text-rose-300"
                        : "text-slate-400 hover:bg-white/5 hover:text-white",
                      collapsed && "justify-center px-2",
                    )}
                    aria-current={active ? "page" : undefined}
                    aria-label={item.label}
                  >
                    <item.icon className="w-4.5 h-4.5 shrink-0" aria-hidden />
                    <span className={cn("truncate", collapsed && "hidden")}>
                      {item.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User card */}
        <div className="p-3 border-t border-white/10 shrink-0">
          <div
            className={cn(
              "flex items-center gap-3",
              collapsed && "flex-col gap-2",
            )}
          >
            <Avatar
              name={user?.name}
              size="sm"
              className="bg-rose-700/30 text-rose-300 shrink-0"
            />
            <div className={cn("flex-1 min-w-0", collapsed && "hidden")}>
              <p className="text-sm font-semibold text-white truncate">
                {user?.name}
              </p>
              <p className="text-xs text-slate-400 truncate capitalize">
                {user?.role}
              </p>
            </div>
            <button
              onClick={signOut}
              title="Sign out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-white/5 transition-all shrink-0"
              aria-label="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Expand button when collapsed */}
          <button
            onClick={toggleCollapsed}
            title="Expand sidebar"
            aria-label="Expand sidebar"
            className={cn(
              "hidden w-full mt-2 py-2 rounded-xl border border-white/10 text-slate-400",
              "hover:text-white hover:border-white/20 hover:bg-white/5 transition-all",
              "items-center justify-center",
              collapsed && "flex",
            )}
          >
            <PanelLeftOpen className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* ── Content area ──────────────────────────────────── */}
      <div
        id="admin-scroll"
        className={cn(
          "flex-1 flex flex-col min-w-0 overflow-auto transition-[margin] duration-300 ease-in-out",
          collapsed ? "lg:ml-16" : "lg:ml-64",
        )}
      >
        <ScrollRestorer />
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-4 md:px-6 h-14 md:h-16 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-2 text-sm text-gray-500"
            >
              <Link
                to={ROUTES.ADMIN_DASHBOARD}
                onClick={() => setMobileOpen(false)}
                className="hover:text-rose-700 transition-colors font-medium"
              >
                Admin
              </Link>
              <ChevronRight className="w-4 h-4" aria-hidden />
              <span className="font-semibold text-gray-800 capitalize">
                {pageName}
              </span>
            </nav>
          </div>
        </header>

        {/* Page content with consistent max-width */}
        <main className="flex-1 p-4 md:p-6" id="admin-main">
          <div className="max-w-8xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
