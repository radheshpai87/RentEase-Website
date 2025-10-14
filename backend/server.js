import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import crypto from 'crypto';

// Routes
import authRoutes from './routes/auth.js';
import propertiesRoutes from './routes/properties.js';
import locationsRoutes from './routes/locations.js';
import categoriesRoutes from './routes/categories.js';
import inquiriesRoutes from './routes/inquiries.js';
import cmsRoutes from './routes/cms.js';
import adminRoutes from './routes/admin.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = 5000;

// Server instance tracking for token invalidation
const SERVER_INSTANCE_ID = crypto.randomUUID();

// In-memory token blacklist (in production, use Redis or database)
const tokenBlacklist = new Set();
const validTokens = new Set();

// Middleware to check token blacklist
export const checkTokenValidity = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    if (tokenBlacklist.has(token)) {
      return res.status(401).json({ 
        message: 'Token has been blacklisted. Please login again.',
        serverRestarted: true 
      });
    }
  }
  next();
};

// Function to add token to blacklist
export const blacklistToken = (token) => {
  tokenBlacklist.add(token);
  validTokens.delete(token);
};

// Function to add token to valid tokens list
export const addValidToken = (token) => {
  validTokens.add(token);
};

// Function to clear all tokens (used on server shutdown)
const clearAllTokens = () => {
  validTokens.forEach(token => blacklistToken(token));
  console.log('All active tokens have been blacklisted');
};

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Apply token validity check to all routes
app.use(checkTokenValidity);

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Upload endpoint
app.post('/api/upload', upload.array('images', 10), (req, res) => {
  try {
    const files = req.files.map(file => `/uploads/${file.filename}`);
    res.json({ 
      message: 'Files uploaded successfully',
      files 
    });
  } catch (error) {
    res.status(400).json({ message: 'Upload failed', error: error.message });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertiesRoutes);
app.use('/api/locations', locationsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/inquiries', inquiriesRoutes);
app.use('/api/cms', cmsRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Endpoint to check server status and instance
app.get('/api/server-status', (req, res) => {
  res.json({ 
    message: 'Server is running',
    instanceId: SERVER_INSTANCE_ID,
    timestamp: new Date().toISOString()
  });
});

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/rentease');
    console.log('Database connected');
  } catch (error) {
    console.log('Database connection failed:', error);
    process.exit(1);
  }
};

const startServer = async () => {
  await connectDB();
  const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Server Instance ID: ${SERVER_INSTANCE_ID}`);
  });

  // Graceful shutdown handling
  const gracefulShutdown = (signal) => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    
    // Clear all active tokens
    clearAllTokens();
    
    server.close((err) => {
      if (err) {
        console.error('Error during server shutdown:', err);
        process.exit(1);
      }
      
      mongoose.connection.close(() => {
        console.log('Database connection closed.');
        console.log('Server shutdown complete.');
        process.exit(0);
      });
    });
  };

  // Handle process termination signals
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  process.on('SIGUSR2', () => gracefulShutdown('SIGUSR2')); // For nodemon
  
  return server;
};

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
