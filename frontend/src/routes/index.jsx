import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import { PageLoader } from "@/components/atoms/Spinner";
import { PublicLayout } from "@/layouts/PublicLayout";
import { AuthLayout } from "@/layouts/AuthLayout";
import { AppLayout } from "@/layouts/AppLayout";
import { AdminLayout } from "@/layouts/AdminLayout";
import { ProtectedRoute, AdminRoute, GuestRoute } from "./ProtectedRoute";

/* ── Lazy imports ──────────────────────────────────────────── */

// Public
const LandingPage = lazy(() => import("@/pages/public/LandingPage"));
const AboutPage = lazy(() => import("@/pages/public/AboutPage"));
const FAQPage = lazy(() => import("@/pages/public/FAQPage"));
const FeaturesPage = lazy(() => import("@/pages/public/FeaturesPage"));
const HowItWorksPage = lazy(() => import("@/pages/public/HowItWorksPage"));
const ResourcesPage = lazy(() => import("@/pages/public/ResourcesPage"));
const ContactPage = lazy(() => import("@/pages/public/ContactPage"));
const PrivacyPage = lazy(() => import("@/pages/public/PrivacyPage"));
const TermsPage = lazy(() => import("@/pages/public/TermsPage"));
const AccessibilityPage = lazy(
  () => import("@/pages/public/AccessibilityPage"),
);

// Auth
const LoginPage = lazy(() => import("@/pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/auth/RegisterPage"));
const VerifyEmailPage = lazy(() => import("@/pages/auth/VerifyEmailPage"));
const EmailVerifiedPage = lazy(() => import("@/pages/auth/EmailVerifiedPage"));
const ForgotPasswordPage = lazy(
  () => import("@/pages/auth/ForgotPasswordPage"),
);
const ResetPasswordPage = lazy(() => import("@/pages/auth/ResetPasswordPage"));
const AcceptInvitePage = lazy(() => import("@/pages/auth/AcceptInvitePage"));
const PasswordSuccessPage = lazy(
  () => import("@/pages/auth/PasswordSuccessPage"),
);
const SessionExpiredPage = lazy(
  () => import("@/pages/system/SessionExpiredPage"),
);
const UnauthorizedPage = lazy(() => import("@/pages/system/UnauthorizedPage"));

// Onboarding
const OnboardingPage = lazy(() => import("@/pages/onboarding/OnboardingPage"));

// App
const DashboardPage = lazy(() => import("@/pages/app/DashboardPage"));
const ChatPage = lazy(() => import("@/pages/chat/ChatPage"));
const ChatHistoryPage = lazy(() => import("@/pages/chat/ChatHistoryPage"));
const ChatSavedPage = lazy(() => import("@/pages/chat/ChatSavedPage"));

// Education
const EducationHomePage = lazy(
  () => import("@/pages/education/EducationHomePage"),
);
const TrimesterPage = lazy(() => import("@/pages/education/TrimesterPage"));
const NutritionPage = lazy(() => import("@/pages/education/NutritionPage"));
const DangerSignsPage = lazy(() => import("@/pages/education/DangerSignsPage"));
const ANCSchedulePage = lazy(() => import("@/pages/education/ANCSchedulePage"));
const VaccinesPage = lazy(() => import("@/pages/education/VaccinesPage"));
const MentalHealthPage = lazy(
  () => import("@/pages/education/MentalHealthPage"),
);
const BirthPrepPage = lazy(() => import("@/pages/education/BirthPrepPage"));
const PostpartumPage = lazy(() => import("@/pages/education/PostpartumPage"));
const BreastfeedingPage = lazy(
  () => import("@/pages/education/BreastfeedingPage"),
);

// Profile & Settings
const ProfilePage = lazy(() => import("@/pages/profile/ProfilePage"));
const PregnancyProfilePage = lazy(
  () => import("@/pages/profile/PregnancyProfilePage"),
);
const SettingsPage = lazy(() => import("@/pages/profile/SettingsPage"));

