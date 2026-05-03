# Security Architecture: Stateless "Zero-PII" Design

Vote Consciously is built on an elite, privacy-first foundation. As a civic technology platform handling sensitive electoral data, we employ a "Zero-Storage" Personal Identifiable Information (PII) architecture.

## 1. Zero-Storage PII Philosophy
- **In-Memory Processing:** Voter IDs (EPIC) and geolocation data (GPS) are strictly processed in-memory during a session. They are never written to disk, local storage, or a backend database.
- **Immediate Purging:** Once validation (e.g., verifying an EPIC ID against the format or comparing GPS coordinates for an Indelible Badge) is complete, the raw data is instantly purged from memory.
- **Client-Side First:** Computations that involve sensitive data occur client-side whenever mathematically feasible to reduce the attack surface area of network requests.

## 2. EPIC Validation Engine
- **Regex Guard:** All EPIC IDs are validated against a strict `^[A-Z]{3}[0-9]{7}$` pattern before any logic evaluates them.
- **No Mapping Tables Saved:** Mock structures emulate ECI databases but do not save lookup queries.

## 3. Geolocation & Media (Indelible Badge)
- **EXIF Extraction:** Image metadata is extracted directly in the browser. 
- **No Server Uploads:** The actual user image is not uploaded to our servers. Only the derived coordinates are used for verification.
- **Coordinate Fuzzing:** Internal logs and outputs only represent broad constituency matching, not exact latitude and longitude.

## 4. API & Cloud Safety
- **Google Generative AI:** Our integration with `@google/generative-ai` uses strict Safety Settings to filter out Hate Speech, Harassment, Sexually Explicit content, and Dangerous content, ensuring objectivity and safety in civic discourse.
- **Cloud Run Deployment:** Designed for containerized execution with ephemeral instances, reinforcing the stateless nature of the application.

## 5. Accessibility and Inclusivity as Security
- Ensuring the app is robust against misuse while remaining accessible (WCAG AAA) is a core security principle, guaranteeing equitable access to civic intelligence without compromising privacy.
