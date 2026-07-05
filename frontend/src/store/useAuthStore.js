import { create } from "zustand";
import { persist } from "zustand/middleware";
import { normalizeUser } from "@/utils/auth";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => set({ token }),

      login: (user, token) => {
        set({ user, token, isAuthenticated: true });
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },

      updateUser: (updates) => {
        const user = get().user;
        if (user) set({ user: { ...user, ...updates } });
      },

      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: "mamaguide-auth",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      // Normalize user on rehydration in case it was stored in the raw
      // Supabase format (before normalizeUser was introduced).
      onRehydrateStorage: () => (state) => {
        if (state?.user?.user_metadata) {
          state.user = normalizeUser(state.user);
        }
      },
    },
  ),
);
