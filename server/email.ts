import nodemailer from 'nodemailer';

interface EmailData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  service?: string;
  message?: string;
}

interface PriceCalculationData {
  serviceType: string;
  roomCount: number;
  squareMeters: number;
  weekendService: boolean;
  disposalService: boolean;
  basePrice: number;
  additionalPrice: number;
  totalPrice: number;
}

// Create transporter using Gmail SMTP (kostenlos)
const createTransporter = () => {
  // Verwende Gmail SMTP - der Benutzer muss eine Gmail-App-Passwort erstellen
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'kontakt@wirpackens.org',
      pass: process.env.EMAIL_PASSWORD || 'app-specific-password'
    }
  });
};

// Alternative: SMTP2GO (kostenlos bis 1000 E-Mails/Monat)
const createSMTP2GOTransporter = () => {
  return nodemailer.createTransport({
    host: 'mail.smtp2go.com',
    port: 2525,
    secure: false,
    auth: {
      user: process.env.SMTP2GO_USER,
      pass: process.env.SMTP2GO_PASSWORD
    }
  });
};

// Alternative: Ethereal Email (nur für Tests)
const createEtherealTransporter = async () => {
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass
    }
  });
};

export async function sendContactEmail(data: EmailData): Promise<boolean> {
  try {
    let transporter;
    
    // Versuche verschiedene kostenlose Optionen
    if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
      transporter = createTransporter();
    } else if (process.env.SMTP2GO_USER && process.env.SMTP2GO_PASSWORD) {
      transporter = createSMTP2GOTransporter();
    } else {
      // Fallback für Entwicklung - Ethereal Email (Test-E-Mails)
      transporter = await createEtherealTransporter();
    }

    const serviceLabels: Record<string, string> = {
      household: 'Haushaltsauflösung',
      office: 'Büroentrümpelung',
      moving: 'Umzug',
      messie: 'Messiewohnung',
      cleaning: 'Besenrein',
      other: 'Sonstiges'
    };

    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@wirpackens.org',
      to: 'kontakt@wirpackens.org',
      subject: `Neue Anfrage von ${data.firstName} ${data.lastName}`,
      html: `
        <h2>Neue Kundenanfrage über die Website</h2>
        
        <h3>Kontaktdaten:</h3>
        <ul>
          <li><strong>Name:</strong> ${data.firstName} ${data.lastName}</li>
          <li><strong>E-Mail:</strong> ${data.email}</li>
          ${data.phone ? `<li><strong>Telefon:</strong> ${data.phone}</li>` : ''}
          ${data.service ? `<li><strong>Gewünschte Leistung:</strong> ${serviceLabels[data.service] || data.service}</li>` : ''}
        </ul>
        
        ${data.message ? `
        <h3>Nachricht:</h3>
        <p>${data.message.replace(/\n/g, '<br>')}</p>
        ` : ''}
        
        <hr>
        <p><small>Diese E-Mail wurde automatisch über das Kontaktformular auf wirpackens.org gesendet.</small></p>
      `,
      text: `
Neue Kundenanfrage über die Website

Kontaktdaten:
- Name: ${data.firstName} ${data.lastName}
- E-Mail: ${data.email}
${data.phone ? `- Telefon: ${data.phone}` : ''}
${data.service ? `- Gewünschte Leistung: ${serviceLabels[data.service] || data.service}` : ''}

${data.message ? `Nachricht:\n${data.message}` : ''}

---
Diese E-Mail wurde automatisch über das Kontaktformular auf wirpackens.org gesendet.
      `
    };

    const info = await transporter.sendMail(mailOptions);
    
    // Für Entwicklung - zeige Ethereal Email Link
    if (info.messageId && process.env.NODE_ENV === 'development') {
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
    
    return true;
  } catch (error) {
    console.error('E-Mail-Versand-Fehler:', error);
    return false;
  }
}

export async function sendPriceCalculationEmail(data: PriceCalculationData): Promise<boolean> {
  try {
    let transporter;
    
    if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
      transporter = createTransporter();
    } else if (process.env.SMTP2GO_USER && process.env.SMTP2GO_PASSWORD) {
      transporter = createSMTP2GOTransporter();
    } else {
      transporter = await createEtherealTransporter();
    }

    const serviceLabels: Record<string, string> = {
      household: 'Haushaltsauflösung',
      office: 'Büroentrümpelung',
      moving: 'Umzug',
      messie: 'Messiewohnung',
      cleaning: 'Besenrein'
    };

    const additionalServices = [];
    if (data.weekendService) additionalServices.push('Wochenend-Service (+15%)');
    if (data.disposalService) additionalServices.push('Sondermüll-Entsorgung (+10€/m²)');

    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@wirpackens.org',
      to: 'kontakt@wirpackens.org',
      subject: 'Neue Preisberechnung - Angebot angefordert',
      html: `
        <h2>Neue Preisberechnung über die Website</h2>
        
        <h3>Projektdetails:</h3>
        <ul>
          <li><strong>Dienstleistung:</strong> ${serviceLabels[data.serviceType] || data.serviceType}</li>
          <li><strong>Anzahl Räume:</strong> ${data.roomCount}</li>
          <li><strong>Quadratmeter:</strong> ${data.squareMeters} m²</li>
          ${additionalServices.length > 0 ? `<li><strong>Zusatzleistungen:</strong> ${additionalServices.join(', ')}</li>` : ''}
        </ul>
        
        <h3>Preisberechnung:</h3>
        <ul>
          <li><strong>Grundpreis:</strong> ${data.basePrice.toLocaleString('de-DE')}€</li>
          <li><strong>Zusatzleistungen:</strong> ${data.additionalPrice.toLocaleString('de-DE')}€</li>
          <li><strong>Gesamtpreis:</strong> ${data.totalPrice.toLocaleString('de-DE')}€</li>
        </ul>
        
        <p><strong>Der Kunde möchte ein verbindliches Angebot!</strong></p>
        
        <hr>
        <p><small>Diese E-Mail wurde automatisch über den Preisrechner auf wirpackens.org gesendet.</small></p>
      `,
      text: `
Neue Preisberechnung über die Website

Projektdetails:
- Dienstleistung: ${serviceLabels[data.serviceType] || data.serviceType}
- Anzahl Räume: ${data.roomCount}
- Quadratmeter: ${data.squareMeters} m²
${additionalServices.length > 0 ? `- Zusatzleistungen: ${additionalServices.join(', ')}` : ''}

Preisberechnung:
- Grundpreis: ${data.basePrice.toLocaleString('de-DE')}€
- Zusatzleistungen: ${data.additionalPrice.toLocaleString('de-DE')}€
- Gesamtpreis: ${data.totalPrice.toLocaleString('de-DE')}€

Der Kunde möchte ein verbindliches Angebot!

---
Diese E-Mail wurde automatisch über den Preisrechner auf wirpackens.org gesendet.
      `
    };

    const info = await transporter.sendMail(mailOptions);
    
    if (info.messageId && process.env.NODE_ENV === 'development') {
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
    
    return true;
  } catch (error) {
    console.error('E-Mail-Versand-Fehler:', error);
    return false;
  }
}