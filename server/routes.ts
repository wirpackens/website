import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, insertPriceCalculationSchema, insertBookingSchema } from "@shared/schema";
import { sendContactEmail, sendPriceCalculationEmail } from "./email";
import { z } from "zod";
import Stripe from "stripe";

// Initialize Stripe (will need actual keys from user)
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey || stripeSecretKey === "sk_test_placeholder") {
  console.error("❌ STRIPE_SECRET_KEY ist nicht konfiguriert! Bitte setzen Sie eine gültige Stripe Secret Key in den Umgebungsvariablen.");
}

const stripe = new Stripe(stripeSecretKey || "sk_test_placeholder", {
  apiVersion: "2025-08-27.basil",
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Contact form submission
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(validatedData);
      
      // Send email notification
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
  });

  // Get all contacts (for admin purposes)
  app.get("/api/contacts", async (req, res) => {
    try {
      const contacts = await storage.getContacts();
      res.json({ success: true, contacts });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: "Fehler beim Laden der Kontakte" 
      });
    }
  });

  // Price calculation submission
  app.post("/api/price-calculation", async (req, res) => {
    try {
      const validatedData = insertPriceCalculationSchema.parse(req.body);
      const calculation = await storage.createPriceCalculation(validatedData);
      
      // Send email notification for price calculation
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
  });

  // Get all price calculations (for admin purposes)
  app.get("/api/price-calculations", async (req, res) => {
    try {
      const calculations = await storage.getPriceCalculations();
      res.json({ success: true, calculations });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: "Fehler beim Laden der Berechnungen" 
      });
    }
  });

  // Create booking and Stripe payment intent
  app.post("/api/bookings", async (req, res) => {
    try {
      console.log("🚀 Neue Buchungsanfrage erhalten:", JSON.stringify(req.body, null, 2));
      
      // Check if Stripe is properly configured
      if (!stripeSecretKey || stripeSecretKey === "sk_test_placeholder") {
        console.error("❌ Stripe nicht konfiguriert - kann keine Zahlung verarbeiten");
        return res.status(500).json({
          success: false,
          message: "Zahlungssystem ist nicht konfiguriert. Bitte kontaktieren Sie den Administrator.",
          error: "STRIPE_NOT_CONFIGURED"
        });
      }
      
      const validatedData = insertBookingSchema.parse(req.body);
      console.log("✅ Buchungsdaten validiert:", validatedData);
      
      // Create booking in storage
      const booking = await storage.createBooking(validatedData);
      console.log("✅ Buchung in Storage erstellt:", booking.id);
      
      // Create Stripe payment intent
      const depositAmount = validatedData.depositAmount || 20000; // Default 200€ in cents
      console.log("💳 Erstelle Stripe Payment Intent für:", depositAmount, "Cent");
      const paymentIntent = await stripe.paymentIntents.create({
        amount: depositAmount, // Amount in cents
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

      // Create Stripe Checkout Session for better UX
      console.log("🛒 Erstelle Stripe Checkout Session...");
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
        success_url: `${process.env.BASE_URL || 'http://localhost:3001'}/booking-success?session_id={CHECKOUT_SESSION_ID}&booking_id=${booking.id}`,
        cancel_url: `${process.env.BASE_URL || 'http://localhost:3001'}/booking-cancelled?booking_id=${booking.id}`,
        metadata: {
          bookingId: booking.id.toString(),
        },
      });
      console.log("✅ Checkout Session erstellt:", session.id);
      console.log("🔗 Payment URL:", session.url);

      res.json({ 
        success: true, 
        booking, 
        paymentUrl: session.url,
        sessionId: session.id 
      });
      console.log("📤 Antwort gesendet an Client");
    } catch (error: unknown) {
      console.error("❌ Fehler beim Erstellen der Buchung:", error);
      
      if (error instanceof z.ZodError) {
        console.error("❌ Validierungsfehler:", error.errors);
        res.status(400).json({ 
          success: false, 
          message: "Ungültige Buchungsdaten", 
          errors: error.errors 
        });
      } else if (error && typeof error === 'object' && 'type' in error && (error as any).type === 'StripeError') {
        const stripeError = error as any;
        console.error("❌ Stripe-Fehler:", stripeError.message, stripeError.code);
        res.status(400).json({ 
          success: false, 
          message: `Stripe-Fehler: ${stripeError.message}`,
          stripeError: stripeError.code
        });
      } else {
        console.error('❌ Unbekannter Fehler:', error);
        const errorMessage = error && typeof error === 'object' && 'message' in error 
          ? (error as any).message 
          : 'Unbekannter Fehler';
        res.status(500).json({ 
          success: false, 
          message: "Fehler beim Erstellen der Buchung",
          error: errorMessage
        });
      }
    }
  });

  // Handle Stripe webhook for payment confirmation
  app.post("/api/stripe-webhook", async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig as string, process.env.STRIPE_WEBHOOK_SECRET || "");
    } catch (err: any) {
      console.log(`Webhook signature verification failed.`, err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
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
  });

  // Get booking success page data
  app.get("/api/booking-success/:sessionId", async (req, res) => {
    try {
      const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
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
  });

  // Get all bookings (for admin purposes)
  app.get("/api/bookings", async (req, res) => {
    try {
      const bookings = await storage.getBookings();
      res.json({ success: true, bookings });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: "Fehler beim Laden der Buchungen" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

function getServiceTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    household: "Haushaltsauflösung",
    office: "Büroentrümpelung", 
    moving: "Umzug",
    messie: "Messiewohnung"
  };
  return labels[type] || type;
}
