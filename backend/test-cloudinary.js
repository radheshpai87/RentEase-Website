import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Initialize dotenv
dotenv.config();

// Convert __filename and __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Log the Cloudinary configuration to debug
console.log('CLOUDINARY_URL from env:', process.env.CLOUDINARY_URL ? 'Present (redacted)' : 'Missing');

// Explicitly configure Cloudinary to ensure it works
cloudinary.config({
  cloud_name: 'dignxiehl',
  api_key: '682816192237338',
  api_secret: 'hExjK9245k5Y0S_9X_o0VZelxWQ'
});

async function testCloudinaryUpload() {
  try {
    // Path to a test image in the public folder
    const testImagePath = path.join(__dirname, '../public/1.jpg');
    
    console.log('Testing Cloudinary upload with image:', testImagePath);
    
    // Check if file exists
    if (!fs.existsSync(testImagePath)) {
      console.error('Test image not found at path:', testImagePath);
      return;
    }
    
    console.log('Test image exists, attempting upload...');
    
    // Upload the image
    const result = await cloudinary.uploader.upload(testImagePath, {
      folder: 'real-estate/test',
      resource_type: 'image'
    });
    
    console.log('Cloudinary upload successful!');
    console.log('Image URL:', result.secure_url);
    console.log('Public ID:', result.public_id);
  } catch (error) {
    console.error('Cloudinary upload failed with error:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
  }
}

testCloudinaryUpload();