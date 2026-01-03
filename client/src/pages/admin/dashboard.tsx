import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import AdminLayout from "./layout";
import {
  Calendar,
  Users,
  Heart,
  MessageCircle,
  Eye,
  TrendingUp,
} from "lucide-react";

interface DashboardStats {
  totalEvents: number;
  activeEvents: number;
  totalUsers: number;
  totalLikes: number;
  totalComments: number;
  totalViews: number;
  topEvents: Array<{
    id: number;
    title: string;
    likes: number;
    comments: number;
    attendees: number;
  }>;
}

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/admin/stats"],
  });

  const statCards = [
    {
      title: "Total Eventos",
      value: stats?.totalEvents ?? 0,
      icon: Calendar,
      description: `${stats?.activeEvents ?? 0} activos`,
    },
    {
      title: "Usuarios",
      value: stats?.totalUsers ?? 0,
      icon: Users,
      description: "Registrados",
    },
    {
      title: "Total Likes",
      value: stats?.totalLikes ?? 0,
      icon: Heart,
      description: "En todos los eventos",
    },
    {
      title: "Comentarios",
      value: stats?.totalComments ?? 0,
      icon: MessageCircle,
      description: "En todos los eventos",
    },
    {
      title: "Visitas",
      value: stats?.totalViews ?? 0,
      icon: Eye,
      description: "Total de visualizaciones",
    },
    {
      title: "Interacciones",
      value: (stats?.totalLikes ?? 0) + (stats?.totalComments ?? 0),
      icon: TrendingUp,
      description: "Likes + comentarios",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Vista general del sistema de eventos
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading
            ? Array(6)
                .fill(0)
                .map((_, i) => (
                  <Card key={i}>
                    <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-8 w-8 rounded" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-8 w-16 mb-1" />
                      <Skeleton className="h-3 w-20" />
                    </CardContent>
                  </Card>
                ))
            : statCards.map((stat) => (
                <Card key={stat.title} data-testid={`stat-${stat.title.toLowerCase().replace(" ", "-")}`}>
                  <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <stat.icon className="h-4 w-4 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">{stat.description}</p>
                  </CardContent>
                </Card>
              ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Eventos con mayor interacción
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-4 w-8" />
                    <Skeleton className="h-4 flex-1" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>
            ) : stats?.topEvents && stats.topEvents.length > 0 ? (
              <div className="space-y-3">
                {stats.topEvents.map((event, index) => (
                  <div
                    key={event.id}
                    className="flex items-center gap-4 p-3 rounded-lg bg-muted/50"
                    data-testid={`top-event-${event.id}`}
                  >
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{event.title}</p>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3" /> {event.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" /> {event.comments}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" /> {event.attendees}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No hay eventos con interacciones aún
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
