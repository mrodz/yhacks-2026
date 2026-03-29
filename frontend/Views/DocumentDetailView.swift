import SwiftUI

struct DocumentDetailView: View {
    let contract: ContractResponse
    @EnvironmentObject var authManager: AuthManager
    
    @State private var analysis: AnalysisResponse? = nil
    @State private var rawJSON: String? = nil
    @State private var selectedStepId: String? = nil
    @State private var isLoading = true
    @State private var pdfImage: UIImage? = nil
    
    var body: some View {
        ScrollViewReader { scrollProxy in
            ScrollView {
                VStack(spacing: 24) {
                    // Top Header Context (Native Document Thumbnail with Interactive Overlay)
                    if let img = pdfImage {
                        ZStack(alignment: .topLeading) {
                            Image(uiImage: img)
                                .resizable()
                                .scaledToFit()
                                .overlay(
                                    GeometryReader { geo in
                                        DocumentHighlightOverlayView(
                                            parsedLines: rawJSON != nil ? (try? JSONDecoder().decode([ParsedLine].self, from: rawJSON!.data(using: .utf8)!)) ?? [] : [],
                                            analysis: analysis,
                                            selectedStepId: $selectedStepId,
                                            proxy: geo
                                        )
                                    }
                                )
                        }
                        .frame(height: 350)
                        .cornerRadius(8)
                        .shadow(color: Color.black.opacity(0.1), radius: 6, y: 3)
                        .padding(.top)
                        .id("top_pdf_image") // Used to scroll back up
                    } else {
                        Rectangle()
                            .fill(Color(uiColor: .systemGray6))
                            .frame(height: 350)
                            .overlay(ProgressView())
                            .cornerRadius(8)
                            .padding(.top)
                    }
                    
                    // Analysis Section
                    if isLoading {
                        VStack(spacing: 16) {
                            ProgressView()
                            Text("Executing Analysis...".localized())
                                .font(.headline)
                                .foregroundColor(.secondary)
                        }
                        .frame(maxWidth: .infinity)
                        .padding(40)
                        .background(Color(uiColor: .systemBackground))
                        .cornerRadius(16)
                        .padding(.horizontal)
                    } else if let analysis = analysis {
                        // Core Summary Metrics Header
                        VStack(alignment: .leading, spacing: 16) {
                            Text("Overview".localized())
                                .font(.title3.bold())
                            
                            if let summary = analysis.documentSummary?.shortDescription {
                                Text(summary)
                                    .font(.body)
                                    .foregroundColor(.primary)
                            }
                            
                            HStack {
                                if let eta = analysis.eta {
                                    Label("ETA: \(eta.minutes ?? 0) min", systemImage: "clock")
                                        .font(.subheadline.bold())
                                        .foregroundColor(Theme.primaryAction)
                                }
                                Spacer()
                                if let _ = analysis.unanchoredNotes?.first {
                                    Label("Notes".localized(), systemImage: "note.text")
                                        .font(.subheadline)
                                        .foregroundColor(.secondary)
                                }
                            }
                        }
                        .padding()
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .background(Color(uiColor: .systemBackground))
                        .cornerRadius(16)
                        .shadow(color: Color.black.opacity(0.03), radius: 5, y: 2)
                        .padding(.horizontal)
                        
                        if let step0 = analysis.step0 {
                            VStack(alignment: .leading, spacing: 8) {
                                Text(step0.title ?? "Before you begin")
                                    .font(.headline)
                                    .foregroundColor(.orange)
                                if let desc = step0.description {
                                    Text(desc)
                                        .font(.subheadline)
                                }
                                if let items = step0.items, !items.isEmpty {
                                    ForEach(items, id: \.self) { item in
                                        HStack(alignment: .top) {
                                            Text("•".localized())
                                            Text(item)
                                        }.font(.subheadline)
                                    }
                                }
                            }
                            .padding()
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .background(Color.orange.opacity(0.08))
                            .cornerRadius(12)
                            .padding(.horizontal)
                        }
                        
                        // Detailed List of Form Instructions
                        if let steps = analysis.steps, !steps.isEmpty {
                            VStack(alignment: .leading, spacing: 16) {
                                Text("Action Steps".localized())
                                    .font(.title3.bold())
                                    .padding(.horizontal)
                                    .padding(.top, 8)
                                
                                ForEach(Array(steps.enumerated()), id: \.element.id) { index, step in
                                    HStack(alignment: .top, spacing: 16) {
                                        Circle()
                                            .fill(selectedStepId == step.id ? Theme.primaryAction : Theme.primaryAction.opacity(0.15))
                                            .frame(width: 32, height: 32)
                                            .overlay(Text("\(index + 1)").font(.headline.bold()).foregroundColor(selectedStepId == step.id ? .white : Theme.primaryAction))
                                        
                                        VStack(alignment: .leading, spacing: 4) {
                                            if let title = step.title {
                                                Text(title).font(.headline)
                                            }
                                            if let desc = step.description {
                                                Text(desc).font(.subheadline).foregroundColor(.secondary)
                                            }
                                        }
                                    }
                                    .padding(.bottom, 12)
                                    .padding(.horizontal)
                                    .contentShape(Rectangle())
                                    .id(step.id) // Used to scroll down to this specific step
                                    .onTapGesture {
                                        withAnimation(.spring()) {
                                            if selectedStepId == step.id {
                                                selectedStepId = nil
                                            } else {
                                                selectedStepId = step.id
                                                // Scroll back up to the document image so they see the highlight
                                                scrollProxy.scrollTo("top_pdf_image", anchor: .top)
                                            }
                                        }
                                    }
                                }
                            }
                            .padding(.vertical)
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .background(Color(uiColor: .systemBackground))
                            .cornerRadius(16)
                            .shadow(color: Color.black.opacity(0.03), radius: 5, y: 2)
                            .padding(.horizontal)
                        }
                    }
                }
                .padding(.bottom, 40)
            }
            .onChange(of: selectedStepId) { newId in
                if let id = newId {
                    // If they tapped the PDF badge, auto-scroll down to the list step!
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
                        withAnimation(.spring()) {
                            scrollProxy.scrollTo(id, anchor: .center)
                        }
                    }
                }
            }
        }
        .background(Theme.background.ignoresSafeArea())
        .navigationTitle(contract.filename)
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .navigationBarTrailing) {
                Menu {
                    if let rawJSON = rawJSON {
                        ShareLink(item: rawJSON) {
                            Label("Export Raw JSON".localized(), systemImage: "square.and.arrow.up.left")
                        }
                    }
                } label: {
                    Image(systemName: "ellipsis.circle")
                }
            }
        }
        .task {
            // Leverage structured Concurrency to load everything concurrently off the main thread securely
            async let fetchThumb = DocumentsManager.fetchPDFThumbnail(id: contract.id, accessToken: authManager.accessToken)
            async let fetchAna = DocumentsManager.fetchAnalysis(id: contract.id, accessToken: authManager.accessToken)
            async let fetchRaw = DocumentsManager.fetchParsedRaw(id: contract.id, accessToken: authManager.accessToken)
            
            do {
                let thumbResult = try await fetchThumb
                let anaResult = try await fetchAna
                let rawResult = try await fetchRaw
                
                self.pdfImage = thumbResult
                self.analysis = anaResult
                self.rawJSON = rawResult
            } catch {
                print("Failed to load details: \(error)")
            }
            self.isLoading = false
        }
    }
}
