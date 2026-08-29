// Run once per environment: `npm run seed:admin`
// Creates the first admin/root user from .env values instead of exposing a
// public "become admin" route. Safe to re-run — it skips if the email
// already exists.

import mongoose from 'mongoose';
import { connectDatabase } from '../config/db.config';
import ENV_CONFIG from '../config/env.config';
import User from '../models/User.model';
import { Role } from '../types/enum.types';

async function run() {
  await connectDatabase();

  const email = ENV_CONFIG.SEED_ADMIN_EMAIL as string;
  const existing = await User.findOne({ email });

  if (existing) {
    console.log(`Admin already exists for ${email} — skipping.`);
  } else {
    await User.create({
      name: ENV_CONFIG.SEED_ADMIN_NAME,
      email,
      password: ENV_CONFIG.SEED_ADMIN_PASSWORD,
      role: Role.ADMIN,
    });
    console.log(`Admin created for ${email}. Log in and change the password.`);
  }

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
