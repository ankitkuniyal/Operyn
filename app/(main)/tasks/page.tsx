import { getOrCreateUser, getUserByClerkId, getTasks } from "@/db/queries";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { TaskList } from "@/components/tasks/task-list";
import { Card } from "@/components/ui/card";

export const metadata = {
  title: "Tasks | Operyn",
  description: "Manage tasks extracted and compiled by your background workspace AI agent.",
};

export default async function TasksPage() {
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

  const tasks = await getTasks(user.id);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header section */}
      <div className="flex flex-col gap-1.5 pb-2">
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
          Tasks
        </h1>
        <p className="text-muted-foreground text-sm">
          Review, sort, and complete key action items extracted from your Gmail inbox by your AI executive assistant.
        </p>
      </div>

      {/* Main card viewport */}
      <Card className="border border-white/10 bg-card/25 backdrop-blur-xl shadow-xl p-6 rounded-2xl">
        <TaskList tasks={tasks} />
      </Card>
    </div>
  );
}
