import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// PLACEHOLDER: replace '_ROLE_ADMIN_' / '_ROLE_USER_' with your real role
// strings, e.g. 'admin' / 'user', or 'owner' / 'staff' / 'customer'.
// Delete the second role entirely if this project only ever has one role.
const ROLE_VALUES = ['_ROLE_ADMIN_', '_ROLE_USER_'];

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    role: { type: String, enum: ROLE_VALUES, default: ROLE_VALUES[1] },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);
