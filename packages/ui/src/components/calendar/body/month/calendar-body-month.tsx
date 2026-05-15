import { useCalendarContext } from "../../calendar-context";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  format,
  isWithinInterval,
} from "date-fns";
import { cn } from "@comparesystem/ui/lib/utils";
import CalendarEvent from "../../calendar-event";
import { AnimatePresence, motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@comparesystem/ui/components/ui/popover";
import { Button } from "@comparesystem/ui/components/ui/button";
import CalendarOrganizers from "../../calendar-organizers";

export default function CalendarBodyMonth() {
  const { date, filteredEvents, onAddNewAppointmentClick } =
    useCalendarContext();
  const gridRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [rowHeight, setRowHeight] = useState<string>("1fr");
  const [scrollbarWidth, setScrollbarWidth] = useState<number>(0);

  // Get the first day of the month
  const monthStart = startOfMonth(date);
  // Get the last day of the month
  const monthEnd = endOfMonth(date);

  // Get the first Monday of the first week (may be in previous month)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  // Get the last Sunday of the last week (may be in next month)
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  // Get all days between start and end
  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  const today = new Date();

  // Calculate row height to match column width and scrollbar width
  useEffect(() => {
    const calculateRowHeight = () => {
      if (!gridRef.current) return;

      const gridWidth = gridRef.current.clientWidth;
      const columnWidth = gridWidth / 7; // 7 columns
      setRowHeight(`${columnWidth}px`);
    };

    const calculateScrollbarWidth = () => {
      if (!scrollContainerRef.current) return;

      const container = scrollContainerRef.current;
      // Calculate scrollbar width by comparing offsetWidth and clientWidth
      // This accounts for the scrollbar taking up space
      const hasScrollbar = container.scrollHeight > container.clientHeight;
      if (hasScrollbar) {
        const scrollbarWidth = container.offsetWidth - container.clientWidth;
        setScrollbarWidth(scrollbarWidth);
      } else {
        setScrollbarWidth(0);
      }
    };

    calculateRowHeight();

    // Delay scrollbar calculation to ensure DOM is fully rendered
    setTimeout(() => {
      calculateScrollbarWidth();
    }, 100);

    const resizeObserver = new ResizeObserver(() => {
      calculateRowHeight();
      // Small delay for scrollbar calculation after resize
      setTimeout(() => {
        calculateScrollbarWidth();
      }, 50);
    });

    if (gridRef.current) {
      resizeObserver.observe(gridRef.current);
    }
    if (scrollContainerRef.current) {
      resizeObserver.observe(scrollContainerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [monthStart]);

  // Filter events to only show those within the current month view
  const visibleEvents = filteredEvents.filter(
    (event) =>
      isWithinInterval(event.start, {
        start: calendarStart,
        end: calendarEnd,
      }) ||
      isWithinInterval(event.end, { start: calendarStart, end: calendarEnd })
  );

  // Helper function to find the next available 30-minute slot
  const findNextAvailableSlot = (selectedDay: Date) => {
    const dayEvents = filteredEvents.filter((event) =>
      isSameDay(event.start, selectedDay)
    );

    // Sort events by start time
    const sortedEvents = dayEvents.sort(
      (a, b) => a.start.getTime() - b.start.getTime()
    );

    // Start from 9 AM
    let currentTime = new Date(selectedDay);
    currentTime.setHours(9, 0, 0, 0);

    // Check each 30-minute slot from 9 AM to 5 PM
    for (let hour = 9; hour < 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const slotStart = new Date(selectedDay);
        slotStart.setHours(hour, minute, 0, 0);
        const slotEnd = new Date(slotStart);
        slotEnd.setMinutes(slotEnd.getMinutes() + 30);

        // Check if this slot conflicts with any existing event
        const hasConflict = sortedEvents.some((event) => {
          return (
            (slotStart >= event.start && slotStart < event.end) ||
            (slotEnd > event.start && slotEnd <= event.end) ||
            (slotStart <= event.start && slotEnd >= event.end)
          );
        });

        if (!hasConflict) {
          return { start: slotStart, end: slotEnd };
        }
      }
    }

    // If no slot found, default to 9 AM - 9:30 AM
    const defaultStart = new Date(selectedDay);
    defaultStart.setHours(9, 0, 0, 0);
    const defaultEnd = new Date(defaultStart);
    defaultEnd.setMinutes(30, 0, 0);

    return { start: defaultStart, end: defaultEnd };
  };

  return (
    <div className="flex divide-x h-full">
      <div className="lg:flex hidden flex-col flex-1 divide-y max-w-[200px]">
        <CalendarOrganizers />
      </div>
      <div className="flex flex-col flex-1 divide-y">
        <div
          ref={headerRef}
          className="hidden md:grid grid-cols-7 border-border divide-x divide-border sticky top-0 z-10 bg-background flex-shrink-0"
          style={{
            paddingRight: scrollbarWidth > 0 ? `${scrollbarWidth}px` : 0,
          }}
        >
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <div
              key={day}
              className="py-2 text-center text-sm font-medium text-muted-foreground border-b border-border"
            >
              {day}
            </div>
          ))}
        </div>

        <div
          ref={scrollContainerRef}
          className="flex-1 min-h-0 overflow-y-auto"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              ref={gridRef}
              key={monthStart.toISOString()}
              className="grid md:grid-cols-7 relative"
              style={{
                gridAutoRows: rowHeight,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.2,
                ease: "easeInOut",
              }}
            >
              {calendarDays.map((day) => {
                const dayEvents = visibleEvents.filter((event) =>
                  isSameDay(event.start, day)
                );
                const isToday = isSameDay(day, today);
                const isCurrentMonth = isSameMonth(day, date);

                return (
                  <DayCell
                    key={day.toISOString()}
                    day={day}
                    dayEvents={dayEvents}
                    isToday={isToday}
                    isCurrentMonth={isCurrentMonth}
                    findNextAvailableSlot={findNextAvailableSlot}
                    onAddNewAppointmentClick={onAddNewAppointmentClick}
                  />
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function DayCell({
  day,
  dayEvents,
  isToday,
  isCurrentMonth,
  findNextAvailableSlot,
  onAddNewAppointmentClick,
}: {
  day: Date;
  dayEvents: any[];
  isToday: boolean;
  isCurrentMonth: boolean;
  findNextAvailableSlot: (day: Date) => { start: Date; end: Date };
  onAddNewAppointmentClick?: (params?: {
    timeRange?: { start: Date; end: Date };
  }) => void;
}) {
  const cellRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLDivElement>(null);
  const eventsContainerRef = useRef<HTMLDivElement>(null);
  const measureContainerRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(dayEvents.length);
  const [availableHeight, setAvailableHeight] = useState(0);

  useEffect(() => {
    const calculateVisibleEvents = () => {
      if (!cellRef.current || !dateRef.current) {
        return;
      }

      const cellHeight = cellRef.current.clientHeight;
      const dateHeight = dateRef.current.offsetHeight;
      const padding = 16; // p-2 = 8px top + 8px bottom
      const gap = 4; // gap-1 = 4px
      const moreButtonHeight = 28; // Height for "more" button with padding

      const calculatedAvailableHeight = cellHeight - dateHeight - padding - gap;

      setAvailableHeight(calculatedAvailableHeight);

      // Use a timeout to ensure DOM is updated after render
      setTimeout(() => {
        if (!measureContainerRef.current) {
          return;
        }

        // Measure each event's height from the hidden measurement container
        // Access the nested structure: measureContainer > wrapper > events container > events
        const wrapper = measureContainerRef.current.children[0] as HTMLElement;
        if (!wrapper) return;

        const eventsContainer = wrapper.children[1] as HTMLElement;
        if (!eventsContainer) return;

        const eventElements = eventsContainer.children;
        let totalHeight = 0;
        let count = 0;

        for (let i = 0; i < eventElements.length; i++) {
          const eventElement = eventElements[i] as HTMLElement;
          const eventHeight = eventElement.offsetHeight || 0;
          const heightWithGap = totalHeight + eventHeight + (i > 0 ? gap : 0);

          // Check if there are more events after this one
          const hasMoreEvents = i < eventElements.length - 1;

          // Always reserve space for "More" button if there are hidden events
          // This ensures we show events until before the last one that would fit
          const requiredHeight = hasMoreEvents
            ? heightWithGap + moreButtonHeight + gap
            : heightWithGap;

          // Only add this event if it fits (including space for "More" button if needed)
          if (requiredHeight <= calculatedAvailableHeight) {
            totalHeight = heightWithGap;
            count = i + 1;
          } else {
            // Stop before this event to ensure "More" button fits
            break;
          }
        }

        setVisibleCount(Math.max(0, count));
      }, 0);
    };

    // Calculate on mount and when events change
    calculateVisibleEvents();

    // Recalculate on window resize
    const resizeObserver = new ResizeObserver(() => {
      calculateVisibleEvents();
    });

    if (cellRef.current) {
      resizeObserver.observe(cellRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [dayEvents.length, dayEvents]);

  const visibleEvents = dayEvents.slice(0, visibleCount);
  const hiddenEvents = dayEvents.slice(visibleCount);
  const hasMoreEvents = hiddenEvents.length > 0;

  return (
    <div
      ref={cellRef}
      className={cn(
        "relative flex flex-col border-b border-r p-2 cursor-pointer overflow-hidden",
        !isCurrentMonth && "bg-muted/50 hidden md:flex"
      )}
      style={{
        width: "100%",
        aspectRatio: "1/1",
      }}
      onClick={(e) => {
        e.stopPropagation();
        // Find the next available 30-minute slot for the clicked day
        const timeRange = findNextAvailableSlot(day);
        onAddNewAppointmentClick?.({ timeRange });
      }}
    >
      <div
        ref={dateRef}
        className={cn(
          "text-sm font-medium w-fit p-1 flex flex-col items-center justify-center rounded-full aspect-square flex-shrink-0",
          isToday && "bg-primary text-background"
        )}
      >
        {format(day, "d")}
      </div>
      {/* Hidden container to measure event heights */}
      <div
        ref={measureContainerRef}
        className="absolute opacity-0 pointer-events-none -z-10 w-full"
        style={{ visibility: "hidden", top: 0, left: 0 }}
      >
        <div className="flex flex-col gap-1 p-2">
          <div className="h-8" /> {/* Spacer for date */}
          <div className="flex flex-col gap-1 mt-1">
            {dayEvents.map((event) => (
              <CalendarEvent
                key={`measure-${event.id}`}
                event={event}
                className="relative h-auto flex-shrink-0"
                month
              />
            ))}
          </div>
        </div>
      </div>

      <div
        className="flex flex-col gap-1 mt-1 flex-1 min-h-0"
        style={{
          maxHeight: `${availableHeight}px`,
          overflow: "hidden",
        }}
      >
        <div ref={eventsContainerRef} className="flex flex-col gap-1">
          <AnimatePresence mode="wait">
            {visibleEvents.map((event) => (
              <CalendarEvent
                key={event.id}
                event={event}
                className="relative h-auto flex-shrink-0"
                month
              />
            ))}
          </AnimatePresence>
        </div>
        {hasMoreEvents && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs text-muted-foreground hover:text-foreground w-full justify-start px-2 flex-shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                +{hiddenEvents.length} more
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-80 p-0 max-h-[400px] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 pb-2 flex-shrink-0">
                <h3 className="font-semibold text-sm">
                  {format(day, "EEEE, MMMM d")}
                </h3>
              </div>
              <div className="flex flex-col gap-2 px-4 pb-4 overflow-y-auto flex-1 min-h-0">
                {dayEvents.map((event) => (
                  <CalendarEvent
                    key={event.id}
                    event={event}
                    className="relative"
                    month
                  />
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  );
}
