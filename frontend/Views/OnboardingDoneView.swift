import SwiftUI

struct OnboardingDoneView: View {
    var onComplete: () -> Void
    
    var body: some View {
        VStack(spacing: 32) {
            Spacer()
            
            ZStack {
                Circle()
                    .fill(Color.green.opacity(0.15))
                    .frame(width: 120, height: 120)
                
                Image(systemName: "checkmark.seal.fill")
                    .font(.system(size: 60))
                    .foregroundColor(.green)
            }
            
            VStack(spacing: 16) {
                Text("You're All Set!".localized())
                    .font(.largeTitle.bold())
                
                Text("We've tailored FormFriend to your preferences. You are ready to start scanning.".localized())
                    .font(.body)
                    .foregroundColor(.secondary)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 32)
            }
            
            Spacer()
            
            Button {
                withAnimation {
                    onComplete()
                }
            } label: {
                Text("Start Scanning".localized())
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

#Preview {
    OnboardingDoneView {}
}
