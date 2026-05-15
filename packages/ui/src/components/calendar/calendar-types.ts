export type AdminUser = {
  id: number;
  name: string;
  email?: string;
};

export type CandidateProfile = {
  id: number;
  name: string;
  email?: string | null;
  imageUrl?: string | null;
};

export type CalendarProps = {
  events: CalendarEvent[];
  setEvents: (events: CalendarEvent[]) => void;
  mode: Mode;
  setMode: (mode: Mode) => void;
  date: Date;
  setDate: (date: Date) => void;
  calendarIconIsToday?: boolean;
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
  children?: React.ReactNode;
};

export type CalendarContextType = CalendarProps & {
  selectedOrganizerIds: string[];
  setSelectedOrganizerIds: (ids: string[]) => void;
  filteredEvents: CalendarEvent[];
  forcedOpenEventId: string | null;
  setForcedOpenEventId: (eventId: string | null) => void;
};
export type CalendarEvent = {
  id: string;
  title: string;
  color: string;
  start: Date;
  end: Date;
  profile: {
    id: number;
    profileLink: string;
    firstName: string;
    lastName: string;
    imageUrl?: string;
  };
  organizer: {
    name: string;
    id: string;
  };
  participants?: {
    name: string;
    id: string;
  }[];
  meetingLink?: string | null;
};

export const calendarModes = ["day", "week", "month"] as const;
export type Mode = (typeof calendarModes)[number];
