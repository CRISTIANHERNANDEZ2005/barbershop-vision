import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const WhatsAppButton = () => {
  const whatsappNumber = "573044931438";
  const whatsappMessage = "Hola! Me interesa agendar una cita en BARBERSHOP";

  const handleWhatsAppClick = () => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(url, "_blank");
  };

  return (
    <Button
      onClick={handleWhatsAppClick}
      size="lg"
      className="fixed bottom-6 right-6 z-50 rounded-full w-16 h-16 shadow-glow hover:shadow-glow-secondary transition-all duration-300 bg-[#25D366] hover:bg-[#1da851] text-white border-none"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle className="h-8 w-8" />
    </Button>
  );
};

export default WhatsAppButton;
