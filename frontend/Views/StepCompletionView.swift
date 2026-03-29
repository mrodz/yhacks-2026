import SwiftUI

struct StepCompletionView: View {
    let onFinish: () -> Void
    
    var body: some View {
        VStack(spacing: 32) {
            Spacer()
            
            Image(systemName: "checkmark.seal.fill")
                .font(.system(size: 80))
                .foregroundColor(.green)
            
            Text("Document Complete!".localized())
                .font(.largeTitle.bold())
            
            Text("You have successfully reviewed all the required steps for this document.".localized())
                .font(.title3)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
                .padding(.horizontal, 32)
            
            Spacer()
            
            Button(action: onFinish) {
                Text("Return to Documents".localized())
                    .font(.headline.bold())
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Theme.primaryAction)
                    .foregroundColor(.white)
                    .cornerRadius(12)
            }
            .padding(.horizontal, 24)
            .padding(.bottom, 24)
        }
        .background(Theme.background.ignoresSafeArea())
    }
}
