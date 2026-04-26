import { Injectable, Inject } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { eq, and, desc, count, sql, arrayContains } from 'drizzle-orm';
import {
  users, events, comments, likes, attendances,
  type User, type Event, type InsertEvent, type EventWithStats,
} from '../../../shared/schema';

@Injectable()
export class EventsService {
  constructor(@Inject(DatabaseService) private readonly databaseService: DatabaseService) {}

  private get db() {
    return this.databaseService.db;
  }

  async getUserById(id: number): Promise<User | undefined> {
    const [user] = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    return user;
  }

  async getEvents(category?: string, userId?: number, timeFilter?: string, includeAll?: boolean): Promise<EventWithStats[]> {
    const now = new Date();
    const conditions: any[] = [];

    if (category && category !== 'all') {
      conditions.push(arrayContains(events.categories, [category as any]));
    }

    if (!includeAll) {
      conditions.push(eq(events.isArchived, false));
    }

    if (timeFilter === 'past') {
      conditions.push(sql`${events.eventDate} < ${now}`);
    } else if (timeFilter === 'upcoming') {
      conditions.push(sql`${events.eventDate} >= ${now}`);
    }

    const whereClause = conditions.length > 0 ? (conditions.length === 1 ? conditions[0] : and(...conditions)) : undefined;

    const baseEvents = await this.db.select().from(events)
      .where(whereClause)
      .orderBy(desc(events.eventDate));

    return Promise.all(baseEvents.map(async (event) => {
      const [likesResult] = await this.db.select({ count: count() }).from(likes).where(eq(likes.eventId, event.id));
      const [commentsResult] = await this.db.select({ count: count() }).from(comments).where(eq(comments.eventId, event.id));
      const [attendeesResult] = await this.db.select({ count: count() }).from(attendances).where(eq(attendances.eventId, event.id));

      let isLiked = false;
      let isAttending = false;
      if (userId) {
        isLiked = await this.isEventLiked(event.id, userId);
        isAttending = await this.isEventAttending(event.id, userId);
      }

      return {
        ...event,
        likesCount: likesResult.count,
        commentsCount: commentsResult.count,
        attendeesCount: attendeesResult.count,
        isLiked,
        isAttending,
      };
    }));
  }

  async getEventById(id: number, userId?: number, includeArchived?: boolean): Promise<EventWithStats | undefined> {
    const whereClause = includeArchived
      ? eq(events.id, id)
      : and(eq(events.id, id), eq(events.isArchived, false));
    const [event] = await this.db.select().from(events).where(whereClause).limit(1);
    if (!event) return undefined;

    const [likesResult] = await this.db.select({ count: count() }).from(likes).where(eq(likes.eventId, id));
    const [commentsResult] = await this.db.select({ count: count() }).from(comments).where(eq(comments.eventId, id));
    const [attendeesResult] = await this.db.select({ count: count() }).from(attendances).where(eq(attendances.eventId, id));

    let isLiked = false;
    let isAttending = false;
    if (userId) {
      isLiked = await this.isEventLiked(id, userId);
      isAttending = await this.isEventAttending(id, userId);
    }

    return {
      ...event,
      likesCount: likesResult.count,
      commentsCount: commentsResult.count,
      attendeesCount: attendeesResult.count,
      isLiked,
      isAttending,
    };
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const [newEvent] = await this.db.insert(events).values(event).returning();
    return newEvent;
  }

  async updateEvent(id: number, eventData: Partial<InsertEvent>): Promise<Event | undefined> {
    const [event] = await this.db.update(events).set(eventData).where(eq(events.id, id)).returning();
    return event;
  }

  async deleteEvent(id: number): Promise<boolean> {
    await this.db.delete(events).where(eq(events.id, id));
    return true;
  }

  async archiveEvent(id: number): Promise<Event | undefined> {
    const [event] = await this.db.update(events).set({ isArchived: true }).where(eq(events.id, id)).returning();
    return event;
  }

  async incrementEventViews(id: number): Promise<void> {
    await this.db.update(events).set({ views: sql`${events.views} + 1` }).where(eq(events.id, id));
  }

  async toggleLike(eventId: number, userId: number): Promise<boolean> {
    const existing = await this.db.select().from(likes)
      .where(and(eq(likes.eventId, eventId), eq(likes.userId, userId)))
      .limit(1);

    if (existing.length > 0) {
      await this.db.delete(likes).where(and(eq(likes.eventId, eventId), eq(likes.userId, userId)));
      return false;
    } else {
      await this.db.insert(likes).values({ eventId, userId });
      return true;
    }
  }

  async isEventLiked(eventId: number, userId: number): Promise<boolean> {
    const [result] = await this.db.select().from(likes)
      .where(and(eq(likes.eventId, eventId), eq(likes.userId, userId)))
      .limit(1);
    return !!result;
  }

  async toggleAttendance(eventId: number, userId: number): Promise<boolean> {
    const existing = await this.db.select().from(attendances)
      .where(and(eq(attendances.eventId, eventId), eq(attendances.userId, userId)))
      .limit(1);

    if (existing.length > 0) {
      await this.db.delete(attendances).where(and(eq(attendances.eventId, eventId), eq(attendances.userId, userId)));
      return false;
    } else {
      await this.db.insert(attendances).values({ eventId, userId });
      return true;
    }
  }

  async isEventAttending(eventId: number, userId: number): Promise<boolean> {
    const [result] = await this.db.select().from(attendances)
      .where(and(eq(attendances.eventId, eventId), eq(attendances.userId, userId)))
      .limit(1);
    return !!result;
  }

  async getLikedEvents(userId: number): Promise<EventWithStats[]> {
    const likedEventIds = await this.db.select({ eventId: likes.eventId }).from(likes).where(eq(likes.userId, userId));
    const eventsList: EventWithStats[] = [];
    for (const { eventId } of likedEventIds) {
      const event = await this.getEventById(eventId, userId);
      if (event) eventsList.push(event);
    }
    return eventsList;
  }

  async getAttendingEvents(userId: number): Promise<EventWithStats[]> {
    const attendingEventIds = await this.db.select({ eventId: attendances.eventId }).from(attendances).where(eq(attendances.userId, userId));
    const eventsList: EventWithStats[] = [];
    for (const { eventId } of attendingEventIds) {
      const event = await this.getEventById(eventId, userId);
      if (event) eventsList.push(event);
    }
    return eventsList;
  }
}
