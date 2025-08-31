# RentEase - Real Estate Website

A modern, responsive real estate rental website built with React and Vite.

## Features

- **Responsive Design** - Works on desktop, tablet, and mobile
- **Dark Theme** - Modern dark theme with warm amber accents
- **Authentication** - Login and signup pages with form validation
- **Landing Page** - Hero section, features, statistics, and call-to-action
- **Modern UI** - Clean design with animated background patterns

## Project Structure

```
src/
├── pages/           # Full page components
│   ├── Landing.jsx  # Home page
│   ├── Login.jsx    # Login page
│   └── SignUp.jsx   # Registration page
├── components/      # Reusable UI components
│   ├── Header.jsx   # Navigation header
│   ├── Footer.jsx   # Site footer
│   ├── Hero.jsx     # Hero section
│   ├── Features.jsx # Features section
│   ├── Stats.jsx    # Statistics section
│   └── CTA.jsx      # Call-to-action section
├── styles/          # CSS files
│   ├── index.css    # Global styles and variables
│   ├── App.css      # App-level styles
│   ├── Auth.css     # Authentication pages
│   └── *.css        # Component-specific styles
├── App.jsx          # Main app with routing
└── main.jsx         # Entry point
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Technologies Used

- React 18
- React Router DOM
- Vite
- CSS3 with custom properties
- Modern JavaScript (ES6+)

