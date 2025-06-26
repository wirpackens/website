import { CheckCircle, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function FreeInspectionBanner() {
  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6 mb-8">
      <div className="flex items-center gap-4">
        <div className="bg-green-100 rounded-full p-3">
          <MapPin className="h-6 w-6 text-green-600" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
              Kostenlos
            </Badge>
            <h3 className="text-lg font-semibold text-gray-900">
              Unverbindliche Sichtprüfung vor Ort
            </h3>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-gray-700 mb-1">
                <strong>Bis 30km von Gudensberg:</strong> Vollkommen kostenlose Besichtigung Ihrer Räumlichkeiten
              </p>
              <p className="text-sm text-gray-600">
                Wir kommen zu Ihnen, schauen uns alles an und erstellen ein präzises, 
                transparentes Angebot – ohne versteckte Kosten oder Verpflichtungen.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}