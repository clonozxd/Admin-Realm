import { Controller, Get, Post, Delete, Param, Body, Req, Res, UseGuards, Inject } from '@nestjs/common';
import { Request, Response } from 'express';
import { CommentsService } from './comments.service';
import { AuthGuard } from '../common/guards/auth.guard';

@Controller()
export class CommentsController {
  constructor(@Inject(CommentsService) private readonly commentsService: CommentsService) {}

  @Get('api/events/:id/comments')
  async getCommentsByEventId(@Param('id') id: string, @Res() res: Response) {
    try {
      const eventId = parseInt(id);
      const comments = await this.commentsService.getCommentsByEventId(eventId);
      return res.json(comments);
    } catch (error) {
      return res.status(500).json({ error: 'Error al obtener comentarios' });
    }
  }

  @Post('api/events/:id/comments')
  @UseGuards(AuthGuard)
  async createComment(
    @Param('id') id: string,
    @Body() body: any,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const eventId = parseInt(id);
      const userId = (req.session as any).userId!;
      const { content } = body;

      if (!content || content.trim().length === 0) {
        return res.status(400).json({ error: 'El comentario no puede estar vacío' });
      }

      const comment = await this.commentsService.createComment({ eventId, userId, content });
      return res.json(comment);
    } catch (error) {
      return res.status(500).json({ error: 'Error al crear comentario' });
    }
  }
}
