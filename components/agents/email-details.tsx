"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ProcessedEmail } from "@/db/schema";
import {
  ChevronDown,
  Clock,
  FileText,
  ListTodo,
  User,
  AlertTriangle,
  MailOpen
} from "lucide-react";
import { useState } from "react";

const priorityStyles: Record<string, string> = {
  high: "bg-red-500/10 text-red-400 border border-red-500/20",
  medium: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  low: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
};

const categoryStyles: Record<string, string> = {
  work: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20",
  personal: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  newsletter: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
  notification: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",
  spam: "bg-red-500/20 text-red-400 border border-red-500/30",
  other: "bg-white/5 text-muted-foreground border border-white/10",
};

export function EmailDetail({ email }: { email: ProcessedEmail }) {
  const [expanded, setExpanded] = useState(false);

  const senderName =
    email.from?.split("<")[0]?.trim().replace(/"/g, "") || email.from;

  return (
    <Card className="border border-white/10 bg-card/25 backdrop-blur-xl hover:bg-card/30 hover:border-white/15 transition-all duration-300 rounded-2xl overflow-hidden shadow-xl">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-primary"
      >
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-3.5 flex-1 min-w-0">
              {/* Subject + Badges */}
              <div className="flex flex-col gap-2">
                <h3 className="text-base font-bold text-white tracking-tight truncate">
                  {email.subject || "(No subject)"}
                </h3>
                
                <div className="flex flex-wrap items-center gap-1.5">
                  {email.priority && (
                    <Badge variant="outline" className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${priorityStyles[email.priority] ?? "bg-white/5"}`}>
                      {email.priority}
                    </Badge>
                  )}
                  {email.category && (
                    <Badge variant="outline" className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${categoryStyles[email.category] ?? ""}`}>
                      {email.category}
                    </Badge>
                  )}
                  {email.draftCreated && (
                    <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      Draft Created
                    </Badge>
                  )}
                  {(email.tasksCreated ?? 0) > 0 && (
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <ListTodo className="h-3 w-3" />
                      {email.tasksCreated} Task{email.tasksCreated !== 1 ? "s" : ""}
                    </Badge>
                  )}
                </div>
              </div>

              {/* From + Date */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground font-medium pt-0.5">
                <span className="flex items-center gap-1.5 truncate">
                  <User className="h-3.5 w-3.5 text-primary shrink-0" />
                  {senderName}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  {new Date(email.processedAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                </span>
              </div>

              {/* Summary */}
              {email.summary && (
                <p className="text-xs text-muted-foreground leading-relaxed bg-white/[0.02] border border-white/5 p-3 rounded-xl max-w-3xl">
                  {email.summary}
                </p>
              )}
            </div>

            {/* Expanded toggle chevron */}
            <div className={`p-1.5 rounded-lg bg-white/5 border border-white/10 text-muted-foreground transition-transform duration-300 shrink-0 ${expanded ? 'rotate-180 text-white bg-primary/20 border-primary/30' : ''}`}>
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>
        </CardContent>
      </button>

      {/* Expanded details panel */}
      {expanded && (
        <div className="border-t border-white/5 bg-white/[0.01] p-5 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Action Items */}
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
                <ListTodo className="h-4 w-4 text-emerald-400" />
                Action Items & Tasks
              </h4>
              
              {email.actionItems && email.actionItems.length > 0 ? (
                <ul className="space-y-3">
                  {email.actionItems.map((item, i) => (
                    <li key={i} className="border border-white/5 bg-black/25 p-3.5 rounded-xl space-y-1">
                      <p className="text-xs font-semibold text-white">{item.title}</p>
                      {item.description && (
                        <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                          {item.description}
                        </p>
                      )}
                      {item.dueDate && (
                        <p className="text-[10px] font-bold text-primary/80 flex items-center gap-1 mt-1.5">
                          <Clock className="h-3 w-3" />
                          Due: {new Date(item.dueDate).toLocaleDateString([], { dateStyle: 'medium' })}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-6 border border-dashed border-white/5 bg-black/10 rounded-xl">
                  <MailOpen className="h-6 w-6 text-muted-foreground mb-2" />
                  <p className="text-xs text-muted-foreground">No tasks extracted from this email.</p>
                </div>
              )}
            </div>

            {/* Draft Reply */}
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
                <FileText className="h-4 w-4 text-purple-400" />
                AI Drafted Reply
              </h4>
              
              {email.draftReply ? (
                <div className="border border-white/5 bg-black/25 p-4 rounded-xl flex flex-col gap-2">
                  <p className="text-xs text-white leading-relaxed whitespace-pre-wrap font-sans">
                    {email.draftReply}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-6 border border-dashed border-white/5 bg-black/10 rounded-xl h-full min-h-[120px]">
                  <FileText className="h-6 w-6 text-muted-foreground mb-2" />
                  <p className="text-xs text-muted-foreground">No automated reply drafted for this email.</p>
                </div>
              )}
            </div>
          </div>

          {/* Error description if present */}
          {email.status === "error" && email.error && (
            <div className="flex items-start gap-2.5 p-3.5 border border-red-500/20 bg-red-500/5 rounded-xl text-red-400">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <p className="text-xs font-medium">Processing Error: {email.error}</p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}