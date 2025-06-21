import { Badge } from "@/components/ui/badge";
import { Shield, X } from "lucide-react";
import { useState } from "react";

export default function PriceGuaranteeBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-secondary to-secondary/80 text-secondary-foreground border-b border-secondary/20">
      <div className="container">
        <div className="flex items-center justify-start md:justify-center py-3 px-4 relative">
          <div className="flex items-center gap-3">
            <div className="bg-secondary-foreground/10 rounded-full p-2">
              <Shield className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="bg-white/10 text-secondary-foreground border-white/20">
                Festpreisgarantie
              </Badge>
              <span className="text-sm font-medium">
                Keine versteckten Kosten – Sie zahlen nur den vorher kalkulierten Preis
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="absolute right-4 text-secondary-foreground/60 hover:text-secondary-foreground transition-colors p-1"
            aria-label="Banner schließen"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}