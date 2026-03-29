import SwiftUI

struct ScanCameraView: View {
    @Environment(\.dismiss) var dismiss
    @State private var showReview = false
    
    var body: some View {
        NavigationStack {
            ZStack {
                Color.black.ignoresSafeArea()
                
                // Camera Viewfinder Placeholder
                VStack {
                    Spacer()
                    
                    Text("Line up the page inside the frame".localized())
                        .font(.headline)
                        .foregroundColor(.white)
                        .padding()
                        .background(Color.black.opacity(0.6))
                        .cornerRadius(8)
                    
                    // The Frame
                    Rectangle()
                        .stroke(Color.white, style: StrokeStyle(lineWidth: 2, dash: [10]))
                        .aspectRatio(0.7, contentMode: .fit)
                        .padding(40)
                    
                    Spacer()
                    
                    // Controls
                    HStack {
                        Button("Cancel".localized()) { dismiss() }
                            .font(.headline)
                            .foregroundColor(.white)
                            .padding()
                        
                        Spacer()
                        
                        Button {
                            showReview = true
                        } label: {
                            Circle()
                                .fill(Color.white)
                                .frame(width: 70, height: 70)
                                .overlay(Circle().stroke(Color.black, lineWidth: 2).padding(2))
                        }
                        
                        Spacer()
                        
                        Button(action: {}) {
                            Image(systemName: "bolt.fill")
                                .font(.title2)
                                .foregroundColor(.white)
                                .padding()
                        }
                    }
                    .padding(.horizontal, 30)
                    .padding(.bottom, 40)
                }
            }
            .navigationBarHidden(true)
            .fullScreenCover(isPresented: $showReview) {
                ScanReviewView(isPresented: $showReview) {
                    dismiss()
                }
            }
        }
    }
}

#Preview {
    ScanCameraView()
}
