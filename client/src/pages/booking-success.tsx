import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Calendar, MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import { format } from "date-fns";
import { de } from "date-fns/locale";

interface BookingData {
  id: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceType: string;
  appointmentDate: string;
  appointmentTime: string;
  currentAddress: string;
  newAddress?: string;
  totalPrice: number;
  depositAmount: number;
  paymentStatus: string;
  bookingStatus: string;
}

export default function BookingSuccess() {
  const [, setLocation] = useLocation();
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    const bookingId = urlParams.get('booking_id');

    if (!sessionId || !bookingId) {
      setError("Ungültige Buchungsparameter");
      setLoading(false);
      return;
    }

    // Fetch booking data
    fetch(`/api/booking-success/${sessionId}`)
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setBooking(data.booking);
        } else {
          setError(data.message || "Fehler beim Laden der Buchungsdaten");
        }
      })
      .catch(err => {
        setError("Netzwerkfehler beim Laden der Buchungsdaten");
      })
      .finally(() => {
        setLoading(false);
      });

    // Redirect to WhatsApp after 5 seconds
    const timer = setTimeout(() => {
      window.location.href = "https://wa.me/4917664805066";
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const getServiceTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      household: "Haushaltsauflösung",
      office: "Büroentrümpelung", 
      moving: "Umzug",
      messie: "Messiewohnung"
    };
    return labels[type] || type;
  };

  const formatPrice = (priceInCents: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(priceInCents / 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold mb-2">Buchung wird geladen...</h2>
            <p className="text-muted-foreground">Bitte warten Sie einen Moment.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-muted/50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold mb-2">Fehler</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => setLocation("/")}>Zur Startseite</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!booking) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="container py-12">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Success Header */}
          <Card className="text-center bg-white shadow-xl">
            <CardContent className="p-8">
              <div className="bg-green-100 text-green-600 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-8 w-8" />
              </div>
              <h1 className="text-3xl font-bold text-green-800 mb-2">
                Zahlung erfolgreich!
              </h1>
              <p className="text-lg text-green-700 mb-4">
                Ihre Buchung wurde bestätigt und die Anzahlung wurde erfolgreich verarbeitet.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800">
                  <strong>Buchungs-ID:</strong> #{booking.id}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Booking Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Ihre Buchungsdetails
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground mb-1">Service</h3>
                    <p className="font-medium">{getServiceTypeLabel(booking.serviceType)}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground mb-1">Termin</h3>
                    <p className="font-medium">
                      {format(new Date(booking.appointmentDate), "EEEE, d. MMMM yyyy", { locale: de })}
                    </p>
                    <p className="text-sm text-muted-foreground">um {booking.appointmentTime} Uhr</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground mb-1">Gesamtpreis</h3>
                    <p className="text-xl font-bold text-primary">{formatPrice(booking.totalPrice)}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground mb-1">Anzahlung (bezahlt)</h3>
                    <p className="font-medium text-green-600">{formatPrice(booking.depositAmount)}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold text-sm text-muted-foreground mb-3">Kontaktdaten</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{booking.customerEmail}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{booking.customerPhone}</span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold text-sm text-muted-foreground mb-3">Adresse</h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">
                        {booking.serviceType === 'moving' ? 'Abhol-Adresse:' : 'Service-Adresse:'}
                      </p>
                      <p className="text-sm text-muted-foreground">{booking.currentAddress}</p>
                    </div>
                  </div>
                  
                  {booking.newAddress && (
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Ziel-Adresse:</p>
                        <p className="text-sm text-muted-foreground">{booking.newAddress}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* WhatsApp Redirect Notice */}
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <MessageCircle className="h-6 w-6 text-green-600" />
                <h3 className="font-semibold text-green-800">Nächste Schritte</h3>
              </div>
              <p className="text-green-700 mb-4">
                Sie werden in wenigen Sekunden automatisch zu WhatsApp weitergeleitet, 
                um weitere Details zu besprechen und Fragen zu klären.
              </p>
              <div className="flex gap-3">
                <Button 
                  onClick={() => window.location.href = "https://wa.me/4917664805066"}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Jetzt zu WhatsApp
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setLocation("/")}
                >
                  Zur Startseite
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Important Info */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3">Wichtige Informationen</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Sie erhalten eine Bestätigungs-E-Mail an {booking.customerEmail}</li>
                <li>• Wir melden uns 24h vor dem Termin zur Bestätigung</li>
                <li>• Bei Fragen erreichen Sie uns über WhatsApp oder telefonisch</li>
                <li>• Der Restbetrag wird nach Abschluss der Arbeiten fällig</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
