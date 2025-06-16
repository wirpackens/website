import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Cookie, Settings, Shield, X } from "lucide-react";

interface CookieConsent {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [consent, setConsent] = useState<CookieConsent>({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const savedConsent = localStorage.getItem('cookie-consent');
    if (!savedConsent) {
      setShowBanner(true);
    } else {
      const parsedConsent = JSON.parse(savedConsent);
      setConsent(parsedConsent);
      loadCookieScripts(parsedConsent);
    }
  }, []);

  const loadCookieScripts = (consentData: CookieConsent) => {
    // Google Analytics (nur wenn Analytics-Cookies erlaubt sind)
    if (consentData.analytics) {
      const gtag = document.createElement('script');
      gtag.async = true;
      gtag.src = 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID';
      document.head.appendChild(gtag);

      const gtagConfig = document.createElement('script');
      gtagConfig.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'GA_MEASUREMENT_ID', {
          anonymize_ip: true,
          cookie_flags: 'SameSite=None;Secure'
        });
      `;
      document.head.appendChild(gtagConfig);
    }

    // Facebook Pixel (nur wenn Marketing-Cookies erlaubt sind)
    if (consentData.marketing) {
      const fbPixel = document.createElement('script');
      fbPixel.innerHTML = `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', 'YOUR_PIXEL_ID');
        fbq('track', 'PageView');
      `;
      document.head.appendChild(fbPixel);
    }
  };

  const saveConsent = (consentData: CookieConsent) => {
    localStorage.setItem('cookie-consent', JSON.stringify(consentData));
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    setConsent(consentData);
    loadCookieScripts(consentData);
    setShowBanner(false);
    setShowSettings(false);
  };

  const acceptAll = () => {
    const allConsent: CookieConsent = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    saveConsent(allConsent);
  };

  const acceptNecessary = () => {
    const necessaryOnly: CookieConsent = {
      necessary: true,
      analytics: false,
      marketing: false,
    };
    saveConsent(necessaryOnly);
  };

  const saveCustomSettings = () => {
    saveConsent(consent);
  };

  const updateConsent = (type: keyof CookieConsent, value: boolean) => {
    if (type === 'necessary') return; // Notwendige Cookies können nicht deaktiviert werden
    setConsent(prev => ({ ...prev, [type]: value }));
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white/95 backdrop-blur-sm border-t border-border shadow-lg">
        <div className="container max-w-6xl mx-auto">
          <Card className="bg-white/95 backdrop-blur-sm border border-border shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="bg-primary text-primary-foreground rounded-lg p-2 flex-shrink-0">
                  <Cookie className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-2">
                    Wir verwenden Cookies
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    Wir verwenden Cookies und ähnliche Technologien, um Ihnen ein optimales Website-Erlebnis zu bieten. 
                    Dazu gehören unbedingt erforderliche Cookies für den Betrieb der Website sowie optionale Cookies für 
                    Statistiken und Marketing. Sie können selbst entscheiden, welche Cookie-Kategorien Sie zulassen möchten.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      onClick={acceptAll}
                      className="btn-primary"
                    >
                      Alle akzeptieren
                    </Button>
                    <Button 
                      onClick={acceptNecessary}
                      variant="outline"
                      className="btn-secondary"
                    >
                      Nur notwendige
                    </Button>
                    <Dialog open={showSettings} onOpenChange={setShowSettings}>
                      <DialogTrigger asChild>
                        <Button variant="ghost" className="flex items-center">
                          <Settings className="h-4 w-4 mr-2" />
                          Einstellungen
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="flex items-center">
                            <Shield className="h-5 w-5 mr-2" />
                            Cookie-Einstellungen
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
                            <Button onClick={saveCustomSettings} className="btn-primary">
                              Einstellungen speichern
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={acceptNecessary}
                  className="flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}