"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Mail,
  Bot,
  Calendar as CalendarIcon,
  CheckCircle,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Loader2,
  FileText,
  AlertCircle,
  Inbox,
  Clock,
  CheckSquare,
} from "lucide-react";

interface Scenario {
  id: string;
  sender: string;
  subject: string;
  body: string;
  receivedAt: string;
  aiThoughts: string[];
  tasks: { title: string; priority: "high" | "medium" | "low"; due: string }[];
  calendarEvent: { title: string; date: string; time: string } | null;
  draftReply: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: "project-sync",
    sender: "sarah@company.com",
    subject: "Project Alpha Sync",
    body: "Hi, let's schedule our Project Alpha sync on Tuesday at 3:00 PM. Please review the proposal draft beforehand.",
    receivedAt: "5 mins ago",
    aiThoughts: [
      "[Gmail Service] Scanning unread emails...",
      "[Gmail Service] Found new unread email from sarah@company.com.",
      "[Gemini AI] Processing email body context...",
      "[Gemini AI] Match found: Meeting scheduling request.",
      "[Gemini AI] Extracted date/time: Next Tuesday at 3:00 PM.",
      "[Calendar Service] Fetching schedule conflicts for Tuesday...",
      "[Calendar Service] Conflict check completed: 100% free slot available.",
      "[Gemini AI] Extracted Action Item: 'Review proposal draft' (High Priority).",
      "[Gmail Service] Writing draft reply with confirmation...",
      "[Calendar Service] Scheduling calendar event..."
    ],
    tasks: [
      { title: "Review Project Alpha proposal draft", priority: "high", due: "Next Monday" }
    ],
    calendarEvent: {
      title: "Project Alpha Sync w/ Sarah",
      date: "Next Tuesday",
      time: "3:00 PM - 4:00 PM"
    },
    draftReply: "Hi Sarah,\n\nSounds good! I've booked our Project Alpha Sync for next Tuesday at 3:00 PM and added it to my calendar. I'll make sure to review the proposal draft prior to our meeting.\n\nBest,\n[Your Name] (via Operyn)"
  },
  {
    id: "bug-report",
    sender: "david@engineering.org",
    subject: "URGENT: Login Failures on Production",
    body: "Hey, users are reporting 500 server errors on the login page since the latest deploy. Can you investigate and patch this by tomorrow morning?",
    receivedAt: "2 mins ago",
    aiThoughts: [
      "[Gmail Service] Scanning unread emails...",
      "[Gmail Service] Found urgent unread email from david@engineering.org.",
      "[Gemini AI] Processing email body context...",
      "[Gemini AI] Urgency rating: CRITICAL.",
      "[Gemini AI] Extracted Action Item: 'Investigate and patch login 500 error' (High Priority).",
      "[Gemini AI] Extracted deadline: Tomorrow morning.",
      "[Calendar Service] Check: No calendar events requested. Skipping conflict check.",
      "[Gmail Service] Writing draft reply acknowledging the critical alert...",
      "[Database Sync] Saving task parameters..."
    ],
    tasks: [
      { title: "Investigate and patch login 500 errors", priority: "high", due: "Tomorrow morning" }
    ],
    calendarEvent: null,
    draftReply: "Hi David,\n\nI've received your report regarding the login 500 errors. I am prioritizing this immediately as a high-priority action item and aiming to resolve it by tomorrow morning.\n\nBest,\n[Your Name] (via Operyn)"
  },
  {
    id: "coffee-chat",
    sender: "jessica@venture.net",
    subject: "Catch up / Coffee?",
    body: "Hi! Long time no see. Let's grab coffee this Friday morning around 10 AM to catch up on things.",
    receivedAt: "1 hour ago",
    aiThoughts: [
      "[Gmail Service] Scanning unread emails...",
      "[Gmail Service] Found unread email from jessica@venture.net.",
      "[Gemini AI] Processing email body context...",
      "[Gemini AI] Match found: Social scheduling request.",
      "[Gemini AI] Extracted date/time: Friday at 10:00 AM.",
      "[Calendar Service] Fetching schedule conflicts for Friday morning...",
      "[Calendar Service] Conflict check completed: 100% free slot available.",
      "[Gemini AI] No strict action item tasks identified.",
      "[Gmail Service] Writing friendly confirmation draft...",
      "[Calendar Service] Scheduling calendar event..."
    ],
    tasks: [],
    calendarEvent: {
      title: "Coffee Chat w/ Jessica",
      date: "This Friday",
      time: "10:00 AM - 11:00 AM"
    },
    draftReply: "Hi Jessica,\n\nI'd love to catch up! I checked my calendar and Friday morning at 10:00 AM works perfectly. I've scheduled it on my end.\n\nLooking forward to catching up!\n\nBest,\n[Your Name] (via Operyn)"
  }
];

