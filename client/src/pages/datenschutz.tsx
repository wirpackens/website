import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield } from "lucide-react";

export default function Datenschutz() {
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
            <h1 className="text-3xl font-bold text-foreground">Datenschutzerklärung</h1>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Datenschutz
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-foreground mb-2">1. Datenschutz auf einen Blick</h3>
                <div className="text-muted-foreground space-y-2">
                  <p>
                    Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen 
                    Daten passiert, wenn Sie unsere Website besuchen. Personenbezogene Daten sind alle Daten, mit 
                    denen Sie persönlich identifiziert werden können.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">2. Allgemeine Hinweise und Pflichtinformationen</h3>
                <div className="text-muted-foreground space-y-2">
                  <h4 className="font-semibold text-foreground">Datenschutz</h4>
                  <p>
                    Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln 
                    Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften 
                    sowie dieser Datenschutzerklärung.
                  </p>
                  <p>
                    Wenn Sie diese Website benutzen, werden verschiedene personenbezogene Daten erhoben. 
                    Personenbezogene Daten sind Daten, mit denen Sie persönlich identifiziert werden können.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">3. Datenerfassung auf unserer Website</h3>
                <div className="text-muted-foreground space-y-2">
                  <h4 className="font-semibold text-foreground">Wer ist verantwortlich für die Datenerfassung auf dieser Website?</h4>
                  <p>
                    Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten 
                    können Sie dem Impressum dieser Website entnehmen.
                  </p>
                  
                  <h4 className="font-semibold text-foreground">Wie erfassen wir Ihre Daten?</h4>
                  <p>
                    Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich 
                    z. B. um Daten handeln, die Sie in ein Kontaktformular eingeben.
                  </p>
                  <p>
                    Andere Daten werden automatisch beim Besuch der Website durch unsere IT-Systeme erfasst. Das sind 
                    vor allem technische Daten (z. B. Internetbrowser, Betriebssystem oder Uhrzeit des Seitenaufrufs).
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">4. Kontaktformular</h3>
                <div className="text-muted-foreground space-y-2">
                  <p>
                    Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem 
                    Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der 
                    Anfrage und für den Fall von Anschlussfragen bei uns gespeichert.
                  </p>
                  <p>
                    Diese Daten geben wir nicht ohne Ihre Einwilligung weiter. Die Verarbeitung der in das 
                    Kontaktformular eingegebenen Daten erfolgt somit ausschließlich auf Grundlage Ihrer Einwilligung 
                    (Art. 6 Abs. 1 lit. a DSGVO).
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">5. Ihre Rechte</h3>
                <div className="text-muted-foreground space-y-2">
                  <p>Sie haben jederzeit das Recht:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten</li>
                    <li>eine Berichtigung oder Löschung dieser Daten zu verlangen</li>
                    <li>eine Einschränkung der Datenverarbeitung zu verlangen</li>
                    <li>der Datenverarbeitung zu widersprechen</li>
                    <li>eine Datenübertragbarkeit zu verlangen</li>
                  </ul>
                  <p>
                    Bei Fragen zum Datenschutz wenden Sie sich bitte an uns unter den im Impressum angegebenen Kontaktdaten.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">6. Widerspruchsrecht</h3>
                <div className="text-muted-foreground space-y-2">
                  <p>
                    Sie haben das Recht, jederzeit gegen die Verarbeitung Ihrer personenbezogenen Daten, die aufgrund 
                    von Art. 6 Abs. 1 lit. e oder f DSGVO erfolgt, Widerspruch einzulegen. Dies gilt auch für ein auf 
                    diese Bestimmungen gestütztes Profiling.
                  </p>
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Hinweis:</strong> Diese Datenschutzerklärung wurde zuletzt am 1. Januar 2024 aktualisiert.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
