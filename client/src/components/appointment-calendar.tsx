import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Shield } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface AppointmentCalendarProps {
  onDateTimeSelect: (date: Date, time: string) => void;
  selectedDate?: Date;
  selectedTime?: string;
  totalPrice?: number;
}

export default function AppointmentCalendar({ onDateTimeSelect: _onDateTimeSelect, selectedDate, selectedTime, totalPrice }: AppointmentCalendarProps) {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
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

            <Button 
              onClick={() => window.open('https://www.sumupbookings.com/wir-packens-entruempelung-ug-haftungsbeschraenkt', '_blank')}
              className="bg-white text-green-600 hover:bg-gray-100 font-bold text-lg px-8 py-3 h-auto"
            >
              <Calendar className="h-5 w-5 mr-2" />
              Jetzt buchen & Preis sichern
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
