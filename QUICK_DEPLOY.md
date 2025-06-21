# Schnelles Vercel Deployment - Wir Packens UG

## Einfachster Weg: Direkt von Replit zu Vercel

### Option 1: Vercel CLI (Empfohlen)

1. **Vercel CLI verwenden** (bereits installiert):
```bash
npx vercel
```

2. **Bei den Prompts**:
   - `? Set up and deploy "~/workspace"?` → **Y**
   - `? Which scope do you want to deploy to?` → Wählen Sie Ihren Account
   - `? Link to existing project?` → **N**
   - `? What's your project's name?` → **wirpackens**
   - `? In which directory is your code located?` → **./** (Enter)
   - `? Want to override the settings?` → **N**

3. **Fertig!** Vercel deployt automatisch und gibt Ihnen eine URL.

### Option 2: GitHub + Vercel Dashboard

1. **GitHub Repository manuell erstellen**:
   - Gehen Sie zu https://github.com/miguelhaeslerde
   - "New repository" → Name: `wirpackens`
   - Public, keine README/gitignore hinzufügen

2. **Projekt-Dateien hochladen**:
   - "uploading an existing file" wählen
   - Alle Dateien aus dem workspace drag & drop
   - Commit message: "Complete Wir Packens UG website"
   - "Commit directly to main branch"

3. **Vercel verbinden**:
   - https://vercel.com → "New Project"
   - GitHub Repository `miguelhaeslerde/wirpackens` importieren
   - "Deploy" klicken

## E-Mail nach Deployment aktivieren

**Wichtig**: Nach dem Deployment E-Mail-Variablen setzen:

1. **Vercel Dashboard** → Ihr Projekt → Settings → Environment Variables
2. Hinzufügen:
   ```
   EMAIL_USER = kontakt@wirpackens.org
   EMAIL_PASSWORD = [Gmail App-Passwort]
   ```
3. **Redeploy** über Deployments Tab

## Gmail App-Passwort erstellen

1. https://myaccount.google.com/security
2. 2-Faktor-Authentifizierung aktivieren
3. "App-Passwörter" → "Mail" → "Anderes Gerät"
4. 16-stelliges Passwort kopieren

## Status Check

Nach Deployment testen:
- ✅ Website lädt unter vercel.app URL
- ✅ Preisrechner funktioniert
- ✅ Kontaktformular (nach E-Mail-Setup)
- ✅ Cookie-Banner erscheint

Das Projekt ist vollständig deployment-bereit!