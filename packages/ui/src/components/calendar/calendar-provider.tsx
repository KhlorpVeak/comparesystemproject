import { CalendarContext } from "./calendar-context";
import type { CalendarEvent, Mode } from "./calendar-types";
import { useState, useEffect, useRef } from "react";
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";

export default function CalendarProvider({
  events,
  setEvents,
  mode,
  setMode,
  date,
  setDate,
  calendarIconIsToday = true,
  onDateRangeChange,
  onDateNavigate,
  onAddNewAppointmentClick,
  onEventClick,
  children,
}: {
  events: CalendarEvent[];
  setEvents: (events: CalendarEvent[]) => void;
  mode: Mode;
  setMode: (mode: Mode) => void;
  date: Date;
  setDate: (date: Date) => void;
  calendarIconIsToday: boolean;
  onDateRangeChange?: (params: {
    startDate: Date;
    endDate: Date;
    mode: Mode;
  }) => void | Promise<void>;
  onDateNavigate?: (params: {
    date: Date;
    mode: Mode;
  }) => void;
  onAddNewAppointmentClick?: (params?: {
    timeRange?: { start: Date; end: Date };
  }) => void;
  onEventClick?: (event: CalendarEvent) => void;
  children: React.ReactNode;
}) {
  const [selectedOrganizerIds, setSelectedOrganizerIds] = useState<string[]>(
    []
  );
  const [forcedOpenEventId, setForcedOpenEventId] = useState<string | null>(
    null
  );

  // Track previous values to detect changes
  const prevModeRef = useRef<Mode>(mode);
  const prevDateRef = useRef<Date>(date);

  // Helper function to calculate date range based on mode
  const getDateRange = (currentDate: Date, currentMode: Mode) => {
    switch (currentMode) {
      case "day":
        return {
          startDate: startOfDay(currentDate),
          endDate: endOfDay(currentDate),
        };
      case "week":
        return {
          startDate: startOfWeek(currentDate, { weekStartsOn: 1 }),
          endDate: endOfWeek(currentDate, { weekStartsOn: 1 }),
        };
      case "month":
        return {
          startDate: startOfMonth(currentDate),
          endDate: endOfMonth(currentDate),
        };
      default:
        return {
          startDate: startOfDay(currentDate),
          endDate: endOfDay(currentDate),
        };
    }
  };

  // Effect to detect date range changes and trigger event fetching
  useEffect(() => {
    const hasModeChanged = prevModeRef.current !== mode;
    const hasDateChanged = prevDateRef.current.getTime() !== date.getTime();

    if ((hasModeChanged || hasDateChanged) && onDateRangeChange) {
      const { startDate, endDate } = getDateRange(date, mode);

      // Call the event fetching function
      onDateRangeChange({
        startDate,
        endDate,
        mode,
      });

      // Update refs
      prevModeRef.current = mode;
      prevDateRef.current = date;
    }
  }, [mode, date, onDateRangeChange]);

  // Effect to select all organizers by default when events change
  useEffect(() => {
    // Extract unique organizer IDs from events
    const organizerIds = new Set<string>();
    events.forEach((event) => {
      if (event.organizer.id) {
        organizerIds.add(event.organizer.id);
      }
    });

    const allOrganizerIds = Array.from(organizerIds);

    // If no organizers are currently selected, select all
    if (selectedOrganizerIds.length === 0 && allOrganizerIds.length > 0) {
      setSelectedOrganizerIds(allOrganizerIds);
    } else if (selectedOrganizerIds.length > 0) {
      // Add any new organizers that aren't already selected
      const newOrganizers = allOrganizerIds.filter(
        (id) => !selectedOrganizerIds.includes(id)
      );
      if (newOrganizers.length > 0) {
        setSelectedOrganizerIds((prev) => [...prev, ...newOrganizers]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events]);

  // Filter events based on selected organizer IDs
  // If all organizers are selected (or none selected), show all events
  const allOrganizerIds = new Set(
    events.map((e) => e.organizer.id).filter(Boolean)
  );
  const filteredEvents =
    selectedOrganizerIds.length === 0 ||
    selectedOrganizerIds.length === allOrganizerIds.size
      ? events
      : events.filter((event) =>
          selectedOrganizerIds.includes(event.organizer.id)
        );

  return (
    <CalendarContext.Provider
      value={{
        events,
        setEvents,
        mode,
        setMode,
        date,
        setDate,
        calendarIconIsToday,
        onDateRangeChange,
        onDateNavigate,
        onAddNewAppointmentClick,
        onEventClick,
        selectedOrganizerIds,
        setSelectedOrganizerIds,
        filteredEvents,
        forcedOpenEventId,
        setForcedOpenEventId,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
}
