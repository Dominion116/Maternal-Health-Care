import { create } from 'zustand'

const getLocalBool = (key, fallback = false) => {
  try {
    const val = localStorage.getItem(key)
    return val === null ? fallback : val === 'true'
  } catch {
    return fallback
  }
}

export const useUIStore = create((set) => ({
  // Mobile sidebar drawer (app)
  sidebarOpen: false,
  // Desktop sidebar collapsed state (app) — persisted
  sidebarCollapsed: getLocalBool('sidebar_collapsed', false),

  // Toast notifications
  toasts: [],
  // Modal
  activeModal: null,
  // Mobile chat (unused but kept for compat)
  mobileChatOpen: false,

  toggleSidebar: () => set(s => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  toggleSidebarCollapsed: () => set(s => {
    const next = !s.sidebarCollapsed
    try { localStorage.setItem('sidebar_collapsed', next) } catch {}
    return { sidebarCollapsed: next }
  }),
  setSidebarCollapsed: (collapsed) => set(() => {
    try { localStorage.setItem('sidebar_collapsed', collapsed) } catch {}
    return { sidebarCollapsed: collapsed }
  }),

  setMobileChatOpen: (open) => set({ mobileChatOpen: open }),

  openModal: (modalId) => set({ activeModal: modalId }),
  closeModal: () => set({ activeModal: null }),

  addToast: (toast) => {
    const id = `toast_${Date.now()}`
    set(s => ({ toasts: [...s.toasts, { id, ...toast }] }))
    return id
  },
  removeToast: (id) =>
    set(s => ({ toasts: s.toasts.filter(t => t.id !== id) })),
}))
