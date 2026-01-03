import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import AdminLayout from "./layout";
import type { CommentWithUser } from "@shared/schema";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Trash2, MessageCircle, Shield } from "lucide-react";

interface CommentWithEvent extends CommentWithUser {
  eventTitle: string;
}

export default function AdminModeration() {
  const { toast } = useToast();

  const { data: comments = [], isLoading } = useQuery<CommentWithEvent[]>({
    queryKey: ["/api/admin/comments"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/comments/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/comments"] });
      toast({ title: "Comentario eliminado", description: "El comentario ha sido eliminado" });
    },
  });

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6" />
            Moderación
          </h1>
          <p className="text-muted-foreground">Revisar y moderar comentarios de usuarios</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Comentarios recientes ({comments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-16 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No hay comentarios para moderar</p>
              </div>
            ) : (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="flex gap-3 p-4 rounded-lg border"
                    data-testid={`comment-${comment.id}`}
                  >
                    <Avatar className="h-10 w-10 flex-shrink-0">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">
                        {getInitials(comment.user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{comment.user.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {comment.eventTitle}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(comment.createdAt), "d MMM yyyy, HH:mm", { locale: es })}
                        </span>
                      </div>
                      <p className="text-sm text-foreground/90 break-words">{comment.content}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteMutation.mutate(comment.id)}
                      className="flex-shrink-0"
                      data-testid={`button-delete-${comment.id}`}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
