import SwiftUI

struct ScanReviewView: View {
    @Binding var isPresented: Bool
    var onComplete: () -> Void
    @State private var showProcessing = false
    
    var body: some View {
        NavigationStack {
            ZStack {
                Theme.background.ignoresSafeArea()
                
                VStack {
                    // Document Preview
                    Rectangle()
                        .fill(Color.white)
                        .aspectRatio(0.7, contentMode: .fit)
                        .overlay(
                            Text("Captured Image".localized())
                                .font(.headline)
                                .foregroundColor(.gray)
                        )
                        .shadow(color: Color.black.opacity(0.1), radius: 10, x: 0, y: 5)
                        .padding()
                    
                    // Thumbnails bottom bar
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 12) {
                            RoundedRectangle(cornerRadius: 8)
                                .fill(Color.white)
                                .frame(width: 60, height: 80)
                                .overlay(RoundedRectangle(cornerRadius: 8).stroke(Theme.primaryAction, lineWidth: 2))
                            
                            Button(action: {}) {
                                RoundedRectangle(cornerRadius: 8)
                                    .fill(Theme.secondaryAction)
                                    .frame(width: 60, height: 80)
                                    .overlay(Image(systemName: "plus").foregroundColor(Theme.primaryAction))
                            }
                        }
                        .padding(.horizontal)
                    }
                    .frame(height: 100)
                    
                    // Actions
                    HStack(spacing: 16) {
                        Button("Retake".localized()) {
                            isPresented = false
                        }
                        .font(.headline)
                        .foregroundColor(Theme.primaryAction)
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Theme.secondaryAction)
                        .cornerRadius(12)
                        
                        Button("Continue".localized()) {
                            showProcessing = true
                        }
                        .font(.headline)
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Theme.primaryAction)
                        .cornerRadius(12)
                    }
                    .padding()
                }
            }
            .navigationTitle("Review".localized())
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Cancel".localized()) {
                        onComplete()
                    }
                }
            }
            .fullScreenCover(isPresented: $showProcessing) {
                ProcessingOverlay {
                    onComplete()
                }
            }
        }
    }
}
