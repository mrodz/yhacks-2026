import Foundation
import UIKit
import PDFKit
import Combine

@MainActor
class DocumentsManager: ObservableObject {
    @Published var contracts: [ContractResponse] = []
    @Published var isLoading = false
    @Published var errorMessage: String? = nil
    
    let baseURL = "https://api.formfriend.xyz"
    
    func fetchContracts(accessToken: String) async {
        isLoading = true
        errorMessage = nil
        defer { isLoading = false }
        
        guard let url = URL(string: "\(baseURL)/contracts") else { return }
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        
        do {
            let (data, response) = try await URLSession.shared.data(for: request)
            guard let httpResponse = response as? HTTPURLResponse else { return }
            
            if httpResponse.statusCode == 200 {
                contracts = try JSONDecoder().decode([ContractResponse].self, from: data)
            } else {
                errorMessage = "Failed to load documents."
            }
        } catch {
            errorMessage = error.localizedDescription
        }
    }
    
    // Static helper to fetch analysis metadata
    static func fetchAnalysis(id: Int, accessToken: String) async throws -> AnalysisResponse {
        let url = URL(string: "https://api.formfriend.xyz/contracts/\(id)/analysis")!
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        
        let (data, _) = try await URLSession.shared.data(for: request)
        return try JSONDecoder().decode(AnalysisResponse.self, from: data)
    }
    
    // Static helper to fetch raw JSON payload for debugging
    static func fetchParsedRaw(id: Int, accessToken: String) async throws -> String {
        let url = URL(string: "https://api.formfriend.xyz/contracts/\(id)/parsed")!
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        
        let (data, _) = try await URLSession.shared.data(for: request)
        return String(data: data, encoding: .utf8) ?? "Invalid JSON Encoding"
    }
    
    // Natively extract the first page of the downloaded PDF as a thumbnail
    static func fetchPDFThumbnail(id: Int, accessToken: String) async throws -> UIImage? {
        let url = URL(string: "https://api.formfriend.xyz/contracts/\(id)/file")!
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        
        let (data, _) = try await URLSession.shared.data(for: request)
        let fileResponse = try JSONDecoder().decode(FileResponse.self, from: data)
        guard let pdfURL = URL(string: fileResponse.url) else { return nil }
        
        let (pdfData, _) = try await URLSession.shared.data(from: pdfURL)
        guard let document = PDFDocument(data: pdfData),
              let page = document.page(at: 0) else { return nil }
        
        let pageRect = page.bounds(for: .mediaBox)
        let renderer = UIGraphicsImageRenderer(size: pageRect.size)
        let image = renderer.image { ctx in
            UIColor.white.set()
            ctx.fill(pageRect)
            ctx.cgContext.translateBy(x: 0.0, y: pageRect.size.height)
            ctx.cgContext.scaleBy(x: 1.0, y: -1.0)
            page.draw(with: .mediaBox, to: ctx.cgContext)
        }
        return image
    }
}
