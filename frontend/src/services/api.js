import axios from "axios";
import { API_BASE_URL } from "@/utils/constants";
import { useAuthStore } from "@/store/useAuthStore";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // /auth/* 401s (bad login credentials, expired OTP, etc.) are not a
    // session expiring — only redirect when an already-authenticated
    // request gets rejected.
    const isAuthEndpoint = error.config?.url?.startsWith("/auth/");
    if (error.response?.status === 401 && !isAuthEndpoint) {
      useAuthStore.getState().logout();
      window.location.href = "/auth/session-expired";
    }
    return Promise.reject(error);
  },
);

export default api;
