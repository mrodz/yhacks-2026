import SwiftUI


struct LoginView: View {
    @EnvironmentObject var authManager: AuthManager
    @State private var email = ""
    @State private var password = ""
    @State private var showRegistration = false
    
    var body: some View {
        NavigationStack {
            VStack(spacing: 24) {
                Spacer()
                
                Image(systemName: "person.badge.key.fill")
                    .font(.system(size: 60))
                    .foregroundColor(Theme.primaryAction)
                
                VStack(spacing: 8) {
                    Text("Welcome Back".localized())
                        .font(.largeTitle.bold())
                    Text("Log in to FormFriend to continue".localized())
                        .foregroundColor(.secondary)
                }
                
                VStack(spacing: 16) {
                    TextField("Email", text: $email)
                        .keyboardType(.emailAddress)
                        .autocapitalization(.none)
                        .padding()
                        .background(Color(uiColor: .systemGray6))
                        .cornerRadius(12)
                    
                    SecureField("Password", text: $password)
                        .padding()
                        .background(Color(uiColor: .systemGray6))
                        .cornerRadius(12)
                }
                .padding(.top, 16)
                
                if let error = authManager.errorMessage {
                    Text(error)
                        .font(.subheadline)
                        .foregroundColor(.red)
                        .multilineTextAlignment(.center)
                }
                
                Button {
                    Task {
                        await authManager.login(email: email, password: password)
                    }
                } label: {
                    HStack {
                        if authManager.isLoading {
                            ProgressView().tint(.white)
                        } else {
                            Text("Log In".localized())
                        }
                    }
                    .font(.headline)
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(email.isEmpty || password.isEmpty ? Color(uiColor: .systemGray4) : Theme.primaryAction)
                    .cornerRadius(16)
                }
                .disabled(email.isEmpty || password.isEmpty || authManager.isLoading)
                .padding(.top, 8)
                
                Spacer()
                
                Button("Don't have an account? Sign Up".localized()) {
                    showRegistration = true
                }
                .foregroundColor(Theme.primaryAction)
                .padding(.bottom, 20)
            }
            .padding()
            .navigationBarHidden(true)
            .navigationDestination(isPresented: $showRegistration) {
                RegistrationView()
            }
        }
    }
}
