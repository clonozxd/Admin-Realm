import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  GraduationCap,
  LayoutDashboard,
  Calendar,
  Users,
  Shield,
  BarChart3,
  ArrowLeft,
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Eventos", url: "/admin/eventos", icon: Calendar },
  { title: "Usuarios", url: "/admin/usuarios", icon: Users },
  { title: "Moderación", url: "/admin/moderacion", icon: Shield },
  { title: "Métricas", url: "/admin/metricas", icon: BarChart3 },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [location, setLocation] = useLocation();
  const { user } = useAuth();

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Acceso denegado</h1>
          <p className="text-muted-foreground mb-4">
            No tienes permisos para acceder a esta sección
          </p>
          <Button onClick={() => setLocation("/")}>Volver al inicio</Button>
        </div>
      </div>
    );
  }

  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3.5rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <Sidebar>
          <SidebarHeader className="p-4 border-b">
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-semibold">FIMAZ Admin</span>
              </div>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Administración</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => {
                    const isActive = location === item.url || 
                      (item.url !== "/admin" && location.startsWith(item.url));
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive}
                          data-testid={`nav-${item.title.toLowerCase()}`}
                        >
                          <Link href={item.url}>
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between gap-4 p-4 border-b bg-background">
            <div className="flex items-center gap-2">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation("/")}
                className="gap-1"
                data-testid="button-back-home"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver
              </Button>
            </div>
            <ThemeToggle />
          </header>
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
