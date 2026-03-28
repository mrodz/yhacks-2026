# Swift Integration Guide

This doc describes how a Swift/iOS app integrates with the backend's auth and user API.
The backend is a Spring Boot service backed by AWS Cognito — but your Swift app **never talks
to Cognito directly**. All auth goes through the backend's own endpoints.

Base URL: `http://localhost:8080` (swap for your production domain when deployed)

---

## Auth overview

| Concept | Detail |
|---|---|
| Auth mechanism | JWT Bearer tokens issued by Cognito via the backend |
| Token to use on API calls | `accessToken` — send as `Authorization: Bearer <token>` |
| Token lifetime | `accessToken` ~1 hour · `refreshToken` ~30 days |
| Token storage | **iOS Keychain** (`kSecClassGenericPassword`) — never `UserDefaults` |
| Sessions | Stateless. No cookies, no server session. |

---

## User lifecycle

```
Register (step 1)  →  Verify email (step 2)  →  Login  →  Authenticated calls  →  Logout
POST /users            POST /users/confirm        POST /auth/login   GET /users/me   (clear Keychain)
```

---

## 1. Register — Step 1: Create account

```
POST /users
Content-Type: application/json
```

Request body:
```json
{
  "name": "Jane Smith",
  "email": "jane@yale.edu",
  "password": "Abc123!@#",
  "phoneNumber": "+12025551234",
  "nickname": "Janie",
  "preferredUsername": "jsmith",
  "personalEmail": "jane@gmail.com"
}
```

| Field | Required | Notes |
|---|---|---|
| `name` | yes | Full name |
| `email` | yes | Must be a supported university domain |
| `password` | yes | Min 8 chars; Cognito policy: upper, lower, number, symbol |
| `phoneNumber` | yes | E.164 format, e.g. `+12025551234` |
| `nickname` | no | Display name |
| `preferredUsername` | no | Handle / username |
| `personalEmail` | no | Recovery email, must be valid email format |

Responses:

| Status | Meaning |
|---|---|
| `202 Accepted` | Account created in Cognito; 6-digit code sent to `email` |
| `400 Bad Request` | Validation error or unsupported school domain |
| `409 Conflict` | Email already registered |

On `202`: move the user to the verification screen. Do **not** show a success screen yet.

---

## 2. Register — Step 2: Verify email

```
POST /users/confirm
Content-Type: application/json
```

Request body:
```json
{
  "email": "jane@yale.edu",
  "code": "123456"
}
```

Responses:

| Status | Meaning |
|---|---|
| `201 Created` | Account fully confirmed; returns `UserResponse` (see below) |
| `400 Bad Request` | Wrong or expired code |

On `201`: account is ready. Navigate to the login screen.

---

## 3. Login

```
POST /auth/login
Content-Type: application/json
```

Request body:
```json
{
  "email": "jane@yale.edu",
  "password": "Abc123!@#"
}
```

Success response `200 OK`:
```json
{
  "accessToken": "eyJraWQiOiJ...",
  "idToken": "eyJraWQiOiJ...",
  "refreshToken": "eyJjdHkiOiJ..."
}
```

| Field | Use |
|---|---|
| `accessToken` | Send as `Authorization: Bearer` on every API call |
| `idToken` | Contains Cognito user claims (email, name, sub). Optional for most cases. |
| `refreshToken` | Store in Keychain; use to get a new `accessToken` after 401 |

Error responses:

| Status | Meaning |
|---|---|
| `401 Unauthorized` | Wrong email or password |

Store `accessToken` and `refreshToken` in Keychain immediately after a successful login.

---

## 4. Get current user profile

```
GET /users/me
Authorization: Bearer <accessToken>
```

Success response `200 OK`:
```json
{
  "id": 1,
  "name": "Jane Smith",
  "email": "jane@yale.edu",
  "schoolId": 3,
  "schoolCode": "YAL",
  "schoolName": "Yale University"
}
```

| Status | Meaning |
|---|---|
| `200 OK` | Authenticated; returns profile |
| `401 Unauthorized` | Missing, expired, or invalid token |

On `401`: clear Keychain tokens and send the user to the login screen.

---

## 5. Logout

JWTs are stateless — there is no server-side session to invalidate. Logout is purely client-side:

1. Delete `accessToken` and `refreshToken` from Keychain.
2. Navigate to the login/home screen.

---

## 6. Error format

