import { Button } from "@/components/ui/button";
import { MapPin, Calculator, Phone, Calendar, CheckCircle } from "lucide-react";
import heroImage from "@assets/94cbe216-6224-4a73-9e04-0a0cb10b6df6_1754066721003.jpg";
import { openGoogleCalendarPopup } from "@/lib/google-calendar";

export default function Hero() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-gradient-to-br from-muted/50 to-muted py-12 lg:py-20">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm font-medium mb-6">
              <MapPin className="h-4 w-4 mr-2" />
              Gudensberg, Hessen • 50km Umkreis
            </div>
            
            <h1 className="text-3xl lg:text-5xl font-bold text-foreground leading-tight mb-6">
              Professionelle <span className="text-primary">Entrümpelung und Umzüge</span> in Hessen
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Von der Haushaltsauflösung bis zur Büroentrümpelung – wir räumen auf, damit Sie sich entspannen können. 
              Zuverlässig, schnell und zu fairen Preisen.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button 
                onClick={() => scrollToSection('calculator')}
                className="btn-primary flex items-center justify-center"
              >
                <Calculator className="h-4 w-4 mr-2" />
                Preis berechnen
              </Button>
              <Button 
                onClick={() => openGoogleCalendarPopup()}
                variant="outline" 
                className="btn-secondary flex items-center justify-center"
              >
                <Phone className="h-4 w-4 mr-2" />
                Termin buchen
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="bg-card rounded-lg p-4 border border-border shadow-sm">
                <div className="bg-primary/10 text-primary rounded-lg p-3 w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <Calculator className="h-6 w-6" />
                </div>
                <div className="text-lg font-bold text-foreground mb-1">1. Preis berechnen</div>
                <div className="text-sm text-muted-foreground">Mit Festpreisgarantie</div>
              </div>
              <div className="bg-card rounded-lg p-4 border border-border shadow-sm">
                <div className="bg-secondary/10 text-secondary rounded-lg p-3 w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <Calendar className="h-6 w-6" />
                </div>
                <div className="text-lg font-bold text-foreground mb-1">2. Termin vereinbaren</div>
                <div className="text-sm text-muted-foreground">Kostenlos bis 50km</div>
              </div>
              <div className="bg-card rounded-lg p-4 border border-border shadow-sm">
                <div className="bg-green-100 text-green-600 rounded-lg p-3 w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <div className="text-lg font-bold text-foreground mb-1">3. Job erledigt</div>
                <div className="text-sm text-muted-foreground">Besenreine Übergabe</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <img 
              src={heroImage} 
              alt="Professionelle Entrümpelung - Team beim Entsorgen von Möbeln" 
              className="rounded-2xl shadow-2xl w-full h-auto" 
            />
            
            <div className="absolute -bottom-6 -left-6 bg-card rounded-xl shadow-xl p-6 border border-border">
              <div className="flex items-center space-x-3">
                <div className="bg-secondary text-secondary-foreground rounded-full p-3">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <div className="font-bold text-foreground">100% Recycling</div>
                  <div className="text-sm text-muted-foreground">Umweltfreundlich</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
