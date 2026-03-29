import SwiftUI

struct OnboardingIntroView: View {
    @Binding var step: Int
    
    var body: some View {
        VStack(spacing: 32) {
            Spacer()
            
            Image(systemName: "doc.viewfinder")
                .font(.system(size: 80))
                .foregroundColor(Theme.primaryAction)
            
            VStack(spacing: 16) {
                Text("Welcome to FormFriend".localized())
                    .font(.largeTitle.bold())
                    .multilineTextAlignment(.center)
                
                Text("Turn confusing paperwork into clear, step-by-step guidance. Simply scan a document, and we'll help you fill it out.".localized())
                    .font(.body)
                    .foregroundColor(.secondary)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 32)
            }
            
            Spacer()
            
            Button {
                withAnimation { step = 1 }
            } label: {
                Text("Get Started".localized())
                    .font(.headline)
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Theme.primaryAction)
                    .cornerRadius(16)
                    .shadow(color: Theme.primaryAction.opacity(0.3), radius: 8, x: 0, y: 4)
            }
            .padding(.horizontal, 24)
            .padding(.bottom, 40)
        }
        .background(Theme.background.ignoresSafeArea())
    }
}
