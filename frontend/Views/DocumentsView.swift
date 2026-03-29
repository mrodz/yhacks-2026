import SwiftUI

struct DocumentsView: View {
    @StateObject private var         docManager = DocumentsManager()
    @EnvironmentObject var authManager: AuthManager
    
    let columns = [
        GridItem(.flexible(), spacing: 16),
        GridItem(.flexible(), spacing: 16)
    ]
    
    var body: some View {
        NavigationStack {
            ScrollView {
                if docManager.isLoading && docManager.contracts.isEmpty {
                    ProgressView().padding(.top, 80)
                } else if docManager.contracts.isEmpty {
                    VStack(spacing: 16) {
                        Image(systemName: "folder.badge.plus")
                            .font(.system(size: 60))
                            .foregroundColor(Color(uiColor: .systemGray3))
                        Text("No documents yet.".localized())
                            .font(.headline)
                            .foregroundColor(.secondary)
                    }
                    .padding(.top, 100)
                } else {
                    LazyVGrid(columns: columns, spacing: 20) {
                        ForEach(docManager.contracts) { contract in
                            NavigationLink(destination: DocumentDetailView(contract: contract)) {
                                DocumentCardModernView(contract: contract)
                            }
                            .buttonStyle(PlainButtonStyle())
                        }
                    }
                    .padding()
                }
            }
            .navigationTitle("Documents".localized())
            .background(Theme.background.ignoresSafeArea())
            .task {
                await docManager.fetchContracts(accessToken: authManager.accessToken)
            }
            .refreshable {
                await docManager.fetchContracts(accessToken: authManager.accessToken)
            }
        }
    }
}

struct DocumentCardModernView: View {
    let contract: ContractResponse
    
    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            PDFThumbnailView(contractId: contract.id)
                .frame(maxWidth: .infinity)
                .clipped()
            
            VStack(alignment: .leading, spacing: 4) {
                Text(contract.filename)
                    .font(.subheadline.bold())
                    .lineLimit(1)
                    .truncationMode(.middle)
                    .foregroundColor(.primary)
                
                // Display the creation date or a placeholder
                Text(contract.createdAt ?? "Upload Complete")
                    .font(.caption)
                    .foregroundColor(.secondary)
                    .lineLimit(1)
            }
            .padding(12)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(Color(uiColor: .systemBackground))
        }
        .background(Color(uiColor: .systemBackground))
        .cornerRadius(12)
        .shadow(color: Color.black.opacity(0.04), radius: 6, x: 0, y: 3)
    }
}
