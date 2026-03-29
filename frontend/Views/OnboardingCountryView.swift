import SwiftUI

struct OnboardingCountryView: View {
    @Binding var step: Int
    @State private var selectedCountry: String? = nil
    let countries = ["United States", "Canada", "United Kingdom", "Australia", "Other"]
    
    var body: some View {
        VStack(alignment: .leading, spacing: 24) {
            VStack(alignment: .leading, spacing: 8) {
                Text("Where do you live?".localized())
                    .font(.largeTitle.bold())
                Text("This helps us understand the forms you'll be scanning.".localized())
                    .font(.body)
                    .foregroundColor(.secondary)
            }
            .padding(.horizontal, 24)
            .padding(.top, 60)
            
            ScrollView {
                VStack(spacing: 12) {
                    ForEach(countries, id: \.self) { country in
                        Button {
                            withAnimation(.easeInOut(duration: 0.2)) {
                                selectedCountry = country
                            }
                        } label: {
                            HStack {
                                Text(country)
                                    .font(.headline)
                                    .foregroundColor(.primary)
                                Spacer()
                                if selectedCountry == country {
                                    Image(systemName: "checkmark.circle.fill")
                                        .foregroundColor(Theme.primaryAction)
                                        .transition(.scale)
                                }
                            }
                            .padding()
                            .background(selectedCountry == country ? Theme.primaryAction.opacity(0.08) : Color(uiColor: .systemBackground))
                            .cornerRadius(12)
                            .overlay(RoundedRectangle(cornerRadius: 12).stroke(selectedCountry == country ? Theme.primaryAction : Color.clear, lineWidth: 2))
                        }
                    }
                }
                .padding(.horizontal, 24)
            }
    @AppStorage("userCountry") var storedCountry: String = ""
            
            Button {
                if let c = selectedCountry {
                    storedCountry = c
                }
                withAnimation {
                    step = 2
                }
            } label: {
                Text("Continue".localized())
                    .font(.headline)
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(selectedCountry == nil ? Color(uiColor: .systemGray4) : Theme.primaryAction)
                    .cornerRadius(16)
            }
            .disabled(selectedCountry == nil)
            .padding(.horizontal, 24)
            .padding(.bottom, 40)
        }
        .background(Theme.background.ignoresSafeArea())
    }
}
