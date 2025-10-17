import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Building, Phone, Mail } from "lucide-react";

export default function Impressum() {
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
            <h1 className="text-3xl font-bold text-foreground">Impressum</h1>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="h-5 w-5 mr-2" />
                Angaben gemäß § 5 TMG
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Firma</h3>
                <p className="text-muted-foreground">Wir Packens UG (haftungsbeschränkt)</p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Anschrift</h3>
                <p className="text-muted-foreground">
                  Hans-Geisser-Straße 8<br />
                  34281 Gudensberg<br />
                  Deutschland
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Kontakt</h3>
                <div className="space-y-1 text-muted-foreground">
                  <p className="flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    Telefon: 05603 123456
                  </p>
                  <p className="flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    E-Mail: kontakt@wirpackens.org
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Geschäftsführer</h3>
                <p className="text-muted-foreground">Max Mustermann</p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Registereintrag</h3>
                <div className="text-muted-foreground">
                  <p>Eintragung im Handelsregister</p>
                  <p>Registergericht: Amtsgericht Kassel</p>
                  <p>Registernummer: HRB 13024</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Umsatzsteuer-ID</h3>
                <p className="text-muted-foreground">
                  Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:<br />
                  DE123456789
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h3>
                <p className="text-muted-foreground">
                  Justin Haesler und Christian Ritter<br />
                  Hans-Geisser-Straße 8<br />
                  34281 Gudensberg
                </p>
              </div>


              <div>
                <h3 className="font-semibold text-foreground mb-2">Verbraucherstreitbeilegung/Universalschlichtungsstelle</h3>
                <p className="text-muted-foreground">
                  Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer 
                  Verbraucherschlichtungsstelle teilzunehmen.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
