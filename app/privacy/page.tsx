import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, ArrowLeft, Mail, Calendar, Key, AlertTriangle } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | Operyn",
  description: "Read the Privacy Policy of Operyn to understand how we securely manage your Gmail and Google Calendar data.",
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen text-foreground relative overflow-x-hidden bg-background">
      {/* Glow Effects */}
      <div className="absolute top-[-10%] left-[10%] h-[500px] w-[500px] bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[10%] right-[10%] h-[500px] w-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md border-b border-white/5 bg-background/50 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/logo.png" alt="Logo" width={32} height={32} className="w-auto h-8" />
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              Operyn
            </span>
          </Link>
          <Link href="/">
            <span className="text-xs font-semibold text-muted-foreground hover:text-white flex items-center gap-1.5 transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Home
            </span>
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-6 py-16 space-y-12">
        <div className="space-y-4 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground text-sm">
            Last Updated: May 25, 2026
          </p>
        </div>

        {/* Highlight Banner */}
        <div className="bg-gradient-to-br from-card/30 to-card/10 border border-white/10 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6 shadow-2xl backdrop-blur-md">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 shrink-0">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <div className="space-y-1.5">
            <h3 className="font-bold text-white text-base">Google API Limited Use Compliance</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Operyn's use and transfer to any other app of information received from Google APIs will adhere to the{" "}
              <a
                href="https://developers.google.com/terms/api-services-user-data-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                Google API Services User Data Policy
              </a>
              , including the Limited Use requirements.
            </p>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-primary">1.</span> Introduction
            </h2>
            <p>
              Operyn ("we", "our", or "us") provides an autonomous AI executive assistant designed to help users streamline their daily workflows by organizing tasks, categorizing unread emails, scheduling calendar events, and drafting reply context.
            </p>
            <p>
              We are committed to maintaining the highest standards of data security and user privacy. This policy describes how we access, collect, process, and protect your Google User Data.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-primary">2.</span> How We Access and Use Google User Data
            </h2>
            <p>
              Operyn requests authorization to connect to your Gmail and Google Calendar accounts via OAuth 2.0. We request only the minimum scopes necessary to operate our services:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
              <div className="p-5 border border-white/5 bg-white/[0.01] rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-white font-semibold">
                  <Mail className="h-4 w-4 text-red-400" />
                  Gmail Read/Modify Scopes
                </div>
                <p className="text-xs">
                  We request read access (`gmail.readonly`) to scan unread emails in your mailbox and fetch details. We request modify/compose permissions (`gmail.modify`, `gmail.compose`) strictly to save draft replies in your "Drafts" folder and to mark processed emails as read. We never send emails on your behalf without your explicit approval.
                </p>
              </div>

              <div className="p-5 border border-white/5 bg-white/[0.01] rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-white font-semibold">
                  <Calendar className="h-4 w-4 text-blue-400" />
                  Calendar Read/Write Scopes
                </div>
                <p className="text-xs">
                  We request read access (`calendar.readonly`) to cross-reference upcoming schedules and avoid duplicate bookings or highlight timing conflicts. We request write access (`calendar.events`) strictly to insert new events or meetings extracted from email threads into your Google Calendar.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-primary">3.</span> Data Protection and Encryption
            </h2>
            <p>
              Your security is our absolute priority. We employ advanced cryptographic protections to keep your data secure:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs">
              <li>
                <strong className="text-white">Encrypted OAuth Tokens:</strong> All Access and Refresh tokens obtained during OAuth login are encrypted in our Postgres database using industry-grade <strong className="text-white">AES-256-GCM</strong>.
              </li>
              <li>
                <strong className="text-white">No Email Storing:</strong> We do not store your email bodies, subjects, or sender names permanently. They are processed dynamically in-memory within our secure runtime environment and passed to the AI model to yield task configurations. Only the high-level summaries of successfully completed runs are stored in logs.
              </li>
              <li>
                <strong className="text-white">No Data Sharing or Ad Targeting:</strong> Your Google User Data is never used for advertising, nor is it transferred or sold to any third-party brokers. It is used exclusively to power the executive AI assistant capabilities you enable.
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-primary">4.</span> Deletion and Account Revocation
            </h2>
            <p>
              You maintain total control over your connected accounts. You can disconnect your Gmail or Google Calendar integrations at any time directly through the <strong>Settings</strong> screen in the Operyn dashboard.
            </p>
            <p>
              Disconnecting an integration instantly and permanently deletes the corresponding encrypted access and refresh tokens from our database, completely terminating our access.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3 bg-red-500/5 border border-red-500/10 rounded-2xl p-5">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-primary" />
              Notice on Third-Party AI Engine
            </h2>
            <p className="text-xs">
              Operyn uses Gemini API endpoints (provided by Google Cloud AI SDK) to categorize emails, extract action items, and draft replies. The data passed to the model includes only the content of the emails being processed. This data is handled in accordance with the standard API terms and is not used to train Google's generative models.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-primary">5.</span> Contact Us
            </h2>
            <p>
              If you have any questions, feedback, or data deletion requests regarding this Privacy Policy, please contact our support team at:
            </p>
            <p className="text-white font-medium">
              support@operyn.com
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
