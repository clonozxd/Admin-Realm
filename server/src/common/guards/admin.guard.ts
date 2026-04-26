import { Injectable, CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { eq } from 'drizzle-orm';
import { users } from '../../../../shared/schema';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(@Inject(DatabaseService) private readonly databaseService: DatabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    if (!request.session?.userId) {
      response.status(401).json({ error: 'No autorizado' });
      return false;
    }

    const [user] = await this.databaseService.db
      .select()
      .from(users)
      .where(eq(users.id, request.session.userId))
      .limit(1);

    if (!user || user.role !== 'admin') {
      response.status(403).json({ error: 'Acceso denegado' });
      return false;
    }

    return true;
  }
}
