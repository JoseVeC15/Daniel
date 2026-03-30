// backend/src/index.ts

import app from './app';
import { ENV } from './config/env';
import { initScheduler } from './jobs/scheduler';

const start = async () => {
  try {
    // Iniciar cron jobs
    initScheduler();
    
    app.listen(ENV.PORT, () => {
      console.log(`Server running on port ${ENV.PORT}`);
      console.log(`Environment: ${ENV.NODE_ENV}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();
