import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText } from "lucide-react";

export default function AGB() {
  return (
    <div className="min-h-screen bg-muted/50">
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link href="/">
              <Button variant="outline" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Zurück zur Startseite
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-foreground">Allgemeine Geschäftsbedingungen</h1>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                AGB - Wir packens Entrümplung UG
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-foreground mb-2">§ 1 Geltungsbereich</h3>
                <div className="text-muted-foreground space-y-2">
                  <p>
                    Diese Allgemeinen Geschäftsbedingungen gelten für alle Verträge zwischen der Wir packens 
                    Entrümplung UG (nachfolgend "Auftragnehmer") und dem Kunden über Entrümpelungs-, Räumungs-, 
                    Umzugs- und Reinigungsleistungen.
                  </p>
                  <p>
                    Abweichende Bedingungen des Kunden werden nicht anerkannt, es sei denn, der Auftragnehmer 
                    stimmt ihrer Geltung ausdrücklich schriftlich zu.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">§ 2 Vertragsschluss</h3>
                <div className="text-muted-foreground space-y-2">
                  <p>
                    Der Vertrag kommt durch schriftliche Auftragsbestätigung des Auftragnehmers oder durch 
                    Beginn der Arbeiten zustande. Mündliche Nebenabreden bedürfen der schriftlichen Bestätigung.
                  </p>
                  <p>
                    Kostenvoranschläge sind unverbindlich, es sei denn, sie sind ausdrücklich als verbindlich 
                    bezeichnet.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">§ 3 Leistungsumfang</h3>
                <div className="text-muted-foreground space-y-2">
                  <p>
                    Der Umfang der zu erbringenden Leistungen ergibt sich aus der Auftragsbestätigung und 
                    diesen AGB. Änderungen oder Ergänzungen des Auftrags bedürfen der schriftlichen Vereinbarung.
                  </p>
                  <p>
                    Bei Entrümpelungen umfasst die Leistung das Räumen der bezeichneten Objekte und deren 
                    fachgerechte Entsorgung. Eine besenreine Übergabe ist nur bei ausdrücklicher Vereinbarung 
                    geschuldet.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">§ 4 Preise und Zahlungsbedingungen</h3>
                <div className="text-muted-foreground space-y-2">
                  <p>
                    Die Preise verstehen sich inklusive der gesetzlichen Mehrwertsteuer. Zusätzlich anfallende 
                    Entsorgungskosten werden gesondert berechnet.
                  </p>
                  <p>
                    Die Zahlung erfolgt nach Rechnungsstellung binnen 14 Tagen ohne Abzug. Bei Zahlungsverzug 
                    werden Verzugszinsen in Höhe von 8% über dem Basiszinssatz berechnet.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">§ 5 Mitwirkungspflichten des Kunden</h3>
                <div className="text-muted-foreground space-y-2">
                  <p>
                    Der Kunde hat dafür zu sorgen, dass die zu räumenden Objekte zum vereinbarten Zeitpunkt 
                    zugänglich sind und die erforderlichen Genehmigungen vorliegen.
                  </p>
                  <p>
                    Der Kunde ist verpflichtet, alle zu erhaltenden Gegenstände vor Arbeitsbeginn zu kennzeichnen 
                    oder zu entfernen. Eine Haftung für versehentlich entsorgte Gegenstände ist ausgeschlossen.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">§ 6 Haftung</h3>
                <div className="text-muted-foreground space-y-2">
                  <p>
                    Der Auftragnehmer haftet für Schäden nur bei Vorsatz und grober Fahrlässigkeit. Bei 
                    leichter Fahrlässigkeit haftet er nur für die Verletzung wesentlicher Vertragspflichten.
                  </p>
                  <p>
                    Die Haftung für Vermögensschäden ist auf die Höhe des Auftragswertes begrenzt. Eine 
                    Haftung für entgangenen Gewinn ist ausgeschlossen.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">§ 7 Versicherung</h3>
                <div className="text-muted-foreground space-y-2">
                  <p>
                    Der Auftragnehmer verfügt über eine Betriebshaftpflichtversicherung mit einer 
                    Deckungssumme von 1.000.000 EUR für Personen- und Sachschäden.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">§ 8 Kündigung</h3>
                <div className="text-muted-foreground space-y-2">
                  <p>
                    Der Vertrag kann von beiden Seiten mit einer Frist von 3 Werktagen gekündigt werden. 
                    Bei kurzfristiger Absage durch den Kunden können Stornokosten berechnet werden.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">§ 9 Schlussbestimmungen</h3>
                <div className="text-muted-foreground space-y-2">
                  <p>
                    Es gilt deutsches Recht. Gerichtsstand ist Kassel. Sollten einzelne Bestimmungen 
                    unwirksam sein, bleibt die Wirksamkeit des übrigen Vertrages unberührt.
                  </p>
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Stand:</strong> Diese AGB sind gültig ab dem 1. Januar 2024.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
