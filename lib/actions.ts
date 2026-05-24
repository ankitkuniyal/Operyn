"use server";

import { auth } from "@clerk/nextjs/server";
import { getUserByClerkId, deleteIntegration, updateUserAgentStatus } from "@/db/queries";
import { GoogleProvider } from "@/lib/google";
import { revalidatePath } from "next/cache";

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
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    throw new Error("Unauthorized");
  }

  const user = await getUserByClerkId(clerkId);
  if (!user) {
    throw new Error("User not found");
  }

  await updateUserAgentStatus(user.id, enabled);
  revalidatePath("/settings");
  revalidatePath("/dashboard");
}
