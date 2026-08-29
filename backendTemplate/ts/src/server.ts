import app from './app';
import { connectDatabase } from './config/db.config';
import ENV_CONFIG from './config/env.config';

async function start() {
  await connectDatabase();

  app.listen(ENV_CONFIG.PORT, () => {
    console.log(`Server running on port ${ENV_CONFIG.PORT}`);
  });
}

start();
