import { useState } from "react";
import { MessageCircle, AlertTriangle, CheckCircle, Send } from "lucide-react";
import { Badge } from "@/components/atoms/Badge";
import { Input } from "@/components/atoms/Input";
import { Link } from "react-router-dom";
import { ROUTES } from "@/utils/constants";

const contactReasons = [
  { value: "general", label: "General question" },
  { value: "feedback", label: "Feedback about MamaGuide" },
  { value: "bug", label: "Report a technical issue" },
  { value: "medical", label: "Question about health content" },
  { value: "research", label: "Research collaboration" },
  { value: "other", label: "Other" },
];

const faqs = [
  {
    q: "Is MamaGuide free?",
    a: "Yes, MamaGuide is completely free for all users.",
  },
  {
    q: "How do I reset my password?",
    a: 'Use the "Forgot password" link on the login page.',
  },
  {
    q: "Is this a replacement for my doctor?",
    a: "No. MamaGuide provides educational information only — always see your doctor for medical decisions.",
  },
  {
    q: "Can I delete my account and data?",
    a: "Yes. Go to Settings > Privacy to delete your account and all associated data.",
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    reason: "general",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(field, value) {
    setForm((p) => ({ ...p, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-success-light flex items-center justify-center mx-auto mb-5">
          <CheckCircle className="w-8 h-8 text-success" aria-hidden />
        </div>
        <h1 className="font-display font-bold text-2xl text-text-primary mb-2">
          Message sent!
        </h1>
        <p className="text-text-secondary text-sm leading-relaxed mb-6">
          Thank you for reaching out. We will get back to you as soon as
          possible, usually within 2–3 business days.
        </p>
        <Link
          to={ROUTES.HOME}
          className="inline-flex items-center gap-2 bg-rose-700 text-white font-semibold px-6 py-3 rounded-xl hover:bg-rose-800 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 md:py-24">
      <div className="text-center mb-12">
        <Badge variant="rose" size="lg" className="mb-4">
          Get in Touch
        </Badge>
        <h1 className="font-display font-extrabold text-4xl md:text-5xl text-text-primary mb-4">
          Contact Us
        </h1>
        <p className="text-text-secondary max-w-xl mx-auto leading-relaxed">
          Have a question, feedback, or want to collaborate? We would love to
          hear from you.
        </p>
      </div>

      {/* Emergency notice */}
      <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl mb-8">
        <AlertTriangle
          className="w-5 h-5 text-red-600 shrink-0 mt-0.5"
          aria-hidden
        />
        <div>
          <p className="font-semibold text-sm text-red-800">
            Medical Emergency?
          </p>
          <p className="text-xs text-red-700 mt-0.5">
            This contact form is NOT for medical emergencies. If you have an
            emergency, call <strong>112</strong> immediately or go to your
            nearest hospital.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-5 gap-8">
        {/* Contact form */}
        <div className="md:col-span-3">
          <div className="bg-white rounded-3xl border border-border p-6 md:p-8">
            <h2 className="font-display font-bold text-xl text-text-primary mb-5">
              Send us a message
            </h2>
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <Input
                label="Your name"
                placeholder="e.g. Adaeze Okonkwo"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
              />
              <Input
                label="Email address"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
              />

              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">
                  Reason for contact
                </label>
                <select
                  value={form.reason}
                  onChange={(e) => handleChange("reason", e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-border bg-white text-sm text-text-primary focus:outline-2 focus:outline-rose-500"
                >
                  {contactReasons.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">
                  Message{" "}
                  <span className="text-error" aria-hidden>
                    *
                  </span>
                </label>
                <textarea
                  value={form.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  rows={5}
                  placeholder="Tell us how we can help..."
                  className="w-full px-4 py-3 rounded-xl border border-border bg-white text-sm text-text-primary resize-none focus:outline-2 focus:outline-rose-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading || !form.name || !form.email || !form.message}
                className="w-full h-12 bg-rose-700 text-white font-semibold rounded-xl hover:bg-rose-800 transition-colors disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <>
                    <Send className="w-4 h-4" aria-hidden />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="md:col-span-2 space-y-5">
          {/* Project info */}
          <div className="bg-warm-white rounded-2xl border border-border p-5">
            <h3 className="font-semibold text-sm text-text-primary mb-3">
              About This Project
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed mb-3">
              MamaGuide is a Final Year Project — a deep learning-based maternal
              health chatbot for Nigerian pregnant women and healthcare workers.
            </p>
            <p className="text-xs text-text-secondary leading-relaxed">
              Developed at a Nigerian university. For academic enquiries, please
              specify in your message.
            </p>
          </div>

          {/* Quick FAQs */}
          <div className="bg-white rounded-2xl border border-border p-5">
            <h3 className="font-semibold text-sm text-text-primary mb-3">
              Quick Answers
            </h3>
            <div className="space-y-3">
              {faqs.map((faq) => (
                <div key={faq.q}>
                  <p className="text-xs font-semibold text-text-primary">
                    {faq.q}
                  </p>
                  <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
            <Link
              to={ROUTES.FAQ}
              className="inline-flex items-center gap-1 text-xs text-rose-700 hover:underline font-medium mt-3"
            >
              See all FAQs →
            </Link>
          </div>

          {/* Chat link */}
          <div className="bg-rose-50 rounded-2xl border border-rose-200 p-5">
            <MessageCircle className="w-6 h-6 text-rose-600 mb-2" aria-hidden />
            <p className="font-semibold text-sm text-text-primary mb-1">
              Have a health question?
            </p>
            <p className="text-xs text-text-secondary mb-3">
              Ask MamaGuide directly — faster than email.
            </p>
            <Link
              to={ROUTES.REGISTER}
              className="inline-flex items-center gap-1.5 text-xs bg-rose-700 text-white font-semibold px-4 py-2 rounded-lg hover:bg-rose-800 transition-colors"
            >
              Start Chatting Free
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
