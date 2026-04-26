import { Injectable, Inject } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { eq, and, or, ne, desc, count } from 'drizzle-orm';
import {
  users, chats, messages,
  type Chat, type Message, type InsertMessage, type ChatWithUser,
} from '../../../shared/schema';

@Injectable()
export class ChatsService {
  constructor(@Inject(DatabaseService) private readonly databaseService: DatabaseService) {}

  private get db() {
    return this.databaseService.db;
  }

  async getChats(userId: number): Promise<ChatWithUser[]> {
    const chatsList = await this.db.select().from(chats)
      .where(or(eq(chats.user1Id, userId), eq(chats.user2Id, userId)))
      .orderBy(desc(chats.lastMessageAt));

    return Promise.all(chatsList.map(async (chat) => {
      const otherUserId = chat.user1Id === userId ? chat.user2Id : chat.user1Id;
      const [otherUser] = await this.db.select({ id: users.id, name: users.name }).from(users).where(eq(users.id, otherUserId));
      const [lastMessage] = await this.db.select().from(messages)
        .where(eq(messages.chatId, chat.id))
        .orderBy(desc(messages.createdAt))
        .limit(1);
      const [unreadResult] = await this.db.select({ count: count() }).from(messages)
        .where(and(eq(messages.chatId, chat.id), ne(messages.senderId, userId), eq(messages.isRead, false)));
      return { ...chat, otherUser, lastMessage, unreadCount: unreadResult.count };
    }));
  }

  async getChatById(id: number, userId: number): Promise<Chat | undefined> {
    const [chat] = await this.db.select().from(chats)
      .where(and(eq(chats.id, id), or(eq(chats.user1Id, userId), eq(chats.user2Id, userId))))
      .limit(1);
    return chat;
  }

  async createOrGetChat(user1Id: number, user2Id: number): Promise<Chat> {
    const [existing] = await this.db.select().from(chats)
      .where(or(
        and(eq(chats.user1Id, user1Id), eq(chats.user2Id, user2Id)),
        and(eq(chats.user1Id, user2Id), eq(chats.user2Id, user1Id))
      ))
      .limit(1);
    if (existing) return existing;
    const [newChat] = await this.db.insert(chats).values({ user1Id, user2Id }).returning();
    return newChat;
  }

  async getMessages(chatId: number): Promise<Message[]> {
    return this.db.select().from(messages).where(eq(messages.chatId, chatId)).orderBy(messages.createdAt);
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await this.db.insert(messages).values(message).returning();
    await this.db.update(chats).set({ lastMessageAt: new Date() }).where(eq(chats.id, message.chatId));
    return newMessage;
  }

  async markMessagesAsRead(chatId: number, userId: number): Promise<void> {
    await this.db.update(messages).set({ isRead: true })
      .where(and(eq(messages.chatId, chatId), ne(messages.senderId, userId)));
  }
}
