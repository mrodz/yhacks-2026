//
//  ContentView.swift
//  FormPilot
//

import SwiftUI

struct ContentView: View {
    @StateObject private var authManager = AuthManager()
    @AppStorage("hasCompletedOnboarding") var hasCompletedOnboarding: Bool = false
    
    var body: some View {
        if !hasCompletedOnboarding {
            OnboardingFlowView()
        } else if !authManager.isAuthenticated {
            LoginView()
                .environmentObject(authManager)
        } else {
            TabView {
                HomeView()
                    .tabItem { Label("Home".localized(), systemImage: "house.fill") }
                
                DocumentsView()
                    .tabItem { Label("Documents".localized(), systemImage: "doc.text.fill") }
                
                ProfileView()
                    .tabItem { Label("Profile".localized(), systemImage: "person.crop.circle.fill") }
            }
            .tint(Theme.primaryAction)
            .environmentObject(authManager)
        }
    }
}

#Preview {
    ContentView()
}
