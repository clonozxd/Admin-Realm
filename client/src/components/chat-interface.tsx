import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Send, ArrowLeft, MessageCircle } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { ChatWithUser, Message } from "@shared/schema";

interface ChatListProps {
  chats: ChatWithUser[];
  isLoading?: boolean;
  onSelectChat: (chatId: number) => void;
  selectedChatId?: number;
}

export function ChatList({ chats, isLoading, onSelectChat, selectedChatId }: ChatListProps) {
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
      <div className="space-y-2 p-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3 p-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p>No hay conversaciones</p>
        <p className="text-sm mt-1">Inicia una conversación siguiendo a otros estudiantes</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-1 p-2">
        {chats.map((chat) => (
          <button
            key={chat.id}
            className={`w-full text-left p-3 rounded-lg flex gap-3 hover-elevate transition-colors ${
              selectedChatId === chat.id ? "bg-accent" : ""
            }`}
            onClick={() => onSelectChat(chat.id)}
            data-testid={`chat-${chat.id}`}
          >
            <Avatar className="h-10 w-10 flex-shrink-0">
              <AvatarFallback className="bg-primary/10 text-primary">
                {getInitials(chat.otherUser.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium text-sm truncate">{chat.otherUser.name}</span>
                {chat.lastMessage && (
                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    {format(new Date(chat.lastMessage.createdAt), "HH:mm", { locale: es })}
                  </span>
                )}
              </div>
              {chat.lastMessage && (
                <p className="text-sm text-muted-foreground truncate mt-0.5">
                  {chat.lastMessage.content}
                </p>
              )}
            </div>
            {chat.unreadCount > 0 && (
              <div className="h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center flex-shrink-0">
                {chat.unreadCount}
              </div>
            )}
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}

interface ChatMessagesProps {
  messages: Message[];
  currentUserId: number;
  otherUserName: string;
  isLoading?: boolean;
  onSendMessage: (content: string) => void;
  onBack?: () => void;
  isSending?: boolean;
}

export function ChatMessages({
  messages,
  currentUserId,
  otherUserName,
  isLoading,
  onSendMessage,
  onBack,
  isSending,
}: ChatMessagesProps) {
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage("");
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

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 p-4 border-b">
        {onBack && (
          <Button variant="ghost" size="icon" onClick={onBack} data-testid="button-back-chat">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-primary/10 text-primary">
            {getInitials(otherUserName)}
          </AvatarFallback>
        </Avatar>
        <span className="font-semibold">{otherUserName}</span>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`flex ${i % 2 === 0 ? "justify-end" : ""}`}>
                <Skeleton className="h-12 w-48 rounded-lg" />
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            <p>Inicia la conversación</p>
          </div>
        ) : (
          messages.map((message) => {
            const isMine = message.senderId === currentUserId;
            return (
              <div
                key={message.id}
                className={`flex ${isMine ? "justify-end" : ""}`}
                data-testid={`message-${message.id}`}
              >
                <div
                  className={`max-w-[75%] rounded-lg px-4 py-2 ${
                    isMine
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm break-words">{message.content}</p>
                  <p className={`text-xs mt-1 ${isMine ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                    {format(new Date(message.createdAt), "HH:mm", { locale: es })}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t flex gap-2">
        <Input
          placeholder="Escribe un mensaje..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1"
          data-testid="input-chat-message"
        />
        <Button type="submit" size="icon" disabled={!newMessage.trim() || isSending} data-testid="button-send-message">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
