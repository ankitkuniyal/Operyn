<p align="center">
  <img src="./public/logo.png" alt="Operyn Logo" width="96" height="96" />
</p>

# Operyn

> [!NOTE]
> For a detailed architectural breakdown of non-functional requirements, performance engineering, cost optimizations, and security hardening, check out the [System Design & Engineering Decisions Guide](./SYSTEM_DESIGN.md).

> [!WARNING]
> **Google OAuth Integration Notice**: The Google Workspace OAuth integration is currently running in **Developer Testing Mode** in compliance with Google API Verification policies. To test the live integration, you can either run the application locally by supplying your own client credentials (see Local Setup), or contact me directly to have your Google account whitelisted on the Google Cloud Console.

**Operyn** is an autonomous AI Executive Assistant designed to manage daily workspace workflows in the background. It securely connects to your Google Workspace, analyzes incoming items using generative models, schedules tasks, drafts context-aware email replies, and manages calendar events automatically.

---

## 🚀 Key Features

*   **Autonomous Background Worker**: Periodically polls and executes agent tasks securely without manual intervention.
*   **Google OAuth Integration**: Connects dynamically to Gmail and Google Calendar to scan mailboxes, check conflicts, and insert meetings.
*   **Interactive Task Manager**: A dedicated workspace tab showing AI-extracted tasks, allowing filtering (Pending, Completed, All) and sorting (Due Date, Priority, Date Created) with **Optimistic UI Updates** that run with zero perceived latency.
*   **Live Calendar Sync Agenda**: A real-time timeline displaying upcoming events queried directly from the user's Google Calendar with customized tags highlighting slots scheduled by the AI.
*   **Robust Security & AES-256-GCM**: Persists all third-party OAuth access/refresh tokens in PostgreSQL using enterprise-grade AES-256-GCM encryption.
*   **Prompt Injection Protection**: Employs sandboxed `<email_body>` delimiters and strict system-level model guardrails to prevent indirect prompt injections.
*   **Clerk Billing & Webhooks Synchronization**: Real-time webhook integration to sync Clerk subscriptions (`active`, `past_due`, `canceled`) to the Postgres database.
*   **GitHub Actions Cron Automation**: Runs GitHub Actions workflow schedules to securely trigger background agent runs for premium subscribers every 15 minutes.
*   **Rate-Limiting Protection**: Restricts manual agent runs to 3 executions per 10 minutes to protect API quotas.
*   **Performance Cache Memoization**: Integrates React's `cache` query memoization and concurrent `Promise.all` fetch routines to render views instantly.

---

## 🛠️ Tech Stack

*   **Framework**: Next.js 15 (App Router)
*   **Language**: TypeScript
*   **Database & ORM**: PostgreSQL (Railway) + Drizzle ORM
*   **Authentication**: Clerk Authentication
*   **Integrations**: Google APIs Client (Gmail & Calendar v3)
*   **AI Engine**: Google Gen AI API (via Vercel AI SDK)
*   **Styling**: Tailwind CSS + Radix UI + Lucide Icons

---

## 📂 Project Architecture & Data Flows

### 1. System Architecture Diagram
This diagram illustrates the physical and logical layout of the Operyn platform, mapping client interactions, middleware limits, auth checks, persistent storage lookup, token decryption, background schedulers, and external API requests:

