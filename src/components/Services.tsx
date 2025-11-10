import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scissors, Sparkles, Brush, Star } from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: Scissors,
      title: "Corte de Cabello",
      description: "Cortes modernos y clásicos adaptados a tu estilo personal",
      price: "Desde $25.000"
    },
    {
      icon: Sparkles,
      title: "Fade & Degradado",
      description: "Degradados perfectos con transiciones suaves y precisas",
      price: "Desde $30.000"
    },
    {
      icon: Brush,
      title: "Barba & Perfilado",
      description: "Arreglo completo de barba con técnicas profesionales",
      price: "Desde $20.000"
    },
    {
      icon: Star,
      title: "Diseños Especiales",
      description: "Diseños únicos y personalizados en tu corte",
      price: "Desde $35.000"
    }
  ];

  return (
    <section id="servicios" className="py-20 px-4 bg-gradient-hero">
      <div className="container mx-auto">
        <h2 className="text-5xl md:text-6xl font-bold text-center mb-4 glow-text">
          Nuestros Servicios
        </h2>
        <p className="text-center text-muted-foreground mb-16 text-lg">
          Calidad profesional en cada servicio
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card 
                key={index}
                className="hover-glow bg-card border-border text-center transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl font-orbitron">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {service.description}
                  </p>
                  <p className="text-xl font-bold text-secondary">
                    {service.price}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
