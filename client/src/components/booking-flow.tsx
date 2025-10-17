import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import AppointmentCalendar from "./appointment-calendar";
import BookingForm, { type BookingFormData } from "./booking-form";
import { ArrowLeft, Calendar, User, CreditCard, CheckCircle } from "lucide-react";
import type { InsertBooking } from "@shared/schema";

interface BookingFlowProps {
  priceCalculation: {
    id?: number;
    serviceType: string;
    roomCount: number;
    squareMeters: number;
    totalPrice: number;
    weekendService: boolean;
    disposalService: boolean;
  };
  onClose: () => void;
}

type BookingStep = "calendar" | "form" | "payment" | "success";

export default function BookingFlow({ priceCalculation, onClose }: BookingFlowProps) {
  const [currentStep, setCurrentStep] = useState<BookingStep>("calendar");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const [bookingData, setBookingData] = useState<BookingFormData>();
  
  const { toast } = useToast();

  const createBooking = useMutation({
    mutationFn: async (data: InsertBooking) => {
      console.log("🚀 Sende Buchungsanfrage:", data);
      try {
        const response = await apiRequest("POST", "/api/bookings", data);
        const result = await response.json();
        console.log("✅ Buchungsantwort erhalten:", result);
        return result;
      } catch (error) {
        console.error("❌ Fehler bei Buchungsanfrage:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log("🎉 Buchung erfolgreich erstellt:", data);
      if (data.paymentUrl) {
        console.log("💳 Weiterleitung zu Stripe:", data.paymentUrl);
        // Use window.open for better browser compatibility
        const paymentWindow = window.open(data.paymentUrl, '_self');
        if (!paymentWindow) {
          console.error("❌ Popup blockiert - versuche direkte Weiterleitung");
          window.location.href = data.paymentUrl;
        }
      } else {
        console.error("❌ Keine Payment URL erhalten:", data);
        toast({
          title: "Fehler",
          description: "Keine Zahlungs-URL erhalten. Bitte versuchen Sie es erneut.",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      console.error("❌ Buchungsfehler:", error);
      toast({
        title: "Fehler",
        description: `Die Buchung konnte nicht erstellt werden: ${error.message || 'Unbekannter Fehler'}`,
        variant: "destructive",
      });
    },
  });

  const steps = [
    { id: "calendar", title: "Termin wählen", icon: Calendar },
    { id: "form", title: "Daten eingeben", icon: User },
    { id: "payment", title: "Zahlung", icon: CreditCard },
    { id: "success", title: "Bestätigung", icon: CheckCircle },
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  const progressPercentage = ((currentStepIndex + 1) / steps.length) * 100;

  const handleDateTimeSelect = (date: Date, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
  };

  const handleNextFromCalendar = () => {
    if (selectedDate && selectedTime) {
      setCurrentStep("form");
    }
  };

  const handleFormSubmit = (formData: BookingFormData) => {
    if (!selectedDate || !selectedTime) return;

    setBookingData(formData);
    
    const bookingPayload: InsertBooking = {
      priceCalculationId: priceCalculation.id || null,
      customerName: formData.customerName,
      customerEmail: formData.customerEmail,
      customerPhone: formData.customerPhone,
      serviceType: priceCalculation.serviceType,
      appointmentDate: selectedDate,
      appointmentTime: selectedTime,
      currentAddress: formData.currentAddress,
      newAddress: formData.newAddress || null,
      specialRequests: formData.specialRequests || null,
      totalPrice: priceCalculation.totalPrice,
      depositAmount: 20000, // 200€ in cents
      paymentStatus: "pending",
      stripePaymentIntentId: null,
      bookingStatus: "pending",
    };

    createBooking.mutate(bookingPayload);
  };

  const handleBack = () => {
    if (currentStep === "form") {
      setCurrentStep("calendar");
    } else if (currentStep === "calendar") {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-background rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Termin buchen</h2>
            <Button variant="outline" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress value={progressPercentage} className="w-full" />
            <div className="flex justify-between text-sm">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = index === currentStepIndex;
                const isCompleted = index < currentStepIndex;
                
                return (
                  <div
                    key={step.id}
                    className={`flex items-center gap-1 ${
                      isActive ? 'text-primary font-medium' : 
                      isCompleted ? 'text-green-600' : 'text-muted-foreground'
                    }`}
                  >
                    <StepIcon className="h-4 w-4" />
                    <span className="hidden sm:inline">{step.title}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="p-6">
          {currentStep === "calendar" && (
            <div className="space-y-6">
              <AppointmentCalendar
                onDateTimeSelect={handleDateTimeSelect}
                selectedDate={selectedDate}
                selectedTime={selectedTime}
              />
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={handleBack}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Zurück
                </Button>
                <Button 
                  onClick={handleNextFromCalendar}
                  disabled={!selectedDate || !selectedTime}
                >
                  Weiter zu den Buchungsdetails
                </Button>
              </div>
            </div>
          )}

          {currentStep === "form" && selectedDate && selectedTime && (
            <div className="space-y-6">
              <BookingForm
                priceCalculation={priceCalculation}
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                onSubmit={handleFormSubmit}
                isLoading={createBooking.isPending}
              />
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={handleBack}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Termin ändern
                </Button>
              </div>
            </div>
          )}

          {currentStep === "payment" && (
            <Card className="max-w-md mx-auto">
              <CardContent className="p-8 text-center">
                <CreditCard className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Weiterleitung zur Zahlung</h3>
                <p className="text-muted-foreground mb-4">
                  Sie werden zur sicheren Stripe-Zahlung weitergeleitet...
                </p>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