// Admin
const AdminDashboardPage = lazy(
  () => import("@/pages/admin/AdminDashboardPage"),
);
const AdminUsersPage = lazy(() => import("@/pages/admin/AdminUsersPage"));
const AdminConversationsPage = lazy(
  () => import("@/pages/admin/AdminConversationsPage"),
);
const AdminAnalyticsPage = lazy(
  () => import("@/pages/admin/AdminAnalyticsPage"),
);
const AdminSUSPage = lazy(() => import("@/pages/admin/AdminSUSPage"));
const AdminFeedbackPage = lazy(() => import("@/pages/admin/AdminFeedbackPage"));
const AdminKnowledgePage = lazy(
  () => import("@/pages/admin/AdminKnowledgePage"),
);
const AdminReportsPage = lazy(() => import("@/pages/admin/AdminReportsPage"));

// Evaluation
const SUSQuestionnairePage = lazy(
  () => import("@/pages/evaluation/SUSQuestionnairePage"),
);
const FeedbackPage = lazy(() => import("@/pages/evaluation/FeedbackPage"));
const ResearchConsentPage = lazy(
  () => import("@/pages/evaluation/ResearchConsentPage"),
);
const SurveyCompletePage = lazy(
  () => import("@/pages/evaluation/SurveyCompletePage"),
);

// System
const NotFoundPage = lazy(() => import("@/pages/system/NotFoundPage"));
const MaintenancePage = lazy(() => import("@/pages/system/MaintenancePage"));

/* ── Suspense wrapper ──────────────────────────────────────── */
function S({ children }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}

