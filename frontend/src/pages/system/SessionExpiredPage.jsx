import { Link } from "react-router-dom";
import { Clock, LogIn } from "lucide-react";
import { ROUTES } from "@/utils/constants";

export default function SessionExpiredPage() {
  return (
    <div className="min-h-dvh bg-hero-gradient flex flex-col items-center justify-center px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-5 animate-bounce-in">
        <Clock className="w-10 h-10 text-amber-600" aria-hidden />
      </div>
      <h1 className="font-display font-bold text-2xl text-text-primary mb-2">
        Session Expired
      </h1>
      <p className="text-text-secondary text-sm max-w-sm leading-relaxed mb-6">
        Your session has expired for security. Please sign in again to continue
        using MamaGuide.
      </p>
      <Link
        to={ROUTES.LOGIN}
        className="inline-flex items-center gap-2 bg-rose-700 text-white font-semibold px-6 py-3 rounded-xl hover:bg-rose-800 transition-colors shadow-sm"
      >
        <LogIn className="w-4 h-4" aria-hidden />
        Sign In Again
      </Link>
    </div>
  );
}
