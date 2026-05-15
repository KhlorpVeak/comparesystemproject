import CalendarBodyDayCalendar from "./calendar-body-day-calendar";
import CalendarOrganizers from "../../calendar-organizers";
import { useCalendarContext } from "../../calendar-context";
import CalendarBodyDayContent from "./calendar-body-day-content";
import CalendarBodyMarginDayMargin from "./calendar-body-margin-day-margin";
import { forwardRef, type RefObject } from "react";

const CalendarBodyDay = forwardRef<HTMLDivElement>((_, ref) => {
  const { date } = useCalendarContext();
  return (
    <div className="flex divide-x h-full">
      <div className="lg:flex hidden flex-col flex-1 divide-y max-w-[276px]">
        <CalendarBodyDayCalendar />
        <CalendarOrganizers />
      </div>
      <div className="flex flex-col flex-1 divide-y">
        <div className="flex flex-col flex-1 overflow-y-auto" ref={ref}>
          <div className="relative flex flex-1 divide-x">
            <CalendarBodyMarginDayMargin />
            <CalendarBodyDayContent
              date={date}
              scrollContainerRef={ref as RefObject<HTMLDivElement>}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

CalendarBodyDay.displayName = "CalendarBodyDay";

export default CalendarBodyDay;
