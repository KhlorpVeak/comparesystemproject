import type { CalendarEvent as CalendarEventType } from "./calendar-types";
import { useCalendarContext } from "./calendar-context";
import { format, isSameDay } from "date-fns";
import { cn } from "@comparesystem/ui/lib/utils";
import { motion, MotionConfig, AnimatePresence } from "framer-motion";
import CalendarEventPopover, { type CalendarEventPopoverRef } from "./popover/calendar-event-popover";
import { useRef } from "react";

interface EventStack {
  events: CalendarEventType[];
  startTime: Date;
  endTime: Date;
}

interface EventPosition {
  left: string;
  width: string;
  top: string;
  height: string;
}

function calculateEventStackPosition(
  eventStack: EventStack,
  allEventStacks: EventStack[]
): EventPosition {
  // Find the index of this stack among all stacks
  const stackIndex = allEventStacks.findIndex(stack => 
    stack.startTime.getTime() === eventStack.startTime.getTime()
  );
  
  // Calculate position - each stack takes full width but is offset vertically
  const width = "100%";
  const left = "0%";

  // Calculate top position based on start time
  const startMinutes = eventStack.startTime.getHours() * 60 + eventStack.startTime.getMinutes();
  const topPosition = startMinutes * (128 / 60); // 128px per hour, 60 minutes

  // Calculate height based on duration
  const endMinutes = eventStack.endTime.getHours() * 60 + eventStack.endTime.getMinutes();
  const durationMinutes = endMinutes - startMinutes;
  const height = durationMinutes * (128 / 60);

  return {
    left,
    width,
    top: `${topPosition}px`,
    height: `${height}px`,
  };
}

export default function CalendarEventStack({
  eventStack,
  allEventStacks,
  className,
}: {
  eventStack: EventStack;
  allEventStacks: EventStack[];
  className?: string;
}) {
  const style = calculateEventStackPosition(eventStack, allEventStacks);
  const eventCount = eventStack.events.length;
  const eventPopoverRefs = useRef<Map<string, CalendarEventPopoverRef>>(new Map());

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence mode="wait">
        <motion.div
          className={cn(
            "absolute rounded-lg transition-all duration-300 shadow-sm hover:shadow-md",
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
          <div className="h-full flex flex-col">
            {/* Header with time and event count */}
            <div className="p-2 bg-primary/5 border-b border-primary/20 rounded-t-lg">
              <div className="text-center">
                <p className="text-sm font-semibold text-primary">
                  {format(eventStack.startTime, "h:mm a")}
                </p>
                <p className="text-xs text-primary/70 mt-1">
                  {eventCount} event{eventCount !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            
            {/* Horizontal deck of cards */}
            <div className="flex-1 p-2 overflow-x-auto scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
              <div className="flex gap-2 h-full">
                {eventStack.events.map((event, index) => {
                  const eventCard = (
                    <motion.div
                      className={cn(
                        "flex-shrink-0 w-32 h-full rounded-lg cursor-pointer transition-all duration-200 hover:shadow-lg border border-transparent hover:border-muted-foreground/20",
                        `border-t-4 border-${event.color}-500`,
                        "bg-white/90 backdrop-blur-sm shadow-sm"
                      )}
                      onClick={() => {
                        const ref = eventPopoverRefs.current.get(event.id);
                        ref?.open();
                      }}
                      initial={{ opacity: 0, x: -20, rotateY: -15 }}
                      animate={{ opacity: 1, x: 0, rotateY: 0 }}
                      transition={{ 
                        delay: index * 0.1,
                        type: "spring",
                        stiffness: 100,
                        damping: 15
                      }}
                      whileHover={{ 
                        scale: 1.05,
                        rotateY: 5,
                        z: 10
                      }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        transformStyle: "preserve-3d",
                        zIndex: eventStack.events.length - index
                      }}
                    >
                      <div className="p-3 h-full flex flex-col justify-between">
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`size-2 rounded-full bg-${event.color}-500 flex-shrink-0`} />
                          <div className="text-xs font-medium text-muted-foreground truncate">
                            {format(event.start, "h:mm")}
                          </div>
                        </div>
                        
                        <div className="flex-1 flex flex-col justify-center">
                          <p className="font-medium text-sm leading-tight text-center line-clamp-3">
                            {event.title}
                          </p>
                        </div>
                        
                        <div className="text-xs text-muted-foreground text-center mt-2">
                          {format(event.end, "h:mm")}
                        </div>
                      </div>
                    </motion.div>
                  );

                  return (
                    <CalendarEventPopover
                      key={event.id}
                      ref={(ref) => {
                        if (ref) {
                          eventPopoverRefs.current.set(event.id, ref);
                        }
                      }}
                      event={event}
                    >
                      {eventCard}
                    </CalendarEventPopover>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </MotionConfig>
  );
}
