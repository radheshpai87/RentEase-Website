#!/usr/bin/env node

/**
 * Cloudinary Connection Test
 * 
 * This script tests if the Cloudinary connection is working correctly.
 * Run it to diagnose Cloudinary configuration issues.
 */

import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current file path for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m'
};

console.log(`${colors.bright}${colors.blue}===== Cloudinary Connection Test =====${colors.reset}\n`);

// Check if CLOUDINARY_URL is set
console.log(`${colors.yellow}Checking CLOUDINARY_URL environment variable:${colors.reset}`);
if (process.env.CLOUDINARY_URL) {
  console.log(`${colors.green}✓ CLOUDINARY_URL is set${colors.reset}`);
  console.log(`  Format appears to be: cloudinary://API_KEY:API_SECRET@CLOUD_NAME`);
} else {
  console.log(`${colors.red}✗ CLOUDINARY_URL is NOT set${colors.reset}`);
}

// Configure Cloudinary explicitly
console.log(`\n${colors.yellow}Configuring Cloudinary with explicit credentials:${colors.reset}`);
cloudinary.config({
  cloud_name: 'dignxiehl',
  api_key: '682816192237338',
  api_secret: 'hExjK9245k5Y0S_9X_o0VZelxWQ'
});

// Test the configuration by making a simple API call
console.log(`\n${colors.yellow}Testing Cloudinary API connectivity:${colors.reset}`);

async function testCloudinaryConnectivity() {
  try {
    const result = await cloudinary.api.ping();
    console.log(`${colors.green}✓ Cloudinary API is reachable${colors.reset}`);
    console.log(`  Response: ${JSON.stringify(result)}`);
    return true;
  } catch (error) {
    console.log(`${colors.red}✗ Could not connect to Cloudinary API${colors.reset}`);
    console.log(`  Error: ${error.message}`);
    console.log(`  Details: ${JSON.stringify(error)}`);
    return false;
  }
}

// Test image upload
async function testImageUpload() {
  console.log(`\n${colors.yellow}Testing image upload to Cloudinary:${colors.reset}`);
  
  // Find a test image - look for any JPEG file in public folder
  const publicDir = path.join(__dirname, '../public');
  const imageFiles = fs.readdirSync(publicDir).filter(file => 
    file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png')
  );
  
  if (imageFiles.length === 0) {
    console.log(`${colors.red}✗ No test image found in public directory${colors.reset}`);
    return false;
  }
  
  const testImagePath = path.join(publicDir, imageFiles[0]);
  console.log(`  Using test image: ${testImagePath}`);
  
  try {
    const uploadResult = await cloudinary.uploader.upload(testImagePath, {
      folder: 'real-estate/test',
      resource_type: 'auto'
    });
    
    console.log(`${colors.green}✓ Image uploaded successfully${colors.reset}`);
    console.log(`  Image URL: ${uploadResult.secure_url}`);
    console.log(`  Public ID: ${uploadResult.public_id}`);
    return true;
  } catch (error) {
    console.log(`${colors.red}✗ Image upload failed${colors.reset}`);
    console.log(`  Error: ${error.message}`);
    console.log(`  Details: ${JSON.stringify(error)}`);
    return false;
  }
}

// Run tests
async function runTests() {
  const connTest = await testCloudinaryConnectivity();
  if (connTest) {
    await testImageUpload();
  }
  
  console.log(`\n${colors.bright}${colors.blue}===== Test Complete =====${colors.reset}\n`);
}

runTests();