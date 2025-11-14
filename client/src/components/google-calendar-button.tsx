import { useEffect, useRef } from "react";

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

interface GoogleCalendarButtonProps {
  className?: string;
}

export default function GoogleCalendarButton({ className }: GoogleCalendarButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Google Calendar Scheduling Button Script
    const loadCalendarScript = () => {
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
          if (window.calendar?.schedulingButton && buttonRef.current) {
            window.calendar.schedulingButton.load({
              url: 'https://calendar.google.com/calendar/appointments/schedules/AcZssZ0U8t43j4VC_36EOQCKug1F_94nrLulJQ6p3MtOYpHilbnquJI8gwIMUv4qN_JghqIyGUbjwFtg?gv=true',
              color: '#039BE5',
              label: 'Termin eintragen',
              target: buttonRef.current,
              locale: 'de',
            });
          }
        };
        document.head.appendChild(script);
      } else if (window.calendar?.schedulingButton && buttonRef.current) {
        // Script already loaded, just initialize
        window.calendar.schedulingButton.load({
          url: 'https://calendar.google.com/calendar/appointments/schedules/AcZssZ0U8t43j4VC_36EOQCKug1F_94nrLulJQ6p3MtOYpHilbnquJI8gwIMUv4qN_JghqIyGUbjwFtg?gv=true',
          color: '#039BE5',
          label: 'Termin eintragen',
          target: buttonRef.current,
          locale: 'de',
        });
      }
    };

    loadCalendarScript();
  }, []);

  return <div ref={buttonRef} className={className}></div>;
}

