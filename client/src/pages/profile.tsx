import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { ThemeToggle } from "@/components/theme-toggle";
import { FollowersList } from "@/components/followers-list";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { UserWithStats, EventWithStats } from "@shared/schema";
import { ArrowLeft, GraduationCap, Users, Calendar, Heart, Settings, Edit, Loader2 } from "lucide-react";
import { EventCard } from "@/components/event-card";

export default function ProfilePage() {
  const [, setLocation] = useLocation();
  const { user, refetchUser } = useAuth();
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editName, setEditName] = useState("");

  const { data: followers = [], isLoading: followersLoading } = useQuery<UserWithStats[]>({
    queryKey: ["/api/users/me/followers"],
    enabled: !!user,
  });

  const { data: following = [], isLoading: followingLoading } = useQuery<UserWithStats[]>({
    queryKey: ["/api/users/me/following"],
    enabled: !!user,
  });

  const { data: likedEvents = [], isLoading: likedLoading } = useQuery<EventWithStats[]>({
    queryKey: ["/api/users/me/liked-events"],
    enabled: !!user,
  });

  const { data: attendingEvents = [], isLoading: attendingLoading } = useQuery<EventWithStats[]>({
    queryKey: ["/api/users/me/attending-events"],
    enabled: !!user,
  });

  const followMutation = useMutation({
    mutationFn: async (userId: number) => {
      await apiRequest("POST", `/api/users/${userId}/follow`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users/me/followers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/users/me/following"] });
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: async (userId: number) => {
      await apiRequest("DELETE", `/api/users/${userId}/follow`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users/me/followers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/users/me/following"] });
    },
  });

  const startChatMutation = useMutation({
    mutationFn: async (userId: number) => {
      const res = await apiRequest("POST", "/api/chats", { userId });
      return res.json();
    },
    onSuccess: (data) => {
      setLocation(`/chats/${data.id}`);
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (name: string) => {
      const res = await apiRequest("PATCH", "/api/users/me/profile", { name });
      return res.json();
    },
    onSuccess: async () => {
      await refetchUser();
      setIsEditDialogOpen(false);
      toast({
        title: "Perfil actualizado",
        description: "Tu nombre ha sido actualizado correctamente",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar el perfil",
        variant: "destructive",
      });
    },
  });

  const handleEditProfile = () => {
    if (user) {
      setEditName(user.name);
      setIsEditDialogOpen(true);
    }
  };

  const handleSaveProfile = () => {
    if (editName.trim().length >= 2) {
      updateProfileMutation.mutate(editName.trim());
    } else {
      toast({
        title: "Error",
        description: "El nombre debe tener al menos 2 caracteres",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Acceso denegado</h1>
          <Button onClick={() => setLocation("/login")}>Iniciar sesión</Button>
        </div>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setLocation("/")} data-testid="button-back">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-semibold text-lg hidden sm:inline">FIMAZ Eventos</span>
              </div>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {user.role === "admin" && (
              <Button variant="outline" size="sm" onClick={() => setLocation("/admin")} data-testid="button-admin">
                <Settings className="h-4 w-4 mr-2" />
                Panel Admin
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="text-center sm:text-left flex-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                  <h1 className="text-2xl font-bold">{user.name}</h1>
                  <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                    {user.role === "admin" ? "Administrador" : "Estudiante"}
                  </Badge>
                </div>
                <p className="text-muted-foreground">{user.email}</p>
                <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{followers.length}</p>
                    <p className="text-sm text-muted-foreground">Seguidores</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{following.length}</p>
                    <p className="text-sm text-muted-foreground">Siguiendo</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{likedEvents.length}</p>
                    <p className="text-sm text-muted-foreground">Likes</p>
                  </div>
                </div>
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="mt-4" onClick={handleEditProfile} data-testid="button-edit-profile">
                      <Edit className="h-4 w-4 mr-2" />
                      Editar perfil
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Editar perfil</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-name">Nombre</Label>
                        <Input
                          id="edit-name"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          placeholder="Tu nombre"
                          data-testid="input-edit-name"
                        />
                        <p className="text-xs text-muted-foreground">
                          Solo puedes editar tu nombre. Para cambiar otros datos, contacta a un administrador.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label>Correo electrónico</Label>
                        <Input value={user.email} disabled />
                        <p className="text-xs text-muted-foreground">
                          Este campo solo puede ser modificado por un administrador
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label>Rol</Label>
                        <Input value={user.role === "admin" ? "Administrador" : "Estudiante"} disabled />
                        <p className="text-xs text-muted-foreground">
                          Este campo solo puede ser modificado por un administrador
                        </p>
                      </div>
                      <Button
                        onClick={handleSaveProfile}
                        disabled={updateProfileMutation.isPending}
                        className="w-full"
                        data-testid="button-save-profile"
                      >
                        {updateProfileMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        Guardar cambios
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="attending" className="w-full">
          <TabsList className="w-full justify-start mb-6 flex-wrap h-auto gap-1">
            <TabsTrigger value="attending" className="gap-1.5" data-testid="tab-attending">
              <Calendar className="h-4 w-4" />
              Mis eventos
            </TabsTrigger>
            <TabsTrigger value="liked" className="gap-1.5" data-testid="tab-liked">
              <Heart className="h-4 w-4" />
              Me gusta
            </TabsTrigger>
            <TabsTrigger value="followers" className="gap-1.5" data-testid="tab-followers">
              <Users className="h-4 w-4" />
              Seguidores
            </TabsTrigger>
            <TabsTrigger value="following" className="gap-1.5" data-testid="tab-following">
              <Users className="h-4 w-4" />
              Siguiendo
            </TabsTrigger>
          </TabsList>

          <TabsContent value="attending">
            {attendingLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2].map((i) => (
                  <Skeleton key={i} className="h-64" />
                ))}
              </div>
            ) : attendingEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {attendingEvents.map((event) => (
                  <EventCard key={event.id} event={event} showActions={false} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No tienes eventos confirmados</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="liked">
            {likedLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2].map((i) => (
                  <Skeleton key={i} className="h-64" />
                ))}
              </div>
            ) : likedEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {likedEvents.map((event) => (
                  <EventCard key={event.id} event={event} showActions={false} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Heart className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No tienes eventos favoritos</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="followers">
            <Card>
              <CardHeader>
                <CardTitle>Seguidores ({followers.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <FollowersList
                  users={followers}
                  isLoading={followersLoading}
                  onFollow={(id) => followMutation.mutate(id)}
                  onUnfollow={(id) => unfollowMutation.mutate(id)}
                  onMessage={(id) => startChatMutation.mutate(id)}
                  currentUserId={user.id}
                  emptyMessage="Aún no tienes seguidores"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="following">
            <Card>
              <CardHeader>
                <CardTitle>Siguiendo ({following.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <FollowersList
                  users={following}
                  isLoading={followingLoading}
                  onFollow={(id) => followMutation.mutate(id)}
                  onUnfollow={(id) => unfollowMutation.mutate(id)}
                  onMessage={(id) => startChatMutation.mutate(id)}
                  currentUserId={user.id}
                  emptyMessage="Aún no sigues a nadie"
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
