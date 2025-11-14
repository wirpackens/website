// Google Calendar Appointment Scheduling Helper
// TypeScript declaration for Google Calendar API
declare global {
  interface Window {
    calendar?: {
      schedulingButton: {
        load: (config: {
          url: string;
          color?: string;
          label?: string;
          target: HTMLElement;
          locale?: string;
        }) => void;
      };
    };
  }
}

const CALENDAR_URL = 'https://calendar.google.com/calendar/appointments/schedules/AcZssZ0U8t43j4VC_36EOQCKug1F_94nrLulJQ6p3MtOYpHilbnquJI8gwIMUv4qN_JghqIyGUbjwFtg?gv=true';

let calendarScriptLoaded = false;
let hiddenButtonElement: HTMLElement | null = null;

// Load Google Calendar Script
export function loadGoogleCalendarScript(): Promise<void> {
  return new Promise((resolve) => {
    if (calendarScriptLoaded && window.calendar?.schedulingButton) {
      resolve();
      return;
    }

    // Load CSS
    if (!document.querySelector('link[href*="calendar/scheduling-button-script.css"]')) {
      const link = document.createElement('link');
      link.href = 'https://calendar.google.com/calendar/scheduling-button-script.css';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }

    // Load JS
    if (!document.querySelector('script[src*="calendar/scheduling-button-script.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://calendar.google.com/calendar/scheduling-button-script.js';
      script.async = true;
      script.onload = () => {
        calendarScriptLoaded = true;
        initializeHiddenButton();
        resolve();
      };
      document.head.appendChild(script);
    } else {
      calendarScriptLoaded = true;
      initializeHiddenButton();
      resolve();
    }
  });
}

// Initialize hidden button for programmatic opening
function initializeHiddenButton() {
  if (hiddenButtonElement || !window.calendar?.schedulingButton) return;

  // Create hidden button element
  hiddenButtonElement = document.createElement('div');
  hiddenButtonElement.style.display = 'none';
  hiddenButtonElement.style.position = 'absolute';
  hiddenButtonElement.style.visibility = 'hidden';
  document.body.appendChild(hiddenButtonElement);

  // Load calendar button into hidden element
  window.calendar.schedulingButton.load({
    url: CALENDAR_URL,
    color: '#039BE5',
    label: 'Termin eintragen',
    target: hiddenButtonElement,
    locale: 'de',
  });
}

// Open Google Calendar popup programmatically
export async function openGoogleCalendarPopup() {
  await loadGoogleCalendarScript();
  
  // Wait a bit for the button to be initialized
  setTimeout(() => {
    if (hiddenButtonElement) {
      // Find the button inside the hidden element and click it
      const button = hiddenButtonElement.querySelector('button') as HTMLButtonElement;
      if (button) {
        button.click();
      } else {
        // Wait a bit more and try again
        setTimeout(() => {
          const retryButton = hiddenButtonElement?.querySelector('button') as HTMLButtonElement;
          if (retryButton) {
            retryButton.click();
          } else {
            // Fallback: open URL directly in new tab
            window.open(CALENDAR_URL, '_blank');
          }
        }, 500);
      }
    } else {
      // Fallback: open URL directly in new tab
      window.open(CALENDAR_URL, '_blank');
    }
  }, 200);
}

