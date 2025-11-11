import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Star, MessageSquare } from "lucide-react";
import type { User } from "@supabase/supabase-js";

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  profiles: {
    first_name: string;
    last_name: string;
  };
}

const Reviews = () => {
  const [user, setUser] = useState<User | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    loadReviews();

    return () => subscription.unsubscribe();
  }, []);

  const loadReviews = async () => {
    const { data, error } = await supabase
      .from("reviews")
      .select(`
        id,
        rating,
        comment,
        created_at,
        profiles (
          first_name,
          last_name
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading reviews:", error);
    } else {
      setReviews(data || []);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para dejar una reseña.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("reviews").insert({
      user_id: user.id,
      rating,
      comment,
    });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "¡Reseña enviada!",
        description: "Gracias por tu opinión.",
      });
      setComment("");
      setRating(5);
      loadReviews();
    }

    setLoading(false);
  };

  return (
    <section id="resenas" className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto">
        <h2 className="text-5xl md:text-6xl font-bold text-center mb-4 glow-text">
          Reseñas de Clientes
        </h2>
        <p className="text-center text-muted-foreground mb-16 text-lg">
          Lo que dicen nuestros clientes satisfechos
        </p>

        {user && (
          <Card className="max-w-2xl mx-auto mb-12 p-6 bg-card border-border">
            <h3 className="text-2xl font-orbitron font-bold mb-4 text-foreground">
              Deja tu reseña
            </h3>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  Calificación
                </label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRating(value)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          value <= rating
                            ? "fill-primary text-primary"
                            : "text-muted-foreground"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  Tu opinión
                </label>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Cuéntanos sobre tu experiencia..."
                  className="min-h-32 bg-background/50"
                  required
                />
              </div>

              <Button
                type="submit"
                variant="hero"
                disabled={loading}
                className="w-full"
              >
                {loading ? "Enviando..." : "Enviar Reseña"}
              </Button>
            </form>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {reviews.map((review) => (
            <Card
              key={review.id}
              className="p-6 bg-card border-border hover-glow"
            >
              <div className="flex items-center space-x-2 mb-3">
                {[1, 2, 3, 4, 5].map((value) => (
                  <Star
                    key={value}
                    className={`h-5 w-5 ${
                      value <= review.rating
                        ? "fill-primary text-primary"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>

              <p className="text-foreground mb-4 line-clamp-4">
                {review.comment}
              </p>

              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MessageSquare className="h-4 w-4" />
                <span>{review.profiles.first_name} {review.profiles.last_name}</span>
                <span>•</span>
                <span>
                  {new Date(review.created_at).toLocaleDateString("es-ES")}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
