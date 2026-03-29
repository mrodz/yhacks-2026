import SwiftUI

struct AccountSettingsView: View {
    @EnvironmentObject var authManager: AuthManager
    
    // Onboarding preferences stored persistently
    @AppStorage("preferredLanguage") var storedLanguage: String = ""
    @AppStorage("userCountry") var storedCountry: String = ""
    
    var body: some View {
        List {
            Section(header: Text("Personal Details".localized())) {
                LabeledContent("Name", value: authManager.currentUser?.name ?? "N/A")
                LabeledContent("Email", value: authManager.currentUser?.email ?? "N/A")
                
                if let phone = authManager.currentUser?.phoneNumber, !phone.isEmpty {
                    LabeledContent("Phone Number", value: phone)
                }
                
                if let school = authManager.currentUser?.schoolName {
                    LabeledContent("School", value: school)
                }
            }
            
            Section(header: Text("Onboarding Preferences".localized()), footer: Text("These preferences are used to customize which document fields are highlighted for you natively.".localized())) {
                LabeledContent {
                    Text(authManager.currentUser?.language ?? (storedLanguage.isEmpty ? "Not set" : storedLanguage))
                        .foregroundColor(.primary)
                } label: {
                    Label("Primary Language".localized(), systemImage: "globe")
                }
                
                LabeledContent {
                    Text(storedCountry.isEmpty ? "Not set" : storedCountry)
                        .foregroundColor(.primary)
                } label: {
                    Label("Region".localized(), systemImage: "map")
                }
            }
            
            Section(header: Text("Account Security".localized())) {
                NavigationLink(destination: Text("Change Password Placeholder".localized())) {
                    Label("Change Password".localized(), systemImage: "key")
                }
            }
        }
        .navigationTitle("Account details".localized())
        .navigationBarTitleDisplayMode(.inline)
    }
}

#Preview {
    NavigationStack {
        AccountSettingsView()
            .environmentObject(AuthManager())
    }
}
