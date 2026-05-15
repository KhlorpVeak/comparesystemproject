"use client";

import * as React from "react";
import { ClockIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@comparesystem/ui/lib/utils";
import { Button } from "@comparesystem/ui/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@comparesystem/ui/components/ui/popover";
import { ScrollArea, ScrollBar } from "@comparesystem/ui/components/ui/scroll-area";

interface TimePickerProps {
  value: Date;
  onChange: (value: Date) => void;
  minHour?: number; // 0-23 format
  maxHour?: number; // 0-23 format
  minuteStep?: number; // e.g., 30 for 30-minute slots
}

export function TimePicker({
  value,
  onChange,
  minHour = 0,
  maxHour = 23,
  minuteStep = 5,
}: TimePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  // Generate hours based on constraints (8am-6pm = 8-18 in 24h format)
  const getAvailableHours = () => {
    const availableHours: number[] = [];
    for (let h = minHour; h <= maxHour; h++) {
      // Convert 24-hour to 12-hour format
      let hour12: number;
      if (h === 0) {
        hour12 = 12; // midnight
      } else if (h === 12) {
        hour12 = 12; // noon
      } else if (h > 12) {
        hour12 = h - 12; // 1pm-11pm
      } else {
        hour12 = h; // 1am-11am
      }

      if (!availableHours.includes(hour12)) {
        availableHours.push(hour12);
      }
    }
    // Sort: 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6
    return availableHours.sort((a, b) => {
      // Put 12 first if it exists, then sort others
      if (a === 12 && b !== 12) return -1;
      if (b === 12 && a !== 12) return 1;
      if (a === 12 && b === 12) return 0;
      // For 8-11, keep in order
      if (a >= 8 && b >= 8) return a - b;
      // For 1-6, keep in order
      if (a < 8 && b < 8) return a - b;
      // 8-11 come before 1-6
      if (a >= 8 && b < 8) return -1;
      if (a < 8 && b >= 8) return 1;
      return a - b;
    });
  };

  const hours = getAvailableHours();

  // Generate minutes based on step (e.g., 0, 30 for 30-minute slots)
  const minutes = Array.from(
    { length: Math.floor(60 / minuteStep) },
    (_, i) => i * minuteStep
  );

  const handleTimeChange = (
    type: "hour" | "minute" | "ampm",
    timeValue: string
  ) => {
    const newDate = new Date(value);
    if (type === "hour") {
      const hour12 = parseInt(timeValue);

      // For 8am-6pm range:
      // Hours 8-11 are AM (8, 9, 10, 11)
      // Hour 12 is PM (noon)
      // Hours 1-6 are PM (1pm, 2pm, 3pm, 4pm, 5pm, 6pm)
      let hour24: number;
      if (hour12 >= 8 && hour12 <= 11) {
        // 8am-11am
        hour24 = hour12;
      } else if (hour12 === 12) {
        // 12pm (noon)
        hour24 = 12;
      } else if (hour12 >= 1 && hour12 <= 6) {
        // 1pm-6pm
        hour24 = hour12 + 12;
      } else {
        // Fallback: use current AM/PM state
        const currentHours = newDate.getHours();
        const isPM = currentHours >= 12;
        if (hour12 === 12) {
          hour24 = isPM ? 12 : 0;
        } else {
          hour24 = isPM ? hour12 + 12 : hour12;
        }
      }

      // Ensure hour is within constraints
      if (hour24 < minHour) {
        hour24 = minHour;
      } else if (hour24 > maxHour) {
        hour24 = maxHour;
      }

      newDate.setHours(hour24);
    } else if (type === "minute") {
      const minute = parseInt(timeValue);
      newDate.setMinutes(minute);
    } else if (type === "ampm") {
      const currentHours = newDate.getHours();
      const hour12 =
        currentHours === 0
          ? 12
          : currentHours > 12
            ? currentHours - 12
            : currentHours;
      const isPM = timeValue === "PM";

      // Convert 12-hour to 24-hour format
      let newHours: number;
      if (hour12 === 12) {
        newHours = isPM ? 12 : 0;
      } else {
        newHours = isPM ? hour12 + 12 : hour12;
      }

      // Ensure hour is within constraints after AM/PM change
      if (newHours < minHour) {
        newHours = minHour;
      } else if (newHours > maxHour) {
        newHours = maxHour;
      }

      newDate.setHours(newHours);
    }
    onChange(newDate);
  };

  // Filter available AM/PM options based on constraints
  // For 8am-6pm, we need both AM (8-11) and PM (12-6)
  const getAvailableAmPm = () => {
    // For 8am-6pm range, we always show both AM and PM
    // AM covers 8-11, PM covers 12-6
    if (minHour >= 8 && maxHour <= 18) {
      return ["AM", "PM"];
    }

    // For other ranges, determine based on constraints
    const available: string[] = [];
    if (minHour < 12) {
      available.push("AM");
    }
    if (maxHour >= 12) {
      available.push("PM");
    }

    return available.length > 0 ? available : ["AM", "PM"];
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
        >
          <ClockIcon className="mr-2 h-4 w-4" />
          {value ? (
            format(value, "hh:mm aa")
          ) : (
            <span>hh:mm aa</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
          <ScrollArea className="w-64 sm:w-auto">
            <div className="flex sm:flex-col p-2">
              {hours.map((hour) => (
                <Button
                  key={hour}
                  size="icon"
                  variant={
                    value && value.getHours() % 12 === hour % 12
                      ? "default"
                      : "ghost"
                  }
                  className="sm:w-full shrink-0 aspect-square"
                  onClick={() => handleTimeChange("hour", hour.toString())}
                >
                  {hour}
                </Button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" className="sm:hidden" />
          </ScrollArea>
          <ScrollArea className="w-64 sm:w-auto">
            <div className="flex sm:flex-col p-2">
              {minutes.map((minute) => (
                <Button
                  key={minute}
                  size="icon"
                  variant={
                    value && value.getMinutes() === minute ? "default" : "ghost"
                  }
                  className="sm:w-full shrink-0 aspect-square"
                  onClick={() =>
                    handleTimeChange("minute", minute.toString())
                  }
                >
                  {minute.toString().padStart(2, "0")}
                </Button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" className="sm:hidden" />
          </ScrollArea>
          <ScrollArea>
            <div className="flex sm:flex-col p-2">
              {getAvailableAmPm().map((ampm) => (
                <Button
                  key={ampm}
                  size="icon"
                  variant={
                    value &&
                    ((ampm === "AM" && value.getHours() < 12) ||
                      (ampm === "PM" && value.getHours() >= 12))
                      ? "default"
                      : "ghost"
                  }
                  className="sm:w-full shrink-0 aspect-square"
                  onClick={() => handleTimeChange("ampm", ampm)}
                >
                  {ampm}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  );
}
