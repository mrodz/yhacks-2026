import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useApp } from '@/lib/app-context';
import OnboardingWelcome from '@/components/screens/OnboardingWelcome';
import OnboardingLanguage from '@/components/screens/OnboardingLanguage';
import OnboardingRegion from '@/components/screens/OnboardingRegion';
import OnboardingAccessibility from '@/components/screens/OnboardingAccessibility';
import OnboardingAuth from '@/components/screens/OnboardingAuth';

export default function OnboardingScreen() {
  const { currentScreen } = useApp();
  const router = useRouter();

  // When auth is complete, navigate to tabs
  useEffect(() => {
    if (
      currentScreen === 'home' ||
      currentScreen === 'documents' ||
      currentScreen === 'help' ||
      currentScreen === 'profile'
    ) {
      router.replace('/(tabs)');
    }
  }, [currentScreen]);

  switch (currentScreen) {
    case 'onboarding-welcome':
      return <OnboardingWelcome />;
    case 'onboarding-language':
      return <OnboardingLanguage />;
    case 'onboarding-region':
      return <OnboardingRegion />;
    case 'onboarding-accessibility':
      return <OnboardingAccessibility />;
    case 'onboarding-auth':
      return <OnboardingAuth />;
    default:
      return <OnboardingWelcome />;
  }
}
