import { createServer } from "./main";
import { serveStatic } from "./static";
import { log } from "./logger";

(async () => {
  try {
    log('Starting production server...');
    const { app, server } = await createServer();
    
    log('Setting up static file serving...');
    serveStatic(app);

    const port = process.env.PORT || 4001;
    const host = '0.0.0.0';
    
    log(`Attempting to bind server to ${host}:${port}`);
    
    server.listen({
      port,
      host
    }, () => {
      log(`✅ Production server started successfully on ${host}:${port}`);
      log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      log(`Process ID: ${process.pid}`);
    });
    
    // Add error handling for the server
    server.on('error', (error: any) => {
      log(`❌ Server error: ${error.message}`);
      if (error.code === 'EADDRINUSE') {
        log(`Port ${port} is already in use`);
      }
      process.exit(1);
    });
    
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})(); 