# Vercel Deployment - Wir Packens UG

## Schnellstart (Empfohlen)

### Option 1: Direkt von GitHub deployen

1. **GitHub Repository erstellen** (falls noch nicht geschehen):
   - Gehen Sie zu https://github.com/miguelhaeslerde
   - Erstellen Sie ein neues Repository: `wirpackens`
   - Public Repository

2. **Code zu GitHub pushen**:
   ```bash
   # Im workspace-Verzeichnis
   rm -rf .git
   git init
   git add .
   git commit -m "Wir Packens UG website ready for Vercel"
   git branch -M main
   git remote add origin https://github.com/miguelhaeslerde/wirpackens.git
   git push -u origin main
   ```

3. **Vercel Deployment**:
   - Gehen Sie zu https://vercel.com
   - Klicken Sie "New Project"
   - Importieren Sie `miguelhaeslerde/wirpackens`
   - Vercel erkennt automatisch alle Einstellungen aus `vercel.json`
   - Klicken Sie "Deploy"

### Option 2: Vercel CLI (Schneller)

```bash
# Vercel CLI installieren
npm i -g vercel

# Im workspace-Verzeichnis
vercel

# Folgen Sie den Prompts:
# - Set up and deploy? Y
# - Which scope? Wählen Sie Ihren Account
# - Link to existing project? N
# - Project name: wirpackens
# - In which directory? ./ (Enter)
# - Want to override settings? N
```

## E-Mail-Konfiguration nach Deployment

Nach erfolgreichem Deployment müssen Sie die E-Mail-Environment-Variables setzen:

1. **Vercel Dashboard** → Ihr Projekt → Settings → Environment Variables

2. **Gmail SMTP konfigurieren** (Empfohlen):
   ```
   EMAIL_USER = kontakt@wirpackens.org
   EMAIL_PASSWORD = ihr-gmail-app-passwort
   ```

3. **Gmail App-Passwort erstellen**:
   - https://myaccount.google.com/security
   - 2-Faktor-Authentifizierung aktivieren
   - App-Passwörter → Mail → Anderes Gerät
   - 16-stelliges Passwort kopieren

4. **Redeploy** nach Environment Variables:
   - Vercel Dashboard → Deployments → ... → Redeploy

## Vercel-Konfiguration (bereits optimiert)

Das Projekt enthält bereits die perfekte `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist", 
  "framework": "vite",
  "functions": {
    "server/index.ts": {
      "runtime": "@vercel/node"
    }
  },
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/$1"
    },
    {
      "source": "/(.*)", 
      "destination": "/"
    }
  ]
}
```

## Domain-Setup (Optional)

Nach dem Deployment können Sie die Domain `wirpackens.org` verbinden:

1. **Vercel Dashboard** → Settings → Domains
2. Domain hinzufügen: `wirpackens.org`
3. **DNS-Konfiguration** bei Ihrem Provider:
   ```
   Type: A
   Name: @
   Value: 76.76.19.61
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

## Nach dem Deployment testen

✅ **Funktionalität prüfen**:
- Homepage lädt korrekt
- Preisrechner funktioniert
- Kontaktformular sendet E-Mails
- Cookie-Banner funktioniert
- Mobile Ansicht optimiert

✅ **Performance**:
- Lighthouse-Score > 90
- Schnelle Ladezeiten
- SEO-optimiert

## Troubleshooting

**Build-Fehler**: 
- Logs in Vercel Dashboard → Functions prüfen

**E-Mail funktioniert nicht**:
- Environment Variables prüfen
- Gmail App-Passwort korrekt?
- Redeploy nach Änderungen

**404-Fehler**:
- `vercel.json` Rewrites sind konfiguriert
- SPA-Routing funktioniert automatisch

Das Projekt ist vollständig Vercel-optimiert!