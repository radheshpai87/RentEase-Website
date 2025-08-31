# RentEase - Real Estate Website

A modern, full-stack real estate rental website with React frontend and Node.js backend.

## Features

- **Full Authentication System** - Complete user registration and login with JWT tokens
- **MongoDB Database** - User data storage with password hashing
- **Responsive Design** - Works perfectly on all devices
- **Modern UI** - Clean, simple design with notification system
- **Real-time Notifications** - Success/error feedback for user actions
- **Property Search Interface** - Search form for properties (UI ready for backend integration)

## Tech Stack

### Frontend
- **React 18** - Modern UI library
- **React Router** - Client-side routing
- **Vite** - Fast build tool and dev server
- **Custom CSS** - No external CSS frameworks

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing

## Project Structure

```
real-estate-website/
├── backend/                 # Backend API
│   ├── models/
│   │   └── User.js         # User database model
│   ├── routes/
│   │   └── auth.js         # Authentication routes
│   └── server.js           # Express server setup
├── src/                    # Frontend React app
│   ├── components/
│   │   ├── pages/
│   │   │   ├── Landing.jsx # Home page
│   │   │   ├── Login.jsx   # Login page
│   │   │   └── SignUp.jsx  # Registration page
│   │   ├── Header.jsx      # Navigation
│   │   ├── Hero.jsx        # Hero section with search
│   │   ├── Notification.jsx # Toast notifications
│   │   ├── Features.jsx    # Features showcase
│   │   ├── Stats.jsx       # Statistics display
│   │   ├── Footer.jsx      # Site footer
│   │   └── CTA.jsx         # Call-to-action
│   ├── styles/             # CSS files
│   │   ├── index.css       # Global styles
│   │   ├── Auth.css        # Login/signup styles
│   │   ├── Notification.css # Toast styles
│   │   └── [other].css     # Component styles
│   ├── App.jsx             # Main app component
│   └── main.jsx            # Entry point
├── package.json            # Dependencies and scripts
└── README.md               # This file
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or cloud instance)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd real-estate-website
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/rentease
   JWT_SECRET=your-secret-key-here
   PORT=5000
   ```

4. **Start MongoDB:**
   Make sure MongoDB is running on your system.

### Running the Application

```bash
npm run dev:full
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/test` - Test endpoint

## Database Schema

### User Model
```javascript
{
  firstName: String (required)
  lastName: String (required)
  email: String (required, unique)
  phoneNumber: String (required)
  password: String (required, hashed)
  role: String (default: 'user')
  createdAt: Date (auto-generated)
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational purposes.

