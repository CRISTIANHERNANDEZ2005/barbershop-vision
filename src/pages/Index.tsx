import Hero from "@/components/Hero";
import About from "@/components/About";
import Gallery from "@/components/Gallery";
import Services from "@/components/Services";
import Schedule from "@/components/Schedule";
import WhatsAppButton from "@/components/WhatsAppButton";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <About />
      <Gallery />
      <Services />
      <Schedule />
      <WhatsAppButton />
      
      {/* Footer */}
      <footer className="bg-gradient-hero py-8 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground mb-2">
            © 2025 BARBERSHOP - Todos los derechos reservados
          </p>
          <p className="text-sm text-muted-foreground">
            Tu Estilo del Futuro
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
