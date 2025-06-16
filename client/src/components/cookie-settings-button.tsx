import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Settings, Shield } from "lucide-react";

interface CookieConsent {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

export default function CookieSettingsButton() {
  const [showSettings, setShowSettings] = useState(false);
  const [consent, setConsent] = useState<CookieConsent>(() => {
    const saved = localStorage.getItem('cookie-consent');
    return saved ? JSON.parse(saved) : {
      necessary: true,
      analytics: false,
      marketing: false,
    };
  });

  const updateConsent = (type: keyof CookieConsent, value: boolean) => {
    if (type === 'necessary') return;
    setConsent(prev => ({ ...prev, [type]: value }));
  };

  const saveSettings = () => {
    localStorage.setItem('cookie-consent', JSON.stringify(consent));
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    setShowSettings(false);
    
    // Reload page to apply new cookie settings
    window.location.reload();
  };

  return (
    <Dialog open={showSettings} onOpenChange={setShowSettings}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
          <Settings className="h-4 w-4 mr-2" />
          Cookie-Einstellungen
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Cookie-Einstellungen verwalten
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* Notwendige Cookies */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-foreground">Notwendige Cookies</h4>
                <p className="text-sm text-muted-foreground">
                  Diese Cookies sind für die Grundfunktionen der Website erforderlich.
                </p>
              </div>
              <Checkbox 
                checked={true} 
                disabled={true}
                className="opacity-50"
              />
            </div>
            <div className="bg-muted p-3 rounded-lg text-sm text-muted-foreground">
              <strong>Zweck:</strong> Session-Management, Sicherheit, Cookie-Einstellungen speichern<br />
              <strong>Speicherdauer:</strong> Session oder 1 Jahr<br />
              <strong>Anbieter:</strong> Wir Packens UG
            </div>
          </div>

          {/* Analytics Cookies */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-foreground">Analyse-Cookies</h4>
                <p className="text-sm text-muted-foreground">
                  Helfen uns zu verstehen, wie Sie unsere Website nutzen.
                </p>
              </div>
              <Checkbox 
                checked={consent.analytics}
                onCheckedChange={(checked) => updateConsent('analytics', checked === true)}
              />
            </div>
            <div className="bg-muted p-3 rounded-lg text-sm text-muted-foreground">
              <strong>Zweck:</strong> Website-Analyse, Besucherstatistiken, Leistungsoptimierung<br />
              <strong>Speicherdauer:</strong> 2 Jahre<br />
              <strong>Anbieter:</strong> Google Analytics (anonymisiert)
            </div>
          </div>

          {/* Marketing Cookies */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-foreground">Marketing-Cookies</h4>
                <p className="text-sm text-muted-foreground">
                  Werden verwendet, um personalisierte Werbung anzuzeigen.
                </p>
              </div>
              <Checkbox 
                checked={consent.marketing}
                onCheckedChange={(checked) => updateConsent('marketing', checked === true)}
              />
            </div>
            <div className="bg-muted p-3 rounded-lg text-sm text-muted-foreground">
              <strong>Zweck:</strong> Personalisierte Werbung, Conversion-Tracking<br />
              <strong>Speicherdauer:</strong> 1 Jahr<br />
              <strong>Anbieter:</strong> Facebook, Google Ads
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-blue-900 mb-1">Ihre Rechte</p>
                <p className="text-blue-800">
                  Sie können Ihre Einwilligung jederzeit widerrufen oder ändern. 
                  Weitere Informationen finden Sie in unserer{" "}
                  <a href="/datenschutz" className="underline hover:no-underline">
                    Datenschutzerklärung
                  </a>.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-border">
            <Button 
              variant="outline" 
              onClick={() => setShowSettings(false)}
            >
              Abbrechen
            </Button>
            <Button onClick={saveSettings} className="btn-primary">
              Einstellungen speichern
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}