import Foundation
import Combine

struct ParsedWord: Codable, Identifiable {
    let id: String
    
    let text: String?
    let confidence: Double?
    let boundingBox: BoundingBox?
    let page: Int?
    
    // Derived properties for easy SwiftUI GeometryReader access
    var left: Double? { boundingBox?.left }
    var top: Double? { boundingBox?.top }
    var width: Double? { boundingBox?.width }
    var height: Double? { boundingBox?.height }
    
    struct BoundingBox: Codable {
        let left: Double?
        let top: Double?
        let width: Double?
        let height: Double?
    }
}

typealias ParsedLine = [ParsedWord]

struct ContractParseResponse: Codable {
    let uploadId: Int?
    let filename: String?
    let lines: [ParsedLine]?
    let analysis: AnalysisResponse?
}

@MainActor
class DocumentParserManager: ObservableObject {
    @Published var isLoading = false
    @Published var errorMessage: String? = nil
    @Published var parsedLines: [ParsedLine] = []
    @Published var parsedResponse: ContractParseResponse? = nil
    
    let baseURL = "https://api.formfriend.xyz"
    
    func parseDocument(pdfData: Data, accessToken: String) async -> Bool {
        isLoading = true
        errorMessage = nil
        defer { isLoading = false }
        
        guard let url = URL(string: "\(baseURL)/contracts/parse") else { return false }
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        
        // AWS Textract backend requires a generous timeout
        request.timeoutInterval = 60
        
        let boundary = "Boundary-\(UUID().uuidString)"
        request.setValue("multipart/form-data; boundary=\(boundary)", forHTTPHeaderField: "Content-Type")
        
        var body = Data()
        body.append("--\(boundary)\r\n".data(using: .utf8)!)
        body.append("Content-Disposition: form-data; name=\"file\"; filename=\"document.pdf\"\r\n".data(using: .utf8)!)
        body.append("Content-Type: application/pdf\r\n\r\n".data(using: .utf8)!)
        body.append(pdfData)
        body.append("\r\n--\(boundary)--\r\n".data(using: .utf8)!)
        
        request.httpBody = body
        
        do {
            let (data, response) = try await URLSession.shared.data(for: request)
            guard let httpResponse = response as? HTTPURLResponse else { return false }
            
            if httpResponse.statusCode == 200 {
                do {
                    let parseResponse = try JSONDecoder().decode(ContractParseResponse.self, from: data)
                    self.parsedLines = parseResponse.lines ?? []
                    self.parsedResponse = parseResponse
                    return true
                } catch {
                    // Force the actual raw response to show in the UI Alert since the console is hidden
                    let responsePreview = String(data: data, encoding: .utf8)?.prefix(150) ?? "Unknown Encoding"
                    errorMessage = "Failed to parse structure. Server responded with:\n\n\(responsePreview)..."
                    return false
                }
            } else if httpResponse.statusCode == 401 {
                errorMessage = "Session expired. Please log in again."
                return false
            } else {
                errorMessage = "Failed to parse document. Error code \(httpResponse.statusCode)"
                return false
            }
        } catch {
            errorMessage = error.localizedDescription
            return false
        }
    }
}
