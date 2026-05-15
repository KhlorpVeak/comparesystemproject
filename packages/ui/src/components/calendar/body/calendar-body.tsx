import { useCalendarContext } from "../calendar-context";
import CalendarBodyDay from "./day/calendar-body-day";
import CalendarBodyWeek from "./week/calendar-body-week";
import CalendarBodyMonth from "./month/calendar-body-month";
import { forwardRef } from "react";

const CalendarBody = forwardRef<HTMLDivElement>((_, ref) => {
  const { mode } = useCalendarContext();

  return (
    <div className="flex-1 overflow-y-auto">
      {mode === "day" && <CalendarBodyDay ref={ref} />}
      {mode === "week" && <CalendarBodyWeek ref={ref} />}
      {mode === "month" && <CalendarBodyMonth />}
    </div>
  );
});

CalendarBody.displayName = "CalendarBody";

export default CalendarBody;