```mermaid
graph TB
    subgraph Client_Side ["Client Side (Next.js SPA / Tailwind)"]
        UI["Glassmorphic Dashboard UI"]
        Forms["Integrations & Settings"]
        ClerkUI["Clerk Auth / Pricing Components"]
    end

    subgraph Authentication ["Identity & Auth Services"]
        ClerkSrv["Clerk Auth Service"]
        GoogleOAuth["Google OAuth 2.0 Server"]
    end

    subgraph Server_Side ["Server Side (Next.js Server API & Actions)"]
        Router["Next.js App Router (Middleware / Proxy)"]
        Actions["Server Actions (runAgentManually, disconnect)"]
        Webhooks["Clerk Webhook Handler (/api/webhooks/clerk)"]
        CronRoute["Cron Handler Route (/api/agents/run)"]
        RateLimit["In-Memory Rate Limiter"]
    end

    subgraph Data_Layer ["Data Persistence & Cryptography"]
        Drizzle["Drizzle ORM Engine"]
        PostgresDB[("PostgreSQL Database")]
        Crypto["AES-256-GCM Crypter (ENCRYPTION_KEY)"]
    end

    subgraph Integrations ["Third-Party External APIs"]
        GeminiAI["Gemini Generative AI API"]
        GmailAPI["Google Gmail API (v3)"]
        CalendarAPI["Google Calendar API (v3)"]
    end

    subgraph Automation ["Automated Triggers"]
        GHCron["GitHub Actions Cron"]
    end

    %% Client and Auth Flows
    UI -->|Session & Auth| ClerkUI
    ClerkUI <-->|M2M Auth| ClerkSrv
    Forms -->|OAuth Consent| GoogleOAuth

    %% Client and Server Flows
    UI -->|Invokes Server Actions| Actions
    Forms -->|Requests| Router
    Router -->|Rate Limit Validation| RateLimit

    %% Webhook & Cron Flow
    ClerkSrv -->|Subscription Webhook Event| Webhooks
    GHCron -->|HTTPS Trigger with CRON_SECRET| CronRoute

    %% Server Logic and DB Layer
    Actions -->|Queries / Writes| Drizzle
    Webhooks -->|Updates User Subscription| Drizzle
    CronRoute -->|Reads Enabled Premium Users| Drizzle
    Drizzle <--> PostgresDB
    
    %% Encryption Flow
    Drizzle <-->|Access/Refresh Tokens| Crypto

    %% External Processing
    CronRoute & Actions -->|Process Gmail inbox| GmailAPI
    CronRoute & Actions -->|Schedule Events| CalendarAPI
    CronRoute & Actions -->|Securely Prompt| GeminiAI

    %% Style definitions
    classDef client fill:#e0f2fe,stroke:#0284c7,stroke-width:2px,rx:8px,ry:8px,color:#0369a1;
    classDef auth fill:#faf5ff,stroke:#d8b4fe,stroke-width:2px,rx:8px,ry:8px,color:#6b21a8;
    classDef server fill:#f5f3ff,stroke:#c084fc,stroke-width:2px,rx:8px,ry:8px,color:#5b21b6;
    classDef database fill:#ecfdf5,stroke:#34d399,stroke-width:2px,rx:8px,ry:8px,color:#065f46;
    classDef external fill:#fff7ed,stroke:#fb923c,stroke-width:2px,rx:8px,ry:8px,color:#9a3412;
    classDef automation fill:#ecfeff,stroke:#22d3ee,stroke-width:2px,rx:8px,ry:8px,color:#075985;
    
    class UI,Forms,ClerkUI client;
    class ClerkSrv,GoogleOAuth auth;
    class Router,Actions,Webhooks,CronRoute,RateLimit server;
    class Drizzle,PostgresDB,Crypto database;
    class GeminiAI,GmailAPI,CalendarAPI external;
    class GHCron automation;
```

### 2. Data Flow Diagram (DFD Level 1)
This Data Flow Diagram tracks the movement of information across the boundaries between external entities, background processes, security modules, database layers, and final destinations:

```mermaid
graph LR
    subgraph Entities ["External Entities"]
        User["👤 End User"]
        GmailService["📧 Gmail API"]
        CalendarService["📅 Calendar API"]
    end

    subgraph Process_Layer ["Data Flow Processes"]
        P1["1.0 Authenticate & Encrypt Credentials"]
        P2["2.0 Rate Limit Manual Execution"]
        P3["3.0 Retrieve & Decrypt OAuth Tokens"]
        P4["4.0 Scan Emails & Sanitize Input"]
        P5["5.0 Process via Gemini AI (Sandbox)"]
        P6["6.0 Execute Calendar Sync & Draft Emails"]
    end

    subgraph Data_Stores ["Data Stores"]
        DS1[("Postgres: Users Table")]
        DS2[("Postgres: Integrations Table")]
        DS3[("Postgres: Agent Runs Table")]
    end

    %% Data Flow 1: Auth & Store
    User -->|Clerk & Google credentials| P1
    P1 -->|Encrypted Tokens| DS2
    P1 -->|User profile info| DS1

    %% Data Flow 2: Trigger & Rate Limit
    User -->|Manual run trigger| P2
    P2 -->|Check threshold| DS3
    
    %% Data Flow 3: Get credentials & fetch
    P2 & P3 -->|Decrypt tokens| DS2
    P3 -->|Fetch unread emails| GmailService
    GmailService -->|Raw email body| P4

    %% Data Flow 4: Sandbox & AI
    P4 -->|Delimited sandboxed text| P5
    P5 -->|Zod validated commands| P6

    %% Data Flow 5: Execute outputs
    P6 -->|Write action logs| DS3
    P6 -->|Create replies / drafts| GmailService
    P6 -->|Insert calendar entries| CalendarService

    %% Style definitions
    classDef entity fill:#fff7ed,stroke:#fb923c,stroke-width:2px,rx:8px,ry:8px,color:#9a3412;
    classDef process fill:#e0f2fe,stroke:#0284c7,stroke-width:2px,rx:8px,ry:8px,color:#0369a1;
    classDef store fill:#ecfdf5,stroke:#34d399,stroke-width:2px,rx:8px,ry:8px,color:#065f46;
    
    class User,GmailService,CalendarService entity;
    class P1,P2,P3,P4,P5,P6 process;
    class DS1,DS2,DS3 store;
```

