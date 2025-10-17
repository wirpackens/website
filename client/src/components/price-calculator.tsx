import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { calculatePrice, formatPrice } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import { Send, Shield, Calendar } from "lucide-react";
import type { InsertPriceCalculation } from "@shared/schema";

export default function PriceCalculator() {
  const [serviceType, setServiceType] = useState("");
  const [roomCount, setRoomCount] = useState("");
  const [squareMeters, setSquareMeters] = useState("");
  const [expressService, setExpressService] = useState(false);
  const [weekendService, setWeekendService] = useState(false);
  const [disposalService, setDisposalService] = useState(false);
  const [prices, setPrices] = useState({ basePrice: 0, additionalPrice: 0, totalPrice: 0 });

  const { toast } = useToast();

  const savePriceCalculation = useMutation({
    mutationFn: async (data: InsertPriceCalculation) => {
      const response = await apiRequest("POST", "/api/price-calculation", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Berechnung gespeichert",
        description: "Ihre Preisberechnung wurde erfolgreich gespeichert.",
      });
    },
    onError: () => {
      toast({
        title: "Fehler",
        description: "Die Berechnung konnte nicht gespeichert werden.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (serviceType && squareMeters) {
      const newPrices = calculatePrice(
        serviceType,
        parseInt(squareMeters) || 0,
        expressService,
        weekendService,
        disposalService
      );
      setPrices(newPrices);
    } else {
      setPrices({ basePrice: 0, additionalPrice: 0, totalPrice: 0 });
    }
  }, [serviceType, squareMeters, expressService, weekendService, disposalService]);

  const handleRequestQuote = () => {
    if (prices.totalPrice > 0) {
      const calculationData: InsertPriceCalculation = {
        serviceType,
        roomCount: parseInt(roomCount) || 0,
        squareMeters: parseInt(squareMeters) || 0,
        expressService,
        weekendService,
        disposalService,
        basePrice: prices.basePrice,
        additionalPrice: prices.additionalPrice,
        totalPrice: prices.totalPrice,
      };

      savePriceCalculation.mutate(calculationData);
    }
  };



  const serviceOptions = [
    { value: "household", label: "Haushaltsauflösung (25€/m²)" },
    { value: "office", label: "Büroentrümpelung (30€/m²)" },
    { value: "moving", label: "Umzug (12€/m²)" },
    { value: "messie", label: "Messiewohnung (35€/m²)" },
  ];

  const roomOptions = [
    { value: "1", label: "1 Raum" },
    { value: "2", label: "2 Räume" },
    { value: "3", label: "3 Räume" },
    { value: "4", label: "4 Räume" },
    { value: "5", label: "5+ Räume" },
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

                  {/* Room Count */}
                  <div className="space-y-2">
                    <Label htmlFor="room-count">Anzahl Räume</Label>
                    <Select value={roomCount} onValueChange={setRoomCount}>
                      <SelectTrigger>
                        <SelectValue placeholder="Bitte wählen..." />
                      </SelectTrigger>
                      <SelectContent>
                        {roomOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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

                  {/* Additional Services */}
                  <div className="space-y-2">
                    <Label>Zusatzleistungen</Label>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="express-service"
                          checked={expressService}
                          onCheckedChange={(checked) => setExpressService(checked === true)}
                        />
                        <div className="flex flex-col">
                          <Label htmlFor="express-service" className="text-sm font-medium">
                            Express-Service (+20%)
                          </Label>
                          <p className="text-xs text-muted-foreground mt-1">
                            Dringliche Erledigung innerhalb von 1-2 Tagen
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="weekend-service"
                          checked={weekendService}
                          onCheckedChange={(checked) => setWeekendService(checked === true)}
                        />
                        <Label htmlFor="weekend-service" className="text-sm">
                          Wochenend-Service (+15%)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="disposal-service"
                          checked={disposalService}
                          onCheckedChange={(checked) => setDisposalService(checked === true)}
                        />
                        <Label htmlFor="disposal-service" className="text-sm">
                          Sondermüll-Entsorgung (+10€/m²)
                        </Label>
                      </div>

                    </div>
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

                  <div className="space-y-3">
                    <Button 
                      onClick={() => window.open('https://buy.stripe.com/6oUdR8foJ3Nw1Th4YJebu01', '_blank')}
                      disabled={prices.totalPrice === 0}
                      className="w-full bg-white text-primary hover:bg-white/90 font-bold"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Jetzt kaufen
                    </Button>
                    
                    <Button 
                      onClick={handleRequestQuote}
                      disabled={prices.totalPrice === 0 || savePriceCalculation.isPending}
                      variant="outline"
                      className="w-full bg-white/10 text-white border-white/20 hover:bg-white/20"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      {savePriceCalculation.isPending ? "Wird gespeichert..." : "Nur Preis sichern"}
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
                
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="font-semibold mb-2">✅ Garantierter Festpreis</div>
                    <div className="text-sm opacity-90">Keine versteckten Kosten oder Überraschungen</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="font-semibold mb-2">📅 Kostenlose Besichtigung</div>
                    <div className="text-sm opacity-90">Bis 50km ohne Verpflichtungen</div>
                  </div>
                </div>

                <Button 
                  onClick={() => window.open('https://buy.stripe.com/6oUdR8foJ3Nw1Th4YJebu01', '_blank')}
                  className="bg-white text-green-600 hover:bg-gray-100 font-bold text-lg px-8 py-3 h-auto"
                >
                  <Calendar className="h-5 w-5 mr-2" />
                  Jetzt kaufen & Preis sichern
                </Button>
                
                <div className="mt-4 text-sm opacity-80">
                  💡 Tipp: Bei Buchung innerhalb von 24h erhalten Sie zusätzlich 5% Rabatt!
                </div>
              </CardContent>
            </Card>
          </div>
        )}

      </div>
    </section>
  );
}
