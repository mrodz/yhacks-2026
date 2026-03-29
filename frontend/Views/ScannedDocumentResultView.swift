import SwiftUI

struct ScannedDocumentResultView: View {
    let images: [UIImage]
    @Binding var isPresented: Bool
    
    @EnvironmentObject var authManager: AuthManager
    @StateObject private var parserManager = DocumentParserManager()
    @State private var showParsedResult = false
    
    var body: some View {
        NavigationStack {
            ZStack {
                Theme.background.ignoresSafeArea()
                
                if images.isEmpty {
                    Text("No pages scanned.".localized())
                        .foregroundColor(.secondary)
                } else {
                    ScrollView {
                        LazyVStack(spacing: 24) {
                            ForEach(0..<images.count, id: \.self) { index in
                                Image(uiImage: images[index])
                                    .resizable()
                                    .scaledToFit()
                                    .shadow(color: Color.black.opacity(0.1), radius: 10, x: 0, y: 5)
                                    .overlay(
                                        Text("Page \(index + 1)")
                                            .font(.caption.bold())
                                            .foregroundColor(.white)
                                            .padding(6)
                                            .background(Color.black.opacity(0.6))
                                            .cornerRadius(4)
                                            .padding(8)
                                        , alignment: .topTrailing
                                    )
                                    .padding(.horizontal)
                            }
                        }
                        .padding(.vertical)
                    }
                }
                
                if parserManager.isLoading {
                    Color.black.opacity(0.5).ignoresSafeArea()
                    VStack(spacing: 24) {
                        ProgressView()
                            .scaleEffect(2.0)
                            .tint(.white)
                        Text("Uploading & Analyzing...".localized())
                            .font(.headline)
                            .foregroundColor(.white)
                    }
                }
            }
            .navigationTitle("Scanned Pages".localized())
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Cancel".localized()) {
                        isPresented = false
                    }
                    .foregroundColor(.red)
                    .disabled(parserManager.isLoading)
                }
                
                ToolbarItem(placement: .navigationBarTrailing) {
                    if !images.isEmpty {
                        Button {
                            Task {
                                guard let pdfData = PDFGenerator.generatePDF(from: images) else { return }
                                let success = await parserManager.parseDocument(pdfData: pdfData, accessToken: authManager.accessToken)
                                if success {
                                    showParsedResult = true
                                }
                            }
                        } label: {
                            Text("Begin Scan".localized())
                                .font(.headline)
                        }
                        .disabled(parserManager.isLoading)
                    }
                }
            }
            .alert("Error", isPresented: Binding(
                get: { parserManager.errorMessage != nil },
                set: { if !$0 { parserManager.errorMessage = nil } }
            )) {
                Button("OK".localized(), role: .cancel) { }
            } message: {
                if let error = parserManager.errorMessage {
                    Text(error)
                }
            }
            .fullScreenCover(isPresented: $showParsedResult, onDismiss: {
                // Return to gallery immediately after the guided flow drops
                isPresented = false
            }) {
                if let response = parserManager.parsedResponse {
                    GuidedFlowCoordinatorView(parseResponse: response)
                } else {
                    // Fallback visualizer if the response struct is completely null
                    ParsedDocumentResultView(parsedLines: parserManager.parsedLines)
                }
            }
        }
    }
}
