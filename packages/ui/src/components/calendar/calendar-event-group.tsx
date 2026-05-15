import type { CalendarEvent as CalendarEventType } from "./calendar-types";
import { useCalendarContext } from "./calendar-context";
import { format, isSameDay } from "date-fns";
import { cn } from "@comparesystem/ui/lib/utils";
import { motion, MotionConfig, AnimatePresence } from "framer-motion";
import { useState, useRef, memo, useMemo, useCallback } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import CalendarEventPopover, {
  type CalendarEventPopoverRef,
} from "./popover/calendar-event-popover";

interface EventGroup {
  slotKey: string;
  slotStartMinutes: number;
  hour: number;
  minute: number;
  events: CalendarEventType[];
}

interface EventPosition {
  left: string;
  width: string;
  top: string;
  height: string;
}

function calculateEventGroupPosition(
  eventGroup: EventGroup,
  allEventGroups: EventGroup[]
): EventPosition {
  // Position each group to take the full width of its 30-minute slot
  const width = "100%";
  const left = "0%";

  // Calculate position based on 30-minute slots (64px per slot)
  const topPosition = eventGroup.slotStartMinutes * (128 / 60); // 128px per hour, 60 minutes
  const height = "64px"; // 30-minute slot height

  return {
    left,
    width,
    top: `${topPosition}px`,
    height,
  };
}

// Memoized event item component to prevent unnecessary re-renders
const EventListItem = memo(
  ({
    event,
    onEventClick,
  }: {
    event: CalendarEventType;
    onEventClick: (eventId: string) => void;
  }) => {
    const colorMap: Record<string, string> = {
      blue: "blue",
      indigo: "indigo",
      pink: "pink",
      red: "red",
      orange: "orange",
      amber: "amber",
      emerald: "emerald",
    };

    const eventColor = colorMap[event.color] || "blue";

    return (
      <div
        className={cn(
          "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-muted/50 border border-transparent hover:border-muted-foreground/20",
          `border-l-4 border-${eventColor}-500`
        )}
        onClick={(e) => {
          e.stopPropagation();
          onEventClick(event.id);
        }}
      >
        <div
          className={`size-3 rounded-full bg-${eventColor}-500 flex-shrink-0`}
        />
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{event.title}</p>
          <p className="text-xs text-muted-foreground">
            {format(event.start, "h:mm a")} - {format(event.end, "h:mm a")}
          </p>
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.event.id === nextProps.event.id &&
      prevProps.event.title === nextProps.event.title &&
      prevProps.event.start.getTime() === nextProps.event.start.getTime() &&
      prevProps.event.end.getTime() === nextProps.event.end.getTime()
    );
  }
);

EventListItem.displayName = "EventListItem";

const CalendarEventGroup = memo(
  function CalendarEventGroup({
    eventGroup,
    allEventGroups,
    className,
  }: {
    eventGroup: EventGroup;
    allEventGroups: EventGroup[];
    className?: string;
  }) {
    const { date, onAddNewAppointmentClick } =
      useCalendarContext();
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const eventPopoverRefs = useRef<Map<string, CalendarEventPopoverRef>>(
      new Map()
    );

    // Memoize position calculation
    const style = useMemo(
      () => calculateEventGroupPosition(eventGroup, allEventGroups),
      [eventGroup, allEventGroups]
    );

    const eventCount = eventGroup.events.length;

    const handleNewEvent = useCallback(() => {
      const startTime = new Date(date);
      startTime.setHours(eventGroup.hour, eventGroup.minute, 0, 0);
      const endTime = new Date(date);
      endTime.setHours(eventGroup.hour, eventGroup.minute + 30, 0, 0);

      onAddNewAppointmentClick?.({ timeRange: { start: startTime, end: endTime } });
      setIsPopoverOpen(false);
    }, [
      date,
      eventGroup.hour,
      eventGroup.minute,
      onAddNewAppointmentClick,
    ]);

    const handleEventClick = useCallback((eventId: string) => {
      const ref = eventPopoverRefs.current.get(eventId);
      if (ref) {
        ref.open();
      }
      setIsPopoverOpen(false);
    }, []);

    return (
      <MotionConfig reducedMotion="user">
        <AnimatePresence mode="wait">
          <motion.div
            className={cn(
              "absolute rounded-lg cursor-pointer transition-all duration-300 border-2 border-dashed border-primary/30 hover:border-primary/50 bg-primary/5 hover:bg-primary/10 shadow-sm hover:shadow-md",
              className
            )}
            style={style}
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
          >
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <div className="p-4 h-full flex flex-col items-center justify-center">
                  <div className="text-center">
                    <p className="text-sm font-semibold text-primary">
                      {format(
                        new Date().setHours(
                          eventGroup.hour,
                          eventGroup.minute,
                          0,
                          0
                        ),
                        "h:mm a"
                      )}
                    </p>
                    <p className="text-xs text-primary/70 mt-1">
                      {eventCount} event{eventCount !== 1 ? "s" : ""}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1 justify-center">
                      {eventGroup.events.slice(0, 3).map((event, index) => (
                        <div
                          key={event.id}
                          className={cn(
                            "w-2 h-2 rounded-full",
                            `bg-${event.color}-500`
                          )}
                        />
                      ))}
                      {eventCount > 3 && (
                        <div className="w-2 h-2 rounded-full bg-muted-foreground/50" />
                      )}
                    </div>
                  </div>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0 max-h-96" align="start">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <h4 className="font-semibold text-sm">
                        Events at{" "}
                        {format(
                          new Date().setHours(
                            eventGroup.hour,
                            eventGroup.minute,
                            0,
                            0
                          ),
                          "h:mm a"
                        )}
                      </h4>
                    </div>
                    <button
                      onClick={handleNewEvent}
                      className="px-3 py-1.5 text-xs font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-md transition-colors border border-primary/20 hover:border-primary/30"
                    >
                      + New Event
                    </button>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
                    {eventGroup.events.map((event) => (
                      <CalendarEventPopover
                        key={event.id}
                        ref={(ref) => {
                          if (ref) {
                            eventPopoverRefs.current.set(event.id, ref);
                          } else {
                            eventPopoverRefs.current.delete(event.id);
                          }
                        }}
                        event={event}
                      >
                        <EventListItem
                          event={event}
                          onEventClick={handleEventClick}
                        />
                      </CalendarEventPopover>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </motion.div>
        </AnimatePresence>
      </MotionConfig>
    );
  },
  (prevProps, nextProps) => {
    // Only re-render if event group data actually changes
    return (
      prevProps.eventGroup.slotKey === nextProps.eventGroup.slotKey &&
      prevProps.eventGroup.events.length ===
        nextProps.eventGroup.events.length &&
      prevProps.eventGroup.events.every(
        (event, idx) =>
          event.id === nextProps.eventGroup.events[idx]?.id &&
          event.start.getTime() ===
            nextProps.eventGroup.events[idx]?.start.getTime()
      ) &&
      prevProps.className === nextProps.className
    );
  }
);

export default CalendarEventGroup;
