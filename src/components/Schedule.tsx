import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Calendar } from "lucide-react";

const Schedule = () => {
  const schedule = [
    { day: "Lunes - Viernes", hours: "9:00 AM - 7:00 PM" },
    { day: "Sábado", hours: "9:00 AM - 6:00 PM" },
    { day: "Domingo", hours: "10:00 AM - 4:00 PM" }
  ];

  return (
    <section id="horarios" className="py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-5xl md:text-6xl font-bold text-center mb-4 glow-text">
          Horarios
        </h2>
        <p className="text-center text-muted-foreground mb-16 text-lg">
          Estamos disponibles para ti
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {schedule.map((item, index) => (
            <Card 
              key={index}
              className="hover-glow bg-card border-border text-center"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  {index === 0 ? (
                    <Calendar className="w-8 h-8 text-primary" />
                  ) : (
                    <Clock className="w-8 h-8 text-primary" />
                  )}
                </div>
                <CardTitle className="text-xl font-orbitron">
                  {item.day}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-secondary">
                  {item.hours}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Card className="bg-primary/10 border-primary inline-block">
            <CardContent className="pt-6">
              <p className="text-lg text-muted-foreground mb-2">
                ¿Necesitas un horario especial?
              </p>
              <p className="text-xl font-semibold text-foreground">
                Contáctanos para coordinar
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Schedule;
