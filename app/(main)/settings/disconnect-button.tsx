"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { disconnectIntegration } from "../../../lib/actions";
import { GoogleProvider } from "@/lib/google";
import { Loader2, Link2Off } from "lucide-react";

interface DisconnectButtonProps {
  provider: GoogleProvider;
}

export function DisconnectButton({ provider }: DisconnectButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleDisconnect = () => {
    if (
      confirm(
        `Are you sure you want to disconnect your ${provider === "gmail" ? "Gmail" : "Google Calendar"}?`,
      )
    ) {
      startTransition(async () => {
        try {
          await disconnectIntegration(provider);
        } catch (error) {
          console.error("Failed to disconnect integration:", error);
          alert("Failed to disconnect. Please try again.");
        }
      });
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={isPending}
      onClick={handleDisconnect}
      className="relative overflow-hidden border-red-500/30 bg-red-500/5 hover:bg-red-500/10 text-red-400 hover:text-red-300 font-medium transition-all duration-300 backdrop-blur-md rounded-xl px-4 py-2 hover:scale-[1.02] active:scale-[0.98] group disabled:opacity-70 disabled:hover:scale-100"
    >
      <span className="flex items-center gap-2">
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin text-red-400" />
        ) : (
          <Link2Off className="h-4 w-4 text-red-400/80 group-hover:text-red-400 transition-colors" />
        )}
        <span>{isPending ? "Disconnecting..." : "Disconnect"}</span>
      </span>
    </Button>
  );
}
