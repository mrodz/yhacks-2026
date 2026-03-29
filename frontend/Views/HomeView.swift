import SwiftUI

struct ScannedImageSet: Identifiable {
    let id = UUID()
    let images: [UIImage]
}

struct HomeView: View {
    @EnvironmentObject var authManager: AuthManager
    @StateObject private var docManager = DocumentsManager()
    @State private var showScanner = false
    @State private var showPhotoPicker = false
    @State private var scannedImageSet: ScannedImageSet?
    
    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 24) {
                    // Header Area
                    VStack(spacing: 12) {
                        Image(systemName: "doc.viewfinder")
                            .font(.system(size: 64))
                            .foregroundColor(Theme.primaryAction)
                            .padding(.bottom, 8)
                        
                        Text("FormFriend".localized())
                            .font(.largeTitle.bold())
                        
                        Text("Turn confusing paperwork into step-by-step guidance".localized())
                            .font(.body)
                            .foregroundColor(.secondary)
                            .multilineTextAlignment(.center)
                            .padding(.horizontal, 32)
                    }
                    .padding(.top, 50)
                    
                    // CTAs
                    VStack(spacing: 16) {
                        Button {
                            showScanner = true
                        } label: {
                            HStack {
                                Image(systemName: "camera.fill")
                                Text("Scan Photo".localized())
                            }
                            .font(.headline)
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(Theme.primaryAction)
                            .cornerRadius(16)
                            .shadow(color: Theme.primaryAction.opacity(0.3), radius: 8, x: 0, y: 4)
                        }
                        
                        Button {
                            showPhotoPicker = true
                        } label: {
                            HStack {
                                Image(systemName: "photo.on.rectangle")
                                Text("Upload from Camera Roll".localized())
                            }
                            .font(.headline)
                            .foregroundColor(Theme.primaryAction)
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(Theme.secondaryAction)
                            .cornerRadius(16)
                        }
                    }
                    .padding(.horizontal, 24)
                    
                    // Recent Documents
                    VStack(alignment: .leading, spacing: 16) {
                        Text("Recent".localized())
                            .font(.title3.bold())
                            .padding(.horizontal, 24)
                        
                        if docManager.isLoading && docManager.contracts.isEmpty {
                            ProgressView()
                                .padding(.horizontal, 24)
                        } else if docManager.contracts.isEmpty {
                            Text("No recent documents".localized())
                                .font(.subheadline)
                                .foregroundColor(.secondary)
                                .padding(.horizontal, 24)
                        } else {
                            ForEach(docManager.contracts.prefix(3)) { contract in
                                NavigationLink(destination: DocumentDetailView(contract: contract)) {
                                    HStack(spacing: 16) {
                                        Image(systemName: "doc.plaintext.fill")
                                            .font(.title2)
                                            .foregroundColor(Theme.primaryAction)
                                            .frame(width: 40, height: 40)
                                            .background(Color(uiColor: .systemGray6))
                                            .cornerRadius(8)
                                        
                                        VStack(alignment: .leading, spacing: 4) {
                                            Text(contract.filename)
                                                .font(.headline)
                                                .foregroundColor(.primary)
                                                .lineLimit(1)
                                            Text(contract.createdAt ?? "Original PDF")
                                                .font(.subheadline)
                                                .foregroundColor(.secondary)
                                                .lineLimit(1)
                                        }
                                        Spacer()
                                        Image(systemName: "chevron.right")
                                            .foregroundColor(Color(uiColor: .systemGray3))
                                            .font(.subheadline.bold())
                                    }
                                    .padding()
                                    .background(Color(uiColor: .systemBackground))
                                    .cornerRadius(16)
                                    .shadow(color: Color.black.opacity(0.04), radius: 8, x: 0, y: 4)
                                    .padding(.horizontal, 24)
                                }
                                .buttonStyle(PlainButtonStyle())
                            }
                        }
                    }
                    .padding(.top, 24)
                    
                    Spacer(minLength: 40)
                }
            }
            .background(Theme.background.ignoresSafeArea())
            .navigationBarHidden(true)
            .task {
                await docManager.fetchContracts(accessToken: authManager.accessToken)
            }
            .fullScreenCover(isPresented: $showScanner) {
                DocumentScannerView { images in
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                        scannedImageSet = ScannedImageSet(images: images)
                    }
                }
                .ignoresSafeArea()
            }
            .sheet(isPresented: $showPhotoPicker) {
                PhotoPickerView(
                    onImagesPicked: { images in
                        DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                            scannedImageSet = ScannedImageSet(images: images)
                        }
                    },
                    onCancel: {
                        showPhotoPicker = false
                    }
                )
                .ignoresSafeArea()
            }
            .fullScreenCover(item: $scannedImageSet) { set in
                ScannedDocumentResultView(
                    images: set.images,
                    isPresented: Binding(
                        get: { scannedImageSet != nil },
                        set: { isPresenting in
                            if !isPresenting {
                                scannedImageSet = nil
                            }
                        }
                    )
                )
                .environmentObject(authManager)
            }
        }
    }
}

#Preview {
    HomeView()
}
