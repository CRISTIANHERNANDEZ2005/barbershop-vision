import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import cut1 from "@/assets/cut-1.jpg";
import cut2 from "@/assets/cut-2.jpg";
import cut3 from "@/assets/cut-3.jpg";
import cut4 from "@/assets/cut-4.jpg";
import cut5 from "@/assets/cut-5.jpg";
import cut6 from "@/assets/cut-6.jpg";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@supabase/supabase-js";

const Gallery = () => {
  const [user, setUser] = useState<User | null>(null);
  const [likes, setLikes] = useState<Record<number, number>>({});
  const [userLikes, setUserLikes] = useState<Set<number>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    loadLikes();

    return () => subscription.unsubscribe();
  }, []);

  const loadLikes = async () => {
    const { data } = await supabase
      .from("gallery_likes")
      .select("cut_id, user_id");

    if (data) {
      const likeCounts: Record<number, number> = {};
      const currentUserLikes = new Set<number>();

      data.forEach((like) => {
        likeCounts[like.cut_id] = (likeCounts[like.cut_id] || 0) + 1;
        if (user && like.user_id === user.id) {
          currentUserLikes.add(like.cut_id);
        }
      });

      setLikes(likeCounts);
      setUserLikes(currentUserLikes);
    }
  };

  const handleLike = async (cutId: number) => {
    if (!user) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para dar like.",
        variant: "destructive",
      });
      return;
    }

    const hasLiked = userLikes.has(cutId);

    if (hasLiked) {
      const { error } = await supabase
        .from("gallery_likes")
        .delete()
        .eq("user_id", user.id)
        .eq("cut_id", cutId);

      if (!error) {
        setUserLikes((prev) => {
          const newSet = new Set(prev);
          newSet.delete(cutId);
          return newSet;
        });
        setLikes((prev) => ({
          ...prev,
          [cutId]: (prev[cutId] || 0) - 1,
        }));
      }
    } else {
      const { error } = await supabase.from("gallery_likes").insert({
        user_id: user.id,
        cut_id: cutId,
      });

      if (!error) {
        setUserLikes((prev) => new Set(prev).add(cutId));
        setLikes((prev) => ({
          ...prev,
          [cutId]: (prev[cutId] || 0) + 1,
        }));
        toast({
          title: "¡Like agregado!",
          description: "Te gustó este corte.",
        });
      }
    }
  };
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
                <div className="absolute top-4 right-4 z-10">
                  <Button
                    variant={userLikes.has(cut.id) ? "default" : "outline"}
                    size="icon"
                    onClick={() => handleLike(cut.id)}
                    className="rounded-full backdrop-blur-sm"
                  >
                    <Heart
                      className={`h-5 w-5 ${
                        userLikes.has(cut.id) ? "fill-current" : ""
                      }`}
                    />
                  </Button>
                  {likes[cut.id] > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                      {likes[cut.id]}
                    </span>
                  )}
                </div>
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
