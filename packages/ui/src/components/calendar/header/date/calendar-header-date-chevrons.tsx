import { Button } from '@comparesystem/ui/components/ui/button'
import { useCalendarContext } from '../../calendar-context'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  format,
  addDays,
  addMonths,
  addWeeks,
  subDays,
  subMonths,
  subWeeks,
} from 'date-fns'

export default function CalendarHeaderDateChevrons() {
  const { mode, date, setDate, onDateNavigate } = useCalendarContext()

  function handleDateBackward() {
    let newDate: Date
    switch (mode) {
      case 'month':
        newDate = subMonths(date, 1)
        break
      case 'week':
        newDate = subWeeks(date, 1)
        break
      case 'day':
        newDate = subDays(date, 1)
        break
      default:
        newDate = date
        break
    }
    
    setDate(newDate)
    
    // Update URL query params
    if (onDateNavigate) {
      onDateNavigate({ date: newDate, mode })
    }
  }

  function handleDateForward() {
    let newDate: Date
    switch (mode) {
      case 'month':
        newDate = addMonths(date, 1)
        break
      case 'week':
        newDate = addWeeks(date, 1)
        break
      case 'day':
        newDate = addDays(date, 1)
        break
      default:
        newDate = date
        break
    }
    
    setDate(newDate)
    
    // Update URL query params
    if (onDateNavigate) {
      onDateNavigate({ date: newDate, mode })
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        className="h-7 w-7 p-1"
        onClick={handleDateBackward}
      >
        <ChevronLeft className="min-w-5 min-h-5" />
      </Button>

      <span className="min-w-[140px] text-center font-medium">
        {format(date, 'MMMM d, yyyy')}
      </span>

      <Button
        variant="outline"
        className="h-7 w-7 p-1"
        onClick={handleDateForward}
      >
        <ChevronRight className="min-w-5 min-h-5" />
      </Button>
    </div>
  )
}
