import { Controller, Get, Post, Param, Body, Req, Res, UseGuards, Inject } from '@nestjs/common';
import { Request, Response } from 'express';
import { ChatsService } from './chats.service';
import { AuthGuard } from '../common/guards/auth.guard';

@Controller('api/chats')
@UseGuards(AuthGuard)
export class ChatsController {
  constructor(@Inject(ChatsService) private readonly chatsService: ChatsService) {}

  @Get()
  async getChats(@Req() req: Request, @Res() res: Response) {
    try {
      const userId = (req.session as any).userId!;
      const chats = await this.chatsService.getChats(userId);
      return res.json(chats);
    } catch (error) {
      return res.status(500).json({ error: 'Error al obtener chats' });
    }
  }

  @Post()
  async createChat(@Body() body: any, @Req() req: Request, @Res() res: Response) {
    try {
      const userId = (req.session as any).userId!;
      const { otherUserId } = body;
      if (!otherUserId) {
        return res.status(400).json({ error: 'ID de usuario requerido' });
      }
      const chat = await this.chatsService.createOrGetChat(userId, otherUserId);
      return res.json(chat);
    } catch (error) {
      return res.status(500).json({ error: 'Error al crear chat' });
    }
  }

  @Get(':id/messages')
  async getMessages(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
    try {
      const chatId = parseInt(id);
      const userId = (req.session as any).userId!;
      const chat = await this.chatsService.getChatById(chatId, userId);
      if (!chat) {
        return res.status(404).json({ error: 'Chat no encontrado' });
      }
      await this.chatsService.markMessagesAsRead(chatId, userId);
      const messages = await this.chatsService.getMessages(chatId);
      return res.json(messages);
    } catch (error) {
      return res.status(500).json({ error: 'Error al obtener mensajes' });
    }
  }

  @Post(':id/messages')
  async sendMessage(@Param('id') id: string, @Body() body: any, @Req() req: Request, @Res() res: Response) {
    try {
      const chatId = parseInt(id);
      const senderId = (req.session as any).userId!;
      const { content } = body;
      if (!content || content.trim().length === 0) {
        return res.status(400).json({ error: 'El mensaje no puede estar vacío' });
      }
      const chat = await this.chatsService.getChatById(chatId, senderId);
      if (!chat) {
        return res.status(404).json({ error: 'Chat no encontrado' });
      }
      const message = await this.chatsService.createMessage({ chatId, senderId, content });
      return res.json(message);
    } catch (error) {
      return res.status(500).json({ error: 'Error al enviar mensaje' });
    }
  }
}
