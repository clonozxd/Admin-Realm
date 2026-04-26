import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    if (!request.session?.userId) {
      const response = context.switchToHttp().getResponse();
      response.status(401).json({ error: 'No autorizado' });
      return false;
    }
    return true;
  }
}
