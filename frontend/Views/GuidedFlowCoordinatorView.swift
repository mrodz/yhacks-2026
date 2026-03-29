import SwiftUI

struct GuidedFlowCoordinatorView: View {
    let parseResponse: ContractParseResponse
    @Environment(\.dismiss) private var dismiss
    
    // 0 = Step Zero (Preparation)
    // 1...N = Active Steps
    // N+1 = Completion Screen
    @State private var currentStepIndex: Int = 0
    @State private var navigatingForward: Bool = true
    
    private var analysis: AnalysisResponse? {
        parseResponse.analysis
    }
    
    private var steps: [AnalysisStep] {
        analysis?.steps ?? []
    }
    
    var body: some View {
        ZStack {
            Theme.background.ignoresSafeArea()
            
            if currentStepIndex == 0 {
                if let step0 = analysis?.step0 {
                    StepZeroView(
                        step0: step0,
                        onStart: {
                            navigatingForward = true
                            withAnimation(.spring()) {
                                currentStepIndex = steps.isEmpty ? (steps.count + 1) : 1
                            }
                        },
                        onCancel: { dismiss() }
                    )
                    .transition(.move(edge: .leading))
                } else {
                    // Fallback if no Step 0 exists, immediately jump
                    Color.clear.onAppear {
                        currentStepIndex = steps.isEmpty ? (steps.count + 1) : 1
                    }
                }
            } else if currentStepIndex <= steps.count {
                let activeStep = steps[currentStepIndex - 1]
                GuidedStepInteractiveView(
                    step: activeStep,
                    stepIndex: currentStepIndex,
                    totalSteps: steps.count,
                    parseResponse: parseResponse,
                    onNext: {
                        navigatingForward = true
                        withAnimation(.spring()) {
                            currentStepIndex += 1
                        }
                    },
                    onBack: {
                        navigatingForward = false
                        withAnimation(.spring()) {
                            currentStepIndex -= 1
                        }
                    },
                    onCancel: { dismiss() },
                    onJump: { newIndex in
                        navigatingForward = newIndex > currentStepIndex
                        withAnimation(.spring()) {
                            currentStepIndex = newIndex
                        }
                    }
                )
                .transition(.asymmetric(
                    insertion: .move(edge: navigatingForward ? .trailing : .leading),
                    removal: .move(edge: navigatingForward ? .leading : .trailing)
                ))
            } else {
                StepCompletionView(
                    onFinish: {
                        dismiss()
                    }
                )
                .transition(.move(edge: .trailing))
            }
        }
        .navigationBarBackButtonHidden(true)
    }
}
