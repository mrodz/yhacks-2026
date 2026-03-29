import SwiftUI

struct GuidedDocumentScreen: View {
    let document: Document
    @Environment(\.dismiss) var dismiss
    
    var body: some View {
        ZStack(alignment: .bottom) {
            Theme.background.ignoresSafeArea()
            
            ScrollView {
                VStack(spacing: 16) {
                    // Top summary card
                    VStack(alignment: .leading, spacing: 12) {
                        Text(document.title)
                            .font(.title2.bold())
                        Text("Government Form • 3 Pages".localized())
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                        
                        Divider()
                        
                        Text("This is a standard form used for tax purposes. You need to verify boxes 1, 2, and 5 before submitting.".localized())
                            .font(.body)
                            .foregroundColor(.primary)
                    }
                    .padding()
                    .background(Color(uiColor: .systemBackground))
                    .cornerRadius(16)
                    .shadow(color: Color.black.opacity(0.05), radius: 8, x: 0, y: 4)
                    .padding()
                    
                    // Document Mock
                    ZStack {
                        Rectangle()
                            .fill(Color.white)
                            .aspectRatio(0.7, contentMode: .fit)
                            .overlay(
                                Text("Scanned Page Placeholder".localized())
                                    .font(.headline)
                                    .foregroundColor(.gray)
                            )
                            .shadow(color: Color.black.opacity(0.1), radius: 10, x: 0, y: 5)
                        
                        // Overlays
                        VStack(spacing: 40) {
                            HStack {
                                RoundedRectangle(cornerRadius: 8)
                                    .fill(Theme.primaryAction.opacity(0.2))
                                    .frame(width: 160, height: 40)
                                    .overlay(
                                        RoundedRectangle(cornerRadius: 8)
                                            .stroke(Theme.primaryAction, lineWidth: 2)
                                    )
                                    .overlay(
                                        Circle()
                                            .fill(Theme.primaryAction)
                                            .frame(width: 28, height: 28)
                                            .overlay(Text("1".localized()).foregroundColor(.white).font(.caption.bold()))
                                            .offset(x: -14, y: -14)
                                        , alignment: .topLeading
                                    )
                                Spacer()
                            }
                            
                            HStack {
                                Spacer()
                                RoundedRectangle(cornerRadius: 8)
                                    .fill(Color.orange.opacity(0.2))
                                    .frame(width: 120, height: 40)
                                    .overlay(
                                        RoundedRectangle(cornerRadius: 8)
                                            .stroke(Color.orange, lineWidth: 2)
                                    )
                                    .overlay(
                                        Circle()
                                            .fill(Color.orange)
                                            .frame(width: 28, height: 28)
                                            .overlay(Image(systemName: "exclamationmark").foregroundColor(.white).font(.caption.bold()))
                                            .offset(x: 14, y: -14)
                                        , alignment: .topTrailing
                                    )
                            }
                        }
                        .padding(30)
                    }
                    .padding(.horizontal)
                    
                    Spacer(minLength: 220)
                }
            }
            
            // Bottom Sheet/Guidance Panel
            VStack(spacing: 20) {
                HStack {
                    VStack(alignment: .leading, spacing: 4) {
                        Text("Step 1 of 3".localized())
                            .font(.caption.bold())
                            .foregroundColor(Theme.primaryAction)
                        Text("Review Income Box".localized())
                            .font(.title3.bold())
                    }
                    Spacer()
                }
                
                Text("Make sure the amount listed in Box 1 matches your final pay stub for the year.".localized())
                    .font(.body)
                    .foregroundColor(.secondary)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .fixedSize(horizontal: false, vertical: true)
                
                Button {
                    // Placeholder
                } label: {
                    Text("Next Step".localized())
                        .font(.headline)
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Theme.primaryAction)
                        .cornerRadius(12)
                }
            }
            .padding(24)
            .background(Color(uiColor: .systemBackground))
            .cornerRadius(24, corners: [.topLeft, .topRight])
            .shadow(color: Color.black.opacity(0.08), radius: 15, x: 0, y: -8)
            .ignoresSafeArea(edges: .bottom)
        }
        .navigationTitle("Guided View".localized())
        .navigationBarTitleDisplayMode(.inline)
    }
}

extension View {
    func cornerRadius(_ radius: CGFloat, corners: UIRectCorner) -> some View {
        clipShape( RoundedCorner(radius: radius, corners: corners) )
    }
}

struct RoundedCorner: Shape {
    var radius: CGFloat = .infinity
    var corners: UIRectCorner = .allCorners

    func path(in rect: CGRect) -> Path {
        let path = UIBezierPath(roundedRect: rect, byRoundingCorners: corners, cornerRadii: CGSize(width: radius, height: radius))
        return Path(path.cgPath)
    }
}

#Preview {
    GuidedDocumentScreen(document: Document.mockDocuments[0])
}
