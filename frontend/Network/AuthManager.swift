import SwiftUI
import Combine

@MainActor
class AuthManager: ObservableObject {
    @Published var accessToken: String = "" {
        didSet {
            UserDefaults.standard.set(accessToken, forKey: "accessToken")
        }
    }
    @Published var isAuthenticated: Bool = false
    @Published var currentUser: UserResponse?
    @Published var isLoading: Bool = false
    @Published var errorMessage: String? = nil
    
    let baseURL = "https://api.formfriend.xyz"
    
    init() {
        self.accessToken = UserDefaults.standard.string(forKey: "accessToken") ?? ""
        if !self.accessToken.isEmpty {
            self.isAuthenticated = true
            Task { await fetchCurrentUser() }
        }
    }
    
    func login(email: String, password: String) async -> Bool {
        isLoading = true
        errorMessage = nil
        defer { isLoading = false }
        
        guard let url = URL(string: "\(baseURL)/auth/login") else { return false }
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        let body = ["email": email, "password": password]
        request.httpBody = try? JSONEncoder().encode(body)
        
        do {
            let (data, response) = try await URLSession.shared.data(for: request)
            guard let httpResponse = response as? HTTPURLResponse else { return false }
            
            if httpResponse.statusCode == 200 {
                let tokens = try JSONDecoder().decode(AuthTokens.self, from: data)
                self.accessToken = tokens.accessToken
                self.isAuthenticated = true
                await fetchCurrentUser()
                return true
            } else {
                errorMessage = "Invalid credentials. Please try again."
                return false
            }
        } catch {
            errorMessage = error.localizedDescription
            return false
        }
    }
    
    func register(name: String, email: String, password: String, phoneNumber: String, language: String) async -> Bool {
        isLoading = true
        errorMessage = nil
        defer { isLoading = false }
        
        guard let url = URL(string: "\(baseURL)/users") else { return false }
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        let body = [
            "name": name,
            "email": email,
            "password": password,
            "phoneNumber": phoneNumber,
            "language": language
        ]
        request.httpBody = try? JSONEncoder().encode(body)
        
        do {
            let (_, response) = try await URLSession.shared.data(for: request)
            guard let httpResponse = response as? HTTPURLResponse else { return false }
            
            if httpResponse.statusCode == 202 {
                return true
            } else {
                errorMessage = "Registration failed. Ensure you use a valid university email."
                return false
            }
        } catch {
            errorMessage = error.localizedDescription
            return false
        }
    }
    
    func confirm(email: String, code: String, language: String) async -> Bool {
        isLoading = true
        errorMessage = nil
        defer { isLoading = false }
        
        guard let url = URL(string: "\(baseURL)/users/confirm") else { return false }
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        let body = ["email": email, "code": code, "language": language]
        request.httpBody = try? JSONEncoder().encode(body)
        
        do {
            let (_, response) = try await URLSession.shared.data(for: request)
            guard let httpResponse = response as? HTTPURLResponse else { return false }
            
            if httpResponse.statusCode == 201 {
                return true
            } else {
                errorMessage = "Invalid or expired code."
                return false
            }
        } catch {
            errorMessage = error.localizedDescription
            return false
        }
    }
    
    func fetchCurrentUser() async {
        guard !accessToken.isEmpty else { return }
        
        guard let url = URL(string: "\(baseURL)/users/me") else { return }
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        
        do {
            let (data, response) = try await URLSession.shared.data(for: request)
            guard let httpResponse = response as? HTTPURLResponse else { return }
            
            if httpResponse.statusCode == 200 {
                self.currentUser = try JSONDecoder().decode(UserResponse.self, from: data)
                
                // Sync API language to local storage
                if let lang = self.currentUser?.language, !lang.isEmpty {
                    UserDefaults.standard.set(lang, forKey: "preferredLanguage")
                }
            } else if httpResponse.statusCode == 401 || httpResponse.statusCode == 404 {
                logout()
            }
        } catch {
            print("Fetch user error: \(error)")
        }
    }
    
    func logout() {
        self.accessToken = ""
        self.isAuthenticated = false
        self.currentUser = nil
    }
}
