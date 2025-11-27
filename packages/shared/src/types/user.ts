/**
 * ユーザー関連の型定義
 */

export enum UserRole {
  USER = 'user',
  COUNSELOR = 'counselor',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
}

export enum AuthProvider {
  EMAIL = 'email',
  LINE = 'line',
  GOOGLE = 'google',
  APPLE = 'apple',
}

export interface User {
  id: string;
  email: string;
  name: string;
  nickname?: string;
  avatar?: string;
  role: UserRole;
  authProvider: AuthProvider;
  companyCode?: string;
  language: SupportedLanguage;
  isEmailVerified: boolean;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  userId: string;
  birthDate?: Date;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  occupation?: string;
  bio?: string;
}

export interface UserPreferences {
  userId: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;
  language: SupportedLanguage;
  timezone: string;
}

export type SupportedLanguage = 'ja' | 'ko' | 'en';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  companyCode?: string;
  language?: SupportedLanguage;
}

export interface SocialLoginRequest {
  provider: AuthProvider;
  token: string;
  companyCode?: string;
}
