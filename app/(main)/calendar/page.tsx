import { getOrCreateUser, getUserByClerkId } from "@/db/queries";
import { getCalendarClient } from "@/lib/google-client";
import { fetchUpcomingEvents, type CalendarEvent } from "@/lib/agents/calendar";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  MapPin,
  FileText,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Link as LinkIcon,
} from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Calendar | Operyn",
  description: "View upcoming calendar events and meeting schedules synchronized by your AI agent.",
};

export default async function CalendarPage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    redirect("/sign-in");
  }

  let user = await getUserByClerkId(clerkId);
  if (!user) {
    const clerkUser = await currentUser();
    const email = clerkUser?.emailAddresses[0].emailAddress ?? "";
    const name = clerkUser?.fullName ?? "";
    user = await getOrCreateUser(clerkId, email, name);
  }

  const calendarClient = await getCalendarClient(user.id);
  
  let events: CalendarEvent[] = [];
  let errorLoadingCalendar = false;

  if (calendarClient) {
    try {
      // Fetch upcoming events for the next 7 days
      events = await fetchUpcomingEvents(calendarClient, 7 * 24);
    } catch (err) {
      console.error("Failed to fetch Google Calendar events:", err);
      errorLoadingCalendar = true;
    }
  }

  // Group events by local date
  const groupedEvents: { [dateStr: string]: CalendarEvent[] } = {};
  
  events.forEach((event) => {
    if (!event.start) return;
    const dateObj = new Date(event.start);
    if (isNaN(dateObj.getTime())) return;
    
    const dateStr = dateObj.toLocaleDateString([], {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
    
    if (!groupedEvents[dateStr]) {
      groupedEvents[dateStr] = [];
    }
    groupedEvents[dateStr].push(event);
  });

  const getFormattedTime = (isoString: string) => {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "All Day";
    // Check if the time is exactly midnight or has no time portion
    if (isoString.length <= 10) return "All Day"; // YYYY-MM-DD format
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  };

  const isOperynEvent = (description?: string) => {
    if (!description) return false;
    return description.toLowerCase().includes("operyn") || description.toLowerCase().includes("ai assistant");
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-1.5 pb-2">
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
          Calendar
        </h1>
        <p className="text-muted-foreground text-sm">
          Live sync of your upcoming workspace events, meetings, and AI-scheduled calendar slots.
        </p>
      </div>

      {!calendarClient ? (
        /* Not Connected State */
        <Card className="border border-white/10 bg-card/25 backdrop-blur-xl shadow-xl p-8 text-center max-w-2xl mx-auto mt-12 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 h-40 w-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
          <CardTitle className="text-xl font-bold text-white mb-2">Google Calendar Disconnected</CardTitle>
          <CardDescription className="text-muted-foreground text-sm max-w-md mx-auto mb-6">
            Connect your Google Calendar integration in settings to let the AI agent read conflicts and schedule meetings.
          </CardDescription>
          <Button className="bg-primary hover:bg-primary/95 text-white font-semibold rounded-xl cursor-pointer" asChild>
            <Link href="/settings" className="flex items-center gap-2">
              Connect Calendar
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </Card>
      ) : errorLoadingCalendar ? (
        /* Error State */
        <Card className="border border-red-500/20 bg-red-500/5 p-6 text-center max-w-md mx-auto mt-12 rounded-2xl">
          <AlertCircle className="h-10 w-10 text-red-400 mx-auto mb-3" />
          <h3 className="text-md font-bold text-white mb-1">Calendar Access Error</h3>
          <p className="text-xs text-muted-foreground mb-4">
            Could not fetch calendar events. Your Google access token may have expired or was revoked. Please try reconnecting your account.
          </p>
          <Button variant="outline" className="border-white/10 hover:bg-white/5 rounded-xl cursor-pointer" asChild>
            <Link href="/settings">Reconnect Google Calendar</Link>
          </Button>
        </Card>
      ) : events.length === 0 ? (
        /* Empty State */
        <Card className="border border-white/10 bg-card/25 backdrop-blur-xl shadow-xl p-12 text-center max-w-xl mx-auto mt-12 rounded-2xl">
          <Clock className="h-12 w-12 text-muted-foreground/60 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-1">No upcoming events</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            You have a completely clear schedule for the next 7 days! When the AI schedules new tasks from your emails, they will appear here.
          </p>
        </Card>
      ) : (
        /* Timeline Agenda View */
        <div className="space-y-8">
          {Object.keys(groupedEvents).map((dateHeader) => (
            <div key={dateHeader} className="space-y-4">
              {/* Day Date Header */}
              <h3 className="text-sm font-bold tracking-wider text-primary uppercase border-l-2 border-primary pl-3">
                {dateHeader}
              </h3>

              {/* Event agenda items */}
              <div className="grid grid-cols-1 gap-4 pl-4 border-l border-white/5">
                {groupedEvents[dateHeader].map((event) => {
                  const isAi = isOperynEvent(event.description);
                  
                  return (
                    <div
                      key={event.id}
                      className={`group relative flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-5 rounded-2xl border transition-all duration-300 backdrop-blur-xl ${
                        isAi
                          ? "border-primary/20 bg-primary/[0.03] hover:bg-primary/[0.06]"
                          : "border-white/10 bg-white/5 hover:bg-white/[0.08]"
                      }`}
                    >
                      {/* Left Side: Time and Title details */}
                      <div className="space-y-2 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-bold text-white truncate">
                            {event.summary}
                          </span>
                          
                          {isAi && (
                            <span className="bg-primary/20 text-primary border border-primary/30 text-[9px] font-extrabold py-0 px-2 rounded-full uppercase tracking-wider flex items-center gap-1">
                              <Sparkles className="h-2.5 w-2.5" />
                              AI Action Event
                            </span>
                          )}
                        </div>

                        {/* Description */}
                        {event.description && (
                          <p className="text-xs text-muted-foreground leading-relaxed max-w-3xl line-clamp-2">
                            {event.description}
                          </p>
                        )}

                        {/* Location Details */}
                        {event.location && (
                          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-semibold">
                            <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                            <span className="truncate">{event.location}</span>
                          </div>
                        )}
                      </div>

                      {/* Right Side: Timing badge/pill */}
                      <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 md:border-l border-white/5 pt-3 md:pt-0 md:pl-5 shrink-0 gap-2">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          <span>
                            {getFormattedTime(event.start)}
                            {event.end && event.start.length > 10 && (
                              <> - {getFormattedTime(event.end)}</>
                            )}
                          </span>
                        </div>
                        <span className="text-[10px] text-muted-foreground font-medium">
                          Google Calendar Sync
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
