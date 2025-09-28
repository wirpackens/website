# 🚀 WebCleanMaster Deployment Guide

## 📋 Voraussetzungen

### 1. GitHub Repository erstellen
- Gehe zu: https://github.com/wirpackens
- Stelle sicher, dass du als "wirpackens" angemeldet bist
- Klicke "New repository"
- Repository Name: `website`
- Setze auf "Public"
- **NICHT** initialisieren (kein README, .gitignore, etc.)
- Klicke "Create repository"

### 2. Code zu GitHub pushen
```bash
git push -u origin main
```

## 🌐 Vercel Deployment

### 1. Vercel Account
- Gehe zu: https://vercel.com
- Melde dich mit dem GitHub Account "wirpackens" an
- Verbinde GitHub Account falls noch nicht geschehen

### 2. Neues Projekt erstellen
- Klicke "New Project"
- Wähle das Repository "wirpackens/website"
- **Framework Preset:** "Other"
- **Root Directory:** `.` (Projektroot)

### 3. Build Settings
```
Build Command: npm run build
Output Directory: dist/public
Install Command: npm install
```

### 4. Environment Variables
Füge folgende Umgebungsvariablen in Vercel hinzu:

**Required:**
- `STRIPE_SECRET_KEY`: Dein Stripe Secret Key (sk_live_... für Production)
- `STRIPE_PUBLISHABLE_KEY`: Dein Stripe Publishable Key (pk_live_... für Production)  
- `STRIPE_WEBHOOK_SECRET`: Webhook Secret für Production
- `BASE_URL`: https://deine-domain.vercel.app
- `NODE_ENV`: production

**Optional:**
- `SUPABASE_URL`: Falls Supabase verwendet wird
- `SUPABASE_ANON_KEY`: Falls Supabase verwendet wird
- `SUPABASE_SERVICE_ROLE_KEY`: Falls Supabase verwendet wird

### 5. Domain konfigurieren
- Gehe zu "Settings" → "Domains"
- Füge deine Custom Domain hinzu (falls gewünscht)
- Oder verwende die Vercel-Domain: `website-wirpackens.vercel.app`

### 6. Stripe Webhook für Production
- Gehe zu Stripe Dashboard → Webhooks
- Erstelle neuen Webhook für: `https://deine-domain.vercel.app/api/stripe-webhook`
- Events: `checkout.session.completed`
- Kopiere den Webhook Secret und füge ihn als `STRIPE_WEBHOOK_SECRET` hinzu

## ✅ Nach dem Deployment

### 1. Funktionalität testen
- Öffne die deployed Website
- Teste den Preisrechner
- Teste das Buchungssystem
- Teste die Stripe-Zahlung (mit Live-Keys)
- Prüfe WhatsApp-Weiterleitung

### 2. Monitoring
- Vercel Dashboard für Logs und Analytics
- Stripe Dashboard für Zahlungen
- Browser-Konsole für Client-Fehler

## 🔧 Troubleshooting

### Build-Fehler
- Prüfe Vercel Function Logs
- Stelle sicher, dass alle Dependencies installiert sind
- Prüfe TypeScript-Kompilierung

### Stripe-Fehler
- Prüfe ob Live-Keys korrekt gesetzt sind
- Prüfe Webhook-Konfiguration
- Prüfe CORS-Einstellungen

### Performance
- Vercel Analytics aktivieren
- Core Web Vitals überwachen
- Stripe-Performance überwachen

## 📞 Support
Bei Problemen:
1. Vercel Logs prüfen
2. Browser-Konsole prüfen  
3. Stripe Dashboard prüfen
4. GitHub Issues erstellen
