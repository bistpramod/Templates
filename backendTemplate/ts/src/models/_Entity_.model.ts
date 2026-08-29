import mongoose, { Document, Schema } from 'mongoose';

// PLACEHOLDER MODEL — rename this file and every '_Entity_' below to your
// real resource (e.g. Product, Post, Task). Replace the '_field_' line
// with your actual schema fields; name/description/owner/status/timestamps
// are common enough to keep as-is for most resources.

export interface I_Entity_ extends Document {
  name: string;
  slug: string;
  description?: string;
  _field_?: string;
  owner?: mongoose.Types.ObjectId;
  status: 'active' | 'inactive';
}

const _Entity_Schema = new Schema<I_Entity_>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true, trim: true },
    description: { type: String, trim: true },

    // PLACEHOLDER: add/remove fields specific to this resource
    _field_: { type: String },

    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

_Entity_Schema.pre('validate', function (next) {
  if (this.name && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

export default mongoose.model<I_Entity_>('_Entity_', _Entity_Schema);
