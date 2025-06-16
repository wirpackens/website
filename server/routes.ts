import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, insertPriceCalculationSchema } from "@shared/schema";
import { sendContactEmail, sendPriceCalculationEmail } from "./email";
import { z } from "zod";

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
        expressService: validatedData.expressService,
        weekendService: validatedData.weekendService,
        disposalService: validatedData.disposalService,
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

  const httpServer = createServer(app);
  return httpServer;
}
