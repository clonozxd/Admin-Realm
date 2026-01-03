import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link, useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { ThemeToggle } from "@/components/theme-toggle";
import { ChatList, ChatMessages } from "@/components/chat-interface";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { ChatWithUser, Message } from "@shared/schema";
import { ArrowLeft, GraduationCap, MessageCircle } from "lucide-react";

export default function ChatsPage() {
  const params = useParams<{ chatId?: string }>();
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedChatId, setSelectedChatId] = useState<number | undefined>(
    params.chatId ? parseInt(params.chatId) : undefined
  );

  const { data: chats = [], isLoading: chatsLoading } = useQuery<ChatWithUser[]>({
    queryKey: ["/api/chats"],
    enabled: !!user,
  });

  const selectedChat = chats.find((c) => c.id === selectedChatId);

  const { data: messages = [], isLoading: messagesLoading } = useQuery<Message[]>({
    queryKey: ["/api/chats", selectedChatId, "messages"],
    enabled: !!selectedChatId,
    refetchInterval: 3000,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      await apiRequest("POST", `/api/chats/${selectedChatId}/messages`, { content });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chats", selectedChatId, "messages"] });
      queryClient.invalidateQueries({ queryKey: ["/api/chats"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo enviar el mensaje",
        variant: "destructive",
      });
    },
  });

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

  const handleSelectChat = (chatId: number) => {
    setSelectedChatId(chatId);
    setLocation(`/chats/${chatId}`);
  };

  const handleBack = () => {
    setSelectedChatId(undefined);
    setLocation("/chats");
  };

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const showChatList = !isMobile || !selectedChatId;
  const showMessages = !isMobile || selectedChatId;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
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
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <MessageCircle className="h-6 w-6" />
            Mensajes
          </h1>
          <p className="text-muted-foreground">Conversaciones con otros estudiantes</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-240px)]">
          {showChatList && (
            <Card className="md:col-span-1 overflow-hidden">
              <ChatList
                chats={chats}
                isLoading={chatsLoading}
                onSelectChat={handleSelectChat}
                selectedChatId={selectedChatId}
              />
            </Card>
          )}

          {showMessages && (
            <Card className="md:col-span-2 overflow-hidden">
              {selectedChat ? (
                <ChatMessages
                  messages={messages}
                  currentUserId={user.id}
                  otherUserName={selectedChat.otherUser.name}
                  isLoading={messagesLoading}
                  onSendMessage={(content) => sendMessageMutation.mutate(content)}
                  onBack={isMobile ? handleBack : undefined}
                  isSending={sendMessageMutation.isPending}
                />
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Selecciona una conversación</p>
                  </div>
                </div>
              )}
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
