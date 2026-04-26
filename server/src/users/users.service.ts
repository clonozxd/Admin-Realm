import { Injectable, Inject } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { eq, and, desc, count } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import {
  users, followers,
  type User, type UserWithStats, type CreateUserInput,
} from '../../../shared/schema';

@Injectable()
export class UsersService {
  constructor(@Inject(DatabaseService) private readonly databaseService: DatabaseService) {}

  private get db() {
    return this.databaseService.db;
  }

  async getUserById(id: number): Promise<User | undefined> {
    const [user] = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return this.db.select().from(users).orderBy(desc(users.createdAt));
  }

  async updateUserName(id: number, name: string): Promise<User | undefined> {
    const [user] = await this.db.update(users).set({ name }).where(eq(users.id, id)).returning();
    return user;
  }

  async updateUserBlocked(id: number, isBlocked: boolean): Promise<User | undefined> {
    const [user] = await this.db.update(users).set({ isBlocked }).where(eq(users.id, id)).returning();
    return user;
  }

  async updateUserByAdmin(id: number, data: { name?: string; role?: 'admin' | 'student' }): Promise<User | undefined> {
    const [user] = await this.db.update(users).set(data).where(eq(users.id, id)).returning();
    return user;
  }

  async createUser(userData: CreateUserInput): Promise<User> {
    const [userCountResult] = await this.db.select({ count: count() }).from(users);
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const role = userCountResult.count === 0 ? 'admin' : userData.role;

    const [user] = await this.db.insert(users).values({
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      role: role,
    }).returning();
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await this.db.select().from(users).where(eq(users.email, email)).limit(1);
    return user;
  }

  async getFollowers(userId: number): Promise<UserWithStats[]> {
    const followersList = await this.db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      isBlocked: users.isBlocked,
      createdAt: users.createdAt,
    })
    .from(followers)
    .innerJoin(users, eq(followers.followerId, users.id))
    .where(eq(followers.followingId, userId));

    return Promise.all(followersList.map(async (user) => {
      const [followersCount] = await this.db.select({ count: count() }).from(followers).where(eq(followers.followingId, user.id));
      const [followingCount] = await this.db.select({ count: count() }).from(followers).where(eq(followers.followerId, user.id));
      return {
        ...user,
        followersCount: followersCount.count,
        followingCount: followingCount.count,
      };
    }));
  }

  async getFollowing(userId: number): Promise<UserWithStats[]> {
    const followingList = await this.db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      isBlocked: users.isBlocked,
      createdAt: users.createdAt,
    })
    .from(followers)
    .innerJoin(users, eq(followers.followingId, users.id))
    .where(eq(followers.followerId, userId));

    return Promise.all(followingList.map(async (user) => {
      const [followersCount] = await this.db.select({ count: count() }).from(followers).where(eq(followers.followingId, user.id));
      const [followingCount] = await this.db.select({ count: count() }).from(followers).where(eq(followers.followerId, user.id));
      return {
        ...user,
        followersCount: followersCount.count,
        followingCount: followingCount.count,
      };
    }));
  }

  async toggleFollow(followerId: number, followingId: number): Promise<boolean> {
    const existing = await this.db.select().from(followers)
      .where(and(eq(followers.followerId, followerId), eq(followers.followingId, followingId)))
      .limit(1);

    if (existing.length > 0) {
      await this.db.delete(followers).where(and(eq(followers.followerId, followerId), eq(followers.followingId, followingId)));
      return false;
    } else {
      await this.db.insert(followers).values({ followerId, followingId });
      return true;
    }
  }
}
