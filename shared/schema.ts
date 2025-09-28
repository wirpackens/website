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

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  priceCalculationId: integer("price_calculation_id").references(() => priceCalculations.id),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  serviceType: text("service_type").notNull(),
  appointmentDate: timestamp("appointment_date").notNull(),
  appointmentTime: text("appointment_time").notNull(),
  // Address fields - different for moving vs cleaning
  currentAddress: text("current_address").notNull(),
  newAddress: text("new_address"), // Only for moving services
  specialRequests: text("special_requests"),
  totalPrice: integer("total_price").notNull(),
  depositAmount: integer("deposit_amount").notNull().default(20000), // 200€ in cents
  paymentStatus: text("payment_status").notNull().default("pending"), // pending, paid, failed
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  bookingStatus: text("booking_status").notNull().default("pending"), // pending, confirmed, completed, cancelled
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
  createdAt: true,
}).extend({
  phone: z.string().optional(),
  service: z.string().optional(),
  message: z.string().optional(),
});

export const insertPriceCalculationSchema = createInsertSchema(priceCalculations).omit({
  id: true,
  createdAt: true,
}).extend({
  expressService: z.boolean().optional(),
  weekendService: z.boolean().optional(),
  disposalService: z.boolean().optional(),
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  priceCalculationId: z.number().optional(),
  newAddress: z.string().optional(),
  specialRequests: z.string().optional(),
  stripePaymentIntentId: z.string().optional(),
  bookingStatus: z.string().optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contacts.$inferSelect;
export type InsertPriceCalculation = z.infer<typeof insertPriceCalculationSchema>;
export type PriceCalculation = typeof priceCalculations.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;
