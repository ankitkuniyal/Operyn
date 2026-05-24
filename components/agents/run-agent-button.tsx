"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { runAgentManually } from "@/lib/actions";
import { Loader2, Play } from "lucide-react";

export function RunAgentButton() {
  const [isPending, startTransition] = useTransition();

  const handleRun = () => {
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
      disabled={isPending}
      className="bg-primary hover:bg-primary/90 text-white font-medium shadow-lg shadow-primary/20 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center gap-2 justify-center disabled:opacity-75 disabled:hover:scale-100"
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
