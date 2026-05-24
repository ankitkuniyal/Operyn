# Operyn 🤖💼

**Operyn** is an autonomous AI Executive Assistant designed to manage your daily workspace workflow in the background. It securely connects to your Google Workspace, analyzes incoming items, schedules tasks, drafts context-aware email replies, and manages calendar events automatically.

---

## 🚀 Key Features

*   **Autonomous background worker**: Periodically polls and runs agent workflows to execute actions without manual intervention.
*   **Gmail Integration**: Scans unread mail, categorizes items by priority, and writes pre-saved draft responses ready for your approval.
*   **Google Calendar Management**: Schedules, reschedules, and details meetings or events inferred from your incoming emails.
*   **Sleek Glassmorphic Dashboard**: A premium, dark-themed dashboard featuring modern typography, real-time agent monitoring, run statistics, and custom animations.
*   **Secure OAuth Encryption**: Persists all third-party OAuth access and refresh tokens securely using robust `AES-256-GCM` encryption.
*   **Subscription Management**: Clerk-integrated plans to manage feature entitlements (Free Plan vs. Premium).

---

## 🛠️ Tech Stack

*   **Framework**: Next.js 16 (App Router)
*   **Language**: TypeScript
*   **Database & ORM**: PostgreSQL (Railway) + Drizzle ORM
*   **Authentication**: Clerk Authentication
*   **Integrations**: Google APIs Client (Gmail & Calendar v3)
*   **Styling**: Tailwind CSS v4 + Radix UI + Lucide Icons

---

## 📂 Project Architecture

```mermaid
graph TD
    Client[Next.js Client UI] -->|Auth| Clerk[Clerk Auth]
    Client -->|Server Actions| NextServer[Next.js App Router Server]
    NextServer -->|AES-256-GCM Token Encryption| DB[(PostgreSQL Database)]
    BackgroundWorker[Background Agent Daemon] -->|Decrypts Tokens| NextServer
    NextServer -->|OAuth Client| GoogleAPI[Google Workspace APIs]
    GoogleAPI -->|Read & Write| Gmail[Gmail & Google Calendar]
```

---

## ⚙️ Environment Configuration

Create a `.env.local` file in the root directory and add the following keys:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database Connection (Railway / PostgreSQL)
DATABASE_URL=postgresql://user:password@host:port/database

# Encryption Utility (32-character key for AES-256-GCM)
ENCRYPTION_KEY=your_secure_32_character_encryption_key
```

---

## 🏃 Getting Started

### 1. Install Dependencies
```bash
bun install
```

### 2. Prepare Database Schema
Push the Drizzle schema to your live database instance:
```bash
bunx drizzle-kit push
```

### 3. Run the Development Server
```bash
bun dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to view the application.
