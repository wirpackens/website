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
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substring(7);
  
  try {
    console.log(`🚀 [${requestId}] ===== VERCEL FUNCTION START =====`);
    console.log(`🚀 [${requestId}] Method: ${req.method}`);
    console.log(`🚀 [${requestId}] URL: ${req.url}`);
    console.log(`🚀 [${requestId}] Headers:`, JSON.stringify(req.headers, null, 2));
    console.log(`🚀 [${requestId}] Query:`, JSON.stringify(req.query, null, 2));
    
    // Log request body for POST requests
    if (req.method === 'POST' && req.body) {
      console.log(`🚀 [${requestId}] Body Type:`, typeof req.body);
      console.log(`🚀 [${requestId}] Body:`, JSON.stringify(req.body, null, 2));
    }
    
    console.log(`🌍 [${requestId}] Environment Check:`, {
      NODE_ENV: process.env.NODE_ENV,
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ? `Gesetzt (${process.env.STRIPE_SECRET_KEY.substring(0, 7)}...)` : 'NICHT GESETZT',
      BASE_URL: process.env.BASE_URL || 'NICHT GESETZT',
      STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET ? 'Gesetzt' : 'NICHT GESETZT'
    });
    
    console.log(`🔧 [${requestId}] Setting CORS headers...`);
    // Set CORS headers for all requests
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Permissions-Policy', 'payment=(self "https://js.stripe.com" "https://checkout.stripe.com")');
    console.log(`✅ [${requestId}] CORS headers set`);
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      console.log(`✈️ [${requestId}] Handling OPTIONS preflight request`);
      res.status(200).end();
      return;
    }

    // Extract path from URL
    const path = req.url?.split('?')[0] || '';
    console.log(`📍 [${requestId}] Extracted path: "${path}"`);
    console.log(`🔍 [${requestId}] Path analysis:`, {
      originalUrl: req.url,
      extractedPath: path,
      pathLength: path.length,
      pathStartsWith: {
        '/api/': path.startsWith('/api/'),
        '/api/health': path === '/api/health',
        '/api/bookings': path === '/api/bookings'
      }
    });

    // Route handling with detailed logging
    console.log(`🛣️ [${requestId}] Starting route matching...`);
    
    if (path === '/api/health' && req.method === 'GET') {
      console.log(`✅ [${requestId}] Route matched: GET /api/health`);
      return handleHealth(req, res, requestId);
    } else if (path === '/api/contact' && req.method === 'POST') {
      console.log(`✅ [${requestId}] Route matched: POST /api/contact`);
      return handleContact(req, res, requestId);
    } else if (path === '/api/contacts' && req.method === 'GET') {
      console.log(`✅ [${requestId}] Route matched: GET /api/contacts`);
      return handleGetContacts(req, res, requestId);
    } else if (path === '/api/price-calculation' && req.method === 'POST') {
      console.log(`✅ [${requestId}] Route matched: POST /api/price-calculation`);
      return handlePriceCalculation(req, res, requestId);
    } else if (path === '/api/price-calculations' && req.method === 'GET') {
      console.log(`✅ [${requestId}] Route matched: GET /api/price-calculations`);
      return handleGetPriceCalculations(req, res, requestId);
    } else if (path === '/api/bookings' && req.method === 'POST') {
      console.log(`✅ [${requestId}] Route matched: POST /api/bookings - ENTERING BOOKING HANDLER`);
      return handleBookings(req, res, requestId);
    } else if (path === '/api/bookings' && req.method === 'GET') {
      console.log(`✅ [${requestId}] Route matched: GET /api/bookings`);
      return handleGetBookings(req, res, requestId);
    } else if (path === '/api/stripe-webhook' && req.method === 'POST') {
      console.log(`✅ [${requestId}] Route matched: POST /api/stripe-webhook`);
      return handleStripeWebhook(req, res, requestId);
    } else if (path.startsWith('/api/booking-success/') && req.method === 'GET') {
      const sessionId = path.split('/').pop();
      console.log(`✅ [${requestId}] Route matched: GET /api/booking-success/${sessionId}`);
      return handleBookingSuccess(req, res, requestId, sessionId);
    } else {
      console.log(`❌ [${requestId}] No route matched! Available routes:`, {
        path,
        method: req.method,
        availableRoutes: [
          'GET /api/health',
          'POST /api/contact',
          'GET /api/contacts', 
          'POST /api/price-calculation',
          'GET /api/price-calculations',
          'POST /api/bookings',
          'GET /api/bookings',
          'POST /api/stripe-webhook',
          'GET /api/booking-success/:sessionId'
        ]
      });
      res.status(404).json({ 
        success: false, 
        message: 'Route not found', 
        path,
        method: req.method,
        requestId 
      });
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
async function handleHealth(req: VercelRequest, res: VercelResponse, requestId: string) {
  console.log(`🏥 [${requestId}] Health check called`);
  console.log(`🏥 [${requestId}] Preparing health response...`);
  
  const healthData = {
    success: true,
    message: "API is working",
    timestamp: new Date().toISOString(),
    requestId,
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      STRIPE_KEY_PRESENT: !!process.env.STRIPE_SECRET_KEY,
      BASE_URL: process.env.BASE_URL
    }
  };
  
  console.log(`🏥 [${requestId}] Health response:`, JSON.stringify(healthData, null, 2));
  console.log(`🏥 [${requestId}] Sending health response...`);
  
  res.json(healthData);
  
  console.log(`✅ [${requestId}] Health response sent successfully`);
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
async function handleBookings(req: VercelRequest, res: VercelResponse, requestId: string) {
  try {
    console.log(`💼 [${requestId}] ===== BOOKING HANDLER START =====`);
    console.log(`💼 [${requestId}] Neue Buchungsanfrage erhalten`);
    console.log(`💼 [${requestId}] Request body type:`, typeof req.body);
    console.log(`💼 [${requestId}] Request body:`, JSON.stringify(req.body, null, 2));
    
    console.log(`🔧 [${requestId}] Checking Stripe configuration...`);
    console.log(`🔧 [${requestId}] Stripe Key Status:`, stripeSecretKey ? `Gesetzt (${stripeSecretKey.substring(0, 7)}...)` : "NICHT GESETZT");
    console.log(`🔧 [${requestId}] Stripe Key Length:`, stripeSecretKey ? stripeSecretKey.length : 0);
    console.log(`🔧 [${requestId}] Stripe Key Type:`, stripeSecretKey ? (stripeSecretKey.startsWith('sk_live') ? 'LIVE' : 'TEST') : 'NONE');
    
    // Check if Stripe is properly configured
    if (!stripeSecretKey || stripeSecretKey === "sk_test_placeholder") {
      console.error(`❌ [${requestId}] Stripe nicht konfiguriert - kann keine Zahlung verarbeiten`);
      console.error(`❌ [${requestId}] Stripe Key Details:`, {
        present: !!stripeSecretKey,
        isPlaceholder: stripeSecretKey === "sk_test_placeholder",
        envVarPresent: !!process.env.STRIPE_SECRET_KEY
      });
      
      const errorResponse = {
        success: false,
        message: "Zahlungssystem ist nicht konfiguriert. Bitte kontaktieren Sie den Administrator.",
        error: "STRIPE_NOT_CONFIGURED",
        requestId,
        debug: {
          stripeKeyPresent: !!stripeSecretKey,
          stripeKeyLength: stripeSecretKey ? stripeSecretKey.length : 0,
          envVarPresent: !!process.env.STRIPE_SECRET_KEY
        }
      };
      
      console.log(`❌ [${requestId}] Sending error response:`, JSON.stringify(errorResponse, null, 2));
      return res.status(500).json(errorResponse);
    }
    
    console.log(`📝 [${requestId}] Starte Validierung der Buchungsdaten...`);
    console.log(`📝 [${requestId}] Schema validation starting...`);
    
    let validatedData;
    try {
      validatedData = insertBookingSchema.parse(req.body);
      console.log(`✅ [${requestId}] Schema validation successful`);
      console.log(`✅ [${requestId}] Buchungsdaten validiert:`, JSON.stringify(validatedData, null, 2));
    } catch (validationError) {
      console.error(`❌ [${requestId}] Schema validation failed:`, validationError);
      throw validationError;
    }
    
    // Create booking in storage
    console.log(`💾 [${requestId}] Erstelle Buchung in Storage...`);
    console.log(`💾 [${requestId}] Calling storage.createBooking with data:`, JSON.stringify(validatedData, null, 2));
    
    let booking;
    try {
      booking = await storage.createBooking(validatedData);
      console.log(`✅ [${requestId}] Buchung in Storage erstellt mit ID:`, booking.id);
      console.log(`✅ [${requestId}] Booking object:`, JSON.stringify(booking, null, 2));
    } catch (storageError) {
      console.error(`❌ [${requestId}] Storage error:`, storageError);
      throw storageError;
    }
    
    // Create Stripe payment intent
    const depositAmount = validatedData.depositAmount || 20000;
    console.log(`💳 [${requestId}] Erstelle Stripe Payment Intent für:`, depositAmount, "Cent");
    console.log(`💳 [${requestId}] Payment Intent Konfiguration:`, {
      amount: depositAmount,
      currency: 'eur',
      bookingId: booking.id,
      customerEmail: validatedData.customerEmail,
      serviceType: validatedData.serviceType
    });
    
    let paymentIntent;
    try {
      paymentIntent = await stripe.paymentIntents.create({
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
      console.log(`✅ [${requestId}] Payment Intent erstellt:`, paymentIntent.id);
      console.log(`✅ [${requestId}] Payment Intent Details:`, {
        id: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: paymentIntent.status
      });
    } catch (stripeError) {
      console.error(`❌ [${requestId}] Stripe Payment Intent Error:`, stripeError);
      throw stripeError;
    }

    // Update booking with payment intent ID
    console.log(`🔄 [${requestId}] Aktualisiere Buchung mit Payment Intent ID...`);
    try {
      await storage.updateBooking(booking.id, {
        stripePaymentIntentId: paymentIntent.id,
      });
      console.log(`✅ [${requestId}] Buchung mit Payment Intent ID aktualisiert`);
    } catch (updateError) {
      console.error(`❌ [${requestId}] Booking update error:`, updateError);
      throw updateError;
    }

    // Create Stripe Checkout Session
    const baseUrl = process.env.BASE_URL || 'https://www.wirpackens.org';
    console.log(`🌐 [${requestId}] Base URL für Redirects:`, baseUrl);
    
    const sessionConfig = {
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
    };
    
    console.log(`🛒 [${requestId}] Checkout Session Konfiguration:`, JSON.stringify(sessionConfig, null, 2));
    
    let session;
    try {
      session = await stripe.checkout.sessions.create(sessionConfig);
      console.log(`✅ [${requestId}] Checkout Session erstellt:`, session.id);
      console.log(`✅ [${requestId}] Session URL:`, session.url);
    } catch (checkoutError) {
      console.error(`❌ [${requestId}] Stripe Checkout Session Error:`, checkoutError);
      throw checkoutError;
    }

    const responseData = { 
      success: true, 
      booking, 
      paymentUrl: session.url,
      sessionId: session.id,
      requestId
    };
    
    console.log(`📤 [${requestId}] Preparing success response:`, JSON.stringify(responseData, null, 2));
    console.log(`📤 [${requestId}] Sending response...`);
    
    res.json(responseData);
    
    console.log(`✅ [${requestId}] ===== BOOKING HANDLER SUCCESS =====`);
  } catch (error: unknown) {
    console.error(`❌ [${requestId}] ===== BOOKING HANDLER ERROR =====`);
    console.error(`❌ [${requestId}] DETAILLIERTER FEHLER beim Erstellen der Buchung:`, error);
    console.error(`❌ [${requestId}] Error type:`, typeof error);
    console.error(`❌ [${requestId}] Error constructor:`, error?.constructor?.name);
    
    if (error && typeof error === 'object') {
      console.error(`❌ [${requestId}] Error properties:`, Object.keys(error));
      if ('stack' in error) {
        console.error(`❌ [${requestId}] Stack trace:`, (error as any).stack);
      }
    }
    
    if (error instanceof z.ZodError) {
      console.error(`❌ [${requestId}] Zod validation error details:`, JSON.stringify(error.errors, null, 2));
      const errorResponse = { 
        success: false, 
        message: "Ungültige Buchungsdaten", 
        errors: error.errors,
        errorType: "VALIDATION_ERROR",
        requestId
      };
      console.log(`❌ [${requestId}] Sending validation error response:`, JSON.stringify(errorResponse, null, 2));
      res.status(400).json(errorResponse);
    } else if (error && typeof error === 'object' && 'type' in error && (error as any).type === 'StripeError') {
      const stripeError = error as any;
      console.error(`❌ [${requestId}] Stripe-Fehler Details:`, {
        message: stripeError.message,
        code: stripeError.code,
        type: stripeError.type,
        statusCode: stripeError.statusCode,
        requestId: stripeError.requestId,
        raw: stripeError
      });
      const errorResponse = { 
        success: false, 
        message: `Stripe-Fehler: ${stripeError.message}`,
        stripeError: stripeError.code,
        errorType: "STRIPE_ERROR",
        requestId,
        debug: {
          stripeCode: stripeError.code,
          stripeType: stripeError.type,
          stripeStatusCode: stripeError.statusCode,
          stripeRequestId: stripeError.requestId
        }
      };
      console.log(`❌ [${requestId}] Sending Stripe error response:`, JSON.stringify(errorResponse, null, 2));
      res.status(400).json(errorResponse);
    } else {
      const errorMessage = error && typeof error === 'object' && 'message' in error 
        ? (error as any).message 
        : 'Unbekannter Fehler';
      
      console.error(`❌ [${requestId}] Unknown error details:`, {
        message: errorMessage,
        name: error && typeof error === 'object' && 'name' in error ? (error as any).name : 'No name',
        code: error && typeof error === 'object' && 'code' in error ? (error as any).code : 'No code'
      });
        
      const errorResponse = { 
        success: false, 
        message: "Fehler beim Erstellen der Buchung",
        error: errorMessage,
        errorType: "UNKNOWN_ERROR",
        requestId,
        debug: {
          errorType: typeof error,
          errorConstructor: error?.constructor?.name,
          timestamp: new Date().toISOString()
        }
      };
      
      console.log(`❌ [${requestId}] Sending unknown error response:`, JSON.stringify(errorResponse, null, 2));
      res.status(500).json(errorResponse);
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