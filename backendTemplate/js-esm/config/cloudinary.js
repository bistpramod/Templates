// OPTIONAL: only needed if this project uploads images.
// Delete this file + middleware/upload.middleware.js + the cloudinary
// dependency if the project has no image uploads.

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
