import 'dotenv/config';
import { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import Stripe from 'stripe';
import { storage } from '../server/storage';
import { insertContactSchema, insertPriceCalculationSchema, insertBookingSchema } from '../shared/schema';
import { sendContactEmail, sendPriceCalculationEmail } from '../server/email';

// Initialize Stripe
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = new Stripe(stripeSecretKey || "sk_test_placeholder", {
  apiVersion: "2025-08-27.basil",
});

// Helper function to get service type label
function getServiceTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    household: "Haushaltsauflösung",
    office: "Büroentrümpelung", 
    moving: "Umzug",
    messie: "Messiewohnung"
  };
  return labels[type] || type;
}

// Vercel serverless function handler
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    console.log('🚀 Vercel Function called:', req.method, req.url);
    console.log('🌍 Environment Check:', {
      NODE_ENV: process.env.NODE_ENV,
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ? `Gesetzt (${process.env.STRIPE_SECRET_KEY.substring(0, 7)}...)` : 'NICHT GESETZT',
      BASE_URL: process.env.BASE_URL || 'NICHT GESETZT'
    });
    
    // Set CORS headers for all requests
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Permissions-Policy', 'payment=(self "https://js.stripe.com" "https://checkout.stripe.com")');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }

    // Extract path from URL
    const path = req.url?.split('?')[0] || '';
    console.log('📍 Request path:', path);

    // Route handling
    if (path === '/api/health' && req.method === 'GET') {
      return handleHealth(req, res);
    } else if (path === '/api/contact' && req.method === 'POST') {
      return handleContact(req, res);
    } else if (path === '/api/contacts' && req.method === 'GET') {
      return handleGetContacts(req, res);
    } else if (path === '/api/price-calculation' && req.method === 'POST') {
      return handlePriceCalculation(req, res);
    } else if (path === '/api/price-calculations' && req.method === 'GET') {
      return handleGetPriceCalculations(req, res);
    } else if (path === '/api/bookings' && req.method === 'POST') {
      return handleBookings(req, res);
    } else if (path === '/api/bookings' && req.method === 'GET') {
      return handleGetBookings(req, res);
    } else if (path === '/api/stripe-webhook' && req.method === 'POST') {
      return handleStripeWebhook(req, res);
    } else if (path.startsWith('/api/booking-success/') && req.method === 'GET') {
      const sessionId = path.split('/').pop();
      return handleBookingSuccess(req, res, sessionId);
    } else {
      res.status(404).json({ success: false, message: 'Route not found', path });
    }
  } catch (error) {
    console.error('❌ Vercel Function Error:', error);
    console.error('❌ Error Stack:', error instanceof Error ? error.stack : 'No stack trace');
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
}

// Health check handler
async function handleHealth(req: VercelRequest, res: VercelResponse) {
  console.log("🏥 Health check called");
  res.json({
    success: true,
    message: "API is working",
    timestamp: new Date().toISOString(),
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      STRIPE_KEY_PRESENT: !!process.env.STRIPE_SECRET_KEY,
      BASE_URL: process.env.BASE_URL
    }
  });
}

// Contact handler
async function handleContact(req: VercelRequest, res: VercelResponse) {
  try {
    const validatedData = insertContactSchema.parse(req.body);
    const contact = await storage.createContact(validatedData);
    
    const emailSent = await sendContactEmail({
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      email: validatedData.email,
      phone: validatedData.phone || undefined,
      service: validatedData.service || undefined,
      message: validatedData.message || undefined,
    });
    
    if (!emailSent) {
      console.warn('E-Mail konnte nicht gesendet werden, aber Kontakt wurde gespeichert');
    }
    
    res.json({ success: true, contact, emailSent });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ 
        success: false, 
        message: "Ungültige Formulardaten", 
        errors: error.errors 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: "Fehler beim Senden der Nachricht" 
      });
    }
  }
}

// Get contacts handler
async function handleGetContacts(req: VercelRequest, res: VercelResponse) {
  try {
    const contacts = await storage.getContacts();
    res.json({ success: true, contacts });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Fehler beim Laden der Kontakte" 
    });
  }
}

// Price calculation handler
async function handlePriceCalculation(req: VercelRequest, res: VercelResponse) {
  try {
    const validatedData = insertPriceCalculationSchema.parse(req.body);
    const calculation = await storage.createPriceCalculation(validatedData);
    
    const emailSent = await sendPriceCalculationEmail({
      serviceType: validatedData.serviceType,
      roomCount: validatedData.roomCount,
      squareMeters: validatedData.squareMeters,
      expressService: Boolean(validatedData.expressService),
      weekendService: Boolean(validatedData.weekendService),
      disposalService: Boolean(validatedData.disposalService),
      basePrice: validatedData.basePrice,
      additionalPrice: validatedData.additionalPrice,
      totalPrice: validatedData.totalPrice,
    });
    
    if (!emailSent) {
      console.warn('E-Mail konnte nicht gesendet werden, aber Berechnung wurde gespeichert');
    }
    
    res.json({ success: true, calculation, emailSent });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ 
        success: false, 
        message: "Ungültige Berechnungsdaten", 
        errors: error.errors 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: "Fehler beim Speichern der Berechnung" 
      });
    }
  }
}

// Get price calculations handler
async function handleGetPriceCalculations(req: VercelRequest, res: VercelResponse) {
  try {
    const calculations = await storage.getPriceCalculations();
    res.json({ success: true, calculations });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Fehler beim Laden der Berechnungen" 
    });
  }
}

// Bookings handler
async function handleBookings(req: VercelRequest, res: VercelResponse) {
  try {
    console.log("🚀 Neue Buchungsanfrage erhalten:", JSON.stringify(req.body, null, 2));
    console.log("🔧 Stripe Key Status:", stripeSecretKey ? `Gesetzt (${stripeSecretKey.substring(0, 7)}...)` : "NICHT GESETZT");
    
    // Check if Stripe is properly configured
    if (!stripeSecretKey || stripeSecretKey === "sk_test_placeholder") {
      console.error("❌ Stripe nicht konfiguriert - kann keine Zahlung verarbeiten");
      return res.status(500).json({
        success: false,
        message: "Zahlungssystem ist nicht konfiguriert. Bitte kontaktieren Sie den Administrator.",
        error: "STRIPE_NOT_CONFIGURED"
      });
    }
    
    console.log("📝 Starte Validierung der Buchungsdaten...");
    const validatedData = insertBookingSchema.parse(req.body);
    console.log("✅ Buchungsdaten validiert:", validatedData);
    
    // Create booking in storage
    console.log("💾 Erstelle Buchung in Storage...");
    const booking = await storage.createBooking(validatedData);
    console.log("✅ Buchung in Storage erstellt:", booking.id);
    
    // Create Stripe payment intent
    const depositAmount = validatedData.depositAmount || 20000;
    console.log("💳 Erstelle Stripe Payment Intent für:", depositAmount, "Cent");
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: depositAmount,
      currency: 'eur',
      metadata: {
        bookingId: booking.id.toString(),
        customerEmail: validatedData.customerEmail,
        serviceType: validatedData.serviceType,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });
    console.log("✅ Payment Intent erstellt:", paymentIntent.id);

    // Update booking with payment intent ID
    await storage.updateBooking(booking.id, {
      stripePaymentIntentId: paymentIntent.id,
    });
    console.log("✅ Buchung mit Payment Intent ID aktualisiert");

    // Create Stripe Checkout Session
    const baseUrl = process.env.BASE_URL || 'https://www.wirpackens.org';
    console.log("🌐 Base URL für Redirects:", baseUrl);
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Anzahlung - ${getServiceTypeLabel(validatedData.serviceType)}`,
              description: `Termin am ${validatedData.appointmentDate.toLocaleDateString('de-DE')} um ${validatedData.appointmentTime}`,
            },
            unit_amount: depositAmount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${baseUrl}/booking-success?session_id={CHECKOUT_SESSION_ID}&booking_id=${booking.id}`,
      cancel_url: `${baseUrl}/booking-cancelled?booking_id=${booking.id}`,
      metadata: {
        bookingId: booking.id.toString(),
      },
    });
    console.log("✅ Checkout Session erstellt:", session.id);

    res.json({ 
      success: true, 
      booking, 
      paymentUrl: session.url,
      sessionId: session.id 
    });
  } catch (error: unknown) {
    console.error("❌ DETAILLIERTER FEHLER beim Erstellen der Buchung:", error);
    
    if (error instanceof z.ZodError) {
      res.status(400).json({ 
        success: false, 
        message: "Ungültige Buchungsdaten", 
        errors: error.errors,
        errorType: "VALIDATION_ERROR"
      });
    } else if (error && typeof error === 'object' && 'type' in error && (error as any).type === 'StripeError') {
      const stripeError = error as any;
      console.error("❌ Stripe-Fehler Details:", stripeError);
      res.status(400).json({ 
        success: false, 
        message: `Stripe-Fehler: ${stripeError.message}`,
        stripeError: stripeError.code,
        errorType: "STRIPE_ERROR"
      });
    } else {
      const errorMessage = error && typeof error === 'object' && 'message' in error 
        ? (error as any).message 
        : 'Unbekannter Fehler';
        
      res.status(500).json({ 
        success: false, 
        message: "Fehler beim Erstellen der Buchung",
        error: errorMessage,
        errorType: "UNKNOWN_ERROR"
      });
    }
  }
}

// Get bookings handler
async function handleGetBookings(req: VercelRequest, res: VercelResponse) {
  try {
    const bookings = await storage.getBookings();
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Fehler beim Laden der Buchungen" 
    });
  }
}

// Stripe webhook handler
async function handleStripeWebhook(req: VercelRequest, res: VercelResponse) {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body as string, sig as string, process.env.STRIPE_WEBHOOK_SECRET || "");
  } catch (err: any) {
    console.log(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      const bookingId = parseInt(session.metadata?.bookingId || "0");
      
      if (bookingId) {
        await storage.updateBooking(bookingId, {
          paymentStatus: "paid",
          bookingStatus: "confirmed",
        });
        
        console.log(`Payment confirmed for booking ${bookingId}`);
      }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
}

// Booking success handler
async function handleBookingSuccess(req: VercelRequest, res: VercelResponse, sessionId?: string) {
  try {
    if (!sessionId) {
      return res.status(400).json({ success: false, message: "Session ID fehlt" });
    }
    
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const bookingId = parseInt(session.metadata?.bookingId || "0");
    
    if (bookingId) {
      const booking = await storage.getBooking(bookingId);
      res.json({ success: true, booking, session });
    } else {
      res.status(404).json({ success: false, message: "Buchung nicht gefunden" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Fehler beim Laden der Buchungsdaten" });
  }
}