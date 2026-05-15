import type { CalendarProps } from "./calendar-types";
import CalendarHeader from "./header/calendar-header";
import CalendarBody from "./body/calendar-body";
import CalendarHeaderActions from "./header/actions/calendar-header-actions";
import CalendarHeaderDate from "./header/date/calendar-header-date";
import CalendarHeaderActionsMode from "./header/actions/calendar-header-actions-mode";
import CalendarHeaderActionsAdd from "./header/actions/calendar-header-actions-add";
import CalendarProvider from "./calendar-provider";
import { forwardRef } from "react";

export const Calendar = forwardRef<HTMLDivElement, CalendarProps>(({
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
}, ref) => {
  return (
    <CalendarProvider
      events={events}
      setEvents={setEvents}
      mode={mode}
      setMode={setMode}
      date={date}
      setDate={setDate}
      calendarIconIsToday={calendarIconIsToday}
      onDateRangeChange={onDateRangeChange}
      onDateNavigate={onDateNavigate}
      onAddNewAppointmentClick={onAddNewAppointmentClick}
      onEventClick={onEventClick}
    >
      <div className="flex flex-col h-full max-h-screen">
        <CalendarHeader>
          <CalendarHeaderDate />
          <CalendarHeaderActions>
            <CalendarHeaderActionsMode />
            <CalendarHeaderActionsAdd />
          </CalendarHeaderActions>
        </CalendarHeader>
        <CalendarBody ref={ref} />
      </div>
      {children}
    </CalendarProvider>
  );
});

Calendar.displayName = 'Calendar';
