import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home";
import LoginPage from "@/pages/login";
import RegisterPage from "@/pages/register";
import EventDetailPage from "@/pages/event-detail";
import ProfilePage from "@/pages/profile";
import ChatsPage from "@/pages/chats";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminEvents from "@/pages/admin/events";
import AdminUsers from "@/pages/admin/users";
import AdminModeration from "@/pages/admin/moderation";
import AdminMetrics from "@/pages/admin/metrics";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/registro" component={RegisterPage} />
      <Route path="/evento/:id" component={EventDetailPage} />
      <Route path="/perfil" component={ProfilePage} />
      <Route path="/chats" component={ChatsPage} />
      <Route path="/chats/:chatId" component={ChatsPage} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/eventos" component={AdminEvents} />
      <Route path="/admin/usuarios" component={AdminUsers} />
      <Route path="/admin/moderacion" component={AdminModeration} />
      <Route path="/admin/metricas" component={AdminMetrics} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
