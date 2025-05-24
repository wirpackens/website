import { pgTable, text, serial, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  service: text("service"),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const priceCalculations = pgTable("price_calculations", {
  id: serial("id").primaryKey(),
  serviceType: text("service_type").notNull(),
  roomCount: integer("room_count").notNull(),
  squareMeters: integer("square_meters").notNull(),
  expressService: boolean("express_service").default(false),
  weekendService: boolean("weekend_service").default(false),
  disposalService: boolean("disposal_service").default(false),
  basePrice: integer("base_price").notNull(),
  additionalPrice: integer("additional_price").notNull(),
  totalPrice: integer("total_price").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
  createdAt: true,
});

export const insertPriceCalculationSchema = createInsertSchema(priceCalculations).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contacts.$inferSelect;
export type InsertPriceCalculation = z.infer<typeof insertPriceCalculationSchema>;
export type PriceCalculation = typeof priceCalculations.$inferSelect;
