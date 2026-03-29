import SwiftUI

struct StepZeroView: View {
    let step0: Step0
    let onStart: () -> Void
    let onCancel: () -> Void
    
    var body: some View {
        VStack(spacing: 0) {
            HStack {
                Button(action: onCancel) {
                    Image(systemName: "xmark")
                        .font(.title3.bold())
                        .foregroundColor(.primary)
                }
                Spacer()
            }
            .padding()
            
            ScrollView {
                VStack(alignment: .leading, spacing: 24) {
                    Image(systemName: "checklist.checked")
                        .font(.system(size: 64))
                        .foregroundColor(Theme.primaryAction)
                    
                    Text(step0.title ?? "Before you begin")
                        .font(.largeTitle.bold())
                    
                    if let desc = step0.description {
                        Text(desc)
                            .font(.title3)
                            .foregroundColor(.secondary)
                            .fixedSize(horizontal: false, vertical: true)
                    }
                    
                    if let items = step0.items, !items.isEmpty {
                        VStack(alignment: .leading, spacing: 16) {
                            Text("You will need:".localized())
                                .font(.headline)
                                .foregroundColor(.primary)
                            
                            ForEach(items, id: \.self) { item in
                                HStack(alignment: .top, spacing: 12) {
                                    Image(systemName: "checkmark.circle.fill")
                                        .foregroundColor(.green)
                                        .padding(.top, 2)
                                    Text(item)
                                        .font(.body)
                                        .foregroundColor(.primary)
                                        .fixedSize(horizontal: false, vertical: true)
                                }
                            }
                        }
                        .padding()
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .background(Color(uiColor: .systemBackground))
                        .cornerRadius(16)
                        .shadow(color: Color.black.opacity(0.05), radius: 10, y: 5)
                    }
                }
                .padding(.horizontal, 24)
                .padding(.top, 16)
            }
            
            Button(action: onStart) {
                Text("Start Guided Review".localized())
                    .font(.headline.bold())
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Theme.primaryAction)
                    .foregroundColor(.white)
                    .cornerRadius(12)
            }
            .padding(.horizontal, 24)
            .padding(.bottom, 24)
            .padding(.top, 16)
        }
        .background(Theme.background.ignoresSafeArea())
    }
}
