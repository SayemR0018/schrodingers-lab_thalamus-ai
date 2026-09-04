export type LoginRequest = {
  identifier: string;
  password: string;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  username: string;
};

export type AuthError = {
  code: string;
  message: string;
};

export type AuthResponse = {
  success: boolean;
  user?: AuthUser;
  access_token?: string;
  onboarding_completed?: boolean;
  error?: AuthError;
};

export type AuthSession = {
  user: AuthUser;
  access_token: string;
  onboarding_completed: boolean;
};

export interface AuthService {
  login(identifier: string, password: string): Promise<AuthResponse>;
  getSession(): AuthSession | null;
  markOnboardingCompleted(): void;
  logout(): void;
}
