"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { toggleAgentStatus } from "../../lib/actions";
import { Loader2, Play, Square } from "lucide-react";

interface AgentToggleProps {
  initialEnabled: boolean;
}

export function AgentToggle({ initialEnabled }: AgentToggleProps) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      try {
        await toggleAgentStatus(!initialEnabled);
      } catch (error) {
        console.error("Failed to toggle agent status:", error);
        alert("Failed to update status. Please try again.");
      }
    });
  };

  return (
    <Button
      variant="outline"
      onClick={handleToggle}
      disabled={isPending}
      className={`relative overflow-hidden transition-all duration-300 font-medium px-5 py-2.5 rounded-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100 backdrop-blur-md border ${
        initialEnabled
          ? "border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-400"
          : "border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10 text-amber-400"
      }`}
    >
      <span className="flex items-center gap-2">
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : initialEnabled ? (
          <Square className="h-4 w-4 fill-current text-emerald-400" />
        ) : (
          <Play className="h-4 w-4 fill-current text-amber-400" />
        )}
        <span>
          {isPending
            ? "Updating..."
            : initialEnabled
              ? "Pause AI Agent"
              : "Activate AI Agent"}
        </span>
      </span>
    </Button>
  );
}
