import { Controller, Get, Patch, Post, Param, Req, Res, UseGuards, Inject } from '@nestjs/common';
import { Request, Response } from 'express';
import { NotificationsService } from './notifications.service';
import { AuthGuard } from '../common/guards/auth.guard';

@Controller('api/notifications')
@UseGuards(AuthGuard)
export class NotificationsController {
  constructor(@Inject(NotificationsService) private readonly notificationsService: NotificationsService) {}

  @Get()
  async getNotifications(@Req() req: Request, @Res() res: Response) {
    try {
      const userId = (req.session as any).userId!;
      const notifications = await this.notificationsService.getNotifications(userId);
      return res.json(notifications);
    } catch (error) {
      return res.status(500).json({ error: 'Error al obtener notificaciones' });
    }
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string, @Res() res: Response) {
    try {
      await this.notificationsService.markNotificationAsRead(parseInt(id));
      return res.json({ success: true });
    } catch (error) {
      return res.status(500).json({ error: 'Error al marcar notificación' });
    }
  }

  @Post('read-all')
  async markAllAsRead(@Req() req: Request, @Res() res: Response) {
    try {
      const userId = (req.session as any).userId!;
      await this.notificationsService.markAllNotificationsAsRead(userId);
      return res.json({ success: true });
    } catch (error) {
      return res.status(500).json({ error: 'Error al marcar notificaciones' });
    }
  }
}