export const router = createBrowserRouter([
  /* ── PUBLIC ─────────────────────────────────────────────── */
  {
    element: <PublicLayout />,
    children: [
      {
        path: "/",
        element: (
          <S>
            <LandingPage />
          </S>
        ),
      },
      {
        path: "/about",
        element: (
          <S>
            <AboutPage />
          </S>
        ),
      },
      {
        path: "/features",
        element: (
          <S>
            <FeaturesPage />
          </S>
        ),
      },
      {
        path: "/how-it-works",
        element: (
          <S>
            <HowItWorksPage />
          </S>
        ),
      },
      {
        path: "/resources",
        element: (
          <S>
            <ResourcesPage />
          </S>
        ),
      },
      {
        path: "/faq",
        element: (
          <S>
            <FAQPage />
          </S>
        ),
      },
      {
        path: "/contact",
        element: (
          <S>
            <ContactPage />
          </S>
        ),
      },
      {
        path: "/privacy",
        element: (
          <S>
            <PrivacyPage />
          </S>
        ),
      },
      {
        path: "/terms",
        element: (
          <S>
            <TermsPage />
          </S>
        ),
      },
      {
        path: "/accessibility",
        element: (
          <S>
            <AccessibilityPage />
          </S>
        ),
      },
    ],
  },

  /* ── AUTH ────────────────────────────────────────────────── */
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: (
          <S>
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          </S>
        ),
      },
      {
        path: "register",
        element: (
          <S>
            <GuestRoute>
              <RegisterPage />
            </GuestRoute>
          </S>
        ),
      },
      {
        path: "verify-email",
        element: (
          <S>
            <VerifyEmailPage />
          </S>
        ),
      },
      {
        path: "email-verified",
        element: (
          <S>
            <EmailVerifiedPage />
          </S>
        ),
      },
      {
        path: "forgot-password",
        element: (
          <S>
            <ForgotPasswordPage />
          </S>
        ),
      },
      {
        path: "reset-password",
        element: (
          <S>
            <ResetPasswordPage />
          </S>
        ),
      },
      {
        path: "accept-invite",
        element: (
          <S>
            <AcceptInvitePage />
          </S>
        ),
      },
      {
        path: "password-success",
        element: (
          <S>
            <PasswordSuccessPage />
          </S>
        ),
      },
      {
        path: "session-expired",
        element: (
          <S>
            <SessionExpiredPage />
          </S>
        ),
      },
      {
        path: "unauthorized",
        element: (
          <S>
            <UnauthorizedPage />
          </S>
        ),
      },
    ],
  },

  /* ── ONBOARDING ──────────────────────────────────────────── */
  {
    path: "/onboarding",
    element: (
      <S>
        <ProtectedRoute>
          <OnboardingPage />
        </ProtectedRoute>
      </S>
    ),
  },

  /* ── MAIN APP ────────────────────────────────────────────── */
  {
    path: "/app",
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <S>
            <DashboardPage />
          </S>
        ),
      },
      {
        path: "dashboard",
        element: (
          <S>
            <DashboardPage />
          </S>
        ),
      },
      {
        path: "chat",
        element: (
          <S>
            <ChatPage />
          </S>
        ),
      },
      {
        path: "chat/history",
        element: (
          <S>
            <ChatHistoryPage />
          </S>
        ),
      },
      {
        path: "chat/saved",
        element: (
          <S>
            <ChatSavedPage />
          </S>
        ),
      },

      // Education
      {
        path: "education",
        element: (
          <S>
            <EducationHomePage />
          </S>
        ),
      },
      {
        path: "education/trimester",
        element: (
          <S>
            <TrimesterPage />
          </S>
        ),
      },
      {
        path: "education/nutrition",
        element: (
          <S>
            <NutritionPage />
          </S>
        ),
      },
      {
        path: "education/danger-signs",
        element: (
          <S>
            <DangerSignsPage />
          </S>
        ),
      },
      {
        path: "education/anc",
        element: (
          <S>
            <ANCSchedulePage />
          </S>
        ),
      },
      {
        path: "education/vaccines",
        element: (
          <S>
            <VaccinesPage />
          </S>
        ),
      },
      {
        path: "education/mental-health",
        element: (
          <S>
            <MentalHealthPage />
          </S>
        ),
      },
      {
        path: "education/birth-prep",
        element: (
          <S>
            <BirthPrepPage />
          </S>
        ),
      },
      {
        path: "education/postpartum",
        element: (
          <S>
            <PostpartumPage />
          </S>
        ),
      },
      {
        path: "education/breastfeeding",
        element: (
          <S>
            <BreastfeedingPage />
          </S>
        ),
      },

      // Profile
      {
        path: "profile",
        element: (
          <S>
            <ProfilePage />
          </S>
        ),
      },
      {
        path: "profile/pregnancy",
        element: (
          <S>
            <PregnancyProfilePage />
          </S>
        ),
      },
      {
        path: "settings",
        element: (
          <S>
            <SettingsPage />
          </S>
        ),
      },
      {
        path: "settings/:tab",
        element: (
          <S>
            <SettingsPage />
          </S>
        ),
      },
    ],
  },

  /* ── EVALUATION ──────────────────────────────────────────── */
  {
    path: "/evaluation",
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "sus",
        element: (
          <S>
            <SUSQuestionnairePage />
          </S>
        ),
      },
      {
        path: "feedback",
        element: (
          <S>
            <FeedbackPage />
          </S>
        ),
      },
      {
        path: "consent",
        element: (
          <S>
            <ResearchConsentPage />
          </S>
        ),
      },
      {
        path: "complete",
        element: (
          <S>
            <SurveyCompletePage />
          </S>
        ),
      },
    ],
  },

  /* ── ADMIN ───────────────────────────────────────────────── */
  {
    path: "/admin",
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <S>
            <AdminDashboardPage />
          </S>
        ),
      },
      {
        path: "dashboard",
        element: (
          <S>
            <AdminDashboardPage />
          </S>
        ),
      },
      {
        path: "users",
        element: (
          <S>
            <AdminUsersPage />
          </S>
        ),
      },
      {
        path: "conversations",
        element: (
          <S>
            <AdminConversationsPage />
          </S>
        ),
      },
      {
        path: "analytics",
        element: (
          <S>
            <AdminAnalyticsPage />
          </S>
        ),
      },
      {
        path: "sus",
        element: (
          <S>
            <AdminSUSPage />
          </S>
        ),
      },
      {
        path: "feedback",
        element: (
          <S>
            <AdminFeedbackPage />
          </S>
        ),
      },
      {
        path: "knowledge",
        element: (
          <S>
            <AdminKnowledgePage />
          </S>
        ),
      },
      {
        path: "reports",
        element: (
          <S>
            <AdminReportsPage />
          </S>
        ),
      },
    ],
  },

  /* ── SYSTEM ──────────────────────────────────────────────── */
  {
    path: "/maintenance",
    element: (
      <S>
        <MaintenancePage />
      </S>
    ),
  },
  {
    path: "/404",
    element: (
      <S>
        <NotFoundPage />
      </S>
    ),
  },
  {
    path: "*",
    element: (
      <S>
        <NotFoundPage />
      </S>
    ),
  },
]);
