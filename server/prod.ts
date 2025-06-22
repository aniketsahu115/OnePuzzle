import { createServer } from "./main";
import { serveStatic } from "./static";
import { log } from "./logger";

(async () => {
  try {
    log('Starting production server...');
    const { app, server } = await createServer();
    
    // log('Setting up static file serving...');
    // serveStatic(app);

    const port = parseInt(process.env.PORT || '4001', 10);
    const host = '0.0.0.0';
    
    log(`Attempting to bind server to ${host}:${port}`);
    log(`Current working directory: ${process.cwd()}`);
    log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    
    // Explicitly set the server to listen on all interfaces
    server.listen(port, host, () => {
      log(`✅ Production server started successfully on ${host}:${port}`);
      log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      log(`Process ID: ${process.pid}`);
      log(`Server is ready to accept connections`);
    });
    
    // Add error handling for the server
    server.on('error', (error: any) => {
      log(`❌ Server error: ${error.message}`);
      if (error.code === 'EADDRINUSE') {
        log(`Port ${port} is already in use`);
      } else if (error.code === 'EACCES') {
        log(`Permission denied to bind to port ${port}`);
      }
      process.exit(1);
    });
    
    // Handle graceful shutdown
    process.on('SIGTERM', () => {
      log('Received SIGTERM, shutting down gracefully...');
      server.close(() => {
        log('Server closed');
        process.exit(0);
      });
    });
    
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})(); 