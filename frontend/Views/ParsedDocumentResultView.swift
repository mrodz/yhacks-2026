import SwiftUI

struct ParsedDocumentResultView: View {
    let parsedLines: [ParsedLine]
    @Environment(\.dismiss) var dismiss
    
    var body: some View {
        NavigationStack {
            ZStack {
                Theme.background.ignoresSafeArea()
                
                if parsedLines.isEmpty {
                    VStack(spacing: 16) {
                        Image(systemName: "doc.text.magnifyingglass")
                            .font(.system(size: 60))
                            .foregroundColor(Color(uiColor: .systemGray3))
                        Text("No text found.".localized())
                            .font(.headline)
                            .foregroundColor(.secondary)
                    }
                } else {
                    ScrollView {
                        VStack(alignment: .leading, spacing: 12) {
                            ForEach(0..<parsedLines.count, id: \.self) { lineIndex in
                                let line = parsedLines[lineIndex]
                                let fullText = line.compactMap { $0.text }.joined(separator: " ")
                                
                                Text(fullText)
                                    .font(.body)
                                    .foregroundColor(.primary)
                                    .padding()
                                    .frame(maxWidth: .infinity, alignment: .leading)
                                    .background(Color(uiColor: .systemBackground))
                                    .cornerRadius(12)
                                    .shadow(color: Color.black.opacity(0.04), radius: 3, x: 0, y: 1)
                            }
                        }
                        .padding()
                    }
                }
            }
            .navigationTitle("Extracted Text".localized())
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Done".localized()) {
                        // The user closes out of the parsed view, we could also dismiss the scanner completely here.
                        dismiss()
                    }
                    .font(.headline)
                }
            }
        }
    }
}
