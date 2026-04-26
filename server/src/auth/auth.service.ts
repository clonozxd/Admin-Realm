import { Injectable, Inject } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { eq, count } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import { users, type User, type CreateUserInput } from '../../../shared/schema';

@Injectable()
export class AuthService {
  constructor(@Inject(DatabaseService) private readonly databaseService: DatabaseService) {}

  private get db() {
    return this.databaseService.db;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await this.db.select().from(users).where(eq(users.email, email)).limit(1);
    return user;
  }

  async getUserById(id: number): Promise<User | undefined> {
    const [user] = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    return user;
  }

  async comparePassword(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed);
  }

  async getUserCount(): Promise<number> {
    const [result] = await this.db.select({ count: count() }).from(users);
    return result.count;
  }

  async createUser(userData: CreateUserInput): Promise<User> {
    const userCount = await this.getUserCount();
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const role = userCount === 0 ? 'admin' : userData.role;

    const [user] = await this.db.insert(users).values({
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      role: role,
    }).returning();
    return user;
  }
}