All error responses use RFC 7807 `ProblemDetail`:

```json
{
  "type": "about:blank",
  "title": "Authentication failed",
  "status": 401,
  "detail": "Incorrect email or password.",
  "instance": "/auth/login"
}
```

Parse `detail` to show a user-facing message. Fall back to `title` if `detail` is absent.

---

## 7. Swift code sketch

### Codable models

```swift
struct LoginRequest: Encodable {
    let email: String
    let password: String
}

struct LoginResponse: Decodable {
    let accessToken: String
    let idToken: String
    let refreshToken: String
}

struct UserResponse: Decodable {
    let id: Int
    let name: String
    let email: String
    let schoolId: Int
    let schoolCode: String
    let schoolName: String
}

struct APIError: Decodable {
    let title: String
    let detail: String?
    let status: Int
}
```

### Keychain helper (minimal)

```swift
import Security

enum Keychain {
    static func save(_ value: String, forKey key: String) {
        let data = Data(value.utf8)
        let query: [CFString: Any] = [
            kSecClass: kSecClassGenericPassword,
            kSecAttrAccount: key,
            kSecValueData: data
        ]
        SecItemDelete(query as CFDictionary)
        SecItemAdd(query as CFDictionary, nil)
    }

    static func load(forKey key: String) -> String? {
        let query: [CFString: Any] = [
            kSecClass: kSecClassGenericPassword,
            kSecAttrAccount: key,
            kSecReturnData: true,
            kSecMatchLimit: kSecMatchLimitOne
        ]
        var result: AnyObject?
        guard SecItemCopyMatching(query as CFDictionary, &result) == errSecSuccess,
              let data = result as? Data else { return nil }
        return String(data: data, encoding: .utf8)
    }

    static func delete(forKey key: String) {
        let query: [CFString: Any] = [
            kSecClass: kSecClassGenericPassword,
            kSecAttrAccount: key
        ]
        SecItemDelete(query as CFDictionary)
    }
}
```

### URLRequest extension

```swift
extension URLRequest {
    mutating func addBearerToken() {
        if let token = Keychain.load(forKey: "accessToken") {
            setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }
    }
}
```

### Login call

```swift
func login(email: String, password: String) async throws -> LoginResponse {
    let url = URL(string: "http://localhost:8080/auth/login")!
    var request = URLRequest(url: url)
    request.httpMethod = "POST"
    request.setValue("application/json", forHTTPHeaderField: "Content-Type")
    request.httpBody = try JSONEncoder().encode(LoginRequest(email: email, password: password))

    let (data, response) = try await URLSession.shared.data(for: request)
    guard let http = response as? HTTPURLResponse else { throw URLError(.badServerResponse) }

    if http.statusCode == 200 {
        let result = try JSONDecoder().decode(LoginResponse.self, from: data)
        Keychain.save(result.accessToken, forKey: "accessToken")
        Keychain.save(result.refreshToken, forKey: "refreshToken")
        return result
    } else {
        let err = try JSONDecoder().decode(APIError.self, from: data)
        throw NSError(domain: err.title, code: http.statusCode,
                      userInfo: [NSLocalizedDescriptionKey: err.detail ?? err.title])
    }
}
```

### Fetch current user

```swift
func fetchMe() async throws -> UserResponse {
    let url = URL(string: "http://localhost:8080/users/me")!
    var request = URLRequest(url: url)
    request.addBearerToken()

    let (data, response) = try await URLSession.shared.data(for: request)
    guard let http = response as? HTTPURLResponse else { throw URLError(.badServerResponse) }

    if http.statusCode == 401 {
        // Token expired — clear and force re-login
        Keychain.delete(forKey: "accessToken")
        Keychain.delete(forKey: "refreshToken")
        throw NSError(domain: "Unauthorized", code: 401)
    }

    return try JSONDecoder().decode(UserResponse.self, from: data)
}
```

---

## 8. Endpoint summary

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/users` | None | Initiate registration |
| `POST` | `/users/confirm` | None | Confirm email with code |
| `POST` | `/auth/login` | None | Login → returns JWT tokens |
| `GET` | `/users/me` | Bearer | Get logged-in user's profile |
| `GET` | `/users/{id}` | Bearer | Get user by ID |
| `PATCH` | `/users/{id}` | Bearer | Update user |
| `DELETE` | `/users/{id}` | Bearer | Delete user |
