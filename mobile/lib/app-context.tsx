import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { AppScreen, Document, UserPreferences, ReviewTab, ChatMessage, UserResponse } from './types';
import { mockDocuments } from './mock-data';
import { api, ApiRequestError } from './api';

interface AuthState {
  isAuthenticated: boolean;
  user: UserResponse | null;
  pendingEmail: string | null; // Email awaiting verification
  isLoading: boolean;
  error: string | null;
}

interface AppContextType {
  // Navigation
  currentScreen: AppScreen;
  setCurrentScreen: (screen: AppScreen) => void;
  
  // Auth
  auth: AuthState;
  initiateSignUp: (name: string, email: string, password: string) => Promise<boolean>;
  confirmSignUp: (code: string) => Promise<boolean>;
  skipAuth: () => void;
  logout: () => void;
  clearAuthError: () => void;
  
  // User
  userName: string;
  setUserName: (name: string) => void;
  preferences: UserPreferences;
  setPreferences: (prefs: UserPreferences) => void;
  
  // Documents
  documents: Document[];
  setDocuments: (docs: Document[]) => void;
  currentDocument: Document | null;
  setCurrentDocument: (doc: Document | null) => void;
  
  // Review
  reviewTab: ReviewTab;
  setReviewTab: (tab: ReviewTab) => void;
  selectedClauseId: string | null;
  setSelectedClauseId: (id: string | null) => void;
  
  // Chat
  chatMessages: ChatMessage[];
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  
  // Processing
  processingStep: number;
  setProcessingStep: (step: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('onboarding-welcome');
  const [userName, setUserName] = useState('');
  const [preferences, setPreferences] = useState<UserPreferences>({
    language: 'es',
    country: 'US',
    state: 'CA',
    audioEnabled: false,
    largerText: false,
    plainLanguageMode: true,
  });
  
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    pendingEmail: null,
    isLoading: false,
    error: null,
  });
  
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null);
  
  const [reviewTab, setReviewTab] = useState<ReviewTab>('original');
  const [selectedClauseId, setSelectedClauseId] = useState<string | null>(null);
  
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  
  const [processingStep, setProcessingStep] = useState(0);
  
  const addChatMessage = useCallback((message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    setChatMessages(prev => [...prev, newMessage]);
  }, []);

  /**
   * Step 1: Initiate sign up — sends name/email/password to backend,
   * which validates the school email domain and triggers Cognito verification email.
   */
  const initiateSignUp = useCallback(async (name: string, email: string, password: string): Promise<boolean> => {
    setAuth(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      await api.initiateRegistration({ name, email, password });
      setAuth(prev => ({
        ...prev,
        isLoading: false,
        pendingEmail: email,
      }));
      setUserName(name);
      return true;
    } catch (error) {
      const message = error instanceof ApiRequestError 
        ? error.userMessage 
        : 'An unexpected error occurred';
      setAuth(prev => ({
        ...prev,
        isLoading: false,
        error: message,
      }));
      return false;
    }
  }, []);

  /**
   * Step 2: Confirm sign up — sends the verification code.
   * On success, user is created in the database and returned.
   */
  const confirmSignUp = useCallback(async (code: string): Promise<boolean> => {
    if (!auth.pendingEmail) return false;
    
    setAuth(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const user = await api.confirmRegistration({ email: auth.pendingEmail, code });
      setAuth({
        isAuthenticated: true,
        user,
        pendingEmail: null,
        isLoading: false,
        error: null,
      });
      setUserName(user.name);
      return true;
    } catch (error) {
      const message = error instanceof ApiRequestError 
        ? error.userMessage 
        : 'An unexpected error occurred';
      setAuth(prev => ({
        ...prev,
        isLoading: false,
        error: message,
      }));
      return false;
    }
  }, [auth.pendingEmail]);

  const skipAuth = useCallback(() => {
    setAuth({
      isAuthenticated: true,
      user: null,
      pendingEmail: null,
      isLoading: false,
      error: null,
    });
    setUserName('Guest');
  }, []);

  const logout = useCallback(() => {
    setAuth({
      isAuthenticated: false,
      user: null,
      pendingEmail: null,
      isLoading: false,
      error: null,
    });
    setUserName('');
    setCurrentScreen('onboarding-welcome');
  }, []);

  const clearAuthError = useCallback(() => {
    setAuth(prev => ({ ...prev, error: null }));
  }, []);
  
  return (
    <AppContext.Provider value={{
      currentScreen,
      setCurrentScreen,
      auth,
      initiateSignUp,
      confirmSignUp,
      skipAuth,
      logout,
      clearAuthError,
      userName,
      setUserName,
      preferences,
      setPreferences,
      documents,
      setDocuments,
      currentDocument,
      setCurrentDocument,
      reviewTab,
      setReviewTab,
      selectedClauseId,
      setSelectedClauseId,
      chatMessages,
      addChatMessage,
      processingStep,
      setProcessingStep,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
