export type RiskLevel = 'high' | 'medium' | 'low' | 'info' | 'safe';

export interface Clause {
  id: string;
  title: string;
  originalText: string;
  translatedText: string;
  plainLanguage: string;
  riskLevel: RiskLevel;
  whyMatters: string;
  dependsOnLocalLaw: boolean;
  localLawNote?: string;
  questionsToAsk: string[];
  confidenceNote: string;
  pageNumber: number;
  position: { x: number; y: number; width: number; height: number };
}

export interface Document {
  id: string;
  title: string;
  type: 'lease' | 'employment' | 'medical' | 'school' | 'other';
  uploadDate: Date;
  status: 'processing' | 'needs-review' | 'reviewed' | 'signed' | 'exported';
  languagePair: { from: string; to: string };
  riskCount: { high: number; medium: number; low: number };
  clauses: Clause[];
  pages: number;
  thumbnailUrl?: string;
}

export interface UserPreferences {
  language: string;
  country: string;
  state?: string;
  audioEnabled: boolean;
  largerText: boolean;
  plainLanguageMode: boolean;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  clauseReferences?: { clauseId: string; pageNumber: number }[];
  timestamp: Date;
}

export type AppScreen =
  | 'onboarding-welcome'
  | 'onboarding-language'
  | 'onboarding-region'
  | 'onboarding-accessibility'
  | 'onboarding-auth'
  | 'home'
  | 'scan-choice'
  | 'scan-camera'
  | 'scan-review'
  | 'upload'
  | 'processing'
  | 'review'
  | 'sign'
  | 'export'
  | 'documents'
  | 'help'
  | 'profile';

export type ReviewTab = 'original' | 'translation' | 'summary' | 'risks' | 'questions';

// Backend API types
export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  personalEmail?: string;
}

export interface ConfirmUserRequest {
  email: string;
  code: string;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  schoolId: number;
  schoolCode: string;
  schoolName: string;
}

export interface ApiError {
  type?: string;
  title: string;
  status: number;
  detail: string;
  errors?: string[];
}
