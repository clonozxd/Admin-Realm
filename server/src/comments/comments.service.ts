import { Injectable, Inject } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { eq, desc, count } from 'drizzle-orm';
import {
  users, events, comments,
  type Comment, type InsertComment, type CommentWithUser, type User, type Event,
} from '../../../shared/schema';

@Injectable()
export class CommentsService {
  constructor(@Inject(DatabaseService) private readonly databaseService: DatabaseService) {}

  private get db() {
    return this.databaseService.db;
  }

  async getCommentsByEventId(eventId: number): Promise<CommentWithUser[]> {
    const result = await this.db.select({
      id: comments.id,
      eventId: comments.eventId,
      userId: comments.userId,
      content: comments.content,
      createdAt: comments.createdAt,
      user: {
        id: users.id,
        name: users.name,
      },
    })
    .from(comments)
    .innerJoin(users, eq(comments.userId, users.id))
    .where(eq(comments.eventId, eventId))
    .orderBy(desc(comments.createdAt));

    return result;
  }

  async createComment(comment: InsertComment): Promise<Comment> {
    const [newComment] = await this.db.insert(comments).values(comment).returning();
    return newComment;
  }

  async deleteComment(id: number): Promise<boolean> {
    await this.db.delete(comments).where(eq(comments.id, id));
    return true;
  }

  async getAllComments(): Promise<(Comment & { user: Pick<User, 'id' | 'name'>; event: Pick<Event, 'id' | 'title'> })[]> {
    const result = await this.db.select({
      id: comments.id,
      eventId: comments.eventId,
      userId: comments.userId,
      content: comments.content,
      createdAt: comments.createdAt,
      user: {
        id: users.id,
        name: users.name,
      },
      event: {
        id: events.id,
        title: events.title,
      },
    })
    .from(comments)
    .innerJoin(users, eq(comments.userId, users.id))
    .innerJoin(events, eq(comments.eventId, events.id))
    .orderBy(desc(comments.createdAt));

    return result;
  }
}
