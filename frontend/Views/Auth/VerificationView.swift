import SwiftUI

struct VerificationView: View {
    @EnvironmentObject var authManager: AuthManager
    let email: String
    let password: String // Passed to directly log them in afterward
    let language: String // Deferred from registration — applied only after login
    
    @AppStorage("preferredLanguage") var storedLanguage: String = ""
    
    @State private var code = ""
    
    var body: some View {
        VStack(spacing: 32) {
            VStack(alignment: .leading, spacing: 8) {
                Text("Verify Email".localized())
                    .font(.largeTitle.bold())
                Text("We sent a 6-digit verification code to \(email).")
                    .foregroundColor(.secondary)
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(.top, 20)
            
            TextField("6-Digit Code", text: $code)
                .keyboardType(.numberPad)
                .font(.title)
                .multilineTextAlignment(.center)
                .padding()
                .background(Color(uiColor: .systemGray6))
                .cornerRadius(12)
            
            if let error = authManager.errorMessage {
                Text(error)
                    .font(.caption)
                    .foregroundColor(.red)
            }
            
            Button {
                Task {
                    let success = await authManager.confirm(email: email, code: code, language: language)
                    if success {
                        // Immediately login after verifying successfully
                        let loggedIn = await authManager.login(email: email, password: password)
                        if loggedIn {
                            // Safe to apply language now — auth state will
                            // switch the UI to TabView anyway, so the .id()
                            // reset is harmless at this point.
                            storedLanguage = language
                        }
                    }
                }
            } label: {
                HStack {
                    if authManager.isLoading {
                        ProgressView().tint(.white)
                    } else {
                        Text("Confirm & Login".localized())
                    }
                }
                .font(.headline)
                .foregroundColor(.white)
                .frame(maxWidth: .infinity)
                .padding()
                .background(code.count < 6 ? Color(uiColor: .systemGray4) : Theme.primaryAction)
                .cornerRadius(16)
            }
            .disabled(code.count < 6 || authManager.isLoading)
            
            Spacer()
        }
        .padding()
        .navigationBarTitleDisplayMode(.inline)
    }
}

