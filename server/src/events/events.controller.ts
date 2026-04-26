import { Controller, Get, Post, Param, Query, Req, Res, UseGuards, Inject } from '@nestjs/common';
import { Request, Response } from 'express';
import { EventsService } from './events.service';
import { AuthGuard } from '../common/guards/auth.guard';

@Controller('api/events')
export class EventsController {
  constructor(@Inject(EventsService) private readonly eventsService: EventsService) {}

  @Get()
  async getEvents(
    @Query('category') category: string | undefined,
    @Query('time') timeFilter: string | undefined,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const userId = (req.session as any).userId;

      let includeAll = false;
      if (userId) {
        const user = await this.eventsService.getUserById(userId);
        if (user?.role === 'admin') {
          includeAll = true;
        }
      }

      const events = await this.eventsService.getEvents(category, userId, timeFilter, includeAll);
      return res.json(events);
    } catch (error) {
      console.error('Error fetching events:', error);
      return res.status(500).json({ error: 'Error al obtener eventos' });
    }
  }

  @Get(':id')
  async getEventById(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const eventId = parseInt(id);
      const userId = (req.session as any).userId;

      let includeArchived = false;
      if (userId) {
        const user = await this.eventsService.getUserById(userId);
        if (user?.role === 'admin') {
          includeArchived = true;
        }
      }

      await this.eventsService.incrementEventViews(eventId);
      const event = await this.eventsService.getEventById(eventId, userId, includeArchived);
      if (!event) {
        return res.status(404).json({ error: 'Evento no encontrado' });
      }
      return res.json(event);
    } catch (error) {
      return res.status(500).json({ error: 'Error al obtener evento' });
    }
  }

  @Post(':id/like')
  @UseGuards(AuthGuard)
  async toggleLike(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const eventId = parseInt(id);
      const userId = (req.session as any).userId!;
      const isLiked = await this.eventsService.toggleLike(eventId, userId);
      return res.json({ isLiked });
    } catch (error) {
      return res.status(500).json({ error: 'Error al dar like' });
    }
  }

  @Post(':id/attend')
  @UseGuards(AuthGuard)
  async toggleAttendance(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const eventId = parseInt(id);
      const userId = (req.session as any).userId!;
      const isAttending = await this.eventsService.toggleAttendance(eventId, userId);
      return res.json({ isAttending });
    } catch (error) {
      return res.status(500).json({ error: 'Error al confirmar asistencia' });
    }
  }
}
