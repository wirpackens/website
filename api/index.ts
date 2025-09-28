import 'dotenv/config';
import { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import { registerRoutes } from '../server/routes';

// Create Express app for API routes only
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Initialize routes
let routesInitialized = false;
let server: any;

async function initializeRoutes() {
  if (!routesInitialized) {
    server = await registerRoutes(app);
    routesInitialized = true;
  }
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
    
    await initializeRoutes();
    
    // Set CORS headers for all requests
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Set Permissions Policy for Payment API
    res.setHeader('Permissions-Policy', 'payment=(self "https://js.stripe.com" "https://checkout.stripe.com")');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }
    
    // Convert Vercel request to Express request format
    const expressReq = req as any;
    const expressRes = res as any;
    
    // Handle the request with Express
    app(expressReq, expressRes);
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