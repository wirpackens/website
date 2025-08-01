import Header from "@/components/header";
import Hero from "@/components/hero";
import Services from "@/components/services";
import PriceCalculator from "@/components/price-calculator";
import About from "@/components/about";
import CalendlyBooking from "@/components/calendly-booking";
import Footer from "@/components/footer";
import PriceGuaranteeBanner from "@/components/price-guarantee-banner";

export default function Home() {
  return (
    <div className="min-h-screen">
      <PriceGuaranteeBanner />
      <Header />
      <main>
        <Hero />
        <Services />
        <PriceCalculator />
        <About />
        <CalendlyBooking />
      </main>
      <Footer />
    </div>
  );
}
