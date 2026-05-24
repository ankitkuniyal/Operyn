import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest, NextResponse } from "next/server";
import { getOrCreateUser, updateUserSubscription } from "@/db/queries";

function mapStatus(clerkStatus: string): "none" | "active" | "canceled" | "past_due" {
  switch (clerkStatus) {
    case "active":
      return "active";
    case "past_due":
      return "past_due";
    case "canceled":
    case "ended":
    case "expired":
      return "canceled";
    default:
      return "none";
  }
}

export async function POST(req: NextRequest) {
  let evt;
  try {
    // Verify the Clerk webhook signature using CLERK_WEBHOOK_SIGNING_SECRET
    evt = await verifyWebhook(req);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return new Response("Verification failed", { status: 400 });
  }

  const { type, data } = evt;

  try {
    // 1. Sync User Creation
    if (type === "user.created") {
      const { id, email_addresses, first_name, last_name } = data as any;
      const email = email_addresses[0]?.email_address;
      const name = `${first_name ?? ""} ${last_name ?? ""}`.trim();
      if (email) {
        await getOrCreateUser(id, email, name);
        console.log(`[Webhook] Synced user creation for ${email}`);
      }
    }

    // 2. Sync Subscription Changes (created / updated / active / pastDue)
    if (
      type === "subscription.created" ||
      type === "subscription.active" ||
      type === "subscription.updated" ||
      type === "subscription.pastDue"
    ) {
      const { id: subscriptionId, payer, status } = data as any;
      const clerkId = payer?.user_id;

      if (clerkId) {
        const dbStatus = mapStatus(status);
        await updateUserSubscription(clerkId, subscriptionId, dbStatus);
        console.log(`[Webhook] Synced subscription ${subscriptionId} status (${dbStatus}) for user ${clerkId}`);
      }
    }

    // 3. Sync Subscription Item Cancellations (canceled / pastDue)
    if (type === "subscriptionItem.canceled") {
      const { payer } = data as any;
      const clerkId = payer?.user_id;

      if (clerkId) {
        await updateUserSubscription(clerkId, null, "canceled");
        console.log(`[Webhook] Synced subscription item cancellation for user ${clerkId}`);
      }
    }

    if (type === "subscriptionItem.pastDue") {
      const { payer } = data as any;
      const clerkId = payer?.user_id;

      if (clerkId) {
        await updateUserSubscription(clerkId, null, "past_due");
        console.log(`[Webhook] Synced subscription item past_due status for user ${clerkId}`);
      }
    }

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("Failed to process webhook event:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
