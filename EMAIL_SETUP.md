# E-Mail-Setup für Kontaktformular

Das Kontaktformular ist bereits implementiert und sendet E-Mails an `kontakt@wirpackens.org`. 

## Kostenlose E-Mail-Optionen

### Option 1: Gmail SMTP (Empfohlen)
**Kostenlos und zuverlässig**

1. **Gmail App-Passwort erstellen:**
   - Gehen Sie zu https://myaccount.google.com/security
   - Aktivieren Sie 2-Faktor-Authentifizierung (falls nicht aktiv)
   - Gehen Sie zu "App-Passwörter"
   - Wählen Sie "Mail" und "Anderes Gerät"
   - Kopieren Sie das generierte 16-stellige Passwort

2. **Environment Variables setzen:**
   ```
   EMAIL_USER=kontakt@wirpackens.org
   EMAIL_PASSWORD=ihr-app-passwort-hier
   ```

### Option 2: SMTP2GO (Alternative)
**1000 kostenlose E-Mails pro Monat**

1. Registrierung bei https://www.smtp2go.com
2. Environment Variables:
   ```
   SMTP2GO_USER=ihr-username
   SMTP2GO_PASSWORD=ihr-passwort
   ```

### Option 3: Entwicklungsmodus
**Ohne Setup - für Tests**
- Verwendet Ethereal Email (Test-E-Mails)
- E-Mails werden nicht wirklich gesendet
- Vorschau-Links werden in der Konsole angezeigt

## Vercel Environment Variables

Nach dem Vercel-Deployment:

1. Gehen Sie zu Vercel Dashboard → Ihr Projekt → Settings → Environment Variables
2. Fügen Sie hinzu:
   ```
   EMAIL_USER=kontakt@wirpackens.org
   EMAIL_PASSWORD=ihr-gmail-app-passwort
   ```
3. Redeploy nach dem Hinzufügen der Variables

## Funktionalität

Das System sendet automatisch E-Mails für:

✅ **Kontaktformular-Anfragen**
- Vollständige Kontaktdaten
- Gewünschte Dienstleistung
- Nachricht des Kunden

✅ **Preisrechner-Anfragen ("Angebot anfordern")**
- Detaillierte Projektinformationen
- Berechnete Preise
- Zusatzleistungen

## Test

1. Füllen Sie das Kontaktformular aus
2. Verwenden Sie den Preisrechner und klicken "Verbindliches Angebot anfordern"
3. Prüfen Sie Ihre E-Mails bei kontakt@wirpackens.org

Bei Problemen werden Fallback-Test-E-Mails verwendet, die in der Server-Konsole angezeigt werden.