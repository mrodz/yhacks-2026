"use client"

import { useApp } from "@/lib/app-context"
import { OnboardingWelcome, OnboardingLanguage, OnboardingRegion, OnboardingAccessibility, OnboardingAuth } from "./screens/onboarding"
import { HomeScreen } from "./screens/home"
import { ScanChoiceScreen, ScanCameraScreen, ScanReviewScreen, UploadScreen } from "./screens/scan"
import { ProcessingScreen } from "./screens/processing"
import { ReviewScreen } from "./screens/review"
import { PreSignScreen, SignScreen, ExportScreen } from "./screens/sign"
import { DocumentsScreen } from "./screens/documents"
import { HelpScreen } from "./screens/help"
import { ProfileScreen } from "./screens/profile"
import { BottomNav } from "./navigation/bottom-nav"

export function AppShell() {
  const { currentScreen } = useApp()

  const screensWithNav = ["home", "documents", "help", "profile"]
  const showNav = screensWithNav.includes(currentScreen)

  const renderScreen = () => {
    switch (currentScreen) {
      case "onboarding-welcome":
        return <OnboardingWelcome />
      case "onboarding-language":
        return <OnboardingLanguage />
      case "onboarding-region":
        return <OnboardingRegion />
      case "onboarding-accessibility":
        return <OnboardingAccessibility />
      case "onboarding-auth":
        return <OnboardingAuth />
      case "home":
        return <HomeScreen />
      case "scan-choice":
        return <ScanChoiceScreen />
      case "scan-camera":
        return <ScanCameraScreen />
      case "scan-review":
        return <ScanReviewScreen />
      case "upload":
        return <UploadScreen />
      case "processing":
        return <ProcessingScreen />
      case "review":
        return <ReviewScreen />
      case "sign":
        return <PreSignScreen />
      case "export":
        return <ExportScreen />
      case "documents":
        return <DocumentsScreen />
      case "help":
        return <HelpScreen />
      case "profile":
        return <ProfileScreen />
      default:
        return <OnboardingWelcome />
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className={`flex-1 ${showNav ? "pb-20" : ""}`}>
        {renderScreen()}
      </main>
      {showNav && <BottomNav />}
    </div>
  )
}
