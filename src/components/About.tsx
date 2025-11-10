import { Card, CardContent } from "@/components/ui/card";
import { Award, Users, Zap } from "lucide-react";

const About = () => {
  const features = [
    {
      icon: Award,
      title: "Experiencia",
      description: "Años de experiencia creando estilos únicos"
    },
    {
      icon: Users,
      title: "Clientes Satisfechos",
      description: "Cientos de clientes confían en nuestro servicio"
    },
    {
      icon: Zap,
      title: "Técnicas Modernas",
      description: "Las últimas tendencias y técnicas profesionales"
    }
  ];

  return (
    <section id="nosotros" className="py-20 px-4 bg-gradient-hero">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-5xl md:text-6xl font-bold text-center mb-4 glow-text">
          Sobre Nosotros
        </h2>
        <p className="text-center text-muted-foreground mb-16 text-lg max-w-3xl mx-auto">
          En BARBERSHOP combinamos tradición y modernidad para crear looks únicos. 
          Cada corte es una obra de arte, diseñada específicamente para realzar tu estilo personal.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index}
                className="hover-glow bg-card border-border text-center"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <CardContent className="pt-8">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-orbitron mb-3 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
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

export default About;
