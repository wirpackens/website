import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { format, addDays, startOfWeek, addWeeks, subWeeks, isSameDay, isAfter, isBefore } from "date-fns";
import { de } from "date-fns/locale";

interface AppointmentCalendarProps {
  onDateTimeSelect: (date: Date, time: string) => void;
  selectedDate?: Date;
  selectedTime?: string;
}

export default function AppointmentCalendar({ onDateTimeSelect, selectedDate, selectedTime }: AppointmentCalendarProps) {
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  
  // Available time slots
  const timeSlots = [
    "08:00", "09:00", "10:00", "11:00", 
    "13:00", "14:00", "15:00", "16:00", "17:00"
  ];

  // Generate days for current week
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeek, i));
  
  // Filter out past dates and weekends for availability
  const isDateAvailable = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Must be in the future and not Sunday (0) or Saturday (6)
    const dayOfWeek = date.getDay();
    return isAfter(date, today) || isSameDay(date, today) && dayOfWeek !== 0 && dayOfWeek !== 6;
  };

  const isTimeSlotAvailable = (date: Date, time: string) => {
    if (!isDateAvailable(date)) return false;
    
    // If it's today, only show future time slots
    if (isSameDay(date, new Date())) {
      const now = new Date();
      const [hours, minutes] = time.split(':').map(Number);
      const slotTime = new Date();
      slotTime.setHours(hours, minutes, 0, 0);
      return isAfter(slotTime, now);
    }
    
    return true;
  };

  const handlePrevWeek = () => {
    setCurrentWeek(subWeeks(currentWeek, 1));
  };

  const handleNextWeek = () => {
    setCurrentWeek(addWeeks(currentWeek, 1));
  };

  const handleTimeSelect = (date: Date, time: string) => {
    onDateTimeSelect(date, time);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Wählen Sie Ihren Wunschtermin
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Verfügbare Termine: Montag bis Freitag, 8:00 - 17:00 Uhr
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Week Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevWeek}
            disabled={isBefore(addWeeks(currentWeek, -1), startOfWeek(new Date(), { weekStartsOn: 1 }))}
          >
            <ChevronLeft className="h-4 w-4" />
            Vorherige Woche
          </Button>
          
          <h3 className="font-semibold">
            {format(currentWeek, "d. MMMM", { locale: de })} - {format(addDays(currentWeek, 6), "d. MMMM yyyy", { locale: de })}
          </h3>
          
          <Button variant="outline" size="sm" onClick={handleNextWeek}>
            Nächste Woche
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {weekDays.map((date, dayIndex) => {
            const isAvailable = isDateAvailable(date);
            const dayName = format(date, "EEEE", { locale: de });
            const dayNumber = format(date, "d");
            const monthName = format(date, "MMM", { locale: de });
            
            return (
              <div key={dayIndex} className={`space-y-2 ${!isAvailable ? 'opacity-50' : ''}`}>
                <div className="text-center p-2 border rounded-lg bg-muted/50">
                  <div className="font-medium text-sm">{dayName}</div>
                  <div className="text-lg font-bold">{dayNumber}</div>
                  <div className="text-xs text-muted-foreground">{monthName}</div>
                </div>
                
                {isAvailable && (
                  <div className="space-y-1">
                    {timeSlots.map((time) => {
                      const isTimeAvailable = isTimeSlotAvailable(date, time);
                      const isSelected = selectedDate && selectedTime && 
                        isSameDay(date, selectedDate) && time === selectedTime;
                      
                      return (
                        <Button
                          key={time}
                          variant={isSelected ? "default" : "outline"}
                          size="sm"
                          className={`w-full text-xs ${
                            isSelected ? 'bg-primary text-primary-foreground' : ''
                          }`}
                          disabled={!isTimeAvailable}
                          onClick={() => handleTimeSelect(date, time)}
                        >
                          <Clock className="h-3 w-3 mr-1" />
                          {time}
                        </Button>
                      );
                    })}
                  </div>
                )}
                
                {!isAvailable && (
                  <div className="text-center text-xs text-muted-foreground py-4">
                    Nicht verfügbar
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {selectedDate && selectedTime && (
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-primary">
                <Calendar className="h-4 w-4" />
                <span className="font-medium">
                  Gewählter Termin: {format(selectedDate, "EEEE, d. MMMM yyyy", { locale: de })} um {selectedTime} Uhr
                </span>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
