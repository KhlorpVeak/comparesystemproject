import { useCalendarContext } from "../../calendar-context";
import { isSameDay } from "date-fns";
import { hours } from "./calendar-body-margin-day-margin";
import CalendarBodyHeader from "../calendar-body-header";
import {
  CalendarEventGroup,
  getGroupedEvents,
} from "../../calendar-event-day-week";
import { useEffect, useMemo, useCallback } from "react";

export default function CalendarBodyDayContent({
  date,
  scrollContainerRef,
}: {
  date: Date;
  scrollContainerRef: React.RefObject<HTMLDivElement> | null;
}) {
  const { filteredEvents, onAddNewAppointmentClick } =
    useCalendarContext();

  // Memoize filtering and sorting - expensive operations
  const dayEvents = useMemo(
    () => filteredEvents.filter((event) => isSameDay(event.start, date)),
    [filteredEvents, date]
  );

  // Memoize sorting
  const sortedEvents = useMemo(
    () => [...dayEvents].sort((a, b) => a.start.getTime() - b.start.getTime()),
    [dayEvents]
  );

  // Memoize grouping - expensive operation
  const groupedEvents = useMemo(
    () => getGroupedEvents(sortedEvents),
    [sortedEvents]
  );

  // Auto-scroll to the first event when day view opens
  useEffect(() => {
    if (sortedEvents.length > 0 && scrollContainerRef?.current) {
      const firstEvent = sortedEvents[0];
      const startMinutes =
        firstEvent.start.getHours() * 60 + firstEvent.start.getMinutes();
      const scrollPosition = startMinutes * (128 / 60) - 100; // 100px offset from top

      // Use setTimeout to ensure the DOM is updated before scrolling
      setTimeout(() => {
        if (scrollContainerRef?.current) {
          scrollContainerRef.current.scrollTo({
            top: Math.max(0, scrollPosition),
            behavior: "smooth",
          });
        }
      }, 100);
    }
  }, [sortedEvents, date, scrollContainerRef]); // Re-run when events or date changes

  const handleTimeSlotClick = useCallback(
    (hour: number) => {
      const startTime = new Date(date);
      startTime.setHours(hour, 0, 0, 0);
      const endTime = new Date(date);
      endTime.setHours(hour, 30, 0, 0); // 30-minute slot

      onAddNewAppointmentClick?.({ timeRange: { start: startTime, end: endTime } });
    },
    [date, onAddNewAppointmentClick]
  );

  return (
    <div className="flex flex-col flex-grow">
      <CalendarBodyHeader date={date} />

      <div className="flex-1 relative">
        {hours.map((hour) => (
          <div
            key={hour}
            className="h-32 border-b border-border/50 group cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => handleTimeSlotClick(hour)}
          />
        ))}

        {groupedEvents.map((group) => (
          <CalendarEventGroup key={group.slotKey} events={group.events} />
        ))}
      </div>
    </div>
  );
}
