'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AppScreen, Document, UserPreferences, ReviewTab, ChatMessage } from './types';
import { mockDocuments, mockClauses } from './mock-data';

interface AppContextType {
  // Navigation
  currentScreen: AppScreen;
  setCurrentScreen: (screen: AppScreen) => void;
  
  // User
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
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
  showClauseSheet: boolean;
  setShowClauseSheet: (show: boolean) => void;
  
  // Chat
  chatMessages: ChatMessage[];
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  
  // Processing
  processingStep: number;
  setProcessingStep: (step: number) => void;
  
  // Onboarding
  onboardingStep: number;
  setOnboardingStep: (step: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('onboarding-welcome');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [preferences, setPreferences] = useState<UserPreferences>({
    language: 'es',
    country: 'US',
    state: 'CA',
    audioEnabled: false,
    largerText: false,
    plainLanguageMode: true,
  });
  
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null);
  
  const [reviewTab, setReviewTab] = useState<ReviewTab>('original');
  const [selectedClauseId, setSelectedClauseId] = useState<string | null>(null);
  const [showClauseSheet, setShowClauseSheet] = useState(false);
  
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  
  const [processingStep, setProcessingStep] = useState(0);
  const [onboardingStep, setOnboardingStep] = useState(0);
  
  const addChatMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    setChatMessages(prev => [...prev, newMessage]);
  };
  
  return (
    <AppContext.Provider value={{
      currentScreen,
      setCurrentScreen,
      isAuthenticated,
      setIsAuthenticated,
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
      showClauseSheet,
      setShowClauseSheet,
      chatMessages,
      addChatMessage,
      processingStep,
      setProcessingStep,
      onboardingStep,
      setOnboardingStep,
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
