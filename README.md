# FormPilot

> **Your AI co-pilot for every document you'll ever sign.**

[![Java](https://img.shields.io/badge/Java-25-orange?logo=openjdk)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.0-green?logo=springboot)](https://spring.io/projects/spring-boot)
[![SwiftUI](https://img.shields.io/badge/iOS-SwiftUI-blue?logo=swift)](https://developer.apple.com/xcode/swiftui/)
[![AWS](https://img.shields.io/badge/AWS-Textract%20%7C%20S3%20%7C%20Cognito-yellow?logo=amazonaws)](https://aws.amazon.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-412991?logo=openai)](https://openai.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-blue?logo=postgresql)](https://www.postgresql.org/)

---

## The Problem

When you move to a new country, documents don't wait for you to catch up. Lease agreements, employment contracts, insurance forms, government paperwork — they arrive in dense legal English, with deadlines, and consequences for getting them wrong.

Hiring a translator is expensive. Asking a neighbor to help feels vulnerable. Most people sign anyway, and hope.

**FormPilot closes that gap — turning any document into a guided, step-by-step experience in the language you actually speak.**

---

## What It Does

Upload any PDF. FormPilot reads it, understands it, and walks you through every action you need to take — in plain language, in your language.

```
Upload PDF  →  OCR Extraction  →  AI Analysis  →  Guided Step-by-Step UI
```

- **Scans** your document with AWS Textract to extract every word and its position on the page
- **Analyzes** the document with GPT-4o to classify it, identify risk areas, and generate a step-by-step action plan
- **Highlights** the exact section of the page each step refers to using bounding-box coordinates
- **Guides** you through signatures, checkboxes, fields, warnings, and reviews — one step at a time, in your language
- **Exports** a completed PDF when you're done

---

## Demo

| Onboarding | Document Upload | AI Guided Workflow | Step-by-Step Highlight |
|---|---|---|---|
| Language selection | Scan or upload from library | Plain-language action plan | Real-time page highlighting |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        iOS App (SwiftUI)                     │
│  Camera Scan → Upload → Guided Workflow → PDF Export         │
└────────────────────────────┬────────────────────────────────┘
                             │  HTTPS / JWT
┌────────────────────────────▼────────────────────────────────┐
│              REST API  (Spring Boot 4 / Java 25)             │
│  AuthController  ·  UserController  ·  ContractController    │
└──────┬────────────────────┬──────────────────────┬──────────┘
       │                    │                      │
┌──────▼──────┐   ┌─────────▼──────────┐  ┌───────▼────────┐
│  AWS Cognito │   │   AWS Textract     │  │    AWS S3      │
│  (Auth/JWT) │   │ (OCR Text + Coords)│  │ (PDF Storage)  │
└─────────────┘   └─────────┬──────────┘  └────────────────┘
                            │ Structured blocks
                   ┌────────▼──────────┐
                   │  OpenAI GPT-4o    │
                   │  Document Analysis│
                   │  Step Generation  │
                   └─────────┬─────────┘
                            │ JSON guidance
                   ┌────────▼──────────┐
                   │    PostgreSQL      │
                   │  (JSONB Analysis) │
                   └───────────────────┘
```

---

## Key Features

### Intelligent Document Processing
- **Multi-format OCR** via AWS Textract — handles handwriting, tables, and complex layouts
- **Sentence-level chunking** before LLM analysis for token efficiency while preserving element IDs
- **Prompt versioning system** (V0–V3) allowing iterative AI improvements without breaking the API

### AI-Powered Guidance
- Classifies document type (lease, employment contract, insurance form, government paperwork, etc.)
- Generates preparation checklist — what you need *before* you start
- Produces typed steps: `field`, `signature`, `checkbox`, `warning`, `note`, `review`, `info`
- Assigns confidence scores and time estimates per step
- Each step is **anchored to OCR block IDs** so the app can highlight the exact location

### Native iOS Experience
- SwiftUI MVVM architecture with 28+ screens
- Secure JWT storage in iOS Keychain
- Camera capture + photo library import
- Coordinate-based bounding-box highlighting on live PDF
- In-app PDF export of completed documents

### Multilingual by Design
- Language selected during onboarding — built for people navigating life in a language that isn't their first
- GPT system prompts dynamically inject the user's language preference
- All guidance, warnings, and instructions delivered in the user's chosen language
- Full UI localization via `LanguageManager`

### Secure by Default
- AWS Cognito OAuth 2.0 with 2-step email verification
- 15-minute presigned S3 URLs — no permanent file exposure
- Stateless JWT auth — no server-side sessions

---

## Tech Stack

| Layer | Technology |
|---|---|
| iOS Frontend | Swift 6, SwiftUI, URLSession |
| Backend | Java 25, Spring Boot 4.0, Spring Security |
| Database | PostgreSQL + Flyway migrations |
| Authentication | AWS Cognito (OAuth 2.0 / JWT) |
| Document OCR | AWS Textract |
| File Storage | AWS S3 (presigned URLs) |
| AI Analysis | OpenAI GPT-4o-mini |
| Infrastructure | AWS EC2 + RDS |

---

## Getting Started

### Prerequisites

- Java 25+, Gradle
- PostgreSQL
- AWS account with Cognito, Textract, and S3 configured
- OpenAI API key

### Backend

```bash
cd backend

# Set environment variables
export AWS_REGION=us-east-1
export AWS_COGNITO_USER_POOL_ID=...
export AWS_COGNITO_CLIENT_ID=...
export AWS_COGNITO_CLIENT_SECRET=...
export AWS_S3_BUCKET=...
export OPENAI_API_KEY=...
export DB_URL=jdbc:postgresql://localhost:5432/formpilot
export DB_USERNAME=...
export DB_PASSWORD=...

./gradlew bootRun
```

The API will be available at `http://localhost:8080`.

### iOS App

Open `frontend/FormPilot.xcodeproj` in Xcode, set the API base URL in `Network/`, and run on a simulator or device.

---

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/login` | Authenticate and receive JWT |
| `POST` | `/users` | Register (step 1 — email verification) |
| `POST` | `/users/confirm` | Register (step 2 — verify code) |
| `GET` | `/users/me` | Get current user profile |
| `POST` | `/contracts/parse` | Upload PDF and trigger analysis |
| `GET` | `/contracts` | List upload history |
| `GET` | `/contracts/{id}/file` | Get presigned S3 URL |
| `GET` | `/contracts/{id}/analysis` | Get AI guidance result |

Full reference: [API.md](API.md)

---

## Inspiration

The idea came from a real moment. A friend — a first-generation immigrant student — handed us a lease renewal and said: *"Can you check if I'm signing something bad?"* It was 14 pages of dense legal English. She'd already lived in the apartment for two years and had no idea what half of it said.

That's not a unique story. Every year, millions of people sign documents they don't understand — not because they're careless, but because legal language is deliberately opaque, and asking for help feels like admitting weakness. International students, new immigrants, first-time renters, and people navigating bureaucracy in a second language face this every day. The consequences range from unexpected fees to signing away rights they didn't know they had.

We wanted to build something that didn't just translate words — but actually *guided* people through the document the way a trusted friend with a law degree would.

---

## What It Does

FormPilot turns any PDF into a guided, step-by-step experience in the language you actually speak.

You upload or scan a document. FormPilot uses AWS Textract to extract every word and its precise coordinates on the page. That structured text is sent to GPT-4o, which classifies the document, identifies risk areas, and generates a typed action plan: which fields to fill, which boxes to check, what to watch out for, and what to prepare before you even start. Every step is anchored to a specific location on the document page — so the app highlights exactly what you're looking at in real time.

The result is less "here's a wall of summary text" and more "tap here, sign there, and here's why this clause matters."

---

## How We Built It

The pipeline has three stages running across a production-grade stack:

**1. Extraction** — PDFs are uploaded to AWS S3 and processed synchronously by AWS Textract, which returns structured word blocks with bounding-box coordinates. We group these into sentence-level chunks while preserving their block IDs — giving the LLM readable context without losing the spatial anchoring needed by the frontend.

**2. Analysis** — The chunked text is sent to OpenAI GPT-4o-mini with a versioned system prompt (we iterated through V0–V3 over the hackathon). The model returns a fully structured JSON response: document type, preparation requirements, and an ordered list of typed steps (`field`, `signature`, `checkbox`, `warning`, `note`, `review`, `info`). Each step references the OCR block IDs it relates to, along with a confidence score and time estimate.

**3. Guidance** — The iOS app (SwiftUI, MVVM) receives the analysis and renders an interactive step-by-step workflow. Steps are linked to bounding-box coordinates, so the PDF view highlights the exact region on the page as the user progresses. Auth is handled by AWS Cognito with 2-step email verification, tokens are stored in the iOS Keychain, and all guidance is delivered in the user's chosen language — set at onboarding and injected into every GPT prompt.

Backend: Java 25 + Spring Boot 4, PostgreSQL with Flyway migrations, JSONB columns for analysis storage.

---

## Challenges We Ran Into

**Coordinate accuracy across document types.** AWS Textract returns bounding boxes normalized to the page dimensions, but PDFs rendered in SwiftUI use a different coordinate system. Getting highlights to land precisely — especially on multi-column layouts and forms — required careful coordinate transformation and edge-case handling.

**Prompt engineering at scale.** Early versions of the analysis prompt returned inconsistent JSON structures, hallucinated block IDs, or collapsed multiple actions into a single step. We ended up building a versioning system (`PromptIteration` enum, V0–V3) so we could iterate on the prompt without breaking the API contract. V3 is meaningfully better than V0.

**Sentence-level chunking without losing context.** Sending raw Textract output to GPT produced fragmented, word-by-word output. Sending the full document hit token limits and degraded quality. We built a chunking layer that groups Textract words into sentences while preserving their block IDs — the model gets readable input, the frontend gets linkable coordinates.

**Spring Boot 4 + Java 25 ecosystem gaps.** Several libraries hadn't caught up to Java 25 virtual threads and the Spring Boot 4 programming model. We worked around a few dependency conflicts that wouldn't exist on older stacks — but we weren't going to downgrade at a hackathon.

---

## Accomplishments That We're Proud Of

- **The coordinate-anchored highlight works.** Watching the app highlight the exact clause a step refers to — in real time, on the actual document — is the moment it clicks for anyone who sees it. That required Textract, a custom chunker, a versioned prompt, a coordinate transformer, and SwiftUI all working together.
- **Multilingual end-to-end.** Language selection at onboarding flows all the way into GPT's system prompt. The guidance a Spanish speaker receives is generated in Spanish, not translated after the fact.
- **Prompt versioning as a first-class concept.** Building V0–V3 as an enum in the backend means we can A/B test prompts, roll back, and ship improvements without touching the API surface.
- **We shipped a real iOS app.** 28+ SwiftUI screens, Keychain auth, camera scanning, PDF export — not a mock, not a web wrapper.

---

## What We Learned

- OCR and LLMs are individually impressive. The interesting work is in the **join layer** — how you structure extracted text so the model can reason about it while the frontend can still act on the coordinates.
- **Prompt versioning matters from day one.** We almost didn't build the versioning system. By V2 we were grateful we had it.
- Legal documents are structurally diverse in ways that stress every assumption you make about layout, field ordering, and language. Robustness here is an ongoing project.
- Spatial UI (highlighting a document in real time) is a dramatically higher bar of polish than a list-based UI, but it's also the feature that makes the product feel magical.

---

## What's Next for FormFriend.xyz

- **Live form filling** — not just guidance, but actually populating fields in the PDF as you work through each step
- **Document memory** — recognize when you've signed similar documents before and pre-fill recurring fields (name, address, ID numbers)
- **Red flag scoring** — a risk dashboard that surfaces unusual or unfavorable clauses before you start
- **Web app** — the iOS app is the flagship, but the pipeline works for any platform; a web version is already in progress
- **Expanded language support** — deeper localization beyond UI strings, including right-to-left layout support
- **Enterprise and nonprofit partnerships** — immigration clinics, university international student offices, housing advocacy organizations

---

## Why FormPilot Wins

- **Real problem, underserved audience** — immigrants and non-English speakers face this every day, with no good options
- **End-to-end pipeline** built in one hackathon: OCR → AI → guided mobile UX
- **Coordinate-anchored highlights** turn abstract AI output into a spatial, visual experience
- **Production-grade stack** — Spring Boot 4, Java 25, AWS, native SwiftUI — not a prototype
- **Multilingual from day one** — built for people whose first language isn't the one on the page

---

## Team

Built at YHacks 2026.

---

*FormPilot — because you shouldn't need to be a lawyer, or a native speaker, to understand what you're signing.*
