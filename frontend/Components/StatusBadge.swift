import SwiftUI

struct StatusBadge: View {
    let status: DocumentStatus
    
    var body: some View {
        Text(status.rawValue)
            .font(.caption.bold())
            .padding(.horizontal, 10)
            .padding(.vertical, 5)
            .background(backgroundColor.opacity(0.15))
            .foregroundColor(backgroundColor)
            .clipShape(Capsule())
    }
    
    var backgroundColor: Color {
        switch status {
        case .ready:
            return .green
        case .needsReview:
            return .orange
        case .inProgress:
            return .blue
        }
    }
}

#Preview {
    VStack {
        StatusBadge(status: .ready)
        StatusBadge(status: .needsReview)
        StatusBadge(status: .inProgress)
    }
}
