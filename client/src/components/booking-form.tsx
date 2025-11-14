import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { User, MapPin, MessageSquare, Calendar } from "lucide-react";
import { format } from "date-fns";
import { de } from "date-fns/locale";

interface BookingFormProps {
  priceCalculation: {
    serviceType: string;
    floorCount: number;
    squareMeters: number;
    totalPrice: number;
    weekendService: boolean;
    disposalService: boolean;
  };
  selectedDate: Date;
  selectedTime: string;
  onSubmit: (formData: BookingFormData) => void;
  isLoading?: boolean;
}

export interface BookingFormData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  currentAddress: string;
  newAddress?: string;
  specialRequests?: string;
}

export default function BookingForm({ 
  priceCalculation, 
  selectedDate, 
  selectedTime, 
  onSubmit,
  isLoading = false 
}: BookingFormProps) {
  const [formData, setFormData] = useState<BookingFormData>({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    currentAddress: "",
    newAddress: "",
    specialRequests: "",
  });

  const isMovingService = priceCalculation.serviceType === "moving";
  const depositAmount = 200; // 200€ Anzahlung

  const getServiceTypeLabel = (type: string) => {
    const labels = {
      household: "Haushaltsauflösung",
      office: "Büroentrümpelung", 
      moving: "Umzug",
      messie: "Messiewohnung"
    };
    return labels[type as keyof typeof labels] || type;
  };

  const formatPrice = (priceInCents: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(priceInCents / 100);
  };

  const handleInputChange = (field: keyof BookingFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isFormValid = () => {
    const requiredFields = ['customerName', 'customerEmail', 'customerPhone', 'currentAddress'];
    if (isMovingService) {
      requiredFields.push('newAddress');
    }
    
    return requiredFields.every(field => 
      formData[field as keyof BookingFormData]?.trim()
    );
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Buchungsdetails vervollständigen
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Geben Sie Ihre Kontaktdaten und Adresse ein, um die Buchung abzuschließen
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Booking Summary */}
        <Card className="bg-muted/50">
          <CardContent className="p-4 space-y-3">
            <h3 className="font-semibold text-lg">Buchungsübersicht</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Service:</span>
                <div className="font-medium">{getServiceTypeLabel(priceCalculation.serviceType)}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Termin:</span>
                <div className="font-medium">
                  {format(selectedDate, "EEEE, d. MMMM yyyy", { locale: de })} um {selectedTime} Uhr
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Stockwerke:</span>
                <div className="font-medium">{priceCalculation.floorCount} Stockwerk{priceCalculation.floorCount !== 1 ? 'e' : ''}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Fläche:</span>
                <div className="font-medium">{priceCalculation.squareMeters} m²</div>
              </div>
            </div>
            
            <Separator />
            
            <div className="flex justify-between items-center">
              <span className="font-semibold">Gesamtpreis:</span>
              <span className="text-xl font-bold text-primary">
                {formatPrice(priceCalculation.totalPrice)}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Anzahlung heute:</span>
              <span className="font-semibold text-green-600">
                {formatPrice(depositAmount * 100)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <User className="h-4 w-4" />
              Kontaktinformationen
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customerName">Vollständiger Name *</Label>
                <Input
                  id="customerName"
                  type="text"
                  placeholder="Ihr Name"
                  value={formData.customerName}
                  onChange={(e) => handleInputChange('customerName', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="customerPhone">Telefonnummer *</Label>
                <Input
                  id="customerPhone"
                  type="tel"
                  placeholder="+49 123 456789"
                  value={formData.customerPhone}
                  onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="customerEmail">E-Mail-Adresse *</Label>
              <Input
                id="customerEmail"
                type="email"
                placeholder="max@example.com"
                value={formData.customerEmail}
                onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                required
              />
            </div>
          </div>

          <Separator />

          {/* Address Information */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Adressinformationen
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="currentAddress">
                {isMovingService ? "Aktuelle Adresse (Abhol-Adresse) *" : "Adresse der Entrümpelung *"}
              </Label>
              <Textarea
                id="currentAddress"
                placeholder="Straße, Hausnummer, PLZ Ort"
                value={formData.currentAddress}
                onChange={(e) => handleInputChange('currentAddress', e.target.value)}
                rows={3}
                required
              />
            </div>
            
            {isMovingService && (
              <div className="space-y-2">
                <Label htmlFor="newAddress">Neue Adresse (Ziel-Adresse) *</Label>
                <Textarea
                  id="newAddress"
                  placeholder="Straße, Hausnummer, PLZ Ort"
                  value={formData.newAddress}
                  onChange={(e) => handleInputChange('newAddress', e.target.value)}
                  rows={3}
                  required
                />
              </div>
            )}
          </div>

          <Separator />

          {/* Special Requests */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Besondere Wünsche (optional)
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="specialRequests">
                Zusätzliche Informationen oder besondere Anforderungen
              </Label>
              <Textarea
                id="specialRequests"
                placeholder="z.B. schwere Gegenstände, Zugangshinweise, Parkplätze..."
                value={formData.specialRequests}
                onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                rows={3}
              />
            </div>
          </div>

          {/* Booking Info */}
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-green-600 mt-0.5" />
                <div className="space-y-2">
                  <h4 className="font-semibold text-green-800">Termin buchen</h4>
                  <p className="text-sm text-green-700">
                    Nach dem Absenden werden Sie zum SumUp-Buchungskalender weitergeleitet, 
                    um Ihren Termin zu buchen.
                  </p>
                  <p className="text-xs text-green-600">
                    ✓ Sichere Buchung ✓ Direkte Terminauswahl ✓ Einfach und schnell
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 h-auto"
            disabled={!isFormValid() || isLoading}
          >
            <Calendar className="h-4 w-4 mr-2" />
            {isLoading ? "Wird verarbeitet..." : "Zum Buchungskalender"}
          </Button>
          
          <p className="text-xs text-center text-muted-foreground">
            Mit der Buchung stimmen Sie unseren AGB und Datenschutzbestimmungen zu.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
