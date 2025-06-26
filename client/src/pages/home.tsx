import Header from "@/components/header";
import Hero from "@/components/hero";
import Services from "@/components/services";
import PriceCalculator from "@/components/price-calculator";
import About from "@/components/about";
import Contact from "@/components/contact";
import Footer from "@/components/footer";
import PriceGuaranteeBanner from "@/components/price-guarantee-banner";
import FreeInspectionBanner from "@/components/free-inspection-banner";

export default function Home() {
  return (
    <div className="min-h-screen">
      <PriceGuaranteeBanner />
      <Header />
      <main>
        <Hero />
        <div className="container mx-auto px-4 py-8">
          <FreeInspectionBanner />
        </div>
        <Services />
        <PriceCalculator />
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
