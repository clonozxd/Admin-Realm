import { Controller, Get, Post, Patch, Param, Body, Req, Res, UseGuards, Inject } from '@nestjs/common';
import { Request, Response } from 'express';
import { UsersService } from './users.service';
import { EventsService } from '../events/events.service';
import { AuthGuard } from '../common/guards/auth.guard';

@Controller('api/users')
export class UsersController {
  constructor(
    @Inject(UsersService) private readonly usersService: UsersService,
    @Inject(EventsService) private readonly eventsService: EventsService,
  ) {}

  @Get('me/followers')
  @UseGuards(AuthGuard)
  async getFollowers(@Req() req: Request, @Res() res: Response) {
    try {
      const userId = (req.session as any).userId!;
      const followers = await this.usersService.getFollowers(userId);
      return res.json(followers);
    } catch (error) {
      return res.status(500).json({ error: 'Error al obtener seguidores' });
    }
  }

  @Get('me/following')
  @UseGuards(AuthGuard)
  async getFollowing(@Req() req: Request, @Res() res: Response) {
    try {
      const userId = (req.session as any).userId!;
      const following = await this.usersService.getFollowing(userId);
      return res.json(following);
    } catch (error) {
      return res.status(500).json({ error: 'Error al obtener seguidos' });
    }
  }

  @Post(':id/follow')
  @UseGuards(AuthGuard)
  async toggleFollow(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const followingId = parseInt(id);
      const followerId = (req.session as any).userId!;

      if (followerId === followingId) {
        return res.status(400).json({ error: 'No puedes seguirte a ti mismo' });
      }

      const isFollowing = await this.usersService.toggleFollow(followerId, followingId);
      return res.json({ isFollowing });
    } catch (error) {
      return res.status(500).json({ error: 'Error al seguir usuario' });
    }
  }

  @Get('me/liked-events')
  @UseGuards(AuthGuard)
  async getLikedEvents(@Req() req: Request, @Res() res: Response) {
    try {
      const userId = (req.session as any).userId!;
      const events = await this.eventsService.getLikedEvents(userId);
      return res.json(events);
    } catch (error) {
      return res.status(500).json({ error: 'Error al obtener eventos' });
    }
  }

  @Get('me/attending-events')
  @UseGuards(AuthGuard)
  async getAttendingEvents(@Req() req: Request, @Res() res: Response) {
    try {
      const userId = (req.session as any).userId!;
      const events = await this.eventsService.getAttendingEvents(userId);
      return res.json(events);
    } catch (error) {
      return res.status(500).json({ error: 'Error al obtener eventos' });
    }
  }

  @Patch('me/profile')
  @UseGuards(AuthGuard)
  async updateProfile(
    @Body() body: any,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const userId = (req.session as any).userId!;
      const { name } = body;

      if (!name || name.trim().length < 2) {
        return res.status(400).json({ error: 'El nombre debe tener al menos 2 caracteres' });
      }

      const user = await this.usersService.updateUserName(userId, name.trim());
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      const { password, ...userWithoutPassword } = user;
      return res.json(userWithoutPassword);
    } catch (error) {
      return res.status(500).json({ error: 'Error al actualizar perfil' });
    }
  }
}
