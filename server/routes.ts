import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, insertPriceCalculationSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Contact form submission
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(validatedData);
      res.json({ success: true, contact });
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
      res.json({ success: true, calculation });
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
