import { Link } from "wouter";
import { Package } from "lucide-react";
import CookieSettingsButton from "@/components/cookie-settings-button";

export default function Footer() {
  const services = [
    { name: "Haushaltsauflösung", href: "#services" },
    { name: "Büroentrümpelung", href: "#services" },
    { name: "Umzugsservice", href: "#services" },
    { name: "Messiewohnung", href: "#services" },
    { name: "Besenrein-Säuberung", href: "#services" },
    { name: "Preisrechner", href: "#calculator" },
  ];

  const legalPages = [
    { name: "Impressum", href: "/impressum" },
    { name: "Datenschutzerklärung", href: "/datenschutz" },
    { name: "AGB", href: "/agb" },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId.slice(1));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-foreground text-background py-12 lg:py-16">
      <div className="container">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-primary text-primary-foreground rounded-lg p-2">
                <Package className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Wir Packens</h3>
                <p className="text-sm text-muted-foreground">UG</p>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Ihr zuverlässiger Partner für professionelle Entrümpelungen, Haushaltsauflösungen und Umzüge in Hessen.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Unsere Leistungen</h4>
            <ul className="space-y-3 text-muted-foreground">
              {services.map((service) => (
                <li key={service.name}>
                  {service.href.startsWith('#') ? (
                    <button
                      onClick={() => scrollToSection(service.href)}
                      className="hover:text-background transition-colors text-left"
                    >
                      {service.name}
                    </button>
                  ) : (
                    <Link href={service.href} className="hover:text-background transition-colors">
                      {service.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Kontakt</h4>
            <div className="space-y-3 text-muted-foreground">
              <div className="flex items-center space-x-3">
                <svg className="h-5 w-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <a 
                  href="http://wa.me/491775248500" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  +491775248500
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <svg className="h-5 w-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span>kontakt@wirpackens.org</span>
              </div>
              <div className="flex items-start space-x-3">
                <svg className="h-5 w-5 text-primary mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <div>
                  <div>Gudensberg, Hessen</div>
                  <div className="text-sm">100km Einsatzradius</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <svg className="h-5 w-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span>Mo-Fr: 7:00-18:00 Uhr</span>
              </div>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Rechtliches</h4>
            <ul className="space-y-3 text-muted-foreground">
              {legalPages.map((page) => (
                <li key={page.name}>
                  <Link href={page.href} className="hover:text-background transition-colors">
                    {page.name}
                  </Link>
                </li>
              ))}
            </ul>

          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-muted-foreground/20 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <div className="text-muted-foreground text-sm">
              © 2024 Wir Packens UG. Alle Rechte vorbehalten.
            </div>
            <div className="flex flex-col lg:flex-row items-center space-y-2 lg:space-y-0 lg:space-x-6 text-muted-foreground text-sm">
              <div className="flex items-center space-x-6">
                <span>Handelsregister: HRB 13024</span>
              </div>
              <CookieSettingsButton />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
