import SwiftUI

struct PDFThumbnailView: View {
    let contractId: Int
    @EnvironmentObject var authManager: AuthManager
    
    @State private var thumbnail: UIImage? = nil
    @State private var hasAttempted = false
    
    var body: some View {
        GeometryReader { proxy in
            ZStack {
                if let image = thumbnail {
                    Image(uiImage: image)
                        .resizable()
                        .scaledToFill()
                        .frame(width: proxy.size.width, height: proxy.size.height)
                        .clipped()
                } else if hasAttempted {
                    VStack {
                        Image(systemName: "doc.text.fill")
                            .font(.largeTitle)
                            .foregroundColor(Color(uiColor: .systemGray3))
                    }
                    .frame(width: proxy.size.width, height: proxy.size.height)
                    .background(Color(uiColor: .systemGray6))
                } else {
                    ProgressView()
                        .frame(width: proxy.size.width, height: proxy.size.height)
                        .background(Color(uiColor: .systemGray6))
                }
            }
        }
        .aspectRatio(0.75, contentMode: .fit) // Standard 8.5x11 PDF Aspect Ratio
        .task {
            guard !hasAttempted else { return }
            do {
                if let img = try await DocumentsManager.fetchPDFThumbnail(id: contractId, accessToken: authManager.accessToken) {
                    self.thumbnail = img
                }
            } catch {
                print("Failed to load thumbnail for \(contractId): \(error)")
            }
            self.hasAttempted = true
        }
    }
}
