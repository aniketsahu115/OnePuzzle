import { createServer } from "./main";
import { log } from "./logger";

(async () => {
  try {
    const { app, server } = await createServer();
    
    const { setupVite } = await import("./vite-server");
    await setupVite(app, server);

    const port = process.env.PORT || 4001;
    server.listen({
      port,
      host: '0.0.0.0'
    }, () => {
      log(`Server started on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})();
