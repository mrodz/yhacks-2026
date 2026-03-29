import Foundation

enum DocumentStatus: String, CaseIterable {
    case ready = "Ready"
    case needsReview = "Needs Review"
    case inProgress = "In Progress"
}

struct Document: Identifiable {
    let id = UUID()
    let title: String
    let date: Date
    let status: DocumentStatus
}

extension Document {
    static let mockDocuments = [
        Document(title: "W-2 Tax Form", date: Date(), status: .ready),
        Document(title: "Rental Agreement", date: Date().addingTimeInterval(-86400), status: .needsReview),
        Document(title: "Medical Intake Card", date: Date().addingTimeInterval(-172800), status: .inProgress)
    ]
}
