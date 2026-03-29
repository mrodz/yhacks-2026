import SwiftUI

struct GuidedStepInteractiveView: View {
    let step: AnalysisStep
    let stepIndex: Int
    let totalSteps: Int
    let parseResponse: ContractParseResponse
    
    let onNext: () -> Void
    let onBack: () -> Void
    let onCancel: () -> Void
    var onJump: ((Int) -> Void)? = nil
    
    @EnvironmentObject var authManager: AuthManager
    
    @State private var pdfImage: UIImage? = nil
    // We're converting to `[ParsedLine]` array structure dynamically for the overlay
    @State private var parsedLines: [ParsedLine] = []
    @State private var boundToStepId: String? = nil
    
    /// True when this step maps to a specific field the user needs to fill in or sign
    private var isActionStep: Bool {
        // Check type first — review/warning types are never action steps
        let reviewTypes = ["warning", "review", "note", "info"]
        if let t = step.type?.lowercased(), reviewTypes.contains(t) { return false }
        
        // Known action types from the backend
        let actionTypes = ["field", "fill_in", "signature", "sign", "check", "date", "select"]
        if let t = step.type?.lowercased(), actionTypes.contains(t) { return true }
        
        // Fallback: if it has targetElementIds, treat as action
        if let ids = step.targetElementIds, !ids.isEmpty { return true }
        return false
    }
    
    // Load dynamically dependent on `step.pageHint`
    private func fetchPageImage(hint: Int?) async -> UIImage? {
        guard let uploadId = parseResponse.uploadId else { return nil }
        let targetPage = hint ?? 1
        // Using DocumentsManager if possible, but notice fetchPDFThumbnail only fetches page 0.
        // We will default to a wrapper around the thumbnail for v1
        do {
            return try await DocumentsManager.fetchPDFThumbnail(id: uploadId, accessToken: authManager.accessToken)
        } catch {
            return nil
        }
    }
    
    var body: some View {
        VStack(spacing: 0) {
            // Sleek Top-Anchored Progress Line
            ProgressView(value: Double(stepIndex), total: Double(totalSteps))
                .tint(Theme.primaryAction)
                .background(Color(uiColor: .systemGray5))
                .animation(.spring(), value: stepIndex)
            
            // Flexible Top Document Viewer
            ZStack {
                if let img = pdfImage {
                    Image(uiImage: img)
                        .resizable()
                        .aspectRatio(img.size, contentMode: .fit)
                        .overlay(
                            GeometryReader { geo in
                                // Resilient highlight overlay - strictly optional
                                DocumentHighlightOverlayView(
                                    parsedLines: parsedLines,
                                    analysis: parseResponse.analysis,
                                    selectedStepId: $boundToStepId,
                                    proxy: geo
                                )
                            }
                        )
                        .padding(.horizontal, 4)
                        .padding(.vertical, 8)
                        .shadow(color: Color.black.opacity(0.1), radius: 10, y: 5)
                } else {
                    Rectangle()
                        .fill(Color(uiColor: .systemGray6))
                        .overlay(ProgressView())
                }
                
                // Top Dismiss Navigation
                VStack {
                    HStack {
                        Button(action: onCancel) {
                            Image(systemName: "xmark.circle.fill")
                                .font(.title)
                                .foregroundColor(.secondary)
                                .background(Circle().fill(Color(uiColor: .systemBackground)))
                        }
                        Spacer()
                        Text("\(stepIndex) of \(totalSteps)")
                            .font(.caption.bold())
                            .foregroundColor(.secondary)
                            .padding(.horizontal, 12)
                            .padding(.vertical, 6)
                            .background(Capsule().fill(Color(uiColor: .systemBackground)))
                    }
                    .padding()
                    Spacer()
                }
            }
            .frame(maxHeight: .infinity)
            .background(Color(uiColor: .systemGray6))
            
            // Bottom Flexible Panel Component
            VStack(alignment: .leading, spacing: 16) {
                VStack(alignment: .leading, spacing: 8) {
                    HStack(spacing: 8) {
                        // Type-aware icon
                        Image(systemName: isActionStep ? "pencil.line" : "exclamationmark.triangle.fill")
                            .font(.subheadline.bold())
                            .foregroundColor(isActionStep ? Theme.primaryAction : .orange)
                        
                        Text(isActionStep ? "Step \(stepIndex)" : "Step \(stepIndex) · Review")
                            .font(.subheadline.bold())
                            .foregroundColor(isActionStep ? Theme.primaryAction : .orange)
                        
                        Spacer()
                        
                        if !isActionStep {
                            Text("No field to fill")
                                .font(.caption)
                                .foregroundColor(.orange)
                                .padding(.horizontal, 8)
                                .padding(.vertical, 4)
                                .background(Color.orange.opacity(0.12))
                                .cornerRadius(6)
                        }
                    }
                    
                    if let title = step.title {
                        Text(title)
                            .font(.title3.bold())
                    }
                    if let desc = step.description {
                        Text(desc)
                            .font(.body)
                            .foregroundColor(.secondary)
                            .fixedSize(horizontal: false, vertical: true)
                    }
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                
                // Mic dictation button
                HStack {
                    Spacer()
                    Button(action: {
                        // Speech recognition will be wired here later
                    }) {
                        Image(systemName: "mic.fill")
                            .font(.title2)
                            .foregroundColor(.white)
                            .frame(width: 56, height: 56)
                            .background(Circle().fill(Theme.primaryAction))
                            .shadow(color: Theme.primaryAction.opacity(0.4), radius: 8, y: 4)
                    }
                    Spacer()
                }
                
                Spacer(minLength: 16)
                
                HStack(spacing: 16) {
                    Button(action: onBack) {
                        Image(systemName: "chevron.left")
                            .font(.headline)
                            .frame(width: 50, height: 50)
                            .background(Color(uiColor: .systemGray5))
                            .foregroundColor(.primary)
                            .cornerRadius(12)
                    }
                    
                    Button(action: onNext) {
                        Text(stepIndex == totalSteps ? "Finish" : (isActionStep ? "Next Step" : "Acknowledge & Continue"))
                            .font(.headline.bold())
                            .frame(maxWidth: .infinity)
                            .frame(height: 50)
                            .background(isActionStep ? Theme.primaryAction : Color.orange)
                            .foregroundColor(.white)
                            .cornerRadius(12)
                    }
                }
            }
            .padding()
            .background(Color(uiColor: .systemBackground))
            .cornerRadius(24, corners: [.topLeft, .topRight])
            .shadow(color: Color.black.opacity(0.1), radius: 10, y: -5)
            .id(step.id)
        }
        .background(Theme.background.ignoresSafeArea())
        .onAppear {
            self.parsedLines = parseResponse.lines ?? []
            self.boundToStepId = step.id
        }
        .onChange(of: step.id) { newId in
            self.boundToStepId = newId
        }
        .onChange(of: boundToStepId) { newValue in
            guard let newId = newValue, newId != step.id else { return }
            if let steps = parseResponse.analysis?.steps,
               let idx = steps.firstIndex(where: { $0.id == newId }) {
                onJump?(idx + 1)
            }
        }
        .task(id: step.pageHint) {
            // Fetch dynamically based on the page hint associated with the active step
              self.pdfImage = await fetchPageImage(hint: step.pageHint)
        }
    }
}


