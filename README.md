# RentEase - Modern Real Estate Platform

A comprehensive real estate platform built with React 19 and Node.js, featuring advanced property management, user authentication, admin dashboard, and modern glassmorphism UI design.

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (running on localhost:27017)
- npm or yarn

### Installation & Setup

1. **Clone and Install Dependencies**
   ```bash
   git clone <repository-url>
   cd real-estate-website
   npm install
   ```

2. **Database Setup**
   ```bash
   # Make sure MongoDB is running, then seed the database
   cd backend
   node seed.js
   ```
   This will create sample categories (Residential, Commercial, Industrial, Agricultural) and locations.

3. **Start Development Servers**
   ```bash
   # Run both frontend and backend together (Recommended)
   npm run dev:full
   # or
   npm start
   ```

This will start:
- **Backend API** on http://localhost:5000 (with auto-restart via nodemon)
- **Frontend** on http://localhost:5173 (with hot reload via Vite)

### Alternative - Run Individually
```bash
# Backend only
npm run server

# Frontend only  
npm run dev
```

## Features

### User Features
- **Modern UI Design** - Glassmorphism design with responsive layouts
- **User Authentication** - Secure login/signup with JWT and role-based access
- **Property Search** - Advanced search and filtering by location, type, price
- **Property Details** - Interactive property pages with image galleries
- **Responsive Design** - Mobile-first approach with modern animations

### Admin Features
- **Admin Dashboard** - Comprehensive property and user management
- **Property Management** - Create, edit, delete properties with rich forms
- **Category Management** - Manage property categories (Residential, Commercial, etc.)
- **Location Management** - Handle locations, cities, and areas
- **User Management** - Admin user oversight and role management
- **Analytics Dashboard** - Statistics and insights (users, properties, locations)

### Technical Features
- **JWT Authentication** - Secure token-based authentication
- **File Upload Support** - Image upload for properties
- **RESTful API** - Well-structured backend API
- **Real-time Updates** - Hot reload during development
- **Error Handling** - Comprehensive error handling with user feedback
- **Loading States** - Smooth loading indicators and timeout protection

## Tech Stack

**Frontend:**
- React 19 with Modern Hooks (useState, useEffect, useCallback)
- React Router v6 for navigation
- Vite for lightning-fast development
- Custom CSS with Glassmorphism design
- CSS Variables for consistent theming
- Responsive design with mobile-first approach

**Backend:**
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT Authentication with role-based access
- bcryptjs for secure password hashing
- CORS enabled for cross-origin requests
- Multer for file upload handling

**Development Tools:**
- Concurrently (run multiple servers)
- Nodemon (auto-restart server)
- ESLint (code linting)
- Colored console output for better development experience

## Project Structure

```
├── src/                    # Frontend React application
│   ├── components/         # Reusable React components
│   │   ├── pages/         # Page components
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminProperties.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── SignUp.jsx
│   │   │   ├── Properties.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── Help.jsx
│   │   │   └── Landing.jsx
│   │   ├── Header.jsx     # Navigation component
│   │   ├── Hero.jsx       # Landing page hero
│   │   ├── Features.jsx   # Features showcase
│   │   ├── Stats.jsx      # Statistics component
│   │   ├── CTA.jsx        # Call-to-action sections
│   │   ├── Footer.jsx     # Footer component
│   │   └── Notification.jsx # Toast notifications
│   ├── styles/            # CSS stylesheets
│   │   ├── App.css        # Global styles
│   │   ├── Auth.css       # Authentication pages
│   │   ├── AdminProperties.css # Admin properties (glassmorphism)
│   │   ├── Properties.css # Property listings
│   │   ├── About.css      # About page
│   │   ├── Contact.css    # Contact page
│   │   ├── Help.css       # Help page
│   │   ├── Header.css     # Navigation styles
│   │   ├── Hero.css       # Hero section
│   │   ├── Features.css   # Features styles
│   │   ├── Stats.css      # Statistics styles
│   │   ├── CTA.css        # Call-to-action styles
│   │   ├── Footer.css     # Footer styles
│   │   ├── Notification.css # Notification styles
│   │   └── index.css      # Base styles and CSS variables
│   ├── App.jsx            # Main app component with routing
│   └── main.jsx           # Application entry point
├── backend/               # Backend Node.js application
│   ├── models/            # MongoDB models
│   │   ├── User.js        # User model with roles
│   │   ├── Property.js    # Property model
│   │   ├── Location.js    # Location model
│   │   └── Category.js    # Category model
│   ├── routes/            # API route handlers
│   │   ├── auth.js        # Authentication routes
│   │   ├── properties.js  # Property CRUD operations
│   │   ├── locations.js   # Location management
│   │   ├── categories.js  # Category management
│   │   └── admin.js       # Admin dashboard APIs
│   ├── middleware/        # Custom middleware
│   │   └── auth.js        # JWT authentication middleware
│   ├── uploads/           # File upload directory
│   ├── .env              # Environment variables
│   ├── server.js          # Express server setup
│   └── seed.js            # Database seeding script
├── public/                # Static assets and images
├── package.json           # Dependencies and scripts
├── vite.config.js         # Vite configuration
├── eslint.config.js       # ESLint configuration
└── README.md             # This file
```

