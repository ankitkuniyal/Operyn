"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { runAgentManually } from "@/lib/actions";
import { Loader2, Play } from "lucide-react";

export function RunAgentButton({ disabled }: { disabled?: boolean }) {
  const [isPending, startTransition] = useTransition();

  const handleRun = () => {
    if (disabled) return;
    startTransition(async () => {
      try {
        await runAgentManually();
      } catch (error) {
        console.error("Failed to manually run agent:", error);
        alert("Failed to start agent run. Please try again.");
      }
    });
  };

  return (
    <Button
      onClick={handleRun}
      disabled={isPending || disabled}
      title={disabled ? "Please connect your Gmail integration to run the agent" : undefined}
      className="bg-primary hover:bg-primary/90 text-white font-medium shadow-lg shadow-primary/20 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center gap-2 justify-center disabled:opacity-50 disabled:hover:scale-100 disabled:pointer-events-none"
    >
      {isPending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin text-white" />
          <span>Running Agent...</span>
        </>
      ) : (
        <>
          <Play className="h-4 w-4 fill-current text-white" />
          <span>Run Agent Now</span>
        </>
      )}
    </Button>
  );
}