export function InteractiveSimulation() {
  const [selectedId, setSelectedId] = useState<string>("project-sync");
  const [step, setStep] = useState<"idle" | "running" | "completed">("idle");
  const [currentLogIndex, setCurrentLogIndex] = useState<number>(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [hasRunOnce, setHasRunOnce] = useState<boolean>(false);

  const activeScenario = useMemo(() => {
    return SCENARIOS.find((s) => s.id === selectedId) || SCENARIOS[0];
  }, [selectedId]);

  // Handle run simulation
  const startSimulation = () => {
    setStep("running");
    setHasRunOnce(true);
    setCurrentLogIndex(0);
    setLogs([]);
  };

  const resetSimulation = () => {
    setStep("idle");
    setCurrentLogIndex(0);
    setLogs([]);
  };

  useEffect(() => {
    if (step !== "running") return;

    if (currentLogIndex < activeScenario.aiThoughts.length) {
      const timer = setTimeout(() => {
        setLogs((prev) => [...prev, activeScenario.aiThoughts[currentLogIndex]]);
        setCurrentLogIndex((prev) => prev + 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setStep("completed");
    }
  }, [step, currentLogIndex, activeScenario]);

  return (
    <div className="w-full space-y-8 relative">
      {/* Selector Scenarios */}
      <div className="flex flex-col items-center gap-3 relative z-10">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {SCENARIOS.map((sc) => (
            <Button
              key={sc.id}
              disabled={step === "running"}
              onClick={() => {
                setSelectedId(sc.id);
                resetSimulation();
              }}
              className={`border rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-300 cursor-pointer ${
                selectedId === sc.id
                  ? "bg-primary/20 border-primary text-white shadow-lg shadow-primary/10"
                  : "border-white/10 bg-white/5 text-muted-foreground hover:text-white"
              }`}
            >
              {sc.id === "project-sync" && "📅 Project Sync Request"}
              {sc.id === "bug-report" && "🚨 Critical Bug Alert"}
              {sc.id === "coffee-chat" && "☕ Coffee Chat Invite"}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative">
        {/* Scenario Inbox Card */}
        <div className="lg:col-span-4 flex flex-col">
          <Card className="flex-1 border border-white/10 bg-card/25 backdrop-blur-xl rounded-3xl shadow-xl flex flex-col justify-between overflow-hidden relative">
            <div className="p-5 border-b border-white/5 bg-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Inbox className="h-4.5 w-4.5 text-primary" />
                <span className="text-sm font-bold text-white">Gmail Mock Inbox</span>
              </div>
              <Badge className="bg-primary/20 text-primary border border-primary/30 text-[10px] font-bold py-0.5 px-2.5 rounded-full">
                Unread
              </Badge>
            </div>
            
            <CardContent className="p-6 space-y-4 flex-1 flex flex-col justify-between relative">
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground font-medium">From: <strong className="text-white">{activeScenario.sender}</strong></span>
                  <span className="text-[10px] text-muted-foreground">{activeScenario.receivedAt}</span>
                </div>
                
                <h4 className="text-sm font-bold text-white border-l-2 border-primary pl-2.5">
                  Subject: {activeScenario.subject}
                </h4>
                
                <p className="text-xs text-muted-foreground leading-relaxed bg-black/40 border border-white/5 p-4 rounded-2xl italic">
                  "{activeScenario.body}"
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 relative">
                {step === "idle" && (
                  <div className="w-full space-y-2 text-center">
                    <Button
                      onClick={startSimulation}
                      className="w-full bg-primary hover:bg-primary/95 text-white font-semibold rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform duration-200"
                    >
                      <Play className="h-4 w-4" />
                      Trigger Agent Simulation
                    </Button>
                    {!hasRunOnce && (
                      <p className="text-[10px] text-primary animate-pulse font-bold tracking-wide uppercase mt-1 flex items-center justify-center gap-1">
                        <Sparkles className="h-3 w-3" />
                        Click to test background agent pipeline
                      </p>
                    )}
                  </div>
                )}
                {step === "running" && (
                  <Button
                    disabled
                    className="w-full bg-primary/25 text-primary border border-primary/20 font-semibold rounded-xl flex items-center justify-center gap-2"
                  >
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    Agent Executing Pipeline...
                  </Button>
                )}
                {step === "completed" && (
                  <Button
                    onClick={resetSimulation}
                    className="w-full border border-white/10 hover:bg-white/5 text-white font-semibold rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reset Simulation
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Logs Terminal Card */}
        <div className="lg:col-span-4 flex flex-col">
          <Card className="flex-1 border border-white/10 bg-card/25 backdrop-blur-xl rounded-3xl shadow-xl flex flex-col overflow-hidden min-h-[300px]">
            <div className="p-5 border-b border-white/5 bg-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="h-4.5 w-4.5 text-primary" />
                <span className="text-sm font-bold text-white">Gemini AI Thought Engine</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className={`h-2 w-2 rounded-full ${step === "running" ? "bg-amber-500 animate-ping" : step === "completed" ? "bg-emerald-500" : "bg-muted-foreground"}`} />
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                  {step === "running" ? "Processing" : step === "completed" ? "Completed" : "Standby"}
                </span>
              </div>
            </div>

            <CardContent className="p-5 bg-black/40 flex-1 font-mono text-[10px] leading-relaxed overflow-y-auto space-y-2 h-[220px] max-h-[220px] scrollbar-thin">
              {logs.length > 0 ? (
                logs.map((log, idx) => {
                  let isAi = log.includes("[Gemini AI]");
                  let isCal = log.includes("[Calendar Service]");
                  let isDb = log.includes("[Database Sync]");
                  
                  return (
                    <div
                      key={idx}
                      className={
                        isAi 
                          ? "text-primary font-bold" 
                          : isCal 
                          ? "text-purple-400" 
                          : isDb 
                          ? "text-blue-400" 
                          : "text-neutral-400"
                      }
                    >
                      {log}
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-center space-y-1">
                  <Clock className="h-6 w-6 text-muted-foreground animate-pulse" />
                  <p>Agent is in standby mode.</p>
                  <p className="text-[9px]">Click "Trigger Agent Simulation" on the left.</p>
                </div>
              )}
              {step === "running" && (
                <div className="flex items-center gap-2 text-primary font-semibold">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-ping" />
                  <span>Thinking...</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Pipeline Outcomes Card */}
        <div className="lg:col-span-4 flex flex-col">
          <Card className="flex-1 border border-white/10 bg-card/25 backdrop-blur-xl rounded-3xl shadow-xl flex flex-col overflow-hidden">
            <div className="p-5 border-b border-white/5 bg-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4.5 w-4.5 text-primary" />
                <span className="text-sm font-bold text-white">Pipeline Outcomes</span>
              </div>
            </div>

            <CardContent className="p-5 flex-1 flex flex-col gap-4 justify-center">
              {step === "completed" ? (
                <div className="space-y-4 animate-fade-in">
                  {/* Gmail Draft outcome */}
                  <div className="border border-white/10 bg-white/5 p-4 rounded-xl space-y-2">
                    <div className="flex items-center gap-2 border-b border-white/5 pb-1.5">
                      <FileText className="h-4 w-4 text-purple-400" />
                      <span className="text-xs font-bold text-white">Gmail Reply Draft Created</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-relaxed bg-black/30 p-2.5 rounded-lg border border-white/5 whitespace-pre-line max-h-[80px] overflow-y-auto">
                      {activeScenario.draftReply}
                    </p>
                  </div>

                  {/* Calendar booking outcome */}
                  {activeScenario.calendarEvent && (
                    <div className="border border-white/10 bg-white/5 p-4 rounded-xl space-y-2">
                      <div className="flex items-center gap-2 border-b border-white/5 pb-1.5">
                        <CalendarIcon className="h-4 w-4 text-blue-400" />
                        <span className="text-xs font-bold text-white">Calendar Event Created</span>
                      </div>
                      <div className="text-[10px] text-white font-medium bg-blue-500/10 border border-blue-500/20 p-2.5 rounded-lg flex items-center justify-between">
                        <div>
                          <p className="font-bold">{activeScenario.calendarEvent.title}</p>
                          <p className="text-muted-foreground text-[9px] mt-0.5">{activeScenario.calendarEvent.date} @ {activeScenario.calendarEvent.time}</p>
                        </div>
                        <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[8px] font-extrabold uppercase">
                          Synced
                        </Badge>
                      </div>
                    </div>
                  )}

                  {/* Tasks Synchronized outcome */}
                  {activeScenario.tasks.length > 0 && (
                    <div className="border border-white/10 bg-white/5 p-4 rounded-xl space-y-2">
                      <div className="flex items-center gap-2 border-b border-white/5 pb-1.5">
                        <CheckSquare className="h-4 w-4 text-emerald-400" />
                        <span className="text-xs font-bold text-white">Database Tasks Extracted</span>
                      </div>
                      <div className="space-y-1.5">
                        {activeScenario.tasks.map((t, idx) => (
                          <div key={idx} className="text-[10px] text-white bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-lg flex items-center justify-between">
                            <span className="font-semibold truncate max-w-[150px]">{t.title}</span>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <Badge className="bg-red-500/10 text-red-400 border border-red-500/30 text-[8px] font-extrabold uppercase py-0 px-1.5">
                                {t.priority}
                              </Badge>
                              <span className="text-[8px] text-muted-foreground">{t.due}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center py-12 text-muted-foreground space-y-2">
                  <CheckCircle className="h-8 w-8 text-neutral-600 animate-pulse" />
                  <h4 className="text-xs font-semibold text-white">Awaiting Pipeline Trigger</h4>
                  <p className="text-[10px] max-w-xs">
                    Start the simulation to witness how Operyn uses Google APIs and AI models to create drafts and calendar events.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
