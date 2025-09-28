import { contacts, priceCalculations, bookings, users, type User, type InsertUser, type Contact, type InsertContact, type PriceCalculation, type InsertPriceCalculation, type Booking, type InsertBooking } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createContact(contact: InsertContact): Promise<Contact>;
  getContacts(): Promise<Contact[]>;
  createPriceCalculation(calculation: InsertPriceCalculation): Promise<PriceCalculation>;
  getPriceCalculations(): Promise<PriceCalculation[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  getBooking(id: number): Promise<Booking | undefined>;
  updateBooking(id: number, updates: Partial<Booking>): Promise<Booking | undefined>;
  getBookings(): Promise<Booking[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private contacts: Map<number, Contact>;
  private priceCalculations: Map<number, PriceCalculation>;
  private bookings: Map<number, Booking>;
  private currentUserId: number;
  private currentContactId: number;
  private currentCalculationId: number;
  private currentBookingId: number;

  constructor() {
    this.users = new Map();
    this.contacts = new Map();
    this.priceCalculations = new Map();
    this.bookings = new Map();
    this.currentUserId = 1;
    this.currentContactId = 1;
    this.currentCalculationId = 1;
    this.currentBookingId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = this.currentContactId++;
    const contact: Contact = { 
      ...insertContact, 
      id, 
      createdAt: new Date() 
    };
    this.contacts.set(id, contact);
    return contact;
  }

  async getContacts(): Promise<Contact[]> {
    return Array.from(this.contacts.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async createPriceCalculation(insertCalculation: InsertPriceCalculation): Promise<PriceCalculation> {
    const id = this.currentCalculationId++;
    const calculation: PriceCalculation = { 
      ...insertCalculation, 
      id, 
      createdAt: new Date() 
    };
    this.priceCalculations.set(id, calculation);
    return calculation;
  }

  async getPriceCalculations(): Promise<PriceCalculation[]> {
    return Array.from(this.priceCalculations.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = this.currentBookingId++;
    const booking: Booking = { 
      ...insertBooking, 
      id, 
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.bookings.set(id, booking);
    return booking;
  }

  async getBooking(id: number): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async updateBooking(id: number, updates: Partial<Booking>): Promise<Booking | undefined> {
    const existing = this.bookings.get(id);
    if (!existing) return undefined;
    
    const updated: Booking = { 
      ...existing, 
      ...updates, 
      updatedAt: new Date() 
    };
    this.bookings.set(id, updated);
    return updated;
  }

  async getBookings(): Promise<Booking[]> {
    return Array.from(this.bookings.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }
}

export const storage = new MemStorage();
