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
    household: 25, // €/m²
    office: 30, // €/m²
    moving: 80, // €/hour
    messie: 35, // €/m²
    cleaning: 15, // €/m²
  };

  let basePrice = 0;
  let additionalPrice = 0;

  if (serviceType && squareMeters > 0) {
    const pricePerUnit = servicePrices[serviceType] || 0;

    if (serviceType === 'moving') {
      // Moving service is hourly rate - estimate hours based on size
      const estimatedHours = Math.max(2, Math.ceil(squareMeters / 20));
      basePrice = pricePerUnit * estimatedHours;
    } else {
      // Other services are per square meter
      basePrice = pricePerUnit * squareMeters;
    }

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
