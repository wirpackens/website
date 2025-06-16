# GitHub & Vercel Setup Guide

## Schritt 1: Repository zu GitHub pushen

Das Projekt ist bereits bereit für GitHub. Führen Sie folgende Befehle aus:

```bash
# Alle Dateien zum Staging hinzufügen
git add .

# Commit erstellen
git commit -m "Complete Wir Packens UG website with GDPR cookie banner"

# Remote Repository hinzufügen (falls noch nicht geschehen)
git remote add origin https://github.com/miguelhaeslerde/wirpackens.git

# Code zu GitHub pushen
git push -u origin main
```

## Schritt 2: Vercel Deployment

### Option A: Automatisches Deployment über Vercel Dashboard

1. Gehen Sie zu [vercel.com](https://vercel.com)
2. Melden Sie sich mit Ihrem GitHub-Account an
3. Klicken Sie auf "New Project"
4. Wählen Sie das Repository `miguelhaeslerde/wirpackens`
5. Verwenden Sie folgende Einstellungen:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### Option B: Vercel CLI

```bash
# Vercel CLI installieren
npm i -g vercel

# Deployment starten
vercel

# Bei erstem Mal:
# - Link to existing project? N
# - Project name: wirpackens
# - Directory: ./
# - Want to override settings? N
```

## Schritt 3: Domain-Konfiguration

Nach erfolgreichem Deployment:

1. In Vercel Dashboard → Ihr Projekt → Settings → Domains
2. Domain hinzufügen: `wirpackens.org`
3. DNS bei Ihrem Domain-Provider konfigurieren:

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com

Type: A  
Name: @
Value: 76.76.19.61
```

## Wichtige Projektdateien für Deployment

Das Projekt enthält alle notwendigen Dateien:

- ✅ `vercel.json` - Vercel-Konfiguration
- ✅ `README.md` - Ausführliche Projektdokumentation  
- ✅ `DEPLOYMENT.md` - Detaillierte Deployment-Anleitung
- ✅ `.gitignore` - Git-Ignore-Regeln
- ✅ Alle Frontend- und Backend-Dateien

## Nach dem Deployment prüfen

1. Website-Funktionalität:
   - Homepage lädt korrekt
   - Preisrechner funktioniert
   - Kontaktformular funktioniert
   - Cookie-Banner erscheint

2. Performance testen mit Lighthouse

3. Alle Links und Navigation überprüfen

Das Projekt ist vollständig deployment-bereit!