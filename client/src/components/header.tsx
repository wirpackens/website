import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Phone, Truck } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  const navigation = [
    { name: "Leistungen", href: "#services" },
    { name: "Preisrechner", href: "#calculator" },
    { name: "Über uns", href: "#about" },
    { name: "Kontakt", href: "#contact" },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-border sticky top-0 z-50">
      <div className="container">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="bg-primary text-primary-foreground rounded-lg p-2">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-foreground">Wir packens</h1>
              <p className="text-xs text-muted-foreground hidden lg:block">Entrümplung UG</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href.slice(1))}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* Contact Info & CTA */}
          <div className="flex items-center space-x-4">
            <div className="hidden lg:block text-right">
              <p className="text-sm font-medium text-foreground">
                <Phone className="inline h-4 w-4 text-primary mr-1" />
                05603 123456
              </p>
              <p className="text-xs text-muted-foreground">Kostenlose Beratung</p>
            </div>
            <Button 
              onClick={() => scrollToSection('contact')}
              className="btn-primary"
            >
              Angebot anfordern
            </Button>
            
            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <div className="flex flex-col space-y-4 mt-8">
                  {navigation.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => scrollToSection(item.href.slice(1))}
                      className="text-left py-2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      {item.name}
                    </button>
                  ))}
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm font-medium text-foreground">
                      <Phone className="inline h-4 w-4 text-primary mr-1" />
                      05603 123456
                    </p>
                    <p className="text-xs text-muted-foreground">Kostenlose Beratung</p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
