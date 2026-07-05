import api from "./api";

export const authService = {
  login: (email, password) => api.post("/auth/login", { email, password }),

  register: (data) => api.post("/auth/register", data),

  // Legacy link-based verification (kept for compatibility)
  verifyEmail: (token) => api.post("/auth/verify-email", { token }),

  // OTP-based email verification
  verifyEmailOtp: (email, otp) =>
    api.post("/auth/verify-otp", { email, token: otp, type: "signup" }),

  resendEmailOtp: (email) =>
    api.post("/auth/resend-otp", { email, type: "signup" }),

  // Password reset — step 1: send OTP to email
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),

  // Password reset — step 2: verify OTP, receive short-lived reset token
  verifyResetOtp: (email, otp) =>
    api.post("/auth/verify-otp", { email, token: otp, type: "recovery" }),

  // Password reset — step 3: set new password using reset token
  resetPassword: (token, password) =>
    api.post("/auth/reset-password", { access_token: token, new_password: password }),

  // Admin invite flow — step 2: set a password using the invite link's token
  acceptInvite: (accessToken, password) =>
    api.post("/auth/accept-invite", { access_token: accessToken, password }),

  refreshToken: () => api.post("/auth/refresh"),

  logout: () => api.post("/auth/logout"),

  getProfile: () => api.get("/profile"),

  updateProfile: (data) => api.patch("/profile", data),
};
