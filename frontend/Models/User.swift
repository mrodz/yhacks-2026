import Foundation

struct UserResponse: Codable {
    let id: Int
    let name: String
    let email: String
    let phoneNumber: String?
    let language: String?
    let schoolId: Int?
    let schoolCode: String?
    let schoolName: String?
}

struct AuthTokens: Codable {
    let accessToken: String
    let idToken: String?
    let refreshToken: String?
}
