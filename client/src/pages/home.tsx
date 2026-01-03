import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { ThemeToggle } from "@/components/theme-toggle";
import { CategoryFilter, type Category } from "@/components/category-filter";
import { EventCard } from "@/components/event-card";
import { NotificationsPanel } from "@/components/notifications-panel";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { EventWithStats, Notification } from "@shared/schema";
import { GraduationCap, LogIn, User, Settings, Calendar, History } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function HomePage() {
  const [, setLocation] = useLocation();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [category, setCategory] = useState<Category>("all");
  const [timeFilter, setTimeFilter] = useState<"upcoming" | "past">("upcoming");

  const eventsUrl = `/api/events?category=${category}&time=${timeFilter}`;
  const { data: events, isLoading: eventsLoading } = useQuery<EventWithStats[]>({
    queryKey: [eventsUrl],
  });

  const { data: notifications = [], isLoading: notificationsLoading } = useQuery<Notification[]>({
    queryKey: ["/api/notifications"],
    enabled: !!user,
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const likeMutation = useMutation({
    mutationFn: async (eventId: number) => {
      await apiRequest("POST", `/api/events/${eventId}/like`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [eventsUrl] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para dar like",
        variant: "destructive",
      });
    },
  });

  const attendMutation = useMutation({
    mutationFn: async (eventId: number) => {
      await apiRequest("POST", `/api/events/${eventId}/attend`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [eventsUrl] });
      toast({
        title: "Confirmado",
        description: "Tu asistencia ha sido registrada",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para confirmar asistencia",
        variant: "destructive",
      });
    },
  });

  const markNotificationReadMutation = useMutation({
    mutationFn: async (notificationId: number) => {
      await apiRequest("PATCH", `/api/notifications/${notificationId}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
    },
  });

  const markAllNotificationsReadMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/notifications/read-all");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
    },
  });

  const handleLogout = async () => {
    await logout();
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-lg hidden sm:inline">FIMAZ Eventos</span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            
            {user ? (
              <>
                <NotificationsPanel
                  notifications={notifications}
                  unreadCount={unreadCount}
                  isLoading={notificationsLoading}
                  onMarkAsRead={(id) => markNotificationReadMutation.mutate(id)}
                  onMarkAllAsRead={() => markAllNotificationsReadMutation.mutate()}
                />
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative" data-testid="button-user-menu">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-sm">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <div className="px-2 py-1.5">
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setLocation("/perfil")} data-testid="menu-profile">
                      <User className="h-4 w-4 mr-2" />
                      Mi perfil
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setLocation("/chats")} data-testid="menu-chats">
                      <User className="h-4 w-4 mr-2" />
                      Mensajes
                    </DropdownMenuItem>
                    {user.role === "admin" && (
                      <DropdownMenuItem onClick={() => setLocation("/admin")} data-testid="menu-admin">
                        <Settings className="h-4 w-4 mr-2" />
                        Panel Admin
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-destructive" data-testid="menu-logout">
                      <LogIn className="h-4 w-4 mr-2" />
                      Cerrar sesión
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button onClick={() => setLocation("/login")} data-testid="button-login-nav">
                <LogIn className="h-4 w-4 mr-2" />
                Iniciar sesión
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold">Eventos Universitarios</h1>
                <p className="text-muted-foreground">
                  Descubre los próximos eventos de FIMAZ
                </p>
              </div>
              
              <Tabs value={timeFilter} onValueChange={(v) => setTimeFilter(v as "upcoming" | "past")}>
                <TabsList>
                  <TabsTrigger value="upcoming" className="gap-1.5" data-testid="tab-upcoming">
                    <Calendar className="h-4 w-4" />
                    Próximos
                  </TabsTrigger>
                  <TabsTrigger value="past" className="gap-1.5" data-testid="tab-past">
                    <History className="h-4 w-4" />
                    Pasados
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <CategoryFilter selected={category} onSelect={setCategory} />

            {eventsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="aspect-video rounded-lg" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : events && events.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onLike={(id) => likeMutation.mutate(id)}
                    onAttend={(id) => attendMutation.mutate(id)}
                    showActions={!!user}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Calendar className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                <h2 className="text-xl font-semibold mb-2">No hay eventos</h2>
                <p className="text-muted-foreground">
                  {timeFilter === "upcoming"
                    ? "No hay eventos próximos en esta categoría"
                    : "No hay eventos pasados en esta categoría"}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="border-t py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Sistema de Difusión de Eventos Universitarios - FIMAZ</p>
          <p className="mt-1">Universidad Autónoma de Sinaloa</p>
        </div>
      </footer>
    </div>
  );
}
