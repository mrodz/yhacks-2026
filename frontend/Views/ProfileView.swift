import SwiftUI

struct ProfileView: View {
    @EnvironmentObject var authManager: AuthManager
    
    var body: some View {
        NavigationStack {
            List {
                Section {
                    HStack(spacing: 16) {
                        Image(systemName: "person.circle.fill")
                            .font(.system(size: 60))
                            .foregroundColor(Theme.primaryAction)
                        
                        VStack(alignment: .leading, spacing: 4) {
                            Text(authManager.currentUser?.name ?? "Loading Profile...")
                                .font(.title3.bold())
                                .redacted(reason: authManager.currentUser == nil ? .placeholder : [])
                            
                            Text(authManager.currentUser?.email ?? " ")
                                .font(.subheadline)
                                .foregroundColor(.secondary)
                                .redacted(reason: authManager.currentUser == nil ? .placeholder : [])
                        }
                    }
                    .padding(.vertical, 8)
                    
                    if let phone = authManager.currentUser?.phoneNumber, !phone.isEmpty {
                        HStack {
                            Image(systemName: "phone.fill")
                                .foregroundColor(.secondary)
                                .frame(width: 24)
                            Text(phone)
                                .font(.body)
                        }
                    }
                    
                    if let school = authManager.currentUser?.schoolName {
                        HStack {
                            Image(systemName: "graduationcap.fill")
                                .foregroundColor(.secondary)
                                .frame(width: 24)
                            Text(school)
                                .font(.body)
                        }
                    }
                }
                
                Section(header: Text("App Settings".localized())) {
                    NavigationLink(destination: AccountSettingsView()) {
                        Label("Account".localized(), systemImage: "person.text.rectangle")
                    }
                    NavigationLink(destination: Text("Notifications Placeholder".localized())) {
                        Label("Notifications".localized(), systemImage: "bell.badge")
                    }
                }
                
                Section(header: Text("Support & Privacy".localized())) {
                    NavigationLink(destination: Text("Help & FAQ Placeholder".localized())) {
                        Label("Help & FAQ".localized(), systemImage: "questionmark.circle")
                    }
                    NavigationLink(destination: Text("Privacy Policy Placeholder".localized())) {
                        Label("Privacy".localized(), systemImage: "lock.shield")
                    }
                }
                
                Section {
                    Button(action: {
                        withAnimation {
                            authManager.logout()
                        }
                    }) {
                        Text("Log Out".localized())
                    }
                    .foregroundColor(.red)
                }
            }
            .navigationTitle("Profile".localized())
            .refreshable {
                await authManager.fetchCurrentUser()
            }
        }
    }
}

#Preview {
    ProfileView()
}
