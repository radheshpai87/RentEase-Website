# RentEase - Real Estate Website

A modern real estate platform built with React and Node.js, featuring user authentication, property management, and an admin dashboard.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (running on localhost:27017)
- npm or yarn

### Installation
```bash
# Install dependencies
npm install
```

### Development

#### ⚡ Run Both Frontend & Backend Together (Recommended)
```bash
npm run dev:full
# or
npm start
```

This will start:
- **Backend** on http://localhost:5000 (with auto-restart via nodemon)
- **Frontend** on http://localhost:5173 (with hot reload via Vite)

#### Run Individually
```bash
# Backend only
npm run server

# Frontend only  
npm run dev
```

## 🎨 Features

- **User Authentication** - Login/Signup with JWT and role-based access
- **Property Management** - Browse, search, and filter properties
- **Admin Dashboard** - Comprehensive admin panel for property management
- **Responsive Design** - Mobile-first approach with modern UI
- **Real-time Updates** - Hot reload during development
- **File Uploads** - Image upload for properties
- **Stats Dashboard** - Analytics and statistics for admin

## 🔧 Available Scripts

- `npm run dev:full` - Run both frontend and backend together with colored output
- `npm start` - Same as dev:full
- `npm run dev` - Frontend development server only
- `npm run server` - Backend server with nodemon auto-restart
- `npm run build` - Build frontend for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## 🔐 Environment Setup

The `.env` file is already configured in `backend/.env`:
```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
MONGODB_URI=mongodb://localhost:27017/rentease
PORT=5000
NODE_ENV=development
```

## 🛠️ Tech Stack

**Frontend:**
- React 19 with Hooks
- React Router for navigation
- Vite for fast development
- Custom CSS with CSS Variables

**Backend:**
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT Authentication
- Multer for file uploads
- bcryptjs for password hashing

**Development Tools:**
- Concurrently (run multiple scripts)
- Nodemon (auto-restart server)
- ESLint (code linting)

## 📁 Project Structure

```
├── src/                    # Frontend React app
│   ├── components/         # React components
│   │   └── pages/         # Page components
│   └── styles/            # CSS files
├── backend/               # Backend Node.js app
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── uploads/           # File upload directory
│   ├── .env              # Environment variables
│   └── server.js          # Express server
├── public/                # Static assets
└── package.json           # Dependencies and scripts
```

## 📱 Pages & Features

- **Home** - Landing page with hero section and features
- **Properties** - Property listings with advanced search/filter
- **Property Detail** - Individual property with image gallery
- **About** - Company information with animated stats
- **Contact** - Contact form and information
- **Login/Signup** - User authentication with role selection
- **Admin Dashboard** - Property management, user management
- **Help** - FAQ and support information

## 🎯 Getting Started

1. **Start Development Servers**
   ```bash
   npm run dev:full
   ```
   You'll see colored output with BACKEND (blue) and FRONTEND (magenta) prefixes.

2. **Open Your Browser**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

3. **Create Admin Account**
   - Go to signup page
   - Select "Admin" role in dropdown
   - Use the account to access admin dashboard at `/admin`

4. **Database**
   - MongoDB will automatically create the `rentease` database
   - User data, properties, and other collections will be created as needed

## 🔄 Development Workflow

The concurrently setup provides:
- **Automatic server restart** when backend files change
- **Hot module replacement** for frontend changes
- **Colored console output** to distinguish between frontend/backend logs
- **Single command startup** for entire development environment

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

