import app from './app.js';
import { config } from './src/config/env.js';

const PORT = config.PORT;

const server = app.listen(PORT, () => {
  console.log(`
    🚀 Server is running in ${config.NODE_ENV} mode on port ${PORT}
    🔗 URL: http://localhost:${PORT}
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
