import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import logo from "@/assets/logo.png";
import heroBg from "@/assets/hero-bg.jpg";

const Hero = () => {
  const whatsappNumber = "573044931438";
  const whatsappMessage = "Hola! Me interesa agendar una cita en BARBERSHOP";

  const handleWhatsAppClick = () => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(url, "_blank");
  };

  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroBg} 
          alt="BARBERSHOP Interior" 
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-hero"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center animate-fade-in">
        <img 
          src={logo} 
          alt="BARBERSHOP Logo" 
          className="w-32 h-32 mx-auto mb-8 animate-glow"
        />
        
        <h1 className="text-6xl md:text-8xl font-bold mb-6 glow-text">
          BARBERSHOP
        </h1>
        
        <p className="text-3xl md:text-4xl font-orbitron text-gradient mb-4">
          Tu Estilo del Futuro
        </p>
        
        <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
          Precisión, calidad y estilo en cada corte. Transformamos tu look con técnicas modernas y atención al detalle.
        </p>
        
        <Button 
          size="lg"
          variant="hero"
          onClick={handleWhatsAppClick}
          className="text-lg"
        >
          <MessageCircle className="mr-2 h-5 w-5" />
          Agenda tu Cita
        </Button>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-primary rounded-full"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
