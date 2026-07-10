import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/services/authService";
import { normalizeUser } from "@/utils/auth";

export function useAuth() {
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateUser: handleLocalUserUpdate,
    setLoading,
  } = useAuthStore();

  async function signIn(email, password) {
    setLoading(true);
    try {
      const { data } = await authService.login(email, password);
      const normalizedData = data.data;
      // Supabase returns { user, session: { access_token, ... }, profile }
      // (profile is attached server-side — onboarding_completed lives in
      // user_profiles, not the Supabase auth user object).
      const normalizedUser = {
        ...normalizeUser(normalizedData.user),
        onboarding_completed: normalizedData.profile?.onboarding_completed ?? false,
      };
      const accessToken = normalizedData.session?.access_token;
      login(normalizedUser, accessToken);
      return { success: true, user: normalizedUser };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error || "Login failed",
      };
    } finally {
      setLoading(false);
    }
  }

  async function signOut() {
    try {
      await authService.logout();
    } catch {
      console.warn("Not able to logout");
    }
    logout();
  }

  async function register(userData) {
    setLoading(true);
    try {
      const { data } = await authService.register(userData);
      const normalizedData = data.data;
      // If Supabase skips email confirmation and returns a session, log in now.
      // When email confirmation is required, session is null — navigate to verify.
      if (normalizedData.session?.access_token && normalizedData.user) {
        login(normalizeUser(normalizedData.user), normalizedData.session.access_token);
      }
      return { success: true, data: normalizedData };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error || "Registration failed",
      };
    } finally {
      setLoading(false);
    }
  }

  const isNurse = user?.role === "nurse";
  const isSuperAdmin = user?.role === "super_admin";
  const isAdmin = user?.role === "admin" || user?.role === "researcher" || isSuperAdmin;
  const isPregnantWoman = user?.role === "pregnant_woman";

  // Maps the app's camelCase user fields to the backend's snake_case
  // UpdateProfileDto. Fields without a backing column (pregnancyWeeks)
  // update local state only.
  const PROFILE_FIELD_MAP = {
    name: "full_name",
    phone: "phone_number",
    pregnancyStage: "pregnancy_stage",
    dueDate: "due_date",
    language: "language",
  };

  async function updateUser(updates) {
    const payload = {};
    for (const [localKey, backendKey] of Object.entries(PROFILE_FIELD_MAP)) {
      if (updates[localKey] !== undefined) payload[backendKey] = updates[localKey];
    }
    try {
      if (Object.keys(payload).length > 0) {
        await authService.updateProfile(payload);
      }
      handleLocalUserUpdate(updates);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error || "Failed to update profile",
      };
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    isNurse,
    isAdmin,
    isSuperAdmin,
    isPregnantWoman,
    signIn,
    signOut,
    register,
    updateUser,
  };
}
