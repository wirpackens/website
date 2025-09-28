# Wir Packens UG - Entrümpelungsunternehmen Website

Eine moderne, professionelle Landingpage für ein deutsches Entrümpelungsunternehmen mit Sitz in Gudensberg, Hessen.

## 🏢 Über das Unternehmen

**Wir Packens UG (haftungsbeschränkt)**
- Standort: Hans-Geisser-Straße 8, 34281 Gudensberg, Deutschland
- Einzugsgebiet: 100km Umkreis um Gudensberg
- Website: [wirpackens.org](https://wirpackens.org)
- E-Mail: kontakt@wirpackens.org
- Telefon: 05603 123456

## 🚛 Dienstleistungen

- **Haushaltsauflösung** (ab 25€/m²)
- **Büroentrümpelung** (ab 30€/m²)
- **Umzugsservice** (ab 80€/h)
- **Messiewohnung-Entrümpelung** (ab 35€/m²)
- **Besenrein-Säuberung** (ab 15€/m²)

## ✨ Features

- 📱 **Responsive Design** - Optimiert für alle Geräte
- 🧮 **Interaktiver Preisrechner** - Sofortige Kostenschätzung
- 📞 **Kontaktformular** - Direkte Kundenanfragen
- 🍪 **GDPR-konformer Cookie-Banner** - Datenschutz-compliant
- ⚖️ **Rechtliche Seiten** - Impressum, Datenschutz, AGB
- 🎨 **Modernes Design** - Professionelles Blau-Grün Farbschema

## 🛠 Technische Architektur

### Frontend
- **React 18** mit TypeScript
- **Vite** für schnelles Development
- **Tailwind CSS** für Styling
- **shadcn/ui** Komponenten-Bibliothek
- **Wouter** für Client-side Routing
- **TanStack Query** für API-Management

### Backend
- **Express.js** mit TypeScript
- **In-Memory Storage** für Entwicklung
- **Zod** für Validierung
- **CORS** enabled

### Design System
- **Responsive Design** mit Mobile-First Ansatz
- **Accessibility** Features
- **Dark/Light Mode** Support
- **Consistent Typography** und Spacing

## 🚀 Installation & Development

### Voraussetzungen
- Node.js 20+
- npm oder yarn

### Setup
```bash
# Repository klonen
git clone https://github.com/miguelhaeslerde/wirpackens.git
cd wirpackens

# Dependencies installieren
npm install

# Development Server starten
npm run dev
```

Die Anwendung läuft unter `http://localhost:5000`

## 📁 Projektstruktur

```
wirpackens/
├── client/                 # Frontend React App
│   ├── src/
│   │   ├── components/    # Wiederverwendbare Komponenten
│   │   ├── pages/         # Seiten-Komponenten
│   │   ├── lib/           # Utilities und Konfiguration
│   │   └── hooks/         # Custom React Hooks
│   └── index.html
├── server/                 # Backend Express Server
│   ├── index.ts           # Server Entry Point
│   ├── routes.ts          # API Routes
│   ├── storage.ts         # Daten-Layer
│   └── vite.ts           # Vite Integration
├── shared/                 # Geteilte TypeScript Types
│   └── schema.ts          # Zod Schemas
└── components.json        # shadcn/ui Konfiguration
```

## 🔧 Verfügbare Scripts

```bash
npm run dev          # Development Server starten
npm run build        # Production Build erstellen
npm run preview      # Production Build lokal testen
npm run type-check   # TypeScript Type Checking
```

## 🌐 Deployment

### Vercel Deployment
Das Projekt ist für Vercel optimiert:

1. Repository zu Vercel verbinden
2. Build Command: `npm run build`
3. Output Directory: `dist`
4. Environment Variables setzen (falls erforderlich)

### Umgebungsvariablen
```bash
# Optional - für Production
NODE_ENV=production
```

## 📞 Kontakt & Support

- **E-Mail**: kontakt@wirpackens.org
- **Telefon**: 05603 123456
- **Geschäftszeiten**: Mo-Fr 7:00-18:00 Uhr

## 📝 Lizenz

© 2024 Wir Packens UG. Alle Rechte vorbehalten.

---

**Entwickelt für professionelle Entrümpelungsdienstleistungen in Hessen**# website
