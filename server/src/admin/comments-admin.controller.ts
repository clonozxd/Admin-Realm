import { Controller, Delete, Param, Res, UseGuards, Inject } from '@nestjs/common';
import { Response } from 'express';
import { CommentsService } from '../comments/comments.service';
import { AdminGuard } from '../common/guards/admin.guard';

@Controller('api/comments')
@UseGuards(AdminGuard)
export class CommentsAdminController {
  constructor(@Inject(CommentsService) private readonly commentsService: CommentsService) {}

  @Delete(':id')
  async deleteComment(@Param('id') id: string, @Res() res: Response) {
    try {
      await this.commentsService.deleteComment(parseInt(id));
      return res.json({ success: true });
    } catch (error) {
      return res.status(500).json({ error: 'Error al eliminar comentario' });
    }
  }
}
