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
import { ScrollArea } from "@comparesystem/ui/components/ui/scroll-area";

interface TimeSlotPickerProps {
  value: Date;
  onChange: (value: Date) => void;
  minHour?: number; // 0-23 format, default 8 (8am)
  maxHour?: number; // 0-23 format, default 17 (5pm)
  minuteStep?: number; // e.g., 30 for 30-minute slots
  disabled?: boolean;
}

export function TimeSlotPicker({
  value,
  onChange,
  minHour = 8,
  maxHour = 17,
  minuteStep = 30,
  disabled = false,
}: TimeSlotPickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  // Generate time slots from minHour:00 to maxHour:30 in minuteStep increments
  const generateTimeSlots = (): Date[] => {
    const slots: Date[] = [];
    const baseDate = new Date();
    baseDate.setHours(0, 0, 0, 0); // Use a base date for time calculations

    for (let hour = minHour; hour <= maxHour; hour++) {
      // For each hour, add :00 and :30 slots
      const minutes = [0, minuteStep];

      for (const minute of minutes) {
        // For the last hour (maxHour), only include :30 if minuteStep is 30
        // This ensures we get slots up to 5:30 PM (17:30)
        if (hour === maxHour && minute > minuteStep) {
          continue;
        }
        
        const slot = new Date(baseDate);
        slot.setHours(hour, minute, 0, 0);
        slots.push(slot);
      }
    }

    return slots;
  };

  const timeSlots = generateTimeSlots();

  const handleTimeSelect = (selectedTime: Date) => {
    // Create a new date with the selected time but keep the date part from value
    const newDate = new Date(value);
    newDate.setHours(selectedTime.getHours());
    newDate.setMinutes(selectedTime.getMinutes());
    newDate.setSeconds(0);
    newDate.setMilliseconds(0);
    onChange(newDate);
    setIsOpen(false);
  };

  const formatTimeSlot = (time: Date): string => {
    return format(time, "h:mm aa");
  };

  const isSelected = (slot: Date): boolean => {
    if (!value) return false;
    return (
      value.getHours() === slot.getHours() &&
      value.getMinutes() === slot.getMinutes()
    );
  };

  return (
    <Popover modal open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
          disabled={disabled}
        >
          <ClockIcon className="mr-2 h-4 w-4" />
          {value ? formatTimeSlot(value) : <span>Select time</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <ScrollArea className="h-[300px] w-48">
          <div className="p-2">
            {timeSlots.map((slot, index) => (
              <Button
                key={index}
                variant={isSelected(slot) ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start font-normal",
                  isSelected(slot) && "bg-primary text-primary-foreground"
                )}
                onClick={() => handleTimeSelect(slot)}
              >
                {formatTimeSlot(slot)}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
