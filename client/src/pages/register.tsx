import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { ThemeToggle } from "@/components/theme-toggle";
import { createUserSchema, type CreateUserInput } from "@shared/schema";
import { GraduationCap, Loader2, Shield } from "lucide-react";

export default function RegisterPage() {
  const [, setLocation] = useLocation();
  const { refetchUser } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<Omit<CreateUserInput, "role">>({
    resolver: zodResolver(createUserSchema.omit({ role: true })),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: Omit<CreateUserInput, "role">) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/bootstrap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...data, role: "admin" }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Error al crear administrador");
      }

      await refetchUser();
      toast({
        title: "Cuenta creada",
        description: "Tu cuenta de administrador ha sido creada exitosamente",
      });
      setLocation("/");
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al crear la cuenta",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Crear Administrador</CardTitle>
            <CardDescription>
              Crea la primera cuenta de administrador para el sistema de eventos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre completo</Label>
                <Input
                  id="name"
                  placeholder="Tu nombre"
                  {...form.register("name")}
                  data-testid="input-name"
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>

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
                  placeholder="Tu contraseña segura"
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
                data-testid="button-register"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creando cuenta...
                  </>
                ) : (
                  "Crear cuenta de administrador"
                )}
              </Button>
            </form>

            <p className="mt-4 text-center text-sm text-muted-foreground">
              Esta será la primera cuenta y tendrá privilegios de administrador
            </p>
          </CardContent>
        </Card>
      </main>

      <footer className="p-4 text-center text-sm text-muted-foreground border-t">
        <p>Sistema de Difusión de Eventos Universitarios - FIMAZ</p>
      </footer>
    </div>
  );
}
