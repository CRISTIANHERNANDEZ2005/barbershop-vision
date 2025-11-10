import cut1 from "@/assets/cut-1.jpg";
import cut2 from "@/assets/cut-2.jpg";
import cut3 from "@/assets/cut-3.jpg";
import cut4 from "@/assets/cut-4.jpg";
import cut5 from "@/assets/cut-5.jpg";
import cut6 from "@/assets/cut-6.jpg";
import { Card } from "@/components/ui/card";

const Gallery = () => {
  const cuts = [
    { id: 1, image: cut1, name: "Fade Moderno" },
    { id: 2, image: cut2, name: "Pompadour Texturizado" },
    { id: 3, image: cut3, name: "Undercut Clásico" },
    { id: 4, image: cut4, name: "Crop Texturizado" },
    { id: 5, image: cut5, name: "Diseño Geométrico" },
    { id: 6, image: cut6, name: "Taper Clásico" },
  ];

  return (
    <section id="galeria" className="py-20 px-4">
      <div className="container mx-auto">
        <h2 className="text-5xl md:text-6xl font-bold text-center mb-4 glow-text">
          Nuestros Cortes
        </h2>
        <p className="text-center text-muted-foreground mb-16 text-lg">
          Descubre algunos de nuestros trabajos más destacados
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cuts.map((cut, index) => (
            <Card 
              key={cut.id}
              className="overflow-hidden hover-glow bg-card border-border group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative overflow-hidden">
                <img 
                  src={cut.image} 
                  alt={cut.name}
                  className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl font-orbitron text-foreground">
                    {cut.name}
                  </h3>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
