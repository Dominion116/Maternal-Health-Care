import { Outlet, Link } from "react-router-dom";
import { Heart, Shield, Users, BookOpen } from "lucide-react";
import { ROUTES } from "@/utils/constants";

const trustItems = [
  {
    icon: Shield,
    title: "Safe & Private",
    desc: "Your health data stays secure and private.",
  },
  {
    icon: BookOpen,
    title: "WHO-Based Knowledge",
    desc: "Guidance from WHO ANC guidelines.",
  },
  {
    icon: Users,
    title: "For Nigerian Mothers",
    desc: "Designed for the Nigerian healthcare context.",
  },
];

export function AuthLayout() {
  return (
    <div className="min-h-dvh flex bg-warm-white">
      {/* Left — decorative panel (tablet+) */}
      <div className="hidden md:flex md:w-2/5 lg:w-1/2 bg-brand-gradient flex-col justify-between p-10 relative overflow-hidden">
        {/* decorative circles */}
        <div
          className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/10"
          aria-hidden
        />
        <div
          className="absolute bottom-20 -left-16 w-56 h-56 rounded-full bg-white/10"
          aria-hidden
        />
        <div
          className="absolute top-1/3 right-8 w-32 h-32 rounded-full bg-white/5"
          aria-hidden
        />

        <Link
          to={ROUTES.HOME}
          className="flex items-center gap-2 relative z-10"
          aria-label="MamaGuide home"
        >
          <span className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <Heart className="w-5 h-5 text-white fill-white" aria-hidden />
          </span>
          <span className="font-bold text-2xl text-white font-display">
            MamaGuide
          </span>
        </Link>

        <div className="relative z-10">
          <blockquote className="text-white text-2xl lg:text-3xl font-display font-bold leading-snug mb-3">
            "Every mother deserves access to quality health information."
          </blockquote>
          <p className="text-white/70 text-sm">
            WHO ANC Guidelines · FMOH Nigeria Protocols
          </p>
        </div>

        <div className="relative z-10 space-y-3">
          {trustItems.map((item) => (
            <div key={item.title} className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                <item.icon className="w-4.5 h-4.5 text-white" aria-hidden />
              </span>
              <div>
                <p className="text-white text-sm font-semibold">{item.title}</p>
                <p className="text-white/70 text-xs">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right — form area */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 py-10">
        {/* Mobile logo */}
        <Link
          to={ROUTES.HOME}
          className="md:hidden flex items-center gap-2 mb-8"
        >
          <span className="w-9 h-9 rounded-xl bg-brand-gradient flex items-center justify-center shadow-rose">
            <Heart className="w-4 h-4 text-white fill-white" aria-hidden />
          </span>
          <span className="font-bold text-xl font-display text-text-primary">
            Mama<span className="text-rose-700">Guide</span>
          </span>
        </Link>

        <div className="w-full max-w-md">
          <Outlet />
        </div>

        <p className="mt-8 text-xs text-text-muted text-center max-w-sm leading-relaxed">
          MamaGuide provides educational information only and does not replace
          professional medical advice.
        </p>
      </div>
    </div>
  );
}
