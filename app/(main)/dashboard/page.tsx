import { RunAgentButton } from "@/components/agents/run-agent-button";
import { AgentToggle } from "@/components/agents/agent-toggle";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  getLatestAgentRun,
  getOrCreateUser,
  getUnreadEmails,
  getUserIntegrations,
} from "@/db/queries";
import { auth, currentUser } from "@clerk/nextjs/server";
import { 
  CheckCircle2, 
  Circle, 
  Zap, 
  Mail, 
  FileText, 
  CheckSquare, 
  Clock, 
  ArrowUpRight, 
  Sparkles,
  Calendar,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    redirect("/sign-in");
  }
  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses[0].emailAddress ?? "";
  const name = clerkUser?.fullName ?? "";
  const user = await getOrCreateUser(clerkId, email, name);

  const latestRun = await getLatestAgentRun(user.id);

  const userIntegrations = await getUserIntegrations(user.id);
  const gmailConnected = userIntegrations.some(
    (integration) => integration.provider === "gmail",
  );
  const googleCalendarConnected = userIntegrations.some(
    (integration) => integration.provider === "google_calendar",
  );

  const { has } = await auth();
  const isPremiumUser = has({ plan: "premium" });

  const onboardingSteps = [
    {
      name: "Connect Gmail Integration",
      description: "Allow the agent to scan unread emails and draft replies.",
      completed: gmailConnected,
      href: "/settings",
    },
    {
      name: "Connect Google Calendar",
      description: "Allow the agent to check conflicts and schedule events.",
      completed: googleCalendarConnected,
      href: "/settings",
    },
    {
      name: "Activate Premium (Optional)",
      description: "Unlocks 15-minute autonomous runs and advanced assistant features.",
      completed: isPremiumUser,
      href: "/settings",
    },
  ];

  const completedCount = onboardingSteps.filter(
    (step) => step.completed,
  ).length;
  const progressPercent = Math.round(
    (completedCount / onboardingSteps.length) * 100,
  );

  const { emailsProcessed, draftsCreated, tasksCreated } =
    await getUnreadEmails(user.id);

  // Check if onboarding is complete (if integrations are connected or user dismissed it)
  const showOnboarding = !user.onboardingCompleted && (!gmailConnected || !googleCalendarConnected);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Welcome Header */}
      <div className="flex flex-col gap-1.5 pb-2">
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
          Dashboard
        </h1>
        <p className="text-muted-foreground text-sm">
          Welcome back, {clerkUser?.firstName || "User"}! Monitor and trigger your background AI agents here.
        </p>
      </div>

      <div className="space-y-8">
        {/* Onboarding Wizard Card */}
        {showOnboarding && (
          <Card className="border border-white/10 bg-card/25 backdrop-blur-xl shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 h-40 w-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            <CardHeader className="border-b border-white/5 pb-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Get Started with Operyn
                  </CardTitle>
                  <CardDescription className="text-muted-foreground text-xs mt-1">
                    Complete these quick setup steps to enable your workspace AI pilot.
                  </CardDescription>
                </div>
                <Badge className="bg-primary/20 text-primary border border-primary/30 text-xs font-semibold px-3 py-1 rounded-full">
                  {progressPercent}% Complete
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <Progress value={progressPercent} className="h-2 rounded-full" />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {onboardingSteps.map((step, index) => (
                  <Link key={step.name} href={step.href} className="group">
                    <div className={`h-full flex flex-col justify-between p-4 rounded-2xl border transition-all duration-300 ${
                      step.completed 
                        ? "border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10" 
                        : "border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10 hover:-translate-y-0.5"
                    }`}>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-bold ${step.completed ? "text-emerald-400" : "text-primary"}`}>
                            Step {index + 1}
                          </span>
                          {step.completed ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                          ) : (
                            <Circle className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          )}
                        </div>
                        <h4 className="font-semibold text-sm text-white">{step.name}</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
                      </div>
                      
                      {!step.completed && (
                        <div className="flex items-center gap-1 text-[11px] font-semibold text-primary mt-4 group-hover:underline">
                          Set up
                          <ArrowUpRight className="h-3 w-3" />
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Status and Action grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Agent Control Box */}
          <Card className="border border-white/10 bg-card/25 backdrop-blur-xl shadow-xl">
            <CardHeader className="border-b border-white/5 pb-4">
              <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                <Zap className={`h-5 w-5 ${isPremiumUser && user.agentEnabled ? "text-emerald-400 animate-pulse" : "text-primary"}`} />
                Agent Status
              </CardTitle>
              <CardDescription className="text-muted-foreground text-xs mt-0.5">
                {isPremiumUser
                  ? user.agentEnabled
                    ? "Your background pilot runs automatically every 15 minutes."
                    : "Autonomous agent execution is currently paused."
                  : "Manual triggers only. Upgrade to activate automatic background monitoring."}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-white/5">
                  <span className="text-xs text-muted-foreground font-medium">Automatic Running Mode</span>
                  {!isPremiumUser ? (
                    <Badge variant="outline" className="border-amber-500/20 bg-amber-500/5 text-amber-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Manual Only
                    </Badge>
                  ) : user.agentEnabled ? (
                    <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Active (15m)
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-white/10 bg-white/5 text-muted-foreground text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                      Paused
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between py-2 border-b border-white/5">
                  <span className="text-xs text-muted-foreground font-medium">Gmail Integrator</span>
                  <span className={`text-xs font-semibold ${gmailConnected ? "text-emerald-400" : "text-muted-foreground"}`}>
                    {gmailConnected ? "Connected" : "Disconnected"}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-white/5">
                  <span className="text-xs text-muted-foreground font-medium">Google Calendar Integrator</span>
                  <span className={`text-xs font-semibold ${googleCalendarConnected ? "text-emerald-400" : "text-muted-foreground"}`}>
                    {googleCalendarConnected ? "Connected" : "Disconnected"}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 items-stretch pt-2">
                <RunAgentButton />
                <AgentToggle initialEnabled={user.agentEnabled} disabled={!isPremiumUser} />
              </div>
            </CardContent>
          </Card>

          {/* Last Agent Run Box */}
          <Card className="border border-white/10 bg-card/25 backdrop-blur-xl shadow-xl">
            <CardHeader className="border-b border-white/5 pb-4">
              <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                Last Agent Run
              </CardTitle>
              <CardDescription className="text-muted-foreground text-xs mt-0.5">
                {latestRun ? "Activity overview for the last executed loop" : "No previous agent activity tracked yet."}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {latestRun ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-xs text-muted-foreground font-medium">Trigger Time</span>
                    <span className="text-xs font-semibold text-white">
                      {new Date(latestRun.startedAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-xs text-muted-foreground font-medium">Run Status</span>
                    {latestRun.status === "success" ? (
                      <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Success
                      </Badge>
                    ) : (
                      <Badge className="bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Failed
                      </Badge>
                    )}
                  </div>

                  <div className="flex flex-col gap-1 py-2">
                    <span className="text-xs text-muted-foreground font-medium">Execution Summary</span>
                    <p className="text-xs text-white leading-relaxed bg-white/5 border border-white/10 p-3 rounded-xl mt-1">
                      {latestRun.summary || "No run description available."}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center py-10 border border-dashed border-white/10 rounded-2xl bg-white/5">
                  <AlertCircle className="h-8 w-8 text-muted-foreground mb-3" />
                  <p className="text-sm font-semibold text-white">No activity logged</p>
                  <p className="text-xs text-muted-foreground max-w-xs mt-1">
                    Connect your Gmail integrations and execute "Run Agent Now" to inspect background logs.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              label: "Emails Evaluated",
              value: emailsProcessed,
              description: "Total emails checked by AI",
              icon: Mail,
              color: "from-blue-500/10 to-indigo-500/10 text-blue-400 border-blue-500/20",
            },
            {
              label: "Context Drafts Created",
              value: draftsCreated,
              description: "Draft replies added to Gmail",
              icon: FileText,
              color: "from-purple-500/10 to-pink-500/10 text-purple-400 border-purple-500/20",
            },
            {
              label: "Tasks Generated",
              value: tasksCreated,
              description: "Action items synced to schedule",
              icon: CheckSquare,
              color: "from-emerald-500/10 to-teal-500/10 text-emerald-400 border-emerald-500/20",
            },
          ].map((item) => (
            <Card key={item.label} className="border border-white/10 bg-card/25 backdrop-blur-xl shadow-xl hover:-translate-y-0.5 transition-all duration-300 group">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-4">
                  <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {item.label}
                  </CardTitle>
                  <div className={`p-2 rounded-xl bg-gradient-to-br ${item.color} border`}>
                    <item.icon className="h-4 w-4" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="text-4xl font-extrabold text-white tracking-tight">
                  {item.value}
                </div>
                <p className="text-[11px] text-muted-foreground group-hover:text-white transition-colors duration-200">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}