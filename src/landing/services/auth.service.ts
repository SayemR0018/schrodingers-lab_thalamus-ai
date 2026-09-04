import {
  clearAuthSession,
  getAuthSession,
  markAuthSessionOnboardingComplete,
  saveAuthSession,
} from "@/landing/services/auth-session";
import { mockLogin } from "@/landing/services/mock/mock-auth.service";
import type { AuthResponse, AuthService } from "@/landing/services/auth.types";

export type {
  AuthError,
  AuthResponse,
  AuthSession,
  AuthUser,
  LoginRequest,
} from "@/landing/services/auth.types";

export const authService: AuthService = {
  async login(identifier, password): Promise<AuthResponse> {
    try {
      const response = await mockLogin({ identifier, password });

      if (
        response.success &&
        response.user &&
        response.access_token &&
        typeof response.onboarding_completed === "boolean"
      ) {
        saveAuthSession({
          user: response.user,
          access_token: response.access_token,
          onboarding_completed: response.onboarding_completed,
        });
      }

      return response;
    } catch {
      return {
        success: false,
        error: {
          code: "AUTH_UNAVAILABLE",
          message: "We could not sign you in. Please try again.",
        },
      };
    }
  },

  getSession: getAuthSession,
  markOnboardingCompleted: markAuthSessionOnboardingComplete,
  logout: clearAuthSession,
};
