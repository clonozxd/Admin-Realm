import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Send, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { CommentWithUser } from "@shared/schema";

interface CommentSectionProps {
  comments: CommentWithUser[];
  isLoading?: boolean;
  onAddComment: (content: string) => void;
  onDeleteComment?: (commentId: number) => void;
  isSubmitting?: boolean;
  canDelete?: boolean;
  currentUserId?: number;
}

export function CommentSection({
  comments,
  isLoading,
  onAddComment,
  onDeleteComment,
  isSubmitting,
  canDelete,
  currentUserId,
}: CommentSectionProps) {
  const [newComment, setNewComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment.trim());
      setNewComment("");
    }
  };

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
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-16 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <Textarea
          placeholder="Escribe un comentario..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="flex-1 min-h-[80px] resize-none"
          data-testid="input-comment"
        />
        <Button
          type="submit"
          size="icon"
          disabled={!newComment.trim() || isSubmitting}
          data-testid="button-send-comment"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Sé el primero en comentar
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="flex gap-3 group"
              data-testid={`comment-${comment.id}`}
            >
              <Avatar className="h-10 w-10 flex-shrink-0">
                <AvatarFallback className="bg-primary/10 text-primary text-sm">
                  {getInitials(comment.user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-sm">{comment.user.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(comment.createdAt), "d MMM, HH:mm", { locale: es })}
                  </span>
                  {(canDelete || comment.userId === currentUserId) && onDeleteComment && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity ml-auto"
                      onClick={() => onDeleteComment(comment.id)}
                      data-testid={`button-delete-comment-${comment.id}`}
                    >
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  )}
                </div>
                <p className="text-sm mt-1 text-foreground/90 break-words">
                  {comment.content}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
