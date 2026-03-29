import SwiftUI

struct DocumentHighlightOverlayView: View {
    let parsedLines: [ParsedLine]
    let analysis: AnalysisResponse?
    @Binding var selectedStepId: String?
    let proxy: GeometryProxy
    
    var body: some View {
        ZStack(alignment: .topLeading) {
            if let steps = analysis?.steps {
                ForEach(Array(steps.enumerated()), id: \.element.id) { index, step in
                    if let targetIds = step.targetElementIds, let firstId = targetIds.first {
                        if let word = findWord(id: firstId) {
                            let rect = computeRect(for: word, in: proxy.size)
                            
                            // The bounding box highlight
                            if selectedStepId == step.id {
                                Rectangle()
                                    .fill(Theme.primaryAction.opacity(0.3))
                                    .cornerRadius(2)
                                    .frame(width: rect.width, height: rect.height)
                                    .position(x: rect.midX, y: rect.midY)
                                    .animation(.spring(), value: selectedStepId)
                            }
                            
                            // The numbered badge
                            Button(action: {
                                withAnimation(.spring()) {
                                    if selectedStepId == step.id {
                                        selectedStepId = nil
                                    } else {
                                        selectedStepId = step.id
                                    }
                                }
                            }) {
                                Circle()
                                    .fill(selectedStepId == step.id ? Theme.primaryAction : Theme.secondaryAction)
                                    .frame(width: 24, height: 24)
                                    .shadow(radius: selectedStepId == step.id ? 4 : 2)
                                    .overlay(
                                        Text("\(index + 1)")
                                            .font(.caption2.bold())
                                            .foregroundColor(selectedStepId == step.id ? .white : Theme.primaryAction)
                                    )
                            }
                            // Position the badge slightly to the left of the bounding box
                            .position(x: max(16, rect.minX - 16), y: rect.midY)
                            .zIndex(selectedStepId == step.id ? 10 : 1)
                        }
                    }
                }
            }
        }
        .frame(width: proxy.size.width, height: proxy.size.height, alignment: .topLeading)
    }
    
    private func findWord(id: String) -> ParsedWord? {
        for line in parsedLines {
            if let word = line.first(where: { $0.id == id }) {
                return word
            }
        }
        return nil
    }
    
    private func computeRect(for word: ParsedWord, in size: CGSize) -> CGRect {
        // Handle coordinate mapping utilizing API's normalized percentage constraints
        let x = (word.left ?? 0) * size.width
        let y = (word.top ?? 0) * size.height
        let w = (word.width ?? 0) * size.width
        let h = (word.height ?? 0) * size.height
        return CGRect(x: x, y: y, width: w, height: h)
    }
}
