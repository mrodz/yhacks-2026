import SwiftUI

struct OnboardingDataSafetyView: View {
    @Binding var step: Int
    
    var body: some View {
        VStack(spacing: 32) {
            Spacer()
            
            ZStack {
                Circle()
                    .fill(Theme.primaryAction.opacity(0.12))
                    .frame(width: 120, height: 120)
                
                Image(systemName: "lock.shield.fill")
                    .font(.system(size: 60))
                    .foregroundColor(Theme.primaryAction)
            }
            
            VStack(spacing: 16) {
                Text("Your Data Is Safe With Us".localized())
                    .font(.largeTitle.bold())
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 24)
            }
            
            VStack(alignment: .leading, spacing: 20) {
                privacyRow(
                    icon: "hand.raised.fill",
                    title: "We keep it private".localized(),
                    subtitle: "We never sell or share your personal information.".localized()
                )
                
                privacyRow(
                    icon: "iphone",
                    title: "Your device, your docs".localized(),
                    subtitle: "Your documents stay on your device unless you choose otherwise.".localized()
                )
                
                privacyRow(
                    icon: "lock.fill",
                    title: "Locked down tight".localized(),
                    subtitle: "All data is encrypted and stored securely.".localized()
                )
            }
            .padding(.horizontal, 32)
            
            Spacer()
            
            Button {
                withAnimation { step = 3 }
            } label: {
                Text("Continue".localized())
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
    
    private func privacyRow(icon: String, title: String, subtitle: String) -> some View {
        HStack(alignment: .top, spacing: 16) {
            Image(systemName: icon)
                .font(.title2)
                .foregroundColor(Theme.primaryAction)
                .frame(width: 32)
            
            VStack(alignment: .leading, spacing: 4) {
                Text(title)
                    .font(.headline)
                
                Text(subtitle)
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                    .fixedSize(horizontal: false, vertical: true)
            }
        }
    }
}

#Preview {
    OnboardingDataSafetyView(step: .constant(2))
}
