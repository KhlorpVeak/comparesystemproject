import {
  useState,
  useImperativeHandle,
  forwardRef,
  useMemo,
  useCallback,
  memo,
  useEffect,
} from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@comparesystem/ui/components/ui/popover";
import { useCalendarContext } from "../calendar-context";
import { format } from "date-fns";
import {
  Pencil,
  Users,
  MessageCircle,
  List,
  Calendar as CalendarIcon,
  User,
} from "lucide-react";
import { type CalendarEvent } from "../calendar-types";
import { Avatar, AvatarImage, AvatarFallback } from "../../ui/avatar";

export interface CalendarEventPopoverRef {
  open: () => void;
  close: () => void;
}

// Color mapping - moved outside component to avoid recreation
const COLOR_MAP: Record<string, string> = {
  blue: "#3b82f6",
  indigo: "#6366f1",
  pink: "#ec4899",
  red: "#ef4444",
  orange: "#f97316",
  amber: "#f59e0b",
  emerald: "#10b981",
};

// Memoized popover content component - only renders when open
const PopoverContentInner = memo(
  ({
    event,
    onEdit,
  }: {
    event: CalendarEvent;
    onEdit: () => void;
  }) => {
    const formatEventTime = useCallback(() => {
      const dayName = format(event.start, "EEEE");
      const date = format(event.start, "MMMM d");
      const startTime = format(event.start, "h:mm");
      const endTime = format(event.end, "h:mm a");
      const startPeriod = format(event.start, "a");

      return `${dayName}, ${date} • ${startTime}${startPeriod === format(event.end, "a") ? "" : " " + startPeriod} – ${endTime}`;
    }, [event.start, event.end]);

    // Memoize guest data processing
    const guests = useMemo(() => {
      return Array.isArray(event?.participants)
        ? event.participants.map((participant: any, index) => ({
            id: participant.id,
            name: participant.name,
            isOrganizer: index === 0,
          }))
        : [];
    }, [event.participants, event.organizer]);

    const meetingLink = event.meetingLink || "";
    const calendarOwner =
      (event.organizer && event.organizer.name) || "Unknown";

    const indicatorColor =
      (event.organizer &&
        event.organizer.id &&
        COLOR_MAP[event.organizer.id]) ||
      (event.color && COLOR_MAP[event.color]) ||
      COLOR_MAP.blue;

    return (
      <div className="p-4 space-y-4">
        {/* Header with action buttons */}
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={onEdit}
            className="p-1.5 hover:bg-muted rounded-md transition-colors"
            aria-label="Edit event"
          >
            <Pencil className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        {/* Event Title and Time */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-sm flex-shrink-0"
              style={{ backgroundColor: indicatorColor }}
            />
            <h3 className="font-semibold text-base leading-tight line-clamp-2">
              {event.title}
            </h3>
          </div>
          <p className="text-sm text-muted-foreground pl-5">
            {formatEventTime()}
          </p>
        </div>

        {/* Guests Section */}
        {guests.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {guests.length} {guests.length === 1 ? "guest" : "guests"}
                </span>
              </div>
              <button className="p-1 hover:bg-muted rounded-md transition-colors">
                <MessageCircle className="h-4 w-4 text-red-500" />
              </button>
            </div>
            <div className="space-y-2 pl-6">
              {guests.map((guest, index: number) => (
                <div
                  key={guest.id ?? index}
                  className="flex items-center gap-3"
                >
                  <div className="relative">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor:
                          guest.isOrganizer && COLOR_MAP[event.organizer.id]
                            ? COLOR_MAP[event.organizer.id]
                            : "#e5e7eb",
                      }}
                    >
                      <span className="text-xs font-medium">
                        {guest.name?.[0] || "G"}
                      </span>
                    </div>
                    {guest.isOrganizer && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background flex items-center justify-center">
                        <span className="text-[8px] text-white">✓</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {guest.name || "Guest"}
                    </p>
                    {guest.isOrganizer && (
                      <p className="text-xs text-muted-foreground">Organizer</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Meeting Link/Description */}
        {meetingLink && (
          <div className="flex items-start gap-2">
            <List className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <a
              href={meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline break-all"
            >
              {meetingLink}
            </a>
          </div>
        )}

        {event.profile && (
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={event.profile.profileLink}
              className="flex items-center gap-2"
            >
              <Avatar className="w-6 h-6">
                <AvatarImage
                  className="object-cover"
                  src={event.profile.imageUrl}
                />
                <AvatarFallback>
                  {event.profile.firstName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-primary">
                {event.profile.firstName} {event.profile.lastName}
              </span>
            </a>
          </div>
        )}

        {/* Calendar/Owner Section */}
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <span className="text-sm text-muted-foreground">{calendarOwner}</span>
        </div>
      </div>
    );
  }
);

PopoverContentInner.displayName = "PopoverContentInner";

const CalendarEventPopover = forwardRef<
  CalendarEventPopoverRef,
  {
    triggerStyle?: React.CSSProperties;
    side?: "top" | "right" | "bottom" | "left";
    event: CalendarEvent;
    children: React.ReactNode;
  }
>(({ triggerStyle, side = "right", event, children }, ref) => {
  const {
    onEventClick,
    forcedOpenEventId,
    setForcedOpenEventId,
  } = useCalendarContext();
  const [isOpen, setIsOpen] = useState(false);

  useImperativeHandle(
    ref,
    () => ({
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
    }),
    []
  );

  // Open popover when forcedOpenEventId matches this event's id
  useEffect(() => {
    if (forcedOpenEventId === event.id && !isOpen) {
      setIsOpen(true);
    }
  }, [forcedOpenEventId, event.id, isOpen]);

  // Handle popover close - clear forced open state if it was set
  const handleOpenChange = useCallback((open: boolean) => {
    setIsOpen(open);
    if (!open && forcedOpenEventId === event.id) {
      setForcedOpenEventId(null);
    }
  }, [forcedOpenEventId, event.id, setForcedOpenEventId]);

  const handleEdit = useCallback(() => {
    onEventClick?.(event);
    setIsOpen(false);
  }, [event, onEventClick]);


  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <div style={triggerStyle}>{children}</div>
      </PopoverTrigger>
      {/* Only render content when popover is open - lazy loading */}
      {isOpen && (
        <PopoverContent
          className="w-80 p-0"
          side={side}
          align="start"
          onClick={(e) => e.stopPropagation()}
        >
          <PopoverContentInner
            event={event}
            onEdit={handleEdit}
          />
        </PopoverContent>
      )}
    </Popover>
  );
});

CalendarEventPopover.displayName = "CalendarEventPopover";

export default CalendarEventPopover;
