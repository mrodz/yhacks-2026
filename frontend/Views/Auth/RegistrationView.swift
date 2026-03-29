import SwiftUI


struct RegistrationView: View {
    @EnvironmentObject var authManager: AuthManager
    @Environment(\.dismiss) var dismiss
    
    @State private var name = ""
    @State private var email = ""
    @State private var phone = ""
    @State private var password = ""
    @State private var selectedLanguage = "English"
    
    let languages = ["English", "Spanish", "French", "Mandarin", "Arabic"]
    
    @State private var showVerification = false
    
    var body: some View {
        VStack(spacing: 24) {
            VStack(alignment: .leading, spacing: 8) {
                Text("Create Account".localized())
                    .font(.largeTitle.bold())
                Text("Please use your secure university email.".localized())
                    .foregroundColor(.secondary)
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(.top, 20)
            
            VStack(spacing: 16) {
                TextField("Full Name", text: $name)
                    .padding()
                    .background(Color(uiColor: .systemGray6))
                    .cornerRadius(12)
                
                TextField("Email", text: $email)
                    .keyboardType(.emailAddress)
                    .autocapitalization(.none)
                    .padding()
                    .background(Color(uiColor: .systemGray6))
                    .cornerRadius(12)
                
                TextField("Phone Number (+1...)", text: $phone)
                    .keyboardType(.phonePad)
                    .padding()
                    .background(Color(uiColor: .systemGray6))
                    .cornerRadius(12)
                
                SecureField("Password", text: $password)
                    .padding()
                    .background(Color(uiColor: .systemGray6))
                    .cornerRadius(12)
                
                // Language Picker
                Menu {
                    ForEach(languages, id: \.self) { lang in
                        Button(action: { selectedLanguage = lang }) {
                            HStack {
                                Text(lang)
                                if selectedLanguage == lang {
                                    Image(systemName: "checkmark")
                                }
                            }
                        }
                    }
                } label: {
                    HStack {
                        Label("Language", systemImage: "globe")
                            .foregroundColor(.primary)
                        Spacer()
                        Text(selectedLanguage)
                            .foregroundColor(.secondary)
                        Image(systemName: "chevron.up.chevron.down")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                    .padding()
                    .background(Color(uiColor: .systemGray6))
                    .cornerRadius(12)
                }
            }
            
            if let error = authManager.errorMessage {
                Text(error)
                    .font(.caption)
                    .foregroundColor(.red)
            }
            
            Button {
                Task {
                    let success = await authManager.register(name: name, email: email, password: password, phoneNumber: phone, language: selectedLanguage)
                    if success {
                        showVerification = true
                    }
                }
            } label: {
                HStack {
                    if authManager.isLoading {
                        ProgressView().tint(.white)
                    } else {
                        Text("Sign Up".localized())
                    }
                }
                .font(.headline)
                .foregroundColor(.white)
                .frame(maxWidth: .infinity)
                .padding()
                .background(Theme.primaryAction)
                .cornerRadius(16)
            }
            .disabled(authManager.isLoading || email.isEmpty || password.isEmpty)
            .padding(.top, 8)
            
            Spacer()
        }
        .padding()
        .navigationBarTitleDisplayMode(.inline)
        .navigationDestination(isPresented: $showVerification) {
            VerificationView(email: email, password: password, language: selectedLanguage)
        }
    }
}