## Available Scripts

- `npm run dev:full` - **Recommended**: Run both frontend and backend with colored output
- `npm start` - Same as dev:full
- `npm run dev` - Frontend development server only (Vite)
- `npm run server` - Backend server with nodemon auto-restart
- `npm run build` - Build frontend for production
- `npm run lint` - Run ESLint code analysis
- `npm run preview` - Preview production build

## Environment Configuration

The backend uses environment variables in `backend/.env`:
```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
MONGODB_URI=mongodb://localhost:27017/rentease
PORT=5000
NODE_ENV=development
```

**Important**: Change the JWT_SECRET in production to a strong, random string.

## Application Pages & Features

### Public Pages
- **Landing (/)** - Hero section with property showcase and features
- **Properties (/properties)** - Property listings with advanced search/filter
- **Property Detail (/property/:id)** - Individual property with image gallery
- **About (/about)** - Company information with animated statistics
- **Contact (/contact)** - Contact form and company information
- **Help (/help)** - FAQ and support information

### Authentication
- **Login (/login)** - User authentication with role-based access
- **Signup (/signup)** - User registration with role selection (User/Admin)

### Admin Panel
- **Admin Dashboard (/admin)** - Overview with statistics and quick actions
- **Admin Properties (/admin/properties)** - Property management with CRUD operations
  - Modern glassmorphism UI design
  - Create/Edit property forms with validation
  - Category and location dropdown integration
  - Image upload support
  - Property status management
  - Search and filter functionality

## Getting Started Guide

### 1. Start the Application
```bash
npm run dev:full
```
You'll see colored output with BACKEND (blue) and FRONTEND (magenta) prefixes.

### 2. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

### 3. Create Admin Account
1. Go to the signup page (/signup)
2. Select "Admin" role in the dropdown
3. Complete registration
4. Use the account to access admin dashboard at /admin

### 4. Seed Database (Important!)
```bash
cd backend
node seed.js
```
This creates:
- 4 categories: Residential, Commercial, Industrial, Agricultural
- 4 sample locations: Mumbai, Bangalore, Delhi, etc.

### 5. Admin Property Management
1. Login as admin
2. Navigate to /admin/properties
3. Click "Add New Property" to create properties
4. Categories and locations will be populated from seeded data

## Development Workflow

The development setup provides:
- **Automatic server restart** when backend files change (nodemon)
- **Hot module replacement** for instant frontend updates (Vite)
- **Colored console output** to distinguish between frontend/backend logs
- **Single command startup** for the entire development environment
- **Error boundaries** and loading states for better UX
- **JWT token persistence** in localStorage
- **Responsive design** that works on all device sizes

## UI/UX Features

- **Modern Glassmorphism Design** - Beautiful frosted glass effects
- **Responsive Layout** - Mobile-first approach with breakpoints
- **Smooth Animations** - CSS transitions and hover effects
- **Loading States** - Skeleton loading and spinners
- **Error Handling** - User-friendly error messages
- **Toast Notifications** - Success/error feedback
- **Form Validation** - Real-time form validation
- **Dark/Light Theme Support** - CSS variables for easy theming

## Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcryptjs for secure password storage
- **Role-based Access Control** - User and Admin roles
- **Protected Routes** - Frontend and backend route protection
- **CORS Configuration** - Secure cross-origin resource sharing
- **Input Validation** - Server-side validation for all inputs

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### Properties
- `GET /api/properties` - Get all properties (with filters)
- `GET /api/properties/:id` - Get single property
- `POST /api/properties` - Create property (Admin only)
- `PUT /api/properties/:id` - Update property (Admin only)
- `DELETE /api/properties/:id` - Delete property (Admin only)

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (Admin only)
- `PUT /api/categories/:id` - Update category (Admin only)
- `DELETE /api/categories/:id` - Delete category (Admin only)

### Locations
- `GET /api/locations` - Get all locations
- `POST /api/locations` - Create location (Admin only)
- `PUT /api/locations/:id` - Update location (Admin only)
- `DELETE /api/locations/:id` - Delete location (Admin only)

### Admin
- `GET /api/admin/dashboard` - Dashboard statistics (Admin only)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

