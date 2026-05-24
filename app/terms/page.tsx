import Link from "next/link";
import Image from "next/image";
import { Scale, ArrowLeft, Shield } from "lucide-react";

export const metadata = {
  title: "Terms of Service | Operyn",
  description: "Read the Terms of Service of Operyn to understand user responsibilities and rules governing the AI Assistant platform.",
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen text-foreground relative overflow-x-hidden bg-background">
      {/* Glow Effects */}
      <div className="absolute top-[-10%] right-[10%] h-[500px] w-[500px] bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[10%] left-[10%] h-[500px] w-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

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
            Terms of Service
          </h1>
          <p className="text-muted-foreground text-sm">
            Last Updated: May 25, 2026
          </p>
        </div>

        {/* Highlight Banner */}
        <div className="bg-gradient-to-br from-card/30 to-card/10 border border-white/10 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6 shadow-2xl backdrop-blur-md">
          <div className="p-3 bg-primary/10 border border-primary/20 rounded-2xl text-primary shrink-0">
            <Scale className="h-8 w-8" />
          </div>
          <div className="space-y-1.5">
            <h3 className="font-bold text-white text-base">User Agreement & Service Access</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              By connecting your Google Workspace account or using Operyn, you agree to comply with and be bound by these Terms of Service. Please read them carefully.
            </p>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-primary">1.</span> Description of Service
            </h2>
            <p>
              Operyn provides an AI-powered automation workflow platform designed to connect with Google Workspace (specifically Gmail and Google Calendar) to read unread messages, categorize tasks, identify calendar events, and build drafts.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-primary">2.</span> Account Registration & Access
            </h2>
            <p>
              You must register for an account (managed securely through Clerk Authentication) to use the services. You are solely responsible for:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li>Maintaining the confidentiality of your account credentials.</li>
              <li>All activities occurring under your account or connected OAuth sessions.</li>
              <li>Ensuring that you have the legal right and necessary permissions to grant Operyn access to any connected corporate or personal Google Workspace accounts.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-primary">3.</span> Integrations & API Usage rules
            </h2>
            <p>
              Our integration relies on OAuth tokens provided by Google. You authorize us to interact with the Gmail and Calendar APIs on your behalf strictly to achieve the functionalities you explicitly enable (e.g. checking mail, drafting replies, and inserting events).
            </p>
            <p>
              We reserve the right to suspend or block access if we detect abusive calling patterns, attempts to reverse-engineer the API keys, or actions that compromise our backend infrastructure security.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-primary">4.</span> Subscription Billing and Refunds
            </h2>
            <p>
              Automatic background runs (triggered every 15 minutes) require an active Premium plan subscription. Subscriptions are billed periodically on a recurring basis via Clerk Billing.
            </p>
            <p>
              You may cancel your subscription at any time. Upon cancellation, your premium entitlements will remain active until the end of your current billing period, after which the background worker will be disabled.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-primary">5.</span> Disclaimer of Warranties
            </h2>
            <p>
              OPERYN IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT ANY EXPRESS OR IMPLIED WARRANTIES OF ANY KIND.
            </p>
            <p>
              While we leverage advanced generative AI models (such as Gemini 2.5) to parse emails and compose event definitions, AI models can produce inaccurate outputs (hallucinations). You acknowledge that you are responsible for reviewing draft replies and verifying task deadlines before relying on them. We are not liable for any calendar scheduling conflicts, lost emails, or incorrect message categorization.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-primary">6.</span> Limitation of Liability
            </h2>
            <p>
              IN NO EVENT SHALL OPERYN, ITS DIRECTORS, OR EMPLOYEES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES (INCLUDING LOSS OF PROFITS, DATA, OR USE) ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF THE SERVICE.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-primary">7.</span> Contact Information
            </h2>
            <p>
              If you have any questions or require support regarding these Terms of Service, please contact us at:
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
