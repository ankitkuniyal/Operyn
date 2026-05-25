"use server";

import { auth } from "@clerk/nextjs/server";
import { getUserByClerkId, deleteIntegration, updateUserAgentStatus } from "@/db/queries";
import { GoogleProvider } from "@/lib/google";
import { revalidatePath } from "next/cache";
import { checkRateLimit } from "@/lib/rate-limit";

export async function disconnectIntegration(provider: GoogleProvider) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    throw new Error("Unauthorized");
  }

  const user = await getUserByClerkId(clerkId);
  if (!user) {
    throw new Error("User not found");
  }

  await deleteIntegration(user.id, provider);
  revalidatePath("/settings");
  revalidatePath("/dashboard");
}

export async function toggleAgentStatus(enabled: boolean) {
  const { userId: clerkId, has } = await auth();
  if (!clerkId) {
    throw new Error("Unauthorized");
  }

  const isPremiumUser = has({ plan: "premium" });
  if (enabled && !isPremiumUser) {
    throw new Error("Automatic background worker requires a Premium plan subscription.");
  }

  const user = await getUserByClerkId(clerkId);
  if (!user) {
    throw new Error("User not found");
  }

  await updateUserAgentStatus(user.id, enabled);
  revalidatePath("/settings");
  revalidatePath("/dashboard");
}

export async function runAgentManually() {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    throw new Error("Unauthorized");
  }

  const user = await getUserByClerkId(clerkId);
  if (!user) {
    throw new Error("User not found");
  }

  // Enforce rate limiting: maximum 3 manual executions per 10 minutes
  const rateLimitResult = checkRateLimit(user.id);
  if (!rateLimitResult.success) {
    throw new Error("Too many manual agent runs. Please wait before running again.");
  }

  const { runAgent } = await import("@/lib/agents/agents");
  await runAgent(user.id);

  revalidatePath("/dashboard");
  revalidatePath("/monitoring");
}

export async function toggleTaskStatusAction(
  taskId: string,
  status: "pending" | "completed" | "cancelled",
) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    throw new Error("Unauthorized");
  }

  const user = await getUserByClerkId(clerkId);
  if (!user) {
    throw new Error("User not found");
  }

  const { updateTaskStatus: dbUpdateTaskStatus } = await import("@/db/queries");
  await dbUpdateTaskStatus(taskId, user.id, status);

  revalidatePath("/dashboard");
}

export async function deleteTaskAction(taskId: string) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    throw new Error("Unauthorized");
  }

  const user = await getUserByClerkId(clerkId);
  if (!user) {
    throw new Error("User not found");
  }

  const { deleteTask: dbDeleteTask } = await import("@/db/queries");
  await dbDeleteTask(taskId, user.id);

  revalidatePath("/dashboard");
}
