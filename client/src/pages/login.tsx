import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { ThemeToggle } from "@/components/theme-toggle";
import { loginSchema, type LoginInput } from "@shared/schema";
import { GraduationCap, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const { login, user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const { data: bootstrapData } = useQuery<{ needsBootstrap: boolean }>({
    queryKey: ["/api/auth/needs-bootstrap"],
  });

  useEffect(() => {
    if (bootstrapData?.needsBootstrap) {
      setLocation("/registro");
    }
  }, [bootstrapData, setLocation]);

  useEffect(() => {
    if (user) {
      setLocation("/");
    }
  }, [user, setLocation]);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      toast({
        title: "Bienvenido",
        description: "Has iniciado sesión correctamente",
      });
      setLocation("/");
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al iniciar sesión",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (bootstrapData?.needsBootstrap) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-semibold text-lg">FIMAZ Eventos</span>
        </div>
        <ThemeToggle />
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
            <CardDescription>
              Ingresa tus credenciales para acceder al sistema de eventos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@correo.edu.mx"
                  {...form.register("email")}
                  data-testid="input-email"
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Tu contraseña"
                  {...form.register("password")}
                  data-testid="input-password"
                />
                {form.formState.errors.password && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
                data-testid="button-login"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Iniciando sesión...
                  </>
                ) : (
                  "Iniciar sesión"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Button
                variant="ghost"
                onClick={() => setLocation("/")}
                className="text-muted-foreground"
                data-testid="button-back-home"
              >
                Volver a ver eventos sin cuenta
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <footer className="p-4 text-center text-sm text-muted-foreground border-t">
        <p>Sistema de Difusión de Eventos Universitarios - FIMAZ</p>
      </footer>
    </div>
  );
}
