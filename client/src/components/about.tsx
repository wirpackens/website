import { Card, CardContent } from "@/components/ui/card";
import { Shield, Clock, Recycle, Euro } from "lucide-react";
import aboutImage from "@assets/bd1ffe8f-962c-4b58-958a-9637adeef49a_1754066721004.jpg";
import serviceImage1 from "@assets/ad847985-65f6-47bf-976b-4d158f84d81f_1754066721003.jpg";
import serviceImage2 from "@assets/f7f6f513-4fc5-4f51-8ab2-7828c8732d52_1754066721004.jpg";

export default function About() {
  const features = [
    {
      icon: Shield,
      title: "Vollversichert",
      description: "Haftpflicht- und Transportversicherung"
    },
    {
      icon: Clock,
      title: "Pünktlich",
      description: "Zuverlässige Terminabsprachen"
    },
    {
      icon: Recycle,
      title: "Umweltbewusst",
      description: "Fachgerechte Verwertung und Recycling"
    },
    {
      icon: Euro,
      title: "Faire Preise",
      description: "Transparente Kostenaufstellung"
    }
  ];

  const serviceAreas = [
    "• Kassel",
    "• Marburg", 
    "• Bad Hersfeld",
    "• Fulda",
    "• Göttingen",
    "• Korbach"
  ];

  return (
    <section id="about" className="py-16 lg:py-24 bg-background">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">Warum Wir packens?</h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Seit über 10 Jahren sind wir Ihr zuverlässiger Partner für professionelle Entrümpelungen in Hessen. 
              Unser erfahrenes Team sorgt für eine schnelle und umweltgerechte Abwicklung.
            </p>

            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="bg-secondary text-secondary-foreground rounded-full p-2 flex-shrink-0">
                    <feature.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <Card className="bg-muted/50">
              <CardContent className="p-6">
                <h4 className="font-semibold text-foreground mb-3">Unser Einzugsgebiet</h4>
                <p className="text-muted-foreground mb-4">
                  Wir sind in einem Umkreis von 50km rund um Gudensberg tätig:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm text-muted-foreground">
                  {serviceAreas.map((area, index) => (
                    <span key={index}>{area}</span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <img 
              src={aboutImage} 
              alt="Professionelles Entrümpelungsteam beim Transport im Treppenhaus" 
              className="rounded-xl shadow-lg w-full h-auto" 
            />
            
            <div className="grid grid-cols-2 gap-4">
              <img 
                src={serviceImage1} 
                alt="Professionelle Entrümpelung von Wohnräumen" 
                className="rounded-lg shadow-md w-full h-auto" 
              />
              
              <img 
                src={serviceImage2} 
                alt="Besenreine Übergabe nach Entrümpelung" 
                className="rounded-lg shadow-md w-full h-auto" 
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
