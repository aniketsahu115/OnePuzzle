import express, { type Express, Request, Response } from "express";
import fs from "fs";
import path from "path";
import { log } from "./logger";

export function serveStatic(app: Express) {
  const distPath = path.resolve(process.cwd(), "dist", "public");
  
  log(`Setting up static file serving from: ${distPath}`);

  if (!fs.existsSync(distPath)) {
    const error = `Could not find the build directory: ${distPath}, make sure to build the client first`;
    log(`❌ ${error}`);
    throw new Error(error);
  }

  log(`✅ Static directory found, serving files from: ${distPath}`);
  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use((_req: Request, res: Response) => {
    const indexPath = path.resolve(distPath, "index.html");
    log(`Serving index.html from: ${indexPath}`);
    res.sendFile(indexPath);
  });
} 