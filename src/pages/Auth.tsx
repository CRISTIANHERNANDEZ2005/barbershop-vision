import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Phone, Lock, User } from "lucide-react";
import logo from "@/assets/logo.png";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handlePhoneAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar teléfono de 10 dígitos
    if (phone.length !== 10 || !/^\d{10}$/.test(phone)) {
      toast({
        title: "Error",
        description: "El teléfono debe tener exactamente 10 dígitos numéricos.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Convertir teléfono a formato email para usar el sistema de auth de Supabase
      const email = `${phone}@barbershop.local`;
      
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast({
          title: "¡Bienvenido!",
          description: "Has iniciado sesión correctamente.",
        });
      } else {
        if (!firstName.trim() || !lastName.trim()) {
          toast({
            title: "Error",
            description: "Por favor completa todos los campos.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName,
              last_name: lastName,
              phone: phone,
            },
            emailRedirectTo: `${window.location.origin}/`,
          },
        });

        if (error) throw error;

        toast({
          title: "¡Cuenta creada!",
          description: "Tu cuenta ha sido creada exitosamente.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/20"></div>
      
      <Card className="w-full max-w-md p-8 relative z-10 bg-card/95 backdrop-blur-sm border-border shadow-glow">
        <div className="text-center mb-8">
          <img src={logo} alt="BARBERSHOP" className="h-20 mx-auto mb-4" />
          <h1 className="text-3xl font-orbitron font-bold text-foreground mb-2">
            {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
          </h1>
          <p className="text-muted-foreground">
            {isLogin
              ? "Bienvenido de vuelta a BARBERSHOP"
              : "Únete a la comunidad de BARBERSHOP"}
          </p>
        </div>

        <form onSubmit={handlePhoneAuth} className="space-y-4">
          {!isLogin && (
            <>
              <div className="space-y-2">
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Nombre"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="pl-10 bg-background/50"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Apellido"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="pl-10 bg-background/50"
                    required
                  />
                </div>
              </div>
            </>
          )}

          <div className="space-y-2">
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                type="tel"
                placeholder="Teléfono (10 dígitos)"
                value={phone}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setPhone(value);
                }}
                className="pl-10 bg-background/50"
                required
                maxLength={10}
                pattern="\d{10}"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 bg-background/50"
                required
                minLength={6}
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="hero"
            className="w-full"
            disabled={loading}
          >
            {loading
              ? "Cargando..."
              : isLogin
              ? "Iniciar Sesión"
              : "Crear Cuenta"}
          </Button>
        </form>

        <div className="text-center mt-6">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary hover:underline text-sm"
          >
            {isLogin
              ? "¿No tienes cuenta? Regístrate"
              : "¿Ya tienes cuenta? Inicia sesión"}
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Auth;
