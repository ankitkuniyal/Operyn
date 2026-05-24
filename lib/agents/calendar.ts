import type { calendar_v3 } from 'googleapis';

export interface CalendarEvent {
  id: string;
  summary: string;
  start: string;
  end: string;
  location?: string;
  description?: string;
}

export async function fetchUpcomingEvents(
  calendar: calendar_v3.Calendar,
  hoursAhead = 24
): Promise<CalendarEvent[]> {
  const now = new Date();
  const future = new Date(now.getTime() + hoursAhead * 60 * 60 * 1000);

  const response = await calendar.events.list({
    calendarId: 'primary',
    timeMin: now.toISOString(),
    timeMax: future.toISOString(),
    singleEvents: true,
    orderBy: 'startTime',
    maxResults: 20,
  });

  return (response.data.items ?? []).map((event) => ({
    id: event.id ?? '',
    summary: event.summary ?? 'No title',
    start: event.start?.dateTime ?? event.start?.date ?? '',
    end: event.end?.dateTime ?? event.end?.date ?? '',
    location: event.location ?? undefined,
    description: event.description ?? undefined,
  }));
}

export async function createCalendarEvent(
  calendar: calendar_v3.Calendar,
  event: {
    title: string;
    description: string;
    date: string;
    startTime: string | null;
    endTime: string | null;
  }
): Promise<string> {
  const isAllDay = !event.startTime;
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  let startDateTime = event.date; // Default fallback
  if (event.startTime) {
    const parsedStart = new Date(event.startTime);
    if (!isNaN(parsedStart.getTime())) {
      startDateTime = parsedStart.toISOString();
    } else {
      // If event.startTime is just a plain time string (e.g. "12:48 AM" or "10:00")
      // extract date part and combine
      const datePart = event.date.split('T')[0];
      const combined = new Date(`${datePart}T${event.startTime.padStart(5, '0')}`);
      if (!isNaN(combined.getTime())) {
        startDateTime = combined.toISOString();
      } else {
        // Attempt parsing standard 12-hour AM/PM formats
        const timeMatch = event.startTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
        if (timeMatch) {
          let [_, hoursStr, minutesStr, ampm] = timeMatch;
          let hours = parseInt(hoursStr, 10);
          const minutes = parseInt(minutesStr, 10);
          if (ampm && ampm.toUpperCase() === 'PM' && hours < 12) hours += 12;
          if (ampm && ampm.toUpperCase() === 'AM' && hours === 12) hours = 0;
          const combinedParsed = new Date(event.date);
          combinedParsed.setHours(hours, minutes, 0, 0);
          if (!isNaN(combinedParsed.getTime())) {
            startDateTime = combinedParsed.toISOString();
          }
        }
      }
    }
  }

  let endDateTime = event.endTime ? new Date(event.endTime).toISOString() : '';
  const parsedStart = new Date(startDateTime);
  if (!endDateTime || isNaN(new Date(endDateTime).getTime())) {
    // Default duration is 1 hour after start
    endDateTime = new Date(parsedStart.getTime() + 60 * 60 * 1000).toISOString();
  }

  const eventBody: calendar_v3.Schema$Event = {
    summary: event.title,
    description: event.description,
    start: isAllDay
      ? { date: event.date.split('T')[0] }
      : { dateTime: startDateTime, timeZone },
    end: isAllDay
      ? { date: event.date.split('T')[0] }
      : { dateTime: endDateTime, timeZone },
    reminders: {
      useDefault: false,
      overrides: [{ method: 'popup', minutes: 30 }],
    },
  };

  const response = await calendar.events.insert({
    calendarId: 'primary',
    requestBody: eventBody,
  });

  console.log(`[Agent] Created calendar event: "${event.title}"`);
  return response.data.id ?? '';
}