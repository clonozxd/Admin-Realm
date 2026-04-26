import { Injectable, Inject } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { eq, desc, count, sql } from 'drizzle-orm';
import { users, events, comments, likes, attendances } from '../../../shared/schema';

@Injectable()
export class AdminService {
  constructor(@Inject(DatabaseService) private readonly databaseService: DatabaseService) {}

  private get db() {
    return this.databaseService.db;
  }

  async getAdminStats() {
    const [usersResult] = await this.db.select({ count: count() }).from(users);
    const [eventsResult] = await this.db.select({ count: count() }).from(events);
    const [commentsResult] = await this.db.select({ count: count() }).from(comments);
    const [likesResult] = await this.db.select({ count: count() }).from(likes);
    const [viewsResult] = await this.db.select({ total: sql<number>`COALESCE(SUM(${events.views}), 0)` }).from(events);
    const [activeEventsResult] = await this.db.select({ count: count() }).from(events).where(eq(events.isArchived, false));

    const allEvents = await this.db.select().from(events);
    const eventsWithStats = await Promise.all(allEvents.map(async (event) => {
      const [likesRes] = await this.db.select({ count: count() }).from(likes).where(eq(likes.eventId, event.id));
      const [commentsRes] = await this.db.select({ count: count() }).from(comments).where(eq(comments.eventId, event.id));
      const [attendeesRes] = await this.db.select({ count: count() }).from(attendances).where(eq(attendances.eventId, event.id));
      return {
        id: event.id, title: event.title,
        likes: likesRes.count, comments: commentsRes.count, attendees: attendeesRes.count,
        totalInteractions: likesRes.count + commentsRes.count + attendeesRes.count
      };
    }));

    const topEvents = eventsWithStats
      .sort((a, b) => b.totalInteractions - a.totalInteractions)
      .slice(0, 5)
      .map(({ totalInteractions, ...rest }) => rest);

    return {
      totalUsers: usersResult.count, totalEvents: eventsResult.count,
      totalComments: commentsResult.count, activeEvents: activeEventsResult.count,
      totalLikes: likesResult.count, totalViews: Number(viewsResult.total) || 0,
      topEvents,
    };
  }

  async getMetrics() {
    const allEvents = await this.db.select().from(events).orderBy(desc(events.eventDate));
    let totalViews = 0, totalLikes = 0, totalComments = 0, totalAttendees = 0;

    const eventsWithMetrics = await Promise.all(allEvents.map(async (event) => {
      const [likesResult] = await this.db.select({ count: count() }).from(likes).where(eq(likes.eventId, event.id));
      const [commentsResult] = await this.db.select({ count: count() }).from(comments).where(eq(comments.eventId, event.id));
      const [attendeesResult] = await this.db.select({ count: count() }).from(attendances).where(eq(attendances.eventId, event.id));
      const ev = event.views || 0, el = likesResult.count, ec = commentsResult.count, ea = attendeesResult.count;
      totalViews += ev; totalLikes += el; totalComments += ec; totalAttendees += ea;
      return {
        id: event.id, title: event.title, categories: event.categories,
        eventDate: event.eventDate.toISOString(), views: ev, likes: el, comments: ec, attendees: ea,
      };
    }));

    return {
      events: eventsWithMetrics,
      totals: { views: totalViews, likes: totalLikes, comments: totalComments, attendees: totalAttendees },
    };
  }
}
