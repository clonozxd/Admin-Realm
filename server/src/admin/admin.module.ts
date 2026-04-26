import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { CommentsAdminController } from './comments-admin.controller';
import { AdminService } from './admin.service';
import { EventsModule } from '../events/events.module';
import { UsersModule } from '../users/users.module';
import { CommentsModule } from '../comments/comments.module';

@Module({
  imports: [EventsModule, UsersModule, CommentsModule],
  controllers: [AdminController, CommentsAdminController],
  providers: [AdminService],
})
export class AdminModule {}
