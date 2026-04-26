import { Controller, Post, Get, Body, Req, Res, Inject } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { z } from 'zod';
import { loginSchema, createUserSchema } from '../../../shared/schema';

@Controller('api/auth')
export class AuthController {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: any, @Req() req: Request, @Res() res: Response) {
    try {
      const data = loginSchema.parse(body);
      const user = await this.authService.getUserByEmail(data.email);

      if (!user) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      if (user.isBlocked) {
        return res.status(403).json({ error: 'Usuario bloqueado' });
      }

      const validPassword = await this.authService.comparePassword(data.password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      (req.session as any).userId = user.id;
      const { password, ...userWithoutPassword } = user;
      return res.json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      return res.status(500).json({ error: 'Error del servidor' });
    }
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: 'Error al cerrar sesión' });
      }
      return res.json({ message: 'Sesión cerrada' });
    });
  }

  @Get('me')
  async me(@Req() req: Request, @Res() res: Response) {
    if (!(req.session as any).userId) {
      return res.status(401).json({ error: 'No autorizado' });
    }
    const user = await this.authService.getUserById((req.session as any).userId);
    if (!user) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }
    const { password, ...userWithoutPassword } = user;
    return res.json(userWithoutPassword);
  }

  @Post('bootstrap')
  async bootstrap(@Body() body: any, @Req() req: Request, @Res() res: Response) {
    try {
      const userCount = await this.authService.getUserCount();
      if (userCount > 0) {
        return res.status(400).json({ error: 'Ya existe un administrador' });
      }

      const userData = createUserSchema.parse({ ...body, role: 'admin' });
      const user = await this.authService.createUser(userData);
      const { password, ...userWithoutPassword } = user;
      (req.session as any).userId = user.id;
      return res.json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      return res.status(500).json({ error: 'Error al crear administrador' });
    }
  }

  @Get('needs-bootstrap')
  async needsBootstrap(@Res() res: Response) {
    try {
      const userCount = await this.authService.getUserCount();
      return res.json({ needsBootstrap: userCount === 0 });
    } catch (error) {
      return res.status(500).json({ error: 'Error del servidor' });
    }
  }
}
