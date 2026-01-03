import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { UserPlus, UserMinus, MessageCircle, Users } from "lucide-react";
import type { UserWithStats } from "@shared/schema";

interface FollowersListProps {
  users: UserWithStats[];
  isLoading?: boolean;
  onFollow: (userId: number) => void;
  onUnfollow: (userId: number) => void;
  onMessage: (userId: number) => void;
  currentUserId?: number;
  emptyMessage?: string;
}

export function FollowersList({
  users,
  isLoading,
  onFollow,
  onUnfollow,
  onMessage,
  currentUserId,
  emptyMessage = "No hay usuarios para mostrar",
}: FollowersListProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3 p-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-9 w-24" />
          </div>
        ))}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {users.map((user) => (
        <div
          key={user.id}
          className="flex items-center gap-3 p-3 rounded-lg hover-elevate"
          data-testid={`user-${user.id}`}
        >
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary/10 text-primary">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{user.name}</p>
            <p className="text-sm text-muted-foreground">
              {user.followersCount} seguidores
            </p>
          </div>
          <div className="flex gap-2">
            {user.id !== currentUserId && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onMessage(user.id)}
                  data-testid={`button-message-${user.id}`}
                >
                  <MessageCircle className="h-4 w-4" />
                </Button>
                {user.isFollowing ? (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onUnfollow(user.id)}
                    className="gap-1"
                    data-testid={`button-unfollow-${user.id}`}
                  >
                    <UserMinus className="h-4 w-4" />
                    Siguiendo
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => onFollow(user.id)}
                    className="gap-1"
                    data-testid={`button-follow-${user.id}`}
                  >
                    <UserPlus className="h-4 w-4" />
                    Seguir
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
