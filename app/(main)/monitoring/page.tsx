import { EmailDetail } from "@/components/agents/email-details";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { CardTitle } from "@/components/ui/card";
import { getAgentRuns, getOrCreateUser, getUserByClerkId } from "@/db/queries";
import { auth, currentUser } from "@clerk/nextjs/server";
import {
  AlertCircleIcon,
  FileTextIcon,
  ListTodoIcon,
  MailIcon,
  Inbox
} from "lucide-react";
import { redirect } from "next/navigation";

export default async function MonitoringPage() {
  const { userId: clerkId } = await auth();
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

  const runs = await getAgentRuns(user.id);

  const processedEmails: any[] = [];
  for (const run of runs) {
    const log = run.actionsLog ?? [];
    for (const entry of log) {
      if (entry.emailId) {
        processedEmails.push({
          ...entry,
          processedAt: run.startedAt,
        });
      }
    }
  }

  const highPriority = processedEmails.filter(
    (email) => email.priority === "high",
  ).length;
  const totalTasks = processedEmails.reduce(
    (acc, email) => acc + (email.tasksCreated ?? 0),
    0,
  );
  const totalDrafts = processedEmails.filter(
    (email) => email.draftCreated,
  ).length;
  const totalProcessed = processedEmails.length;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-1.5 pb-2">
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
          Monitoring
        </h1>
        <p className="text-muted-foreground text-sm">
          Detailed metrics and analysis of emails evaluated by your workspace AI agent.
        </p>
      </div>

      {/* Stats Widgets */}
      <div className="flex flex-row gap-4 overflow-x-auto pb-3 lg:overflow-visible lg:pb-0 lg:grid lg:grid-cols-4 w-full snap-x snap-mandatory scrollbar-none">
        {[
          { 
            label: "Processed Emails", 
            value: totalProcessed, 
            icon: MailIcon,
            color: "from-blue-500/10 to-indigo-500/10 text-blue-400 border-blue-500/20" 
          },
          {
            label: "High Priority",
            value: highPriority,
            icon: AlertCircleIcon,
            color: "from-red-500/10 to-orange-500/10 text-red-400 border-red-500/20"
          },
          { 
            label: "Drafts Created", 
            value: totalDrafts, 
            icon: FileTextIcon,
            color: "from-purple-500/10 to-pink-500/10 text-purple-400 border-purple-500/20"
          },
          { 
            label: "Tasks Extracted", 
            value: totalTasks, 
            icon: ListTodoIcon,
            color: "from-emerald-500/10 to-teal-500/10 text-emerald-400 border-emerald-500/20"
          },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="border border-white/10 bg-card/25 backdrop-blur-xl shadow-xl hover:-translate-y-0.5 transition-all duration-300 group rounded-2xl flex-1 min-w-[220px] lg:min-w-0 snap-start shrink-0">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${color} border shrink-0`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider truncate">
                  {label}
                </span>
                <span className="text-2xl font-extrabold text-white tracking-tight mt-0.5">
                  {value}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Processed Emails List */}
      <div className="space-y-4 pt-2">
        <h2 className="text-lg font-bold text-white tracking-tight">Recent Activity Log</h2>
        
        {processedEmails.length > 0 ? (
          <div className="space-y-4">
            {processedEmails.map((email, idx) => (
              <EmailDetail key={`${email.emailId}-${idx}`} email={email} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-16 border border-dashed border-white/10 rounded-2xl bg-white/5">
            <Inbox className="h-10 w-10 text-muted-foreground mb-3 animate-pulse" />
            <p className="text-base font-semibold text-white">No emails processed yet</p>
            <p className="text-xs text-muted-foreground max-w-sm mt-1">
              Connect your Gmail account in settings and trigger a manual agent cycle to populate this log.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}