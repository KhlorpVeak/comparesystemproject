import { useCalendarContext } from "./calendar-context";
import { Checkbox } from "@comparesystem/ui/components/ui/checkbox";
import { Label } from "@comparesystem/ui/components/ui/label";
import { useMemo } from "react";

export default function CalendarOrganizers() {
  const { events, selectedOrganizerIds, setSelectedOrganizerIds } =
    useCalendarContext();

  // Extract unique organizers from all events
  const organizers = useMemo(() => {
    const organizerMap = new Map<string, { id: string; name: string; color: string }>();
    
    events.forEach((event) => {
      if (event.organizer.id && event.organizer.name) {
        if (!organizerMap.has(event.organizer.id)) {
          organizerMap.set(event.organizer.id, {
            id: event.organizer.id,
            name: event.organizer.name,
            color: event.color,
          });
        }
      }
    });

    // Sort organizers by name
    return Array.from(organizerMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, [events]);

  const handleOrganizerToggle = (organizerId: string, checked: boolean) => {
    if (checked) {
      setSelectedOrganizerIds([...selectedOrganizerIds, organizerId]);
    } else {
      setSelectedOrganizerIds(
        selectedOrganizerIds.filter((id) => id !== organizerId)
      );
    }
  };

  if (organizers.length === 0) {
    return (
      <div className="p-2 text-muted-foreground text-sm">No organizers found...</div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="font-medium p-2 pb-0 font-heading">Organizers</p>
      <div className="flex flex-col gap-2 px-2 pb-2">
        {organizers.map((organizer) => {
          const isChecked = selectedOrganizerIds.includes(organizer.id);
          return (
            <div
              key={organizer.id}
              className="flex items-center gap-2"
            >
              <Checkbox
                id={organizer.id}
                checked={isChecked}
                onCheckedChange={(checked) =>
                  handleOrganizerToggle(organizer.id, checked === true)
                }
              />
              <Label
                htmlFor={organizer.id}
                className="flex items-center gap-2 cursor-pointer text-sm font-normal"
              >
                <div className={`size-2 rounded-full bg-${organizer.color}-500`} />
                <span className="text-muted-foreground">{organizer.name}</span>
              </Label>
            </div>
          );
        })}
      </div>
    </div>
  );
}
