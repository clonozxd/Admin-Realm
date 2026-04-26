import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { CommentsModule } from './comments/comments.module';
import { UsersModule } from './users/users.module';
import { ChatsModule } from './chats/chats.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AdminModule } from './admin/admin.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    EventsModule,
    CommentsModule,
    UsersModule,
    ChatsModule,
    NotificationsModule,
    AdminModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('api');
  }
}

