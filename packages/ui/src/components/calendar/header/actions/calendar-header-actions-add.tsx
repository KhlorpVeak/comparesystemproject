import { Button } from '@comparesystem/ui/components/ui/button'
import { Plus } from 'lucide-react'
import { useCalendarContext } from '../../calendar-context'

export default function CalendarHeaderActionsAdd() {
  const { onAddNewAppointmentClick } = useCalendarContext()
  
  if (!onAddNewAppointmentClick) return null

  return (
    <Button
      className="flex items-center gap-1 bg-primary text-background"
      onClick={() => onAddNewAppointmentClick?.()}
    >
      <Plus />
      Add appointment
    </Button>
  )
}
