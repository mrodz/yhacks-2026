import SwiftUI

struct OnboardingFlowView: View {
    @AppStorage("hasCompletedOnboarding") var hasCompletedOnboarding: Bool = false
    @AppStorage("onboardingStep") var step = 0
    
    var body: some View {
        VStack(spacing: 0) {
            // Top Navigation Bar
            HStack {
                if step > 0 {
                    Button {
                        withAnimation { step -= 1 }
                    } label: {
                        Image(systemName: "chevron.left")
                            .font(.title2.bold())
                            .foregroundColor(Theme.primaryAction)
                            .padding(.horizontal, 16)
                            .padding(.vertical, 8)
                    }
                } else {
                    Color.clear
                        .frame(width: 50, height: 40)
                }
                
                ProgressView(value: Double(step + 1), total: 4.0)
                    .tint(Theme.primaryAction)
                    .animation(.easeInOut, value: step)
                
                Color.clear
                    .frame(width: 50, height: 40)
            }
            .padding(.top, 8)
            .padding(.horizontal, 8)
            .background(Theme.background)
            
            TabView(selection: $step) {
                OnboardingIntroView(step: $step)
                    .tag(0)
                
                OnboardingCountryView(step: $step)
                    .tag(1)
                
                OnboardingDataSafetyView(step: $step)
                    .tag(2)
                
                OnboardingDoneView {
                    hasCompletedOnboarding = true
                }
                .tag(3)
            }
            .tabViewStyle(.page(indexDisplayMode: .never))
        }
        .background(Theme.background.ignoresSafeArea())
    }
}
