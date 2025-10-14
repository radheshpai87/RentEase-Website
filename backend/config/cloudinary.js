import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Get the current file path for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from root .env file and backend .env file if it exists
dotenv.config({ path: path.join(__dirname, '../../.env') });
if (fs.existsSync(path.join(__dirname, '../.env'))) {
  dotenv.config({ path: path.join(__dirname, '../.env') });
}

// Always explicitly configure Cloudinary to ensure it works
// The cloudinary.config method is safe to call even if CLOUDINARY_URL is set
// as it will use the explicit config only if CLOUDINARY_URL isn't properly parsed
cloudinary.config({
  cloud_name: 'dignxiehl',
  api_key: '682816192237338',
  api_secret: 'hExjK9245k5Y0S_9X_o0VZelxWQ'
});

// Log that Cloudinary is configured (but don't log sensitive values)
console.log('Cloudinary configured with:');
console.log('- Cloud name: dignxiehl');
console.log('- Environment CLOUDINARY_URL present:', !!process.env.CLOUDINARY_URL);

export default cloudinary;