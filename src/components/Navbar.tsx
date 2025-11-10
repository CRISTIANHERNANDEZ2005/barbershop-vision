import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { User as UserIcon, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo.png";
import type { User } from "@supabase/supabase-js";

const Navbar = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión correctamente.",
      });
      navigate("/");
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-3">
            <img src={logo} alt="BARBERSHOP" className="h-12" />
            <span className="text-2xl font-orbitron font-bold text-foreground">
              BARBERSHOP
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#inicio" className="text-foreground hover:text-primary transition-colors">Inicio</a>
            <a href="#nosotros" className="text-foreground hover:text-primary transition-colors">Nosotros</a>
            <a href="#galeria" className="text-foreground hover:text-primary transition-colors">Galería</a>
            <a href="#servicios" className="text-foreground hover:text-primary transition-colors">Servicios</a>
            <a href="#resenas" className="text-foreground hover:text-primary transition-colors">Reseñas</a>
            <a href="#horarios" className="text-foreground hover:text-primary transition-colors">Horarios</a>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 px-3 py-2 rounded-md bg-primary/10">
                  <UserIcon className="h-5 w-5 text-primary" />
                  <span className="text-sm text-foreground hidden sm:inline">
                    {user.email?.split("@")[0]}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Salir</span>
                </Button>
              </div>
            ) : (
              <Button
                variant="hero"
                onClick={() => navigate("/auth")}
                className="flex items-center space-x-2"
              >
                <UserIcon className="h-4 w-4" />
                <span>Iniciar Sesión</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
