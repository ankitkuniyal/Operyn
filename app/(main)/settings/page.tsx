import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getOrCreateUser, getUserIntegrations, getUserByClerkId } from "@/db/queries";
import { auth, currentUser } from "@clerk/nextjs/server";
import {
  CalendarIcon,
  MailIcon,
  Shield,
  ShieldCheck,
  User,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { redirect } from "next/navigation";
import { DisconnectButton } from "./disconnect-button";
import { AgentToggle } from "../../../components/agents/agent-toggle";
import Link from "next/link";

export const metadata = {
  title: "Settings | Operyn",
  description:
    "Manage your integrations, AI agent preferences, and account configuration on Operyn.",
};

export default async function SettingsPage() {
  const { userId: clerkId, has } = await auth();
  if (!clerkId) {
    redirect("/sign-in");
  }
  
  let user = await getUserByClerkId(clerkId);
  if (!user) {
    const clerkUser = await currentUser();
    const email = clerkUser?.emailAddresses[0].emailAddress ?? "";
    const name = clerkUser?.fullName ?? "";
    user = await getOrCreateUser(clerkId, email, name);
  }

  const email = user?.email || "";
  const name = user?.name || "";

  const isPremiumUser = has({ plan: "premium" });

  const userIntegrations = await getUserIntegrations(user.id);
  const gmailIntegration = userIntegrations.find(
    (integration) => integration.provider === "gmail",
  );
  const googleCalendarIntegration = userIntegrations.find(
    (integration) => integration.provider === "google_calendar",
  );

  const providers = [
    {
      key: "gmail" as const,
      name: "Gmail",
      description:
        "Allow the AI Agent to securely process, categorize, and draft replies to your emails.",
      icon: MailIcon,
      integration: gmailIntegration,
      color: "from-red-500/20 to-orange-500/20 text-red-400 border-red-500/30",
    },
    {
      key: "google_calendar" as const,
      name: "Google Calendar",
      description:
        "Allow the AI Agent to retrieve, schedule, and update events on your calendar.",
      icon: CalendarIcon,
      integration: googleCalendarIntegration,
      color: "from-blue-500/20 to-cyan-500/20 text-blue-400 border-blue-500/30",
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col gap-1.5 pb-2">
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
          Settings
        </h1>
        <p className="text-muted-foreground text-sm">
          Configure your integrations, preferences, and AI agent execution
          status.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column (Integrations & Agent Control) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Integrations Card */}
          <Card className="border border-white/10 bg-card/25 backdrop-blur-xl shadow-xl">
            <CardHeader className="border-b border-white/5 pb-4">
              <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Integrations
              </CardTitle>
              <CardDescription className="text-muted-foreground text-xs">
                Authorize Operyn to manage your workspaces and calendar tools
              </CardDescription>
            </CardHeader>
            <CardContent className="divide-y divide-white/5 pt-0">
              {providers.map((provider) => (
                <div
                  key={provider.key}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-6 first:pt-4 last:pb-4 group transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-3 rounded-2xl bg-gradient-to-br ${provider.color} border shrink-0`}
                    >
                      <provider.icon className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white text-base">
                          {provider.name}
                        </span>
                        {provider.integration ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-white/5 text-muted-foreground border border-white/10 px-2.5 py-0.5 rounded-full">
                            <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                            Disconnected
                          </span>
                        )}
                      </div>
                      <p className="text-muted-foreground text-xs leading-relaxed max-w-md">
                        {provider.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center self-end sm:self-center gap-2 shrink-0">
                    {provider.integration ? (
                      <DisconnectButton provider={provider.key} />
                    ) : (
                      <Button
                        asChild
                        className="bg-primary hover:bg-primary/90 text-white font-medium shadow-lg shadow-primary/20 transition-all duration-200 px-5 rounded-xl hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <a href={`/api/auth/google?provider=${provider.key}`}>
                          Connect
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* AI Executive Assistant Card */}
          <Card className="border border-white/10 bg-card/25 backdrop-blur-xl shadow-xl">
            <CardHeader className="border-b border-white/5 pb-4">
              <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                AI Executive Assistant
              </CardTitle>
              <CardDescription className="text-muted-foreground text-xs">
                Control the background execution engine of your Operyn AI Agent
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="flex items-start gap-4 bg-white/5 border border-white/10 rounded-2xl p-4">
                <AlertCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-semibold text-white text-sm">
                    Background Worker Behavior
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    When active, the agent runs in the background periodically.
                    It inspects unread emails in connected mailboxes,
                    categorizes actionable items, drafts contextual replies, and
                    updates calendar schedules automatically.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 pt-2">
                <div className="space-y-0.5">
                  <span className="text-sm font-semibold text-white block">
                    Agent Engine Status
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        !isPremiumUser
                          ? "bg-neutral-600"
                          : user.agentEnabled
                          ? "bg-emerald-400 animate-pulse"
                          : "bg-amber-400 animate-pulse"
                      }`}
                    />
                    <span
                      className={`text-xs font-medium ${
                        !isPremiumUser
                          ? "text-muted-foreground"
                          : user.agentEnabled
                          ? "text-emerald-400"
                          : "text-amber-400"
                      }`}
                    >
                      {!isPremiumUser
                        ? "Manual Triggers Only"
                        : user.agentEnabled
                        ? "Active & Listening"
                        : "Paused / Off-duty"}
                    </span>
                  </div>
                </div>
                <AgentToggle initialEnabled={user.agentEnabled} disabled={!isPremiumUser} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (Account & Plan info) */}
        <div className="space-y-8">
          {/* Account Profile Card */}
          <Card className="border border-white/10 bg-card/25 backdrop-blur-xl shadow-xl">
            <CardHeader className="border-b border-white/5 pb-4">
              <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                Account Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center font-bold text-primary text-base">
                  {name
                    ? name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                    : "U"}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-semibold text-white text-sm truncate">
                    {name || "Operyn User"}
                  </span>
                  <span className="text-xs text-muted-foreground truncate">
                    {email}
                  </span>
                </div>
              </div>

              {/* Plan Details */}
              <div className="pt-4 border-t border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Current Plan
                  </span>
                  {isPremiumUser ? (
                    <Badge className="bg-primary hover:bg-primary text-white font-semibold flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px]">
                      <ShieldCheck className="h-3 w-3 shrink-0" />
                      Premium
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="border-white/10 bg-white/5 text-muted-foreground font-semibold flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px]"
                    >
                      <Shield className="h-3 w-3 shrink-0" />
                      Free Plan
                    </Badge>
                  )}
                </div>

                {!isPremiumUser && (
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4 flex flex-col gap-3">
                    <div className="space-y-1">
                      <span className="text-xs font-semibold text-white block">
                        Upgrade to Premium
                      </span>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        Increase background run intervals, enable unlimited
                        actions, and connect multiple mailboxes.
                      </p>
                    </div>
                    <Button
                      size="sm"
                      className="w-full bg-primary hover:bg-primary/90 text-white font-medium text-xs rounded-xl"
                      asChild
                    >
                      <Link href="/#pricing">Upgrade Plan</Link>
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
