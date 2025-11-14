import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Shield } from "lucide-react";
import { formatPrice } from "@/lib/utils";

// TypeScript declaration for Google Calendar API
declare global {
  interface Window {
    calendar?: {
      schedulingButton: {
        load: (config: {
          url: string;
          color?: string;
          label?: string;
          target: HTMLElement;
          locale?: string;
        }) => void;
      };
    };
  }
}

interface AppointmentCalendarProps {
  onDateTimeSelect: (date: Date, time: string) => void;
  selectedDate?: Date;
  selectedTime?: string;
  totalPrice?: number;
}

export default function AppointmentCalendar({ onDateTimeSelect: _onDateTimeSelect, selectedDate, selectedTime, totalPrice }: AppointmentCalendarProps) {
  const calendarButtonRef = useRef<HTMLDivElement>(null);
  const calendarButtonGuaranteeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Google Calendar Scheduling Button Script
    const loadCalendarScript = () => {
      // Load CSS
      if (!document.querySelector('link[href*="calendar/scheduling-button-script.css"]')) {
        const link = document.createElement('link');
        link.href = 'https://calendar.google.com/calendar/scheduling-button-script.css';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
      }

      // Load JS
      if (!document.querySelector('script[src*="calendar/scheduling-button-script.js"]')) {
        const script = document.createElement('script');
        script.src = 'https://calendar.google.com/calendar/scheduling-button-script.js';
        script.async = true;
        script.onload = () => {
          const calendarConfig = {
            url: 'https://calendar.google.com/calendar/appointments/schedules/AcZssZ0U8t43j4VC_36EOQCKug1F_94nrLulJQ6p3MtOYpHilbnquJI8gwIMUv4qN_JghqIyGUbjwFtg?gv=true',
            color: '#039BE5',
            label: 'Termin eintragen',
            locale: 'de' as const,
          };

          if (window.calendar?.schedulingButton) {
            if (calendarButtonRef.current) {
              window.calendar.schedulingButton.load({
                ...calendarConfig,
                target: calendarButtonRef.current,
              });
            }
            if (calendarButtonGuaranteeRef.current) {
              window.calendar.schedulingButton.load({
                ...calendarConfig,
                target: calendarButtonGuaranteeRef.current,
              });
            }
          }
        };
        document.head.appendChild(script);
      } else if (window.calendar?.schedulingButton) {
        // Script already loaded, just initialize
        const calendarConfig = {
          url: 'https://calendar.google.com/calendar/appointments/schedules/AcZssZ0U8t43j4VC_36EOQCKug1F_94nrLulJQ6p3MtOYpHilbnquJI8gwIMUv4qN_JghqIyGUbjwFtg?gv=true',
          color: '#039BE5',
          label: 'Termin eintragen',
          locale: 'de' as const,
        };

        if (calendarButtonRef.current) {
          window.calendar.schedulingButton.load({
            ...calendarConfig,
            target: calendarButtonRef.current,
          });
        }
        if (calendarButtonGuaranteeRef.current) {
          window.calendar.schedulingButton.load({
            ...calendarConfig,
            target: calendarButtonGuaranteeRef.current,
          });
        }
      }
    };

    loadCalendarScript();
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Wählen Sie Ihren Wunschtermin
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Buchen Sie direkt über unseren Google Kalender
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Google Calendar Appointment Scheduling Button */}
          <div className="w-full flex justify-center py-8">
            <div ref={calendarButtonRef} id="google-calendar-button"></div>
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

      {/* Festpreis Garantie Section */}
      {totalPrice && totalPrice > 0 && (
        <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-xl">
          <CardContent className="p-8 text-center">
            <div className="bg-white/20 text-white rounded-lg p-4 w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <Shield className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-bold mb-4">🎯 Festpreis-Garantie sichern!</h3>
            <p className="text-lg mb-6 opacity-90">
              Sichern Sie sich jetzt Ihren berechneten Preis von <span className="font-bold text-xl">{formatPrice(totalPrice)}</span> 
              mit unserer Festpreis-Garantie. Buchen Sie direkt einen Termin!
            </p>
            
            <div className="grid md:grid-cols-1 gap-6 mb-8">
              <div className="bg-white/10 rounded-lg p-4">
                <div className="font-semibold mb-2">✅ Garantierter Festpreis</div>
                <div className="text-sm opacity-90">Keine versteckten Kosten oder Überraschungen</div>
              </div>
            </div>
            
            <div className="bg-white/10 rounded-lg p-4 mb-6">
              <div className="text-sm opacity-90">
                <strong>Hinweis:</strong> Die Beseitigung von Sondermüll wird zusätzlich berechnet und ist nicht im Festpreis inkludiert.
              </div>
            </div>

            <div className="flex justify-center">
              <div ref={calendarButtonGuaranteeRef} id="google-calendar-button-guarantee"></div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
