import { type CalendarEvent as CalendarEventType } from "./calendar-types";
import { useCalendarContext } from "./calendar-context";
import { format, isSameDay, isSameMonth } from "date-fns";
import { cn } from "@comparesystem/ui/lib/utils";
import { motion, MotionConfig, AnimatePresence } from "framer-motion";
import CalendarEventPopover, {
  type CalendarEventPopoverRef,
} from "./popover/calendar-event-popover";
import { useRef, memo, useMemo } from "react";

interface EventPosition {
  left: string;
  width: string;
  top: string;
  height: string;
}

/**
 * Get the 30-minute time slot key for a given date
 * Returns a string like "09:00" for 9:00-9:30, "09:30" for 9:30-10:00, etc.
 */
export function getTimeSlotKey(date: Date): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  // Round down to nearest 30-minute slot
  const slotMinutes = minutes < 30 ? 0 : 30;
  return `${hours.toString().padStart(2, "0")}:${slotMinutes.toString().padStart(2, "0")}`;
}

/**
 * Group events by their 30-minute time slot
 */
export function groupEventsByTimeSlot(
  events: CalendarEventType[]
): Map<string, CalendarEventType[]> {
  const groups = new Map<string, CalendarEventType[]>();

  events.forEach((event) => {
    const slotKey = getTimeSlotKey(event.start);
    if (!groups.has(slotKey)) {
      groups.set(slotKey, []);
    }
    groups.get(slotKey)!.push(event);
  });

  return groups;
}

/**
 * Calculate position for a time slot group
 */
export function calculateGroupPosition(
  slotKey: string,
  allGroups: Map<string, CalendarEventType[]>
): { position: number; totalGroups: number } {
  // Get all groups for the same day and sort by time
  const sortedGroups = Array.from(allGroups.entries()).sort((a, b) => {
    const [hourA, minA] = a[0].split(":").map(Number);
    const [hourB, minB] = b[0].split(":").map(Number);
    return hourA * 60 + minA - (hourB * 60 + minB);
  });

  const position = sortedGroups.findIndex(([key]) => key === slotKey);
  const totalGroups = sortedGroups.length;

  return { position, totalGroups };
}

/**
 * Get grouped events with their group positions
 */
export function getGroupedEvents(events: CalendarEventType[]): Array<{
  slotKey: string;
  events: CalendarEventType[];
  position: number;
  totalGroups: number;
}> {
  const timeSlotGroups = groupEventsByTimeSlot(events);
  const sortedGroups = Array.from(timeSlotGroups.entries()).sort((a, b) => {
    const [hourA, minA] = a[0].split(":").map(Number);
    const [hourB, minB] = b[0].split(":").map(Number);
    return hourA * 60 + minA - (hourB * 60 + minB);
  });

  return sortedGroups.map(([slotKey, events], index) => ({
    slotKey,
    events,
    position: index,
    totalGroups: sortedGroups.length,
  }));
}

function calculatePosition(start: Date, end: Date): EventPosition {
  // Assume start of calendar at 8AM
  const CALENDAR_START_HOUR = 7;
  // Calculate top and height for the individual event
  const startHour = start.getHours();
  const startMinutes = start.getMinutes();

  let endHour = end.getHours();
  let endMinutes = end.getMinutes();

  if (!isSameDay(start, end)) {
    endHour = 23;
    endMinutes = 59;
  }

  // Adjust so that 8AM is top=0
  const topHourOffset = startHour - CALENDAR_START_HOUR;
  const topPosition =
    topHourOffset * 128 + (startMinutes / 60) * 128;

  const startTotalMinutes = startHour * 60 + startMinutes;
  const endTotalMinutes = endHour * 60 + endMinutes;
  const duration = endTotalMinutes - startTotalMinutes;
  const height = (duration / 60) * 128;

  return {
    left: "0%",
    width: "100%",
    top: `${topPosition}px`,
    height: `${height}px`,
  };
}

/**
 * Individual event component (used within a group)
 */
