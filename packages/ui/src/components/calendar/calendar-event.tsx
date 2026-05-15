import type { CalendarEvent as CalendarEventType } from "./calendar-types";
import { useCalendarContext } from "./calendar-context";
import { isSameDay, isSameMonth } from "date-fns";
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

function getOverlappingEvents(
  currentEvent: CalendarEventType,
  events: CalendarEventType[]
): CalendarEventType[] {
  return events.filter((event) => {
    if (event.id === currentEvent.id) return false;
    return (
      currentEvent.start < event.end &&
      currentEvent.end > event.start &&
      isSameDay(currentEvent.start, event.start)
    );
  });
}

function calculateEventPosition(
  event: CalendarEventType,
  allEvents: CalendarEventType[]
): EventPosition {
  // Get all events that overlap with this event
  const overlappingEvents = getOverlappingEvents(event, allEvents);
  const group = [event, ...overlappingEvents].sort(
    (a, b) => a.start.getTime() - b.start.getTime()
  );
  const position = group.indexOf(event);

  // Each event takes full width
  const width = "100%";
  const left = "0%";

  const startHour = event.start.getHours();
  const startMinutes = event.start.getMinutes();

  let endHour = event.end.getHours();
  let endMinutes = event.end.getMinutes();

  if (!isSameDay(event.start, event.end)) {
    endHour = 23;
    endMinutes = 59;
  }

  // Base top position from start time
  const baseTopPosition = startHour * 128 + (startMinutes / 60) * 128;

  // Calculate vertical offset for stacking based on cumulative height of previous events
  let stackOffset = 0;
  for (let i = 0; i < position; i++) {
    const prevEvent = group[i];
    const prevStartHour = prevEvent.start.getHours();
    const prevStartMinutes = prevEvent.start.getMinutes();
    let prevEndHour = prevEvent.end.getHours();
    let prevEndMinutes = prevEvent.end.getMinutes();

    if (!isSameDay(prevEvent.start, prevEvent.end)) {
      prevEndHour = 23;
      prevEndMinutes = 59;
    }

    const prevDuration =
      prevEndHour * 60 +
      prevEndMinutes -
      (prevStartHour * 60 + prevStartMinutes);
    const prevHeight = (prevDuration / 60) * 128;
    stackOffset += prevHeight + 4; // Add 4px gap between stacked events
  }

  const topPosition = baseTopPosition + stackOffset;

  const duration = endHour * 60 + endMinutes - (startHour * 60 + startMinutes);
  const height = (duration / 60) * 128;

  return {
    left,
    width,
    top: `${topPosition}px`,
    height: `${height}px`,
  };
}

const CalendarEvent = memo(
  function CalendarEvent({
    event,
    month = false,
    className,
  }: {
    event: CalendarEventType;
    month?: boolean;
    className?: string;
  }) {
    const { events, date } = useCalendarContext();

    // Memoize position calculation
    const style = useMemo(() => {
      return month ? {} : calculateEventPosition(event, events);
    }, [month, event, events]);

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
              `px-3 py-1.5 rounded-md truncate cursor-pointer transition-all duration-300 bg-${event.color}-500/10 hover:bg-${event.color}-500/20 border border-${event.color}-500`,
              !month && "absolute",
              className
            )}
            style={style}
            onClick={(e) => {
              e.stopPropagation();
              popoverRef.current?.open();
            }}
            initial={{
              opacity: 0,
              y: -3,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
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
                `flex flex-col w-full text-${event.color}-500`,
                month && "flex-row items-center justify-between"
              )}
              layout="position"
            >
              <p className={cn("font-bold truncate", month && "text-xs")}>
                {event.title}
              </p>
              {/* <p className={cn("text-sm", month && "text-xs")}>
              <span>{format(event.start, "h:mm a")}</span>
              <span className={cn("mx-1", month && "hidden")}>-</span>
              <span className={cn(month && "hidden")}>
                {format(event.end, "h:mm a")}
              </span>
            </p> */}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </MotionConfig>
    );

    return (
      <CalendarEventPopover ref={popoverRef} event={event}>
        {eventContent}
      </CalendarEventPopover>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison for memo - only re-render if event data changes
    return (
      prevProps.event.id === nextProps.event.id &&
      prevProps.event.title === nextProps.event.title &&
      prevProps.event.start.getTime() === nextProps.event.start.getTime() &&
      prevProps.event.end.getTime() === nextProps.event.end.getTime() &&
      prevProps.event.color === nextProps.event.color &&
      prevProps.month === nextProps.month &&
      prevProps.className === nextProps.className
    );
  }
);

export default CalendarEvent;
