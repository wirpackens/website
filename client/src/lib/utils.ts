import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculatePrice(
  serviceType: string,
  squareMeters: number,
  floorCount: number = 1,
  weekendService: boolean = false,
  disposalService: boolean = false
) {
  const servicePrices: Record<string, number> = {
    household: 25, // €/m² (inkl. besenreine Übergabe)
    office: 30, // €/m² (inkl. besenreine Übergabe)
    moving: 12, // €/m² (inkl. besenreine Übergabe)
    messie: 35, // €/m² (inkl. besenreine Übergabe)
  };

  let basePrice = 0;
  let additionalPrice = 0;

  if (serviceType && squareMeters > 0) {
    const pricePerUnit = servicePrices[serviceType] || 0;

    // All services are now per square meter
    basePrice = pricePerUnit * squareMeters;

    // Stockwerksberechnung: +5% pro Stockwerk, max +50% bei 10 Stockwerken
    // 1 Stockwerk = 0%, 2 Stockwerke = +5%, ..., 9 Stockwerke = +40%, 10+ Stockwerke = +50%
    const effectiveFloorCount = Math.min(floorCount, 10); // Limit bei 10 Stockwerken
    const floorSurchargePercent = effectiveFloorCount >= 10 
      ? 0.50 // Bei 10+ Stockwerken: +50%
      : (effectiveFloorCount - 1) * 0.05; // Pro zusätzliches Stockwerk: +5%
    const floorSurcharge = basePrice * floorSurchargePercent;
    additionalPrice += floorSurcharge;

    // Additional services
    if (weekendService) {
      additionalPrice += basePrice * 0.15; // 15% surcharge
    }
    if (disposalService) {
      additionalPrice += 10 * squareMeters; // 10€ per square meter
    }
  }

  return {
    basePrice: Math.round(basePrice * 100), // Convert to cents
    additionalPrice: Math.round(additionalPrice * 100), // Convert to cents
    totalPrice: Math.round((basePrice + additionalPrice) * 100), // Convert to cents
  };
}

export function formatPrice(priceInCents: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR'
  }).format(priceInCents / 100);
}
