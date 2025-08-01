import { useEffect } from "react";

declare global {
  interface Window {
    Calendly?: any;
  }
}

export default function CalendlyBooking() {
  useEffect(() => {
    // Load Calendly script if not already loaded
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    
    // Check if script is already loaded
    if (!document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]')) {
      document.head.appendChild(script);
    }

    return () => {
      // Cleanup if needed
    };
  }, []);

  return (
    <section id="contact" className="py-16 lg:py-24 bg-muted/50">
      <div className="container">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Termin vereinbaren
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Buchen Sie direkt einen kostenlosen Beratungstermin. Wir besprechen Ihr Anliegen 
            und erstellen Ihnen ein maßgeschneidertes Angebot.
          </p>
        </div>
        
        {/* Calendly Widget */}
        <div className="max-w-4xl mx-auto">
          <div 
            className="calendly-inline-widget" 
            data-url="https://calendly.com/justin-wirpackens/30min"
            style={{ minWidth: '320px', height: '700px' }}
          />
        </div>

        {/* Contact Info */}
        <div className="mt-16 grid md:grid-cols-3 gap-8 text-center">
          <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
            <div className="bg-primary/10 text-primary rounded-full p-3 w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h3 className="font-semibold text-foreground mb-2">Telefon</h3>
            <p className="text-primary font-medium">05603 123456</p>
            <p className="text-sm text-muted-foreground mt-1">Kostenlose Beratung</p>
          </div>

          <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
            <div className="bg-primary/10 text-primary rounded-full p-3 w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-foreground mb-2">E-Mail</h3>
            <p className="text-primary font-medium">kontakt@wirpackens.org</p>
            <p className="text-sm text-muted-foreground mt-1">Schnelle Antwort</p>
          </div>

          <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
            <div className="bg-primary/10 text-primary rounded-full p-3 w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-foreground mb-2">Standort</h3>
            <p className="text-foreground font-medium">Hans-Geisser-Straße 8</p>
            <p className="text-sm text-muted-foreground">34281 Gudensberg</p>
          </div>
        </div>
      </div>
    </section>
  );
}