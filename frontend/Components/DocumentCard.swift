import SwiftUI

struct DocumentCard: View {
    let document: Document
    
    var body: some View {
        HStack {
            VStack(alignment: .leading, spacing: 6) {
                Text(document.title)
                    .font(.headline)
                    .foregroundColor(.primary)
                Text(document.date, style: .date)
                    .font(.subheadline)
                    .foregroundColor(.secondary)
            }
            Spacer()
            StatusBadge(status: document.status)
        }
        .padding()
        .background(Color(uiColor: .systemBackground))
        .cornerRadius(16)
        .shadow(color: Color.black.opacity(0.04), radius: 8, x: 0, y: 4)
    }
}

#Preview {
    ZStack {
        Color(uiColor: .systemGroupedBackground).ignoresSafeArea()
        DocumentCard(document: Document.mockDocuments[0])
            .padding()
    }
}
