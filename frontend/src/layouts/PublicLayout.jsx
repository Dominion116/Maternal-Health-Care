import { Outlet, Link } from "react-router-dom";
import { PublicNavbar } from "@/components/organisms/PublicNavbar";
import { ScrollRestorer } from "@/components/atoms/ScrollRestorer";
import { Heart } from "lucide-react";
import { ROUTES } from "@/utils/constants";

const footerLinks = {
  Product: [
    { label: "Features", href: ROUTES.FEATURES },
    { label: "How It Works", href: ROUTES.HOW_IT_WORKS },
    { label: "Resources", href: ROUTES.RESOURCES },
    { label: "FAQ", href: ROUTES.FAQ },
  ],
  Legal: [
    { label: "Privacy Policy", href: ROUTES.PRIVACY },
    { label: "Terms of Service", href: ROUTES.TERMS },
    { label: "Accessibility", href: ROUTES.ACCESSIBILITY },
  ],
  About: [
    { label: "About Project", href: ROUTES.ABOUT },
    { label: "Contact", href: ROUTES.CONTACT },
  ],
};

export function PublicLayout() {
  return (
    <div className="min-h-dvh flex flex-col bg-warm-white">
      <ScrollRestorer />
      <PublicNavbar />

      <main className="flex-1 pt-16" id="main-content">
        <Outlet />
      </main>

      <footer
        className="bg-white border-t border-border mt-auto"
        role="contentinfo"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <Link to={ROUTES.HOME} className="flex items-center gap-2 mb-3">
                <span className="w-8 h-8 rounded-lg bg-brand-gradient flex items-center justify-center">
                  <Heart
                    className="w-4 h-4 text-white fill-white"
                    aria-hidden
                  />
                </span>
                <span className="font-bold text-lg font-display text-text-primary">
                  Mama<span className="text-rose-700">Guide</span>
                </span>
              </Link>
              <p className="text-sm text-text-secondary leading-relaxed">
                AI-powered maternal health education for Nigerian mothers and
                healthcare workers.
              </p>
              <p className="text-xs text-text-muted mt-3">
                Powered by WHO ANC guidelines &amp; FMOH Nigeria protocols
              </p>
            </div>

            {/* Links */}
            {Object.entries(footerLinks).map(([group, links]) => (
              <div key={group}>
                <h3 className="text-sm font-semibold text-text-primary mb-3">
                  {group}
                </h3>
                <ul className="space-y-2" role="list">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link
                        to={link.href}
                        className="text-sm text-text-secondary hover:text-rose-700 transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-text-muted text-center sm:text-left">
              © 2025 MamaGuide Final Year Project. Educational purposes only.
            </p>
            <p className="text-xs text-text-muted text-center">
              Not a substitute for professional medical advice.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
