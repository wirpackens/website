import Header from "@/components/header";
import Hero from "@/components/hero";
import Services from "@/components/services";
import PriceCalculator from "@/components/price-calculator";
import About from "@/components/about";
import Contact from "@/components/contact";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Services />
        <PriceCalculator />
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
