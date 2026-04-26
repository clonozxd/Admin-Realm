import express, { type Express } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export function serveStatic(app: Express) {
  const currentDir = import.meta.dirname ?? path.dirname(fileURLToPath(import.meta.url));
  const distPath = path.resolve(currentDir, '..', '..', '..', 'dist', 'public');
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  app.use((req, res, next) => {
    if (req.originalUrl.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.resolve(distPath, 'index.html'));
  });
}
