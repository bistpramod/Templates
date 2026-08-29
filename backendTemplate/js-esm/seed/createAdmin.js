// Run once per environment: `npm run seed:admin`
// Creates the first admin/root user from .env values instead of exposing a
// public "become admin" route. Safe to re-run — it skips if the email
// already exists.

import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.model.js';

async function run() {
  await connectDB();

  const email = process.env.SEED_ADMIN_EMAIL;
  const existing = await User.findOne({ email });

  if (existing) {
    console.log(`Admin already exists for ${email} — skipping.`);
  } else {
    // PLACEHOLDER: '_ROLE_ADMIN_' must match the role string used elsewhere.
    await User.create({
      name: process.env.SEED_ADMIN_NAME,
      email,
      password: process.env.SEED_ADMIN_PASSWORD,
      role: '_ROLE_ADMIN_',
    });
    console.log(`Admin created for ${email}. Log in and change the password.`);
  }

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
