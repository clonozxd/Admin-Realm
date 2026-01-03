import { Bell, Calendar, MessageCircle, UserPlus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { Notification } from "@shared/schema";

interface NotificationsPanelProps {
  notifications: Notification[];
  unreadCount: number;
  isLoading?: boolean;
  onMarkAsRead: (id: number) => void;
  onMarkAllAsRead: () => void;
}

const notificationIcons = {
  event_update: Calendar,
  new_comment: MessageCircle,
  new_follower: UserPlus,
  new_message: MessageCircle,
};

export function NotificationsPanel({
  notifications,
  unreadCount,
  isLoading,
  onMarkAsRead,
  onMarkAllAsRead,
}: NotificationsPanelProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          data-testid="button-notifications"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
              variant="destructive"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Notificaciones</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMarkAllAsRead}
              className="text-xs"
              data-testid="button-mark-all-read"
            >
              <Check className="h-3 w-3 mr-1" />
              Marcar todas
            </Button>
          )}
        </div>
        <ScrollArea className="h-[300px]">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No hay notificaciones</p>
            </div>
          ) : (
            <div>
              {notifications.map((notification) => {
                const Icon = notificationIcons[notification.type];
                return (
                  <button
                    key={notification.id}
                    className={`w-full text-left p-4 hover-elevate transition-colors flex gap-3 ${
                      !notification.isRead ? "bg-primary/5" : ""
                    }`}
                    onClick={() => onMarkAsRead(notification.id)}
                    data-testid={`notification-${notification.id}`}
                  >
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      !notification.isRead ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                    }`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${!notification.isRead ? "font-medium" : ""}`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(new Date(notification.createdAt), "d MMM, HH:mm", { locale: es })}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
