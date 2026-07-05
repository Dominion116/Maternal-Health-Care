import { useState, useMemo } from "react";
import {
  ChevronDown,
  Search,
  MessageCircle,
  HelpCircle,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { ROUTES } from "@/utils/constants";
import { cn } from "@/utils/cn";

const categories = [
  {
    id: "chatbot",
    label: "Chatbot Usage",
    badge: "info",
    faqs: [
      {
        q: "What is MamaGuide?",
        a: "MamaGuide is an AI-powered maternal health education chatbot. It answers questions about pregnancy, antenatal care (ANC), nutrition, danger signs, labour preparation, and postpartum care — all based on WHO guidelines and Nigerian FMOH ANC protocols. It was developed as a Final Year Project to help bridge the maternal health information gap in Nigeria.",
      },
      {
        q: "Is MamaGuide a replacement for my doctor or midwife?",
        a: "No. MamaGuide is an educational tool only. It provides general health information but cannot examine you, run tests, or diagnose conditions. Always consult a qualified healthcare professional — a doctor, midwife, or nurse — for personal medical advice, especially if you have symptoms or concerns.",
      },
      {
        q: "How accurate is MamaGuide?",
        a: "MamaGuide's AI model is trained on the MOTHER dataset and verified WHO/FMOH guidelines. Each response includes a confidence score — shown as a percentage. When confidence is low (below 70%), MamaGuide will say so and recommend consulting your healthcare provider. The model is periodically reviewed by the development team.",
      },
      {
        q: "What topics can MamaGuide answer?",
        a: "MamaGuide can answer questions about: pregnancy symptoms and what is normal, antenatal care (ANC) visits and what to expect, nutrition and diet during pregnancy, danger signs that require urgent care, fetal development and movement, labour and delivery preparation, postpartum recovery and newborn care, and breastfeeding basics.",
      },
      {
        q: "Does MamaGuide work offline?",
        a: "The chat feature requires an internet connection to process messages through the AI. However, the Education library pages may be available from your browser cache if you have visited them before. MamaGuide will show a connection warning when offline and will automatically reconnect when internet is restored.",
      },
      {
        q: "How do I report an incorrect or harmful answer?",
        a: "Use the thumbs down button below any chatbot response to flag it. You can also leave a comment explaining the problem. Flagged responses are reviewed by the development team and used to improve the AI model. You can also use the Contact page to report serious concerns directly.",
      },
      {
        q: "Can ANC nurses and healthcare workers use MamaGuide?",
        a: 'Yes. MamaGuide has a dedicated interface for healthcare workers. Nurses and midwives can use MamaGuide to supplement patient education sessions, quickly reference clinical guidelines, and access evidence-based information during consultations. Register with the "Healthcare Worker" role for access to the clinical reference view.',
      },
    ],
  },
  {
    id: "pregnancy",
    label: "Pregnancy Information",
    badge: "rose",
    faqs: [
      {
        q: "How many ANC visits should I attend?",
        a: "The World Health Organisation (WHO) recommends a minimum of 8 antenatal care contacts during pregnancy. In Nigeria, the FMOH recommends starting ANC before 12 weeks (first trimester). Your ANC visits cover blood pressure monitoring, blood tests, ultrasound scans, HIV testing, tetanus vaccination, iron supplementation, and birth planning.",
      },
      {
        q: "What are the danger signs I should watch for during pregnancy?",
        a: "Seek emergency care immediately if you experience: heavy vaginal bleeding, severe headache with blurred vision (may indicate pre-eclampsia), sudden swelling of the face, hands, or feet, reduced or absent fetal movement after 28 weeks, severe abdominal pain, fever above 38°C, difficulty breathing, or loss of consciousness. Call 112 or go to your nearest hospital.",
      },
      {
        q: "What foods should I eat during pregnancy?",
        a: "A healthy pregnancy diet includes: dark leafy vegetables (ugwu, spinach) for iron and folate, protein from beans, eggs, fish, or lean meat, dairy or calcium-rich foods, whole grains, fruits for vitamins, and adequate water (8–10 glasses daily). Avoid raw meat, unpasteurised milk, excess sugar, and alcohol entirely during pregnancy.",
      },
      {
        q: "When should I start taking folic acid?",
        a: "Folic acid (folate) should ideally be started at least 1 month BEFORE becoming pregnant and continued through the first 12 weeks of pregnancy. It reduces the risk of neural tube defects. If you are already pregnant and have not started, begin immediately and tell your ANC provider. The standard dose is 400–800 micrograms daily.",
      },
    ],
  },
  {
    id: "privacy",
    label: "Data & Privacy",
    badge: "sage",
    faqs: [
      {
        q: "Is my health information kept private?",
        a: "Yes. MamaGuide takes your privacy seriously. Your conversations and personal data are stored securely using encrypted storage. We do not sell or share your data with third parties. MamaGuide complies with the Nigeria Data Protection Regulation (NDPR) 2019. Read our full Privacy Policy for details.",
      },
      {
        q: "Who can see my chat messages?",
        a: "Your chat messages are private by default. The development team may access anonymised, aggregated chat data for academic research and AI model improvement — but individual conversations are not reviewed without your consent. Chat data used in the research study is anonymised before analysis.",
      },
      {
        q: "Can I delete my account and data?",
        a: "Yes. Go to Settings → Privacy → Delete Account to permanently delete your account and all associated data. Deletion is processed within 30 days. Once deleted, your data cannot be recovered. You may also request data deletion by contacting us through the Contact page.",
      },
      {
        q: "Does MamaGuide use cookies?",
        a: "MamaGuide uses essential cookies for authentication (keeping you logged in) and preference storage (such as sidebar state). We do not use advertising or third-party tracking cookies. You can clear cookies at any time via your browser settings, but this will log you out of your account.",
      },
    ],
  },
  {
    id: "account",
    label: "Account Issues",
    badge: "amber",
    faqs: [
      {
        q: "I forgot my password. How do I reset it?",
        a: 'On the login page, click "Forgot password?" and enter your registered email address. You will receive a password reset link within a few minutes. Check your spam folder if it does not arrive. The reset link expires after 1 hour. If you still cannot log in, contact us via the Contact page.',
      },
      {
        q: "Why was my account suspended?",
        a: "Accounts may be suspended for violating the Terms of Service — including attempting to manipulate the AI, creating multiple accounts, impersonating healthcare professionals, or posting harmful content. If you believe your account was suspended in error, contact us via the Contact page with your registered email address and we will review the decision.",
      },
      {
        q: "How do I change my pregnancy information or due date?",
        a: "Go to Settings → Profile → Edit Profile to update your pregnancy details, due date, and trimester. Keeping this information accurate helps MamaGuide tailor responses to your specific stage of pregnancy. Changes take effect immediately.",
      },
      {
        q: "Is MamaGuide free to use?",
        a: "Yes, MamaGuide is completely free for all users. There are no subscription fees, in-app purchases, or hidden charges. It was developed as a Final Year Project to improve maternal health outcomes in Nigeria, with the goal of remaining free and accessible.",
      },
    ],
  },
  {
    id: "emergency",
    label: "Emergency Help",
    badge: "error",
    faqs: [
      {
        q: "What should I do in a pregnancy emergency?",
        a: "If you or someone else is experiencing a pregnancy emergency — such as heavy bleeding, loss of consciousness, severe headache with vision changes, or no fetal movement — STOP using the app and call 112 immediately or go to the nearest hospital emergency unit. Do not wait for MamaGuide to respond. Every minute matters in a maternal emergency.",
      },
      {
        q: "What are the emergency phone numbers in Nigeria?",
        a: "Key emergency contacts in Nigeria: General emergency: 112 (free from any network), LASAMBUS (Lagos Ambulance): 0800 037 2867, Lagos State Emergency: 767, Federal Fire Service: 199. Save these numbers in your phone now, before you need them. MamaGuide also displays these numbers whenever it detects a potential emergency in your question.",
      },
      {
        q: "Does MamaGuide detect emergencies automatically?",
        a: "MamaGuide includes an emergency detection system that recognises danger sign keywords (such as 'heavy bleeding', 'no movement', 'severe headache'). When detected, MamaGuide immediately displays emergency contact information and advises you to seek help. However, this system is not infallible — if you are unsure, always call 112 rather than waiting for the chatbot to confirm.",
      },
    ],
  },
  {
    id: "language",
    label: "Language Support",
    badge: "info",
    faqs: [
      {
        q: "What languages does MamaGuide currently support?",
        a: "MamaGuide currently supports English only. The interface, chatbot responses, and all educational content are in English. We recognise this is a significant limitation for many Nigerian mothers, and multilingual support is our top development priority.",
      },
      {
        q: "Will Yoruba, Hausa, or Igbo be added?",
        a: "Yes. Yoruba, Hausa, and Igbo language support are planned for future updates. Yoruba is targeted as the first additional language. We are working on both the AI model training data and the interface translations. We will announce availability through the app.",
      },
      {
        q: "How can I use MamaGuide if my English is limited?",
        a: "You can use your browser's built-in translation feature — Google Chrome will offer to translate pages automatically. You can also use Google Translate to write your question in your language and translate MamaGuide's response. If you need urgent help, ask a healthcare worker, family member, or neighbour to assist with translation.",
      },
    ],
  },
];

function FAQItem({ faq, searchQuery }) {
  const [open, setOpen] = useState(false);

  const highlight = (text) => {
    if (!searchQuery) return text;
    const regex = new RegExp(
      `(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
      "gi",
    );
    return text.split(regex).map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-amber-200 text-text-primary rounded px-0.5">
          {part}
        </mark>
      ) : (
        part
      ),
    );
  };

  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 py-4 text-left"
        aria-expanded={open}
      >
        <span className="text-sm font-semibold text-text-primary leading-snug">
          {highlight(faq.q)}
        </span>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-text-muted shrink-0 transition-transform duration-200",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>
      {open && (
        <div className="pb-4">
          <p className="text-sm text-text-secondary leading-relaxed">
            {highlight(faq.a)}
          </p>
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const query = search.trim().toLowerCase();

  const filtered = useMemo(() => {
    return categories
      .filter((cat) => activeCategory === "all" || cat.id === activeCategory)
      .map((cat) => ({
        ...cat,
        faqs: cat.faqs.filter(
          (faq) =>
            !query ||
            faq.q.toLowerCase().includes(query) ||
            faq.a.toLowerCase().includes(query),
        ),
      }))
      .filter((cat) => cat.faqs.length > 0);
  }, [query, activeCategory]);

  const totalResults = filtered.reduce((sum, cat) => sum + cat.faqs.length, 0);

  return (
    <div className="bg-warm-white min-h-screen">
      {/* Hero */}
      <div className="bg-linear-to-b from-amber-50/80 to-transparent px-4 py-16 md:py-20">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            <Badge variant="amber" size="md">
              Frequently Asked Questions
            </Badge>
          </div>
          <div className="flex justify-center mb-5">
            <span className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center">
              <HelpCircle className="w-8 h-8 text-amber-600" aria-hidden />
            </span>
          </div>
          <h1 className="font-display font-bold text-3xl md:text-4xl text-text-primary mb-4 leading-tight">
            Got questions? We have answers.
          </h1>
          <p className="text-lg text-text-secondary leading-relaxed max-w-xl mx-auto">
            Everything you need to know about MamaGuide, pregnancy health, and
            how to use the chatbot safely.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-16">
        {/* Search bar */}
        <div className="mb-8">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none"
              aria-hidden
            />
            <input
              type="search"
              placeholder="Search questions and answers…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-12 py-3.5 rounded-2xl border border-border bg-white text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
              aria-label="Search frequently asked questions"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {query && (
            <p className="text-xs text-text-muted mt-2 pl-1">
              {totalResults === 0
                ? "No results found. Try different keywords."
                : `${totalResults} result${totalResults !== 1 ? "s" : ""} for "${search.trim()}"`}
            </p>
          )}
        </div>

        {/* Category filter */}
        <div
          className="flex flex-wrap gap-2 mb-8"
          role="group"
          aria-label="Filter by category"
        >
          <button
            onClick={() => setActiveCategory("all")}
            className={cn(
              "px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors",
              activeCategory === "all"
                ? "bg-text-primary text-white"
                : "bg-white border border-border text-text-secondary hover:border-text-muted",
            )}
          >
            All topics
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors",
                activeCategory === cat.id
                  ? "bg-text-primary text-white"
                  : "bg-white border border-border text-text-secondary hover:border-text-muted",
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Emergency banner */}
        {(activeCategory === "all" || activeCategory === "emergency") &&
          !query && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3">
              <span
                className="w-2 h-2 rounded-full bg-red-500 shrink-0 mt-1.5"
                aria-hidden
              />
              <p className="text-sm text-red-800">
                <strong>Pregnancy emergency?</strong> Do not use MamaGuide —
                call{" "}
                <a href="tel:112" className="font-bold underline">
                  112
                </a>{" "}
                or go to your nearest hospital immediately.
              </p>
            </div>
          )}

        {/* FAQ sections */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <HelpCircle
              className="w-12 h-12 text-text-muted mx-auto mb-3"
              aria-hidden
            />
            <h2 className="font-semibold text-text-primary mb-2">
              No results found
            </h2>
            <p className="text-sm text-text-secondary max-w-sm mx-auto mb-5">
              We could not find any FAQs matching "{search.trim()}". Try
              different keywords, or ask MamaGuide directly.
            </p>
            <Button
              variant="secondary"
              onClick={() => {
                setSearch("");
                setActiveCategory("all");
              }}
            >
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {filtered.map((cat) => (
              <div
                key={cat.id}
                className="bg-white rounded-3xl border border-border overflow-hidden"
              >
                <div className="px-6 py-4 border-b border-border bg-neutral-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h2 className="font-display font-bold text-base text-text-primary">
                      {cat.label}
                    </h2>
                    <Badge variant={cat.badge} size="sm">
                      {cat.faqs.length}
                    </Badge>
                  </div>
                </div>
                <div className="px-6">
                  {cat.faqs.map((faq) => (
                    <FAQItem key={faq.q} faq={faq} searchQuery={query} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Still have questions CTA */}
        <div className="mt-10 text-center bg-rose-50 rounded-3xl border border-rose-200 p-8">
          <MessageCircle
            className="w-10 h-10 text-rose-600 mx-auto mb-3"
            aria-hidden
          />
          <h2 className="font-display font-bold text-xl text-text-primary mb-2">
            Still have questions?
          </h2>
          <p className="text-text-secondary text-sm mb-5 max-w-sm mx-auto">
            Ask MamaGuide directly in the chat — or contact us if you have
            feedback, accessibility needs, or a concern to report.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button as={Link} to={ROUTES.REGISTER}>
              Start Chatting
            </Button>
            <Button as={Link} to={ROUTES.CONTACT} variant="secondary">
              Contact Us
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
