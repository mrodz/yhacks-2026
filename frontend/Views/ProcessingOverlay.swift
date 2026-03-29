import SwiftUI

struct ProcessingOverlay: View {
    var onComplete: () -> Void
    @State private var stepIndex = 0
    let steps = [
        "Reading your document...",
        "Finding important steps...",
        "Preparing guidance..."
    ]
    
    var body: some View {
        ZStack {
            Theme.background.ignoresSafeArea()
            
            VStack(spacing: 32) {
                ProgressView()
                    .scaleEffect(2.0)
                    .tint(Theme.primaryAction)
                
                Text(steps[stepIndex])
                    .font(.title3.bold())
                    .foregroundColor(.primary)
                    .animation(.easeInOut, value: stepIndex)
                    .contentTransition(.numericText())
            }
        }
        .onAppear {
            simulateProcessing()
        }
    }
    
    func simulateProcessing() {
        // Step 1
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.2) {
            stepIndex = 1
        }
        // Step 2
        DispatchQueue.main.asyncAfter(deadline: .now() + 2.5) {
            stepIndex = 2
        }
        // Step 3 (Done)
        DispatchQueue.main.asyncAfter(deadline: .now() + 4.0) {
            onComplete()
        }
    }
}

#Preview {
    ProcessingOverlay {}
}
