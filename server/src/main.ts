import 'dotenv/config';
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import session from 'express-session';
import pgSession from 'connect-pg-simple';
import { pool } from './database/database.service';
import express from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: false,
  });

  // Raw body support
  app.use(
    express.json({
      verify: (req: any, _res, buf) => {
        req.rawBody = buf;
      },
    }),
  );
  app.use(express.urlencoded({ extended: false }));

  // Session setup
  const PgStore = pgSession(session);
  app.use(
    session({
      store: new PgStore({
        pool: pool,
        tableName: 'user_sessions',
        createTableIfMissing: true,
      }),
      secret: process.env.SESSION_SECRET || 'fimaz-events-secret-key',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      },
    }),
  );

  // Vite integration for development
  if (process.env.NODE_ENV !== 'production') {
    const { setupVite } = await import('./vite/vite.middleware');
    const httpServer = app.getHttpServer();
    const expressApp = app.getHttpAdapter().getInstance();
    await setupVite(httpServer, expressApp);
  } else {
    const { serveStatic } = await import('./vite/static.middleware');
    const expressApp = app.getHttpAdapter().getInstance();
    serveStatic(expressApp);
  }

  const port = parseInt(process.env.PORT || '5000', 10);
  await app.listen(port, 'localhost');

  const formattedTime = new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
  console.log(`${formattedTime} [nestjs] serving on port ${port}`);
}

bootstrap();