### 3. Data Flow Diagram (DFD Level 2 - AI Processing Pipeline)
This Level 2 DFD decomposes **Process 5.0 (Process via Gemini AI)** to illustrate the detailed data routing, sandboxing validation, prompt construction, security checks, and Zod command parser schema execution:

```mermaid
graph TD
    %% Inputs
    EmailContent["📧 Sanitized Email Input"] --> P51["5.1 Build System Prompt"]
    SecurityRules["🛡️ Delimiter & Sandbox Directives"] --> P51
    
    %% Process 5.1
    P51 -->|Full Promoted Payload| P52["5.2 Invoke Gemini LLM"]
    
    %% Process 5.2
    P52 -->|Raw JSON Output| P53["5.3 Validate via Zod Schema"]
    ZodSchema["📝 Zod Validation Spec"] --> P53
    
    %% Process 5.3
    P53 -->|Validation Failure or Injection Flagged| P54["5.4 Flag Security Alert"]
    P53 -->|Validation Success| P55["5.5 Route Commands"]
    
    %% Output of 5.4
    P54 -->|Write Security Log| DS3[("Postgres: Agent Runs Table")]
    
    %% Outputs of 5.5
    P55 -->|Draft Content| P61["6.1 Create Gmail Draft"]
    P55 -->|Meeting Schedule Details| P62["6.2 Book Google Calendar Event"]
    P55 -->|Task Details| P63["6.3 Create Workspace Task"]
    
    %% Destination writes
    P61 -->|Call Draft API| GmailAPI["Gmail API"]
    P62 -->|Call Calendar API| CalendarAPI["Calendar API"]
    P63 -->|Write Task Record| DS4[("Postgres: Tasks Table")]

    %% Style definitions
    classDef input fill:#fff7ed,stroke:#fb923c,stroke-width:2px,rx:8px,ry:8px,color:#9a3412;
    classDef process fill:#e0f2fe,stroke:#0284c7,stroke-width:2px,rx:8px,ry:8px,color:#0369a1;
    classDef external fill:#f5f3ff,stroke:#c084fc,stroke-width:2px,rx:8px,ry:8px,color:#5b21b6;
    classDef store fill:#ecfdf5,stroke:#34d399,stroke-width:2px,rx:8px,ry:8px,color:#065f46;
    
    class EmailContent,SecurityRules,ZodSchema input;
    class P51,P52,P53,P54,P55,P61,P62,P63 process;
    class GmailAPI,CalendarAPI external;
    class DS3,DS4 store;
```

---

## ⚙️ Environment Configuration

Create a `.env.local` file in the root directory and configure the following variables:

```env
# Clerk Authentication Configuration
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/

# Clerk Webhook Signing Secret (from Clerk Dashboard -> Webhooks)
CLERK_WEBHOOK_SIGNING_SECRET=whsec_...

# Google OAuth Credentials
GOOGLE_CLIENT_ID=507684642745-gi3814koemlbi9k80l7j8oonn4oq13dq.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-...
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database Connection (Railway / PostgreSQL)
DATABASE_URL=postgresql://postgres:...

# Cryptographic Keys (Must be 64-hex characters / 32-bytes)
ENCRYPTION_KEY=e1d4170f....

# Google Gemini API Key
GOOGLE_GENERATIVE_AI_API_KEY=AIzaSy...

# Machine-to-Machine Background Cron Token
CRON_SECRET=b6d3a66.....
```

---

## 🏃 Getting Started

### 1. Install Dependencies
```bash
bun install
```

### 2. Prepare Database Schema
Push the Drizzle schemas to your live Postgres database instance:
```bash
bunx drizzle-kit push
```

### 3. Run the Development Server
```bash
bun dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to view the application.
