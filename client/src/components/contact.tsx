import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Phone, Mail, MapPin, Clock, Send, PhoneCall } from "lucide-react";
import type { InsertContact } from "@shared/schema";

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });
  const [privacyAgreed, setPrivacyAgreed] = useState(false);

  const { toast } = useToast();

  const submitContact = useMutation({
    mutationFn: async (data: InsertContact) => {
      const response = await apiRequest("POST", "/api/contact", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Nachricht gesendet!",
        description: "Vielen Dank für Ihre Anfrage. Wir melden uns innerhalb von 24 Stunden bei Ihnen.",
      });
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        service: "",
        message: "",
      });
      setPrivacyAgreed(false);
    },
    onError: () => {
      toast({
        title: "Fehler",
        description: "Die Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es erneut.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!privacyAgreed) {
      toast({
        title: "Datenschutz",
        description: "Bitte stimmen Sie der Datenschutzerklärung zu.",
        variant: "destructive",
      });
      return;
    }
    submitContact.mutate(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const serviceOptions = [
    { value: "household", label: "Haushaltsauflösung" },
    { value: "office", label: "Büroentrümpelung" },
    { value: "moving", label: "Umzug" },
    { value: "messie", label: "Messiewohnung" },
    { value: "cleaning", label: "Besenrein" },
    { value: "other", label: "Sonstiges" },
  ];

  return (
    <section id="contact" className="py-16 lg:py-24 bg-muted/50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Kontakt aufnehmen</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Haben Sie Fragen oder möchten ein unverbindliches Angebot? Wir melden uns innerhalb von 24 Stunden zurück.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold text-foreground mb-6">Anfrage senden</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Vorname *</Label>
                    <Input
                      id="firstName"
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      placeholder="Ihr Vorname"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nachname *</Label>
                    <Input
                      id="lastName"
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      placeholder="Ihr Nachname"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-Mail *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="ihre.email@beispiel.de"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefon</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="Ihre Telefonnummer"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="service">Gewünschte Leistung</Label>
                  <Select value={formData.service} onValueChange={(value) => handleInputChange("service", value)}>
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

                <div className="space-y-2">
                  <Label htmlFor="message">Nachricht</Label>
                  <Textarea
                    id="message"
                    rows={4}
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    placeholder="Beschreiben Sie Ihr Projekt..."
                    className="resize-none"
                  />
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="privacy-agreement"
                    checked={privacyAgreed}
                    onCheckedChange={(checked) => setPrivacyAgreed(checked === true)}
                  />
                  <Label htmlFor="privacy-agreement" className="text-sm leading-relaxed">
                    Ich stimme der <a href="/datenschutz" className="text-primary hover:underline">Datenschutzerklärung</a> zu und erlaube die Kontaktaufnahme. *
                  </Label>
                </div>

                <Button 
                  type="submit" 
                  disabled={submitContact.isPending}
                  className="w-full btn-primary"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {submitContact.isPending ? "Wird gesendet..." : "Nachricht senden"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <div className="space-y-8">
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold text-foreground mb-6">Kontaktdaten</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary text-primary-foreground rounded-lg p-3">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Telefon</h4>
                      <p className="text-muted-foreground">05603 123456</p>
                      <p className="text-sm text-muted-foreground">Mo-Fr: 7:00-18:00 Uhr</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-primary text-primary-foreground rounded-lg p-3">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">E-Mail</h4>
                      <p className="text-muted-foreground">kontakt@wirpackens.org</p>
                      <p className="text-sm text-muted-foreground">Antwort innerhalb 24h</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-primary text-primary-foreground rounded-lg p-3">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Standort</h4>
                      <p className="text-muted-foreground">Gudensberg, Hessen</p>
                      <p className="text-sm text-muted-foreground">100km Einsatzradius</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Schnelle Reaktion
                </h3>
                <p className="mb-6 opacity-90">
                  Bei Notfällen oder dringenden Anfragen erreichen Sie uns auch außerhalb der Geschäftszeiten.
                </p>
                <Button variant="secondary" className="bg-white text-secondary hover:bg-white/90">
                  <PhoneCall className="h-4 w-4 mr-2" />
                  Notfall-Hotline
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
