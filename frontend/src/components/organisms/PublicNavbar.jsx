import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Heart } from "lucide-react";
import { cn } from "@/utils/cn";
import { Button } from "@/components/atoms/Button";
import { ROUTES } from "@/utils/constants";
import { useAuth } from "@/hooks/useAuth";

const navLinks = [
  { label: "About", href: ROUTES.ABOUT },
  { label: "Features", href: ROUTES.FEATURES },
  { label: "How It Works", href: ROUTES.HOW_IT_WORKS },
  { label: "Resources", href: ROUTES.RESOURCES },
  { label: "FAQ", href: ROUTES.FAQ },
];

export function PublicNavbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-border"
          : "bg-transparent",
      )}
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav
          className="flex items-center justify-between h-16"
          aria-label="Main navigation"
        >
          <Link
            to={ROUTES.HOME}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 group"
            aria-label="MamaGuide home"
          >
            <span className="w-9 h-9 rounded-xl bg-brand-gradient flex items-center justify-center shadow-sm group-hover:shadow-rose transition-shadow">
              <Heart className="w-4 h-4 text-white fill-white" aria-hidden />
            </span>
            <span className="font-bold text-xl text-text-primary font-display">
              Mama<span className="text-rose-700">Guide</span>
            </span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-1" role="list">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  to={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "px-3.5 py-2 rounded-lg text-sm font-medium transition-colors",
                    location.pathname === link.href
                      ? "text-rose-700 bg-rose-50"
                      : "text-text-secondary hover:text-rose-700 hover:bg-rose-50",
                  )}
                  aria-current={
                    location.pathname === link.href ? "page" : undefined
                  }
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <Button as={Link} to={ROUTES.CHAT} size="sm">
                Open Chat
              </Button>
            ) : (
              <>
                <Button
                  as={Link}
                  onClick={() => setOpen(false)}
                  to={ROUTES.LOGIN}
                  variant="ghost"
                  size="sm"
                >
                  Sign In
                </Button>
                <Button
                  as={Link}
                  onClick={() => setOpen(false)}
                  to={ROUTES.REGISTER}
                  size="sm"
                >
                  Get Started Free
                </Button>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden p-2 rounded-lg text-text-secondary hover:bg-rose-50 hover:text-rose-700 transition-colors"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          id="mobile-nav"
          className="md:hidden bg-white border-b border-border shadow-lg animate-fade-in-down"
        >
          <div className="max-w-7xl mx-auto px-4 pb-4 pt-2">
            <ul className="flex flex-col gap-1 mb-4" role="list">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "block px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                      location.pathname === link.href
                        ? "text-rose-700 bg-rose-50"
                        : "text-text-secondary hover:text-rose-700 hover:bg-rose-50",
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-2">
              {isAuthenticated ? (
                <Button
                  as={Link}
                  to={ROUTES.CHAT}
                  fullWidth
                  onClick={() => setOpen(false)}
                >
                  Open Chat
                </Button>
              ) : (
                <>
                  <Button
                    as={Link}
                    to={ROUTES.LOGIN}
                    variant="secondary"
                    onClick={() => setOpen(false)}
                    fullWidth
                  >
                    Sign In
                  </Button>
                  <Button
                    as={Link}
                    onClick={() => setOpen(false)}
                    to={ROUTES.REGISTER}
                    fullWidth
                  >
                    Get Started Free
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
