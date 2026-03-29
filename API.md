# FormFriend API Reference

**Base URL:** `https://api.formfriend.xyz`
**Format:** All request/response bodies are JSON (`Content-Type: application/json`) except the contract upload which is `multipart/form-data`.
**Auth:** Bearer token in the `Authorization` header — `Authorization: Bearer <accessToken>`. Token is a Cognito JWT obtained from `/auth/login`.
**Errors:** All errors return [RFC 9457 Problem Detail](https://www.rfc-editor.org/rfc/rfc9457) JSON:
```json
{ "title": "...", "detail": "...", "status": 400 }
```

---

## Authentication Flow

Registration is **2-step**. Both steps must complete or the user has no DB record and `/users/me` returns 404.

```
Step 1: POST /users          → triggers Cognito to email a 6-digit code
Step 2: POST /users/confirm  → submits the code, creates the DB record
Step 3: POST /auth/login     → returns tokens
```

---

## Endpoints

### `POST /auth/login` — Login
No auth required.

**Request:**
```json
{ "email": "jsmith@university.edu", "password": "..." }
```

**Response `200`:**
```json
{
  "accessToken": "eyJ...",
  "idToken":     "eyJ...",
  "refreshToken": "eyJ..."
}
```
> Store `accessToken` — it is used as the Bearer token for all authenticated requests. `refreshToken` can be used to obtain a new `accessToken` when it expires (Cognito handles this).

**Errors:** `401` invalid credentials.

---

### `POST /users` — Initiate Registration
No auth required.

**Request:**
```json
{
  "name": "Jane Smith",
  "email": "jsmith@university.edu",
  "password": "SecurePass1!",
  "phoneNumber": "+12025551234",
  "nickname": "jane",
  "preferredUsername": "jsmith",
  "personalEmail": "jane@gmail.com"
}
```
> `email` must be a university domain recognized by the system. `phoneNumber` must include country code (e.g. `+1`). `nickname`, `preferredUsername`, and `personalEmail` are optional.

**Response `202`:** Empty body. A 6-digit code is sent to the user's email.

**Errors:** `400` duplicate user or unrecognized school domain.

---

### `POST /users/confirm` — Complete Registration
No auth required.

**Request:**
```json
{ "email": "jsmith@university.edu", "code": "123456" }
```

**Response `201`:** Returns the created user (same shape as `UserResponse` below).

**Errors:** `400` invalid or expired code.

---

### `GET /users/me` — Get Current User
**Auth required.**

**Response `200`:**
```json
{
  "id": 42,
  "name": "Jane Smith",
  "email": "jsmith@university.edu",
  "schoolId": 7,
  "schoolCode": "MIT",
  "schoolName": "Massachusetts Institute of Technology"
}
```

**Errors:** `401` missing/invalid token, `404` token is valid but no DB record exists (registration was not completed — redirect to registration).

---

### `GET /users` — List All Users
**Auth required.**

**Response `200`:** Array of `UserResponse` objects (same shape as above).

---

### `GET /users/{id}` — Get User by ID
**Auth required.**

**Response `200`:** `UserResponse`. **Errors:** `404`.

---

### `PATCH /users/{id}` — Update User
**Auth required.**

**Request** (all fields optional):
```json
{
  "name": "Jane Doe",
  "email": "jdoe@university.edu",
  "personalEmail": "jane@gmail.com",
  "schoolId": 3
}
```

**Response `200`:** Updated `UserResponse`.

---

### `DELETE /users/{id}` — Delete User
**Auth required.**

**Response `204`:** No body.

---

### `POST /contracts/parse` — Upload & Parse PDF
**Auth required.** `Content-Type: multipart/form-data`

**Request:** Form field `file` — must be a PDF (`application/pdf`).

**Response `200`:** Flat array of all Textract blocks for the document. Block hierarchy (pages → lines → words, tables → cells) is encoded in the `relationships` field using Textract's native structure.

```json
[
  {
    "id": "a1b2c3d4-...",
    "blockType": "LINE",
    "text": "This Agreement is entered into",
    "page": 1,
    "confidence": 99.1,
    "boundingBox": { "left": 0.08, "top": 0.05, "width": 0.6, "height": 0.015 },
    "polygon": [
      { "x": 0.08, "y": 0.05 },
      { "x": 0.68, "y": 0.05 },
      { "x": 0.68, "y": 0.065 },
      { "x": 0.08, "y": 0.065 }
    ],
    "relationships": [
      { "type": "CHILD", "ids": ["e5f6...", "g7h8..."] }
    ],
    "entityTypes": [],
    "selectionStatus": null,
    "textType": "PRINTED",
    "rowIndex": null,
    "columnIndex": null,
    "rowSpan": null,
    "columnSpan": null
  },
  ...
]
```

**`blockType` values:** `PAGE`, `LINE`, `WORD`, `TABLE`, `TABLE_TITLE`, `TABLE_FOOTER`, `CELL`, `MERGED_CELL`, `SELECTION_ELEMENT`, `QUERY`, `QUERY_RESULT`, `SIGNATURE`, `KEY_VALUE_SET`

**Bounding box:** All coordinates are normalized `0–1` relative to page dimensions. `boundingBox` and `polygon` may be `null` for `PAGE`-level blocks.

**Navigating structure:**
- A `PAGE` block's `CHILD` relationships list all `LINE` and `TABLE` block IDs on that page.
- A `LINE` block's `CHILD` relationships list its `WORD` block IDs (reading order).
- A `TABLE` block's `CHILD` relationships list its `CELL` block IDs.
- `CELL` blocks include `rowIndex`, `columnIndex`, `rowSpan`, `columnSpan` for table layout reconstruction.
- `SELECTION_ELEMENT` blocks carry `selectionStatus`: `SELECTED` or `NOT_SELECTED`.

**Response `200` shape:**
```json
{
  "uploadId": 12,
  "filename": "lease-agreement.pdf",
  "lines": [ [ { ...WordBlock }, ... ], ... ]
}
```

**Errors:** `400` empty file, `415` not a PDF, `401` unauthenticated.

---

### `GET /contracts` — List Past Uploads
**Auth required.**

**Response `200`:**
```json
[
  { "id": 12, "filename": "lease-agreement.pdf", "createdAt": "2026-03-28T14:22:00Z" },
  { "id": 11, "filename": "nda.pdf",              "createdAt": "2026-03-27T09:10:00Z" }
]
```

Results are ordered newest first.

---

### `GET /contracts/{id}/file` — Get Presigned PDF URL
**Auth required.** Only returns a URL for uploads belonging to the current user.

**Response `200`:**
```json
{ "url": "https://s3.amazonaws.com/bucket/uploads/...?X-Amz-Signature=..." }
```

URL is valid for **15 minutes**. Use it directly in an `<iframe>`, `<embed>`, or `WKWebView`. Requesting a URL for an upload that belongs to another user returns `404`.

---

## Sitemap

```
https://api.formfriend.xyz
│
├── POST   /auth/login                 # get tokens (no auth)
│
├── POST   /users                      # step 1: initiate registration (no auth)
├── POST   /users/confirm              # step 2: verify email code (no auth)
├── GET    /users                      # list all users (auth)
├── GET    /users/me                   # current user from JWT (auth)
├── GET    /users/{id}                 # user by id (auth)
├── PATCH  /users/{id}                 # update user (auth)
└── DELETE /users/{id}                 # delete user (auth)
│
├── POST   /contracts/parse            # upload PDF → { uploadId, filename, lines } (auth, multipart)
├── GET    /contracts                  # list past uploads, newest first (auth)
└── GET    /contracts/{id}/file        # presigned S3 URL for the PDF, 15-min TTL (auth)
```

---

## Swift Implementation Notes

- Store `accessToken` in `Keychain`, not `UserDefaults`.
- On any `401`, clear the stored token and route the user back to login.
- On `GET /users/me` returning `404`, the account is incomplete — route to registration.
- The contract parse endpoint can take several seconds (Textract is async on the backend); show a loading indicator and use a generous timeout (30–60s).
- `multipart/form-data` upload: set the part's `Content-Type` to `application/pdf` explicitly or the server will reject with `415`.