import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { calculatePrice, formatPrice } from "@/lib/utils";
import { Shield, Calendar } from "lucide-react";
import { openGoogleCalendarPopup } from "@/lib/google-calendar";

export default function PriceCalculator() {
  const [serviceType, setServiceType] = useState("");
  const [floorCount, setFloorCount] = useState("");
  const [squareMeters, setSquareMeters] = useState("");
  const [prices, setPrices] = useState({ basePrice: 0, additionalPrice: 0, totalPrice: 0 });


  useEffect(() => {
    if (serviceType && squareMeters) {
      const newPrices = calculatePrice(
        serviceType,
        parseInt(squareMeters) || 0,
        parseInt(floorCount) || 1,
        false, // weekendService entfernt - Sonn- und Feiertage sind nicht erlaubt
        false // disposalService entfernt - Sondermüll wird separat berechnet
      );
      setPrices(newPrices);
    } else {
      setPrices({ basePrice: 0, additionalPrice: 0, totalPrice: 0 });
    }
  }, [serviceType, squareMeters, floorCount]);




  const serviceOptions = [
    { value: "household", label: "Haushaltsauflösung (25€/m²)" },
    { value: "office", label: "Büroentrümpelung (30€/m²)" },
    { value: "moving", label: "Umzug (12€/m²)" },
    { value: "messie", label: "Messiewohnung (35€/m²)" },
  ];

  const floorOptions = [
    { value: "1", label: "1 Stockwerk" },
    { value: "2", label: "2 Stockwerke" },
    { value: "3", label: "3 Stockwerke" },
    { value: "4", label: "4 Stockwerke" },
    { value: "5", label: "5 Stockwerke" },
    { value: "6", label: "6 Stockwerke" },
    { value: "7", label: "7 Stockwerke" },
    { value: "8", label: "8 Stockwerke" },
    { value: "9", label: "9 Stockwerke" },
    { value: "10", label: "10+ Stockwerke" },
  ];

  return (
    <section id="calculator" className="py-16 lg:py-24 bg-muted/50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Kostenloser Preisrechner</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Erhalten Sie sofort eine erste Kosteneinschätzung für Ihr Projekt
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden shadow-xl">
            <div className="grid lg:grid-cols-2">
              {/* Calculator Form */}
              <CardContent className="p-8 lg:p-12">
                <h3 className="text-2xl font-bold text-foreground mb-8">Projektdetails eingeben</h3>
                
                <div className="space-y-6">
                  {/* Service Type */}
                  <div className="space-y-2">
                    <Label htmlFor="service-type">Art der Dienstleistung</Label>
                    <Select value={serviceType} onValueChange={setServiceType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Bitte wählen..." />
                      </SelectTrigger>
                      <SelectContent>
                        {serviceOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Floor Count */}
                  <div className="space-y-2">
                    <Label htmlFor="floor-count">Anzahl Stockwerke</Label>
                    <Select value={floorCount} onValueChange={setFloorCount}>
                      <SelectTrigger>
                        <SelectValue placeholder="Bitte wählen..." />
                      </SelectTrigger>
                      <SelectContent>
                        {floorOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      +5% pro Stockwerk (max. +50% bei 10+ Stockwerken)
                    </p>
                  </div>

                  {/* Square Meters */}
                  <div className="space-y-2">
                    <Label htmlFor="square-meters">Quadratmeter (ca.)</Label>
                    <Input
                      id="square-meters"
                      type="number"
                      placeholder="z.B. 80"
                      min="1"
                      max="500"
                      value={squareMeters}
                      onChange={(e) => setSquareMeters(e.target.value)}
                    />
                  </div>

                </div>
              </CardContent>

              {/* Results */}
              <div className="bg-gradient-to-br from-primary to-primary/80 p-8 lg:p-12 text-primary-foreground">
                <h3 className="text-2xl font-bold mb-8">Ihre Kostenschätzung</h3>
                
                <div className="space-y-6">
                  <Card className="bg-white/10 border-white/20">
                    <CardContent className="p-6">
                      <div className="text-sm opacity-80 mb-2">Grundpreis</div>
                      <div className="text-2xl font-bold">{formatPrice(prices.basePrice)}</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/10 border-white/20">
                    <CardContent className="p-6">
                      <div className="text-sm opacity-80 mb-2">Zusatzleistungen</div>
                      <div className="text-xl font-semibold">{formatPrice(prices.additionalPrice)}</div>
                    </CardContent>
                  </Card>

                  <div className="border-t border-white/20 pt-6">
                    <div className="text-sm opacity-80 mb-2">Ihr Festpreis</div>
                    <div className="text-4xl font-bold">{formatPrice(prices.totalPrice)}</div>
                    <div className="text-sm opacity-80 mt-2">inkl. MwSt. - Garantiert!</div>
                  </div>

                  <Card className="bg-white/10 border-white/20">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <Shield className="h-5 w-5 text-white/80 mt-0.5" />
                        <div className="text-sm opacity-90 leading-relaxed">
                          <strong>Festpreisgarantie:</strong> Dieser berechnete Preis ist Ihr garantierter Festpreis. Keine versteckten Kosten oder Überraschungen!
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/10 border-white/20">
                    <CardContent className="p-4">
                      <div className="text-sm opacity-90 leading-relaxed">
                        <strong>💳 Flexible Zahlung:</strong> Ratenzahlung über Klarna möglich. Sprechen Sie uns gerne an!
                      </div>
                    </CardContent>
                  </Card>

                  <div className="space-y-3">
                    <Button 
                      onClick={() => openGoogleCalendarPopup()}
                      disabled={prices.totalPrice === 0}
                      className="w-full bg-white text-primary hover:bg-white/90 font-bold"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Jetzt buchen
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Festpreis Garantie Section */}
        {prices.totalPrice > 0 && (
          <div className="max-w-4xl mx-auto mt-12">
            <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-xl">
              <CardContent className="p-8 text-center">
                <div className="bg-white/20 text-white rounded-lg p-4 w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <Shield className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold mb-4">🎯 Festpreis-Garantie sichern!</h3>
                <p className="text-lg mb-6 opacity-90">
                  Sichern Sie sich jetzt Ihren berechneten Preis von <span className="font-bold text-xl">{formatPrice(prices.totalPrice)}</span> 
                  mit unserer Festpreis-Garantie. Buchen Sie direkt einen Termin!
                </p>
                
                <div className="grid md:grid-cols-1 gap-6 mb-8">
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="font-semibold mb-2">✅ Garantierter Festpreis</div>
                    <div className="text-sm opacity-90">Keine versteckten Kosten oder Überraschungen</div>
                  </div>
                </div>
                
                <div className="bg-white/10 rounded-lg p-4 mb-6 space-y-2">
                  <div className="text-sm opacity-90">
                    <strong>Hinweis:</strong> Die Beseitigung von Sondermüll wird zusätzlich berechnet und ist nicht im Festpreis inkludiert.
                  </div>
                  <div className="text-sm opacity-90">
                    <strong>💳 Flexible Zahlung:</strong> Ratenzahlung über Klarna möglich. Sprechen Sie uns gerne an!
                  </div>
                </div>

                <Button 
                  onClick={() => openGoogleCalendarPopup()}
                  className="bg-white text-green-600 hover:bg-gray-100 font-bold text-lg px-8 py-3 h-auto"
                >
                  <Calendar className="h-5 w-5 mr-2" />
                  Jetzt buchen & Preis sichern
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

      </div>
    </section>
  );
}
