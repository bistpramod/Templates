import 'dotenv/config';

// Centralizing env access here means the rest of the app never touches
// `process.env` directly, and TypeScript can tell you if you typo a name.
const ENV_CONFIG = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT || '5000',
  CLIENT_URL: process.env.CLIENT_URL,

  DB_URI: process.env.DB_URI as string,

  JWT_SECRET: process.env.JWT_SECRET as string,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',

  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,

  // Only used by src/seed/createAdmin.ts
  SEED_ADMIN_NAME: process.env.SEED_ADMIN_NAME,
  SEED_ADMIN_EMAIL: process.env.SEED_ADMIN_EMAIL,
  SEED_ADMIN_PASSWORD: process.env.SEED_ADMIN_PASSWORD,
};

export default ENV_CONFIG;
