import { createServer } from "./main";
import { serveStatic } from "./static";
import { log } from "./logger";

(async () => {
  try {
    const { app, server } = await createServer();
    
    serveStatic(app);

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