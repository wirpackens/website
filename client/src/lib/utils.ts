import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculatePrice(
  serviceType: string,
  squareMeters: number,
  expressService: boolean = false,
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

    // Additional services
    if (expressService) {
      additionalPrice += basePrice * 0.2; // 20% surcharge
    }
    if (weekendService) {
      additionalPrice += basePrice * 0.15; // 15% surcharge
    }
    if (disposalService) {
      additionalPrice += 10 * squareMeters; // 10€ per square meter
    }
  }

  return {
    basePrice: Math.round(basePrice),
    additionalPrice: Math.round(additionalPrice),
    totalPrice: Math.round(basePrice + additionalPrice),
  };
}

export function formatPrice(price: number): string {
  return `${price.toLocaleString('de-DE')}€`;
}
