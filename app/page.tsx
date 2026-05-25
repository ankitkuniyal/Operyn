import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton, Show, UserButton, PricingTable } from '@clerk/nextjs';
import { 
  Bot, 
  Mail, 
  Calendar, 
  ShieldAlert, 
  ArrowRight, 
  Sparkles, 
  CheckCircle, 
  ShieldCheck, 
  Zap,
  ListTodo,
  FileText
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { InteractiveSimulation } from "@/components/landing/interactive-simulation";

export default function Home() {
  return (
    <div className="min-h-screen text-foreground relative overflow-x-hidden">
      {/* Light highlights for visual depth */}
      <div className="absolute top-[-10%] left-[20%] h-[600px] w-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-[30%] right-[-10%] h-[500px] w-[500px] bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md border-b border-white/5 bg-background/50 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="logo-container">
            <Link href="/" className="flex items-center gap-2.5">
              <Image src="/logo.png" alt="Logo" width={32} height={32} className="w-auto h-8" />
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                Operyn
              </span>
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#workflow" className="hover:text-white transition-colors">How it Works</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </nav>

          <div className="flex items-center gap-4">
            <Show when="signed-out">
              <Link href="/sign-in">
                <Button variant="ghost" className="text-sm font-semibold hover:text-white">
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button className="bg-primary hover:bg-primary/95 text-white font-medium text-sm rounded-xl px-5 shadow-lg shadow-primary/10">
                  Get Started
                </Button>
              </Link>
            </Show>
            <Show when="signed-in">
              <Link href="/dashboard">
                <Button variant="outline" className="border-white/10 hover:bg-white/5 text-white font-medium text-sm rounded-xl">
                  Dashboard
                </Button>
              </Link>
              <UserButton />
            </Show>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-6">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold bg-primary/10 text-primary border border-primary/20 animate-fade-in">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Introducing Autonomous Workspace Agents</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1] max-w-4xl mx-auto">
            Your AI Executive Assistant running <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">24/7</span> in the background.
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Operyn securely integrates with your Gmail and Google Calendar. It scans unread mail, extracts key tasks, schedules events, and drafts replies—completely autonomously.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Show when="signed-out">
              <Link href="/sign-up" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/95 text-white font-semibold text-base rounded-2xl px-8 py-6 shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform duration-200 cursor-pointer">
                  Activate Your Agent Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </Show>
            <Show when="signed-in">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button size="lg" className="w-full bg-primary hover:bg-primary/95 text-white font-semibold text-base rounded-2xl px-8 py-6 shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform duration-200">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </Show>
            <a href="#features" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white font-semibold text-base rounded-2xl px-8 py-6">
                Explore Features
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Visual Workflow Mockup Section */}
      <section id="workflow" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card/25 border border-white/10 backdrop-blur-xl rounded-[32px] p-8 md:p-12 shadow-2xl relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent rounded-[32px] pointer-events-none" />
            
            <div className="text-center space-y-3 mb-12">
              <span className="text-xs font-bold text-primary uppercase tracking-widest">Active Pipeline Simulator</span>
              <h3 className="text-3xl font-bold text-white tracking-tight">Interactive Workflow Visualizer</h3>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                Select a scenario and click "Trigger Agent Simulation" to watch the background pipeline operate in real-time.
              </p>
            </div>

            <InteractiveSimulation />
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="py-24 px-6 bg-black/20 border-y border-white/5">
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
              Supercharge Your Daily Operations
            </h2>
            <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
              Operyn works in the background using secure credentials to optimize your calendar and reply loops.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Email Automation",
                description: "Checks unread mailbox, evaluates priority categories, and writes draft replies for context-aware approvals.",
                icon: Mail,
                color: "from-blue-500/10 to-cyan-500/10 text-blue-400 border-blue-500/20",
              },
              {
                title: "Calendar Intelligence",
                description: "Automatically cross-references your scheduler, books events, and outlines conflicts directly in draft replies.",
                icon: Calendar,
                color: "from-purple-500/10 to-indigo-500/10 text-purple-400 border-purple-500/20",
              },
              {
                title: "Task Extraction",
                description: "Sifts through action items in emails and formats them as tracked tasks in your schedule so nothing is forgotten.",
                icon: ListTodo,
                color: "from-emerald-500/10 to-teal-500/10 text-emerald-400 border-emerald-500/20",
              },
            ].map((feature) => (
              <div key={feature.title} className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm space-y-4 hover:border-white/10 hover:bg-white/[0.04] hover:-translate-y-1 transition-all duration-300">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${feature.color} border w-fit`}>
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Gating section */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
        <div className="bg-gradient-to-br from-card/30 to-card/10 border border-white/10 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 shadow-2xl">
          <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl text-primary shrink-0">
            <ShieldCheck className="h-10 w-10" />
          </div>
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl font-bold text-white">AES-256-GCM Encrypted Credentials</h3>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
              We take security seriously. All authenticated access and refresh tokens for Gmail and Google Calendar are locked using enterprise-grade AES-256-GCM encryption with client authorization tags. Your emails are only parsed locally inside our runtime and are never shared.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 bg-black/10 border-t border-white/5">
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
              Choose Your Subscription
            </h2>
            <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
              Start with manual triggers for free, or unlock continuous autonomous execution with our Premium plan.
            </p>
          </div>

          <div className="bg-card/25 border border-white/10 backdrop-blur-xl rounded-3xl p-6 md:p-10 shadow-2xl">
            <PricingTable />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-black/40 backdrop-blur-md py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="Logo" width={24} height={24} className="w-auto h-6" />
            <span className="text-sm font-semibold text-white/80">Operyn AI © {new Date().getFullYear()}</span>
          </div>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-xs font-medium text-muted-foreground">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <a href="mailto:support@operyn.com" className="hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
