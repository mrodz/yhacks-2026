import Foundation

struct ContractResponse: Codable, Identifiable {
    let id: Int
    let filename: String
    let createdAt: String?
}

struct FileResponse: Codable {
    let url: String
}

// Maps to Java's ContractAnalysis
struct AnalysisResponse: Codable {
    let documentSummary: DocumentSummary?
    let eta: Eta?
    let step0: Step0?
    let steps: [AnalysisStep]?
    let unanchoredNotes: [UnanchoredNote]?
}

struct DocumentSummary: Codable {
    let title: String?
    let documentType: String?
    let shortDescription: String?
}

struct Eta: Codable {
    let minutes: Int?
    let basis: String?
}

struct Step0: Codable {
    let title: String?
    let description: String?
    let items: [String]?
    let confidence: String?
}

// Maps to Java's Step
struct AnalysisStep: Codable, Identifiable {
    var id: String { "\(stepNumber ?? 0)-\(title ?? UUID().uuidString)" }
    let stepNumber: Int?
    let type: String?
    let title: String?
    let description: String?
    let targetElementIds: [String]?
    let pageHint: Int?
    let readingOrderHint: Int?
    let confidence: String?
}

// Maps to Java's UnanchoredNote
struct UnanchoredNote: Codable, Identifiable {
    var id: String { title ?? UUID().uuidString }
    let title: String?
    let description: String?
    let reason: String?
}
