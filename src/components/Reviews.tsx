import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Star, MessageSquare, Pencil, Trash2, Search } from "lucide-react";
import { z } from "zod";
import type { User } from "@supabase/supabase-js";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useIsMobile } from "@/hooks/use-mobile";
import Autoplay from "embla-carousel-autoplay";

const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z
    .string()
    .trim()
    .min(1, "El comentario no puede estar vacío")
    .max(500, "El comentario no puede exceder 500 caracteres"),
});

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  user_id: string;
  public_profiles: {
    first_name: string;
    last_name: string;
  };
}

const Reviews = () => {
  const [user, setUser] = useState<User | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [displayedReviews, setDisplayedReviews] = useState<Review[][]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingReview, setEditingReview] = useState<string | null>(null);
  const [filterRating, setFilterRating] = useState<string>("all");
  const { toast } = useToast();
  const isMobile = useIsMobile();

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
        user_id,
        public_profiles (
          first_name,
          last_name
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading reviews:", error);
    } else {
      setReviews(data || []);
      setFilteredReviews(data || []);
    }
  };

  useEffect(() => {
    if (filterRating === "all") {
      setFilteredReviews(reviews);
    } else {
      const rating = parseInt(filterRating);
      setFilteredReviews(reviews.filter((review) => review.rating === rating));
    }
  }, [filterRating, reviews]);

  useEffect(() => {
    const reviewsPerSlide = isMobile ? 3 : 6;
    const chunks: Review[][] = [];
    
    for (let i = 0; i < filteredReviews.length; i += reviewsPerSlide) {
      chunks.push(filteredReviews.slice(i, i + reviewsPerSlide));
    }
    
    setDisplayedReviews(chunks);
  }, [filteredReviews, isMobile]);

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const getUserReviewCount = async () => {
    if (!user) return 0;
    const { count } = await supabase
      .from("reviews")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);
    return count || 0;
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

    // Validate input
    const result = reviewSchema.safeParse({ rating, comment });
    if (!result.success) {
      toast({
        title: "Error de validación",
        description: result.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    const userReviewCount = await getUserReviewCount();
    
    if (!editingReview && userReviewCount >= 3) {
      toast({
        title: "Límite alcanzado",
        description: "Solo puedes tener un máximo de 3 reseñas.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    if (editingReview) {
      const { error } = await supabase
        .from("reviews")
        .update({ rating, comment })
        .eq("id", editingReview);

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "¡Reseña actualizada!",
          description: "Tu reseña ha sido actualizada.",
        });
        setComment("");
        setRating(5);
        setEditingReview(null);
        loadReviews();
      }
    } else {
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
    }

    setLoading(false);
  };

  const handleEditReview = (review: Review) => {
    setEditingReview(review.id);
    setRating(review.rating);
    setComment(review.comment);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteReview = async (reviewId: string) => {
    const { error } = await supabase
      .from("reviews")
      .delete()
      .eq("id", reviewId);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Reseña eliminada",
        description: "Tu reseña ha sido eliminada.",
      });
      loadReviews();
    }
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
    setRating(5);
    setComment("");
  };

  return (
    <section id="resenas" className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto">
        <h2 className="text-5xl md:text-6xl font-bold text-center mb-4 glow-text">
          Reseñas de Clientes
        </h2>
        <p className="text-center text-muted-foreground mb-8 text-lg">
          Lo que dicen nuestros clientes satisfechos
        </p>

        {reviews.length > 0 && (
          <div className="flex items-center justify-center gap-4 mb-16">
            <div className="flex items-center gap-2 text-3xl font-bold">
              <Star className="h-8 w-8 fill-primary text-primary" />
              <span className="text-foreground">{calculateAverageRating()}</span>
              <span className="text-muted-foreground text-xl">
                / 5.0
              </span>
            </div>
            <div className="text-muted-foreground">
              ({reviews.length} {reviews.length === 1 ? "reseña" : "reseñas"})
            </div>
          </div>
        )}

        {user && (
          <Card className="max-w-2xl mx-auto mb-12 p-6 bg-card border-border">
            <h3 className="text-2xl font-orbitron font-bold mb-4 text-foreground">
              {editingReview ? "Editar reseña" : "Deja tu reseña"}
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
                  maxLength={500}
                  required
                />
                <p className="text-sm text-muted-foreground mt-1">
                  {comment.length}/500 caracteres
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  variant="hero"
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? "Enviando..." : editingReview ? "Actualizar Reseña" : "Enviar Reseña"}
                </Button>
                {editingReview && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancelEdit}
                    disabled={loading}
                  >
                    Cancelar
                  </Button>
                )}
              </div>
            </form>
          </Card>
        )}

        <div className="max-w-6xl mx-auto mb-8">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">Filtrar por:</span>
            <Select value={filterRating} onValueChange={setFilterRating}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las estrellas</SelectItem>
                <SelectItem value="5">5 estrellas</SelectItem>
                <SelectItem value="4">4 estrellas</SelectItem>
                <SelectItem value="3">3 estrellas</SelectItem>
                <SelectItem value="2">2 estrellas</SelectItem>
                <SelectItem value="1">1 estrella</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredReviews.length === 0 ? (
          <Card className="max-w-2xl mx-auto p-12 bg-card border-border text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="rounded-full bg-muted p-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-orbitron font-bold text-foreground">
                No hay reseñas disponibles
              </h3>
              <p className="text-muted-foreground max-w-md">
                {filterRating === "all" 
                  ? "Aún no hay reseñas. ¡Sé el primero en compartir tu experiencia!"
                  : `No encontramos reseñas con ${filterRating} ${filterRating === "1" ? "estrella" : "estrellas"}. Intenta con otro filtro.`
                }
              </p>
            </div>
          </Card>
        ) : (
          <div className="max-w-7xl mx-auto px-4">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              plugins={[
                Autoplay({
                  delay: 4000,
                  stopOnInteraction: true,
                }),
              ]}
              orientation={isMobile ? "vertical" : "horizontal"}
              className="w-full"
            >
              <CarouselContent>
                {displayedReviews.map((reviewChunk, slideIndex) => (
                  <CarouselItem key={slideIndex}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {reviewChunk.map((review) => (
                        <Card
                          key={review.id}
                          className="p-6 bg-card border-border hover-glow animate-fade-in"
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

                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center space-x-2">
                              <MessageSquare className="h-4 w-4" />
                              <span>{review.public_profiles.first_name} {review.public_profiles.last_name}</span>
                              <span>•</span>
                              <span>
                                {new Date(review.created_at).toLocaleDateString("es-ES")}
                              </span>
                            </div>

                            {user && review.user_id === user.id && (
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEditReview(review)}
                                  className="h-8 w-8"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteReview(review.id)}
                                  className="h-8 w-8 text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </Card>
                      ))}
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {displayedReviews.length > 1 && (
                <>
                  <CarouselPrevious className="hidden md:flex" />
                  <CarouselNext className="hidden md:flex" />
                </>
              )}
            </Carousel>
          </div>
        )}
      </div>
    </section>
  );
};

export default Reviews;
