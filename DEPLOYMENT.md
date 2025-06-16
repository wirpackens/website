# Deployment Anleitung

## GitHub Repository Setup

1. **Repository auf GitHub erstellen**
   ```bash
   # Falls noch nicht gemacht:
   git init
   git add .
   git commit -m "Initial commit: Wir Packens UG website"
   git remote add origin https://github.com/miguelhaeslerde/wirpackens.git
   git branch -M main
   git push -u origin main
   ```

## Vercel Deployment

### Automatisches Deployment

1. **Vercel Account verbinden**
   - Gehe zu [vercel.com](https://vercel.com)
   - Melde dich mit GitHub-Account an
   - Klicke auf "New Project"
   - Wähle das Repository `miguelhaeslerde/wirpackens`

2. **Deployment-Konfiguration**
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Environment Variables (optional)**
   ```
   NODE_ENV=production
   ```

### Manuelles Deployment via CLI

```bash
# Vercel CLI installieren
npm i -g vercel

# In Projektordner navigieren
cd wirpackens

# Deployment starten
vercel

# Production Deployment
vercel --prod
```

## Domain-Konfiguration

1. **Custom Domain hinzufügen**
   - In Vercel Dashboard → Project Settings → Domains
   - Domain hinzufügen: `wirpackens.org`
   - DNS-Einstellungen beim Domain-Provider:
     ```
     Type: CNAME
     Name: www
     Value: cname.vercel-dns.com
     
     Type: A
     Name: @
     Value: 76.76.19.61
     ```

2. **SSL-Zertifikat**
   - Wird automatisch von Vercel bereitgestellt
   - HTTPS wird automatisch aktiviert

## Post-Deployment Checks

### ✅ Funktionalität testen
- [ ] Homepage lädt korrekt
- [ ] Navigation funktioniert
- [ ] Preisrechner berechnet Preise
- [ ] Kontaktformular sendet Nachrichten
- [ ] Cookie-Banner erscheint und funktioniert
- [ ] Rechtliche Seiten sind erreichbar

### ✅ Performance optimieren
- [ ] Lighthouse Score überprüfen
- [ ] Core Web Vitals optimieren
- [ ] Bilder komprimieren (falls nötig)

### ✅ SEO Setup
- [ ] Google Search Console einrichten
- [ ] Sitemap erstellen (optional)
- [ ] Meta-Tags überprüfen

## Monitoring & Analytics

### Google Analytics (bei Cookie-Zustimmung)
```javascript
// Bereits im Cookie-Banner implementiert
// GA_MEASUREMENT_ID durch echte ID ersetzen
```

### Error Monitoring
- Vercel bietet integriertes Error Monitoring
- Logs verfügbar im Vercel Dashboard

## Backup & Wartung

### Automatische Deployments
- Jeder Push zu `main` Branch löst automatisches Deployment aus
- Preview-Deployments für Pull Requests

### Rollback
```bash
# Letztes Deployment anzeigen
vercel list

# Rollback zu vorheriger Version
vercel rollback [deployment-url]
```

## Support & Troubleshooting

### Häufige Probleme

1. **Build Fehler**
   ```bash
   # Lokal testen
   npm run build
   npm run preview
   ```

2. **API Routes funktionieren nicht**
   - Überprüfe `vercel.json` Konfiguration
   - Stelle sicher, dass alle Dependencies installiert sind

3. **Umgebungsvariablen**
   - In Vercel Dashboard unter Settings → Environment Variables

### Logs einsehen
```bash
# Vercel Logs anzeigen
vercel logs [deployment-url]
```

## Kontakt

Bei Deployment-Problemen:
- **E-Mail**: kontakt@wirpackens.org
- **Entwickler-Support**: Über GitHub Issues