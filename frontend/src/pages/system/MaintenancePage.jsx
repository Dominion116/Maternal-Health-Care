import { Heart, Clock, RefreshCw, Phone } from "lucide-react";

export default function MaintenancePage() {
  function handleRefresh() {
    window.location.reload();
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-rose-50 via-white to-pink-50 flex flex-col items-center justify-center px-4 py-16 text-center">
      {/* Icon */}
      <div className="relative mb-6">
        <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center">
          <Heart className="w-10 h-10 text-rose-500" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center border-2 border-white">
          <Clock className="w-4 h-4 text-amber-600" />
        </div>
      </div>

      <h1 className="font-display font-bold text-2xl text-gray-900 mb-2">
        MamaGuide is resting
      </h1>
      <p className="text-gray-500 text-sm leading-relaxed mb-1 max-w-sm">
        We are performing scheduled maintenance to make MamaGuide better for
        you.
      </p>
      <p className="text-gray-400 text-xs leading-relaxed mb-8 max-w-xs">
        We will be back shortly. Thank you for your patience.
      </p>

      {/* Estimated time */}
      <div className="bg-white border border-gray-200 rounded-2xl px-6 py-4 mb-8 inline-flex items-center gap-3">
        <Clock className="w-5 h-5 text-rose-500 shrink-0" />
        <div className="text-left">
          <p className="text-xs font-semibold text-gray-700">
            Expected back online
          </p>
          <p className="text-sm font-bold text-gray-900 mt-0.5">
            Within a few hours
          </p>
        </div>
      </div>

      {/* Emergency notice */}
      <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-8 max-w-sm w-full text-left">
        <div className="flex items-start gap-3">
          <Phone className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-sm text-red-800 mb-1">
              Experiencing a health emergency?
            </p>
            <p className="text-xs text-red-700 leading-relaxed mb-2">
              Do not wait for MamaGuide. Call emergency services or go to your
              nearest health facility immediately.
            </p>
            <a
              href="tel:112"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-red-600 px-3 py-1.5 rounded-lg hover:bg-red-700 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              Call 112 Now
            </a>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
        <button
          onClick={handleRefresh}
          className="flex-1 flex items-center justify-center gap-2 h-11 bg-rose-700 text-white font-semibold rounded-xl hover:bg-rose-800 transition-colors text-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Try again
        </button>
        <a
          href="mailto:support@mamaguide.ng"
          className="flex-1 flex items-center justify-center gap-2 h-11 border border-gray-200 bg-white text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors text-sm"
        >
          Contact us
        </a>
      </div>

      <p className="text-xs text-gray-400 mt-8">
        MamaGuide — Supporting mothers across Nigeria
      </p>
    </div>
  );
}
