import mongoose from 'mongoose';

// PLACEHOLDER MODEL — rename this file and every '_Entity_' below to your
// real resource (e.g. Product, Post, Task). Replace the '_field_' lines
// with your actual schema fields; the ones left in (name, description,
// owner, status, timestamps) are common enough to keep as-is for most
// resources.

const _Entity_Schema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true, trim: true },
    description: { type: String, trim: true },

    // PLACEHOLDER: add/remove fields specific to this resource
    _field_: { type: String },

    // Common pattern: who created/owns this record. Remove if not needed.
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    // Common pattern: simple lifecycle flag. Replace values with whatever
    // makes sense for this resource (e.g. 'draft'/'published', 'active'/'archived').
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

// Auto-generate a slug from name if one wasn't provided.
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

export default mongoose.model('_Entity_', _Entity_Schema);
