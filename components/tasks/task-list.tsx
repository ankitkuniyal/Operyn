"use client";

import { useState, useTransition, useMemo, useEffect } from "react";
import { type Task } from "@/db/schema";
import { toggleTaskStatusAction, deleteTaskAction } from "@/lib/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Circle,
  Clock,
  Trash2,
  Calendar,
  AlertTriangle,
  Loader2,
  Sparkles,
  ArrowUpDown,
} from "lucide-react";

interface TaskListProps {
  tasks: Task[];
}

type SortOption = "created-desc" | "created-asc" | "due-soon" | "priority-high" | "priority-low";

export function TaskList({ tasks }: TaskListProps) {
  const [localTasks, setLocalTasks] = useState<Task[]>(tasks);
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("pending");
  const [sortBy, setSortBy] = useState<SortOption>("created-desc");
  const [isPending, startTransition] = useTransition();

  // Sync state with incoming props
  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const handleToggle = (taskId: string, currentStatus: "pending" | "completed" | "cancelled") => {
    const nextStatus = currentStatus === "completed" ? "pending" : "completed";
    
    // 1. Optimistic Update (Immediate UI response!)
    setLocalTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status: nextStatus,
              completedAt: nextStatus === "completed" ? new Date() : null,
            }
          : t
      )
    );

    // 2. Perform background action
    startTransition(async () => {
      try {
        await toggleTaskStatusAction(taskId, nextStatus);
      } catch (err) {
        // Revert on failure
        setLocalTasks((prev) =>
          prev.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  status: currentStatus,
                  completedAt: currentStatus === "completed" ? new Date() : null,
                }
              : t
          )
        );
        console.error("Failed to toggle task status:", err);
      }
    });
  };

  const handleDelete = (taskId: string) => {
    const originalTask = localTasks.find((t) => t.id === taskId);
    if (!originalTask) return;

    // 1. Optimistic Update (Immediate deletion!)
    setLocalTasks((prev) => prev.filter((t) => t.id !== taskId));

    // 2. Perform background delete
    startTransition(async () => {
      try {
        await deleteTaskAction(taskId);
      } catch (err) {
        // Revert on failure
        setLocalTasks((prev) => [...prev, originalTask]);
        console.error("Failed to delete task:", err);
      }
    });
  };

  // Memoized Filter & Sort
  const processedTasks = useMemo(() => {
    // Apply Filter
    let result = localTasks.filter((task) => {
      if (filter === "all") return true;
      return task.status === filter;
    });

    // Apply Sort
    return result.sort((a, b) => {
      switch (sortBy) {
        case "created-desc":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "created-asc":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "due-soon": {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }
        case "priority-high": {
          const priorityWeights = { high: 3, medium: 2, low: 1 };
          return priorityWeights[b.priority] - priorityWeights[a.priority];
        }
        case "priority-low": {
          const priorityWeights = { high: 3, medium: 2, low: 1 };
          return priorityWeights[a.priority] - priorityWeights[b.priority];
        }
        default:
          return 0;
      }
    });
  }, [localTasks, filter, sortBy]);

  const getPriorityColor = (priority: "low" | "medium" | "high") => {
    switch (priority) {
      case "high":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      case "medium":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "low":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      default:
        return "bg-white/5 text-muted-foreground border-white/10";
    }
  };

  const isOverdue = (dueDate: Date | null) => {
    if (!dueDate) return false;
    return new Date(dueDate).getTime() < Date.now();
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString([], {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold text-white">Your Workspace Tasks</h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Sorting Dropdown */}
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-xs font-semibold text-muted-foreground">
            <ArrowUpDown className="h-3.5 w-3.5 text-primary" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-transparent text-white border-none outline-none cursor-pointer pr-1"
            >
              <option value="created-desc" className="bg-neutral-900 text-white">Newest First</option>
              <option value="created-asc" className="bg-neutral-900 text-white">Oldest First</option>
              <option value="due-soon" className="bg-neutral-900 text-white">Due Date (Soonest)</option>
              <option value="priority-high" className="bg-neutral-900 text-white">Priority (High to Low)</option>
              <option value="priority-low" className="bg-neutral-900 text-white">Priority (Low to High)</option>
            </select>
          </div>

          {/* Filter tabs */}
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 text-xs font-semibold">
            {[
              { id: "pending", label: "Pending" },
              { id: "completed", label: "Completed" },
              { id: "all", label: "All" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-lg transition-all duration-200 ${
                  filter === tab.id
                    ? "bg-white/10 text-white shadow-sm"
                    : "text-muted-foreground hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Task Rows */}
      {processedTasks.length > 0 ? (
        <div className="grid grid-cols-1 gap-3">
          {processedTasks.map((task) => {
            const completed = task.status === "completed";
            const overdue = !completed && isOverdue(task.dueDate);

            return (
              <div
                key={task.id}
                className={`group flex items-start gap-4 p-4 rounded-2xl border transition-all duration-300 backdrop-blur-xl ${
                  completed
                    ? "border-emerald-500/10 bg-emerald-500/5 opacity-65"
                    : overdue
                    ? "border-red-500/20 bg-red-500/5"
                    : "border-white/10 bg-white/5 hover:bg-white/[0.08]"
                }`}
              >
                {/* Completion Toggle checkbox (Instant Visual Feedback!) */}
                <button
                  onClick={() => handleToggle(task.id, task.status)}
                  className="mt-0.5 text-muted-foreground hover:text-white transition-colors shrink-0"
                >
                  {completed ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  ) : (
                    <Circle className="h-5 w-5 hover:text-primary transition-colors text-muted-foreground/60" />
                  )}
                </button>

                {/* Details info */}
                <div className="flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-sm font-semibold transition-colors duration-300 leading-snug ${
                        completed ? "line-through text-muted-foreground/80" : "text-white"
                      }`}
                    >
                      {task.title}
                    </span>
                    <Badge
                      variant="outline"
                      className={`text-[9px] uppercase tracking-wider font-bold py-0 px-2 rounded-full border ${getPriorityColor(
                        task.priority,
                      )}`}
                    >
                      {task.priority}
                    </Badge>
                    {task.createdByAgent && (
                      <Badge className="bg-primary/10 text-primary border border-primary/20 text-[9px] font-bold py-0 px-2 rounded-full uppercase tracking-wider">
                        Agent
                      </Badge>
                    )}
                  </div>

                  {task.description && (
                    <p
                      className={`text-xs leading-relaxed max-w-2xl ${
                        completed ? "text-muted-foreground/60" : "text-muted-foreground"
                      }`}
                    >
                      {task.description}
                    </p>
                  )}

                  {/* Due Date details */}
                  {task.dueDate && (
                    <div
                      className={`flex items-center gap-1.5 text-[10px] font-medium mt-1 ${
                        completed
                          ? "text-muted-foreground/50"
                          : overdue
                          ? "text-red-400"
                          : "text-muted-foreground"
                      }`}
                    >
                      {overdue ? (
                        <AlertTriangle className="h-3 w-3 shrink-0 text-red-400" />
                      ) : (
                        <Calendar className="h-3 w-3 shrink-0 text-muted-foreground" />
                      )}
                      <span>
                        Due {formatDate(task.dueDate)}
                        {overdue && " (Overdue)"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Delete button action */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(task.id)}
                  className="h-8 w-8 text-muted-foreground/40 hover:text-red-400 hover:bg-red-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center py-16 border border-dashed border-white/10 rounded-2xl bg-white/5">
          <Clock className="h-8 w-8 text-muted-foreground mb-3" />
          <p className="text-sm font-semibold text-white">No tasks found</p>
          <p className="text-xs text-muted-foreground max-w-xs mt-1">
            {filter === "pending"
              ? "All your generated tasks are completed! Good job."
              : filter === "completed"
              ? "Completed tasks list is empty."
              : "AI runs haven't created any tasks yet."}
          </p>
        </div>
      )}
    </div>
  );
}
