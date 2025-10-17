import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, Building, Truck, AlertTriangle, Fan, Star, Check } from "lucide-react";

export default function Services() {
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const services = [
    {
      icon: Home,
      title: "Haushaltsauflösung",
      description: "Komplette Wohnungsräumung mit fachgerechter Entsorgung und Verwertung. Inkl. besenreiner Übergabe.",
      features: ["Möbel und Hausrat", "Elektrogeräte", "Fachgerechte Entsorgung", "Besenreine Übergabe"],
      price: "Ab 25€/m²",
      color: "bg-primary"
    },
    {
      icon: Building,
      title: "Büroentrümpelung",
      description: "Professionelle Büroräumung mit Datenschutz-konformer Aktenvernichtung und IT-Entsorgung. Inkl. besenreiner Übergabe.",
      features: ["Büromöbel", "IT-Equipment", "Aktenvernichtung", "Besenreine Übergabe"],
      price: "Ab 30€/m²",
      color: "bg-primary"
    },
    {
      icon: Truck,
      title: "Umzug",
      description: "Komplettservice für Ihren Umzug – von der Verpackung bis zur Möbeldemontage am neuen Ort. Inkl. besenreiner Übergabe.",
      features: ["Verpackung", "Transport", "Möbeldemontage", "Besenreine Übergabe"],
      price: "Ab 12€/m²",
      color: "bg-primary"
    },
    {
      icon: AlertTriangle,
      title: "Messiewohnung",
      description: "Einfühlsame Räumung von Messiewohnungen mit spezieller Ausstattung und Hygienemaßnahmen. Inkl. besenreiner Übergabe.",
      features: ["Diskrete Abwicklung", "Spezialausrüstung", "Hygienische Entsorgung", "Besenreine Übergabe"],
      price: "Ab 35€/m²",
      color: "bg-primary"
    }
  ];

  return (
    <section id="services" className="py-16 lg:py-24 bg-background">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Unsere Leistungen</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Professionelle Entrümpelungsdienstleistungen für jeden Bedarf – von der Wohnung bis zum Büro
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="card-hover bg-muted/50 border-border">
              <CardContent className="p-8">
                <div className={`${service.color} text-primary-foreground rounded-lg p-4 w-16 h-16 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <service.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">{service.title}</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {service.description}
                </p>
                <ul className="text-sm text-muted-foreground space-y-2 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="h-4 w-4 text-secondary mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="text-primary font-bold">{service.price}</div>
              </CardContent>
            </Card>
          ))}

          <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
            <CardContent className="p-8">
              <div className="bg-white/20 rounded-lg p-4 w-16 h-16 flex items-center justify-center mb-6">
                <Star className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-4">Vollservice</h3>
              <p className="mb-6 leading-relaxed opacity-90">
                Kombinieren Sie mehrere Leistungen und sparen Sie. Wir kümmern uns um alles aus einer Hand.
              </p>
              <Button 
                onClick={scrollToContact}
                variant="secondary"
                className="bg-white text-primary hover:bg-white/90"
              >
                Beratung anfragen
              </Button>
            </CardContent>
          </Card>
        </div>


        {/* Service Info */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Fan className="h-4 w-4" />
              Wichtiger Hinweis
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Unsere Dienstleistungen ohne Aufbauservice
            </h3>
            <p className="text-gray-700 max-w-2xl mx-auto">
              Wir bieten ausschließlich Entrümpelung, Demontage und Transport an. 
              Möbelmontage oder Aufbauarbeiten sind nicht Teil unserer Leistungen. 
              Alle Preise verstehen sich für die reine Räumung und besenreine Übergabe.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
