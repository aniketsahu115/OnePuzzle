import express, { type Express, Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";
import { createServer } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";
import { fileURLToPath } from 'url';
import { log } from "./logger";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
    host: '0.0.0.0',
  };

  const viteServer = await createServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      info: (msg: string) => log(msg, "vite"),
      warn: (msg: string) => log(msg, "vite"),
      error: (msg: string) => {
        log(msg, "vite");
        process.exit(1);
      },
      warnOnce: (msg: string) => log(msg, "vite"),
      clearScreen: () => {},
      hasErrorLogged: () => false,
      hasWarned: false,
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(viteServer.middlewares);
  app.use("*", async (req: Request, res: Response, next: NextFunction) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        __dirname,
        "..",
        "client",
        "index.html",
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const page = await viteServer.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      viteServer.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  console.log('__dirname in serveStatic:', __dirname);
  const distPath = path.resolve(__dirname, "..", "dist", "public");
  console.log('distPath in serveStatic:', distPath);

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use((_req: Request, res: Response) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}

