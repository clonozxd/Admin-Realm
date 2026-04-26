import { Controller, Get, Post, Patch, Delete, Param, Body, Req, Res, UseGuards, Inject } from '@nestjs/common';
import { Request, Response } from 'express';
import { AdminService } from './admin.service';
import { EventsService } from '../events/events.service';
import { UsersService } from '../users/users.service';
import { CommentsService } from '../comments/comments.service';
import { AdminGuard } from '../common/guards/admin.guard';
import { insertEventSchema, createUserSchema } from '../../../shared/schema';
import { z } from 'zod';

@Controller('api/admin')
@UseGuards(AdminGuard)
export class AdminController {
  constructor(
    @Inject(AdminService) private readonly adminService: AdminService,
    @Inject(EventsService) private readonly eventsService: EventsService,
    @Inject(UsersService) private readonly usersService: UsersService,
    @Inject(CommentsService) private readonly commentsService: CommentsService,
  ) {}

  @Get('stats')
  async getStats(@Res() res: Response) {
    try {
      const stats = await this.adminService.getAdminStats();
      return res.json(stats);
    } catch (error) {
      return res.status(500).json({ error: 'Error al obtener estadísticas' });
    }
  }

  @Get('events')
  async getEventsAll(@Res() res: Response) {
    return this.handleGetEvents('all', res);
  }

  @Get('events/:filter')
  async getEventsFiltered(@Param('filter') filter: string, @Res() res: Response) {
    return this.handleGetEvents(filter, res);
  }

  private async handleGetEvents(filter: string, res: Response) {
    try {
      let events = await this.eventsService.getEvents(undefined, undefined, undefined, true);
      if (filter === 'active') events = events.filter(e => !e.isArchived);
      else if (filter === 'archived') events = events.filter(e => e.isArchived);
      return res.json(events);
    } catch (error) {
      return res.status(500).json({ error: 'Error al obtener eventos' });
    }
  }

  @Post('events')
  async createEvent(@Body() body: any, @Req() req: Request, @Res() res: Response) {
    try {
      const eventData = insertEventSchema.parse({
        ...body, createdBy: (req.session as any).userId, eventDate: new Date(body.eventDate),
      });
      const event = await this.eventsService.createEvent(eventData);
      return res.json(event);
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ error: error.errors[0].message });
      return res.status(500).json({ error: 'Error al crear evento' });
    }
  }

  @Patch('events/:id')
  async updateEvent(@Param('id') id: string, @Body() body: any, @Res() res: Response) {
    try {
      const eventData = { ...body };
      if (eventData.eventDate) eventData.eventDate = new Date(eventData.eventDate);
      const event = await this.eventsService.updateEvent(parseInt(id), eventData);
      if (!event) return res.status(404).json({ error: 'Evento no encontrado' });
      return res.json(event);
    } catch (error) {
      return res.status(500).json({ error: 'Error al actualizar evento' });
    }
  }

  @Delete('events/:id')
  async deleteEvent(@Param('id') id: string, @Res() res: Response) {
    try {
      await this.eventsService.deleteEvent(parseInt(id));
      return res.json({ success: true });
    } catch (error) {
      return res.status(500).json({ error: 'Error al eliminar evento' });
    }
  }

  @Patch('events/:id/archive')
  async archiveEvent(@Param('id') id: string, @Res() res: Response) {
    try {
      const event = await this.eventsService.archiveEvent(parseInt(id));
      if (!event) return res.status(404).json({ error: 'Evento no encontrado' });
      return res.json(event);
    } catch (error) {
      return res.status(500).json({ error: 'Error al archivar evento' });
    }
  }

  @Get('users')
  async getUsers(@Res() res: Response) {
    try {
      const users = await this.usersService.getAllUsers();
      return res.json(users.map(({ password, ...u }) => u));
    } catch (error) {
      return res.status(500).json({ error: 'Error al obtener usuarios' });
    }
  }

  @Post('users')
  async createUser(@Body() body: any, @Res() res: Response) {
    try {
      const userData = createUserSchema.parse(body);
      const existingUser = await this.usersService.getUserByEmail(userData.email);
      if (existingUser) return res.status(400).json({ error: 'El email ya está registrado' });
      const user = await this.usersService.createUser(userData);
      const { password, ...userWithoutPassword } = user;
      return res.json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ error: error.errors[0].message });
      return res.status(500).json({ error: 'Error al crear usuario' });
    }
  }

  @Patch('users/:id/block')
  async blockUser(@Param('id') id: string, @Body() body: any, @Req() req: Request, @Res() res: Response) {
    try {
      const userId = parseInt(id);
      if (userId === (req.session as any).userId) return res.status(400).json({ error: 'No puedes bloquearte a ti mismo' });
      const user = await this.usersService.updateUserBlocked(userId, body.isBlocked);
      if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
      const { password, ...userWithoutPassword } = user;
      return res.json(userWithoutPassword);
    } catch (error) {
      return res.status(500).json({ error: 'Error al bloquear usuario' });
    }
  }

  @Patch('users/:id')
  async updateUser(@Param('id') id: string, @Body() body: any, @Res() res: Response) {
    try {
      const { name, role } = body;
      const updateData: { name?: string; role?: 'admin' | 'student' } = {};
      if (name && name.trim().length >= 2) updateData.name = name.trim();
      if (role && (role === 'admin' || role === 'student')) updateData.role = role;
      if (Object.keys(updateData).length === 0) return res.status(400).json({ error: 'No hay datos para actualizar' });
      const user = await this.usersService.updateUserByAdmin(parseInt(id), updateData);
      if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
      const { password, ...userWithoutPassword } = user;
      return res.json(userWithoutPassword);
    } catch (error) {
      return res.status(500).json({ error: 'Error al actualizar usuario' });
    }
  }

  @Get('comments')
  async getComments(@Res() res: Response) {
    try {
      const comments = await this.commentsService.getAllComments();
      return res.json(comments);
    } catch (error) {
      return res.status(500).json({ error: 'Error al obtener comentarios' });
    }
  }

  @Get('metrics')
  async getMetrics(@Res() res: Response) {
    try {
      const metrics = await this.adminService.getMetrics();
      return res.json(metrics);
    } catch (error) {
      return res.status(500).json({ error: 'Error al obtener métricas' });
    }
  }
}