export const CalendarEventItem = memo(
  function CalendarEventItem({
    event,
    month = false,
    className,
    left,
    width,
    zIndex,
  }: {
    event: CalendarEventType;
    month?: boolean;
    className?: string;
    left: string;
    width: string;
    zIndex: number;
  }) {
    const { date } = useCalendarContext();
    const popoverRef = useRef<CalendarEventPopoverRef>(null);

    // Generate a unique key that includes the current month to prevent animation conflicts
    const isEventInCurrentMonth = isSameMonth(event.start, date);
    const animationKey = useMemo(
      () => `${event.id}-${isEventInCurrentMonth ? "current" : "adjacent"}`,
      [event.id, isEventInCurrentMonth]
    );

    const eventContent = (
      <MotionConfig reducedMotion="user">
        <AnimatePresence mode="wait">
          <motion.div
            className={cn(
              `shadow px-3 py-1.5 rounded-md truncate cursor-pointer transition-all duration-300 bg-${event.color}-500 hover:bg-${event.color}-700 border-[0.5px] border-white`,
              !month && "absolute",
              className
            )}
            style={{
              left,
              width,
              zIndex,
            }}
            // onClick={handleClick}
            initial={{
              y: -3,
              scale: 0.98,
            }}
            animate={{
              y: 0,
              scale: 1,
            }}
            exit={{
              scale: 0.98,
              transition: {
                duration: 0.15,
                ease: "easeOut",
              },
            }}
            transition={{
              duration: 0.2,
              ease: [0.25, 0.1, 0.25, 1],
              opacity: {
                duration: 0.2,
                ease: "linear",
              },
              layout: {
                duration: 0.2,
                ease: "easeOut",
              },
            }}
            layoutId={`event-${animationKey}-${month ? "month" : "day"}`}
          >
            <motion.div
              className={cn(
                `flex flex-col w-full text-white`,
                month && "flex-row items-center justify-between"
              )}
              layout="position"
            >
              <CalendarEventPopover side="top" ref={popoverRef} event={event}>
                <div className="flex flex-col">
                  <p className={cn("font-bold truncate", month && "text-xs")}>
                    {event.title}
                  </p>
                  <p className={cn("text-sm", month && "text-xs")}>
                    <span>{format(event.start, "h:mm a")}</span>
                    <span className={cn("mx-1", month && "hidden")}>-</span>
                    <span className={cn(month && "hidden")}>
                      {format(event.end, "h:mm a")}
                    </span>
                  </p>
                </div>
              </CalendarEventPopover>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </MotionConfig>
    );

    return eventContent;
  },
  (prevProps, nextProps) => {
    return (
      prevProps.event.id === nextProps.event.id &&
      prevProps.event.title === nextProps.event.title &&
      prevProps.event.start.getTime() === nextProps.event.start.getTime() &&
      prevProps.event.end.getTime() === nextProps.event.end.getTime() &&
      prevProps.left === nextProps.left &&
      prevProps.width === nextProps.width &&
      prevProps.zIndex === nextProps.zIndex &&
      prevProps.month === nextProps.month &&
      prevProps.className === nextProps.className
    );
  }
);

/**
 * Event group component that wraps all events in the same time slot
 */
export const CalendarEventGroup = memo(
  function CalendarEventGroup({ events }: { events: CalendarEventType[] }) {
    // Memoize position calculation
    const eventPosition = useMemo(
      () => calculatePosition(events[0].start, events[0].end),
      [events]
    );

    return (
      <div
        className="absolute"
        style={{
          width: "100%",
          top: eventPosition.top,
          height: eventPosition.height,
        }}
      >
        {events.map((event, index) => {
          const originalWidth = 100 / events.length;
          const width = originalWidth + (index > 0 ? 5 : 0);
          const left = `${index * originalWidth - (index > 0 ? 5 : 0)}%`;
          const itemWidth = `${width}%`;

          return (
            <CalendarEventItem
              key={event.id}
              left={left}
              width={itemWidth}
              event={event}
              zIndex={index}
            />
          );
        })}
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.events.length === nextProps.events.length &&
      prevProps.events.every(
        (event, idx) =>
          event.id === nextProps.events[idx]?.id &&
          event.start.getTime() === nextProps.events[idx]?.start.getTime()
      )
    );
  }
);
