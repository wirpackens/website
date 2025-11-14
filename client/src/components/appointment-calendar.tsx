import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";

interface AppointmentCalendarProps {
  onDateTimeSelect: (date: Date, time: string) => void;
  selectedDate?: Date;
  selectedTime?: string;
}

export default function AppointmentCalendar({ onDateTimeSelect: _onDateTimeSelect, selectedDate, selectedTime }: AppointmentCalendarProps) {
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Wählen Sie Ihren Wunschtermin
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Buchen Sie direkt über unseren SumUp-Kalender
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* SumUp Booking Calendar iframe */}
        <div className="w-full" style={{ minHeight: '800px' }}>
          <iframe
            src="https://www.sumupbookings.com/wir-packens-entruempelung-ug-haftungsbeschraenkt"
            className="w-full border-0 rounded-lg"
            style={{ minHeight: '800px', width: '100%' }}
            title="SumUp Buchungskalender"
            allow="payment"
          />
        </div>
        
        {selectedDate && selectedTime && (
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-primary">
                <Calendar className="h-4 w-4" />
                <span className="font-medium">
                  Termin ausgewählt: {selectedDate.toLocaleDateString('de-DE')} um {selectedTime} Uhr
                </span>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
