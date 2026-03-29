import SwiftUI

struct LanguageOption: Hashable {
    let name: String
    let symbol: String
}

struct OnboardingLanguageView: View {
    @Binding var step: Int
    @State private var selectedLanguage: LanguageOption? = nil
    @AppStorage("preferredLanguage") var storedLanguage: String = ""
    
    let languages = [
        LanguageOption(name: "English", symbol: "🇺🇸"),
        LanguageOption(name: "Spanish", symbol: "ñ"),
        LanguageOption(name: "French", symbol: "🇫🇷"),
        LanguageOption(name: "Mandarin", symbol: "文"),
        LanguageOption(name: "Arabic", symbol: "ع")
    ]
    
    var body: some View {
        VStack(alignment: .leading, spacing: 24) {
            VStack(alignment: .leading, spacing: 8) {
                Text("Primary Language".localized())
                    .font(.largeTitle.bold())
                Text("What language do you prefer to read in?".localized())
                    .font(.body)
                    .foregroundColor(.secondary)
            }
            .padding(.horizontal, 24)
            .padding(.top, 40)
            
            ScrollView {
                VStack(spacing: 12) {
                    ForEach(languages, id: \.self) { language in
                        Button {
                            withAnimation(.easeInOut(duration: 0.2)) {
                                selectedLanguage = language
                            }
                        } label: {
                            HStack(spacing: 16) {
                                // Symbol or Flag
                                Text(language.symbol)
                                    .font(.title2)
                                    .frame(width: 40, height: 40)
                                    .background(Color(uiColor: .systemGray6))
                                    .clipShape(Circle())
                                
                                Text(language.name.localized())
                                    .font(.headline)
                                    .foregroundColor(.primary)
                                
                                Spacer()
                                
                                if selectedLanguage == language {
                                    Image(systemName: "checkmark.circle.fill")
                                        .foregroundColor(Theme.primaryAction)
                                        .transition(.scale)
                                }
                            }
                            .padding()
                            .background(selectedLanguage == language ? Theme.primaryAction.opacity(0.08) : Color(uiColor: .systemBackground))
                            .cornerRadius(16)
                            .overlay(RoundedRectangle(cornerRadius: 16).stroke(selectedLanguage == language ? Theme.primaryAction : Color.clear, lineWidth: 2))
                        }
                    }
                }
                .padding(.horizontal, 24)
            }
            
            Button {
                if let lang = selectedLanguage?.name {
                    storedLanguage = lang
                }
                withAnimation { step = 2 }
            } label: {
                Text("Continue".localized())
                    .font(.headline)
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(selectedLanguage == nil ? Color(uiColor: .systemGray4) : Theme.primaryAction)
                    .cornerRadius(16)
            }
            .disabled(selectedLanguage == nil)
            .padding(.horizontal, 24)
            .padding(.bottom, 40)
        }
        .background(Theme.background.ignoresSafeArea())
    }
}
