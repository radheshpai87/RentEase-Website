import './styles/App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'

import Header from './components/Header'
import Footer from './components/Footer'
import { initializeAuth } from './utils/authGuard'

import Landing from './components/pages/Landing'
import Login from './components/pages/Login'
import SignUp from './components/pages/SignUp'
import Properties from './components/pages/Properties'
import PropertyDetail from './components/pages/PropertyDetail'
import AdminDashboard from './components/pages/AdminDashboard'
import About from './components/pages/About'
import Contact from './components/pages/Contact'
import Help from './components/pages/Help'

function App() {
  useEffect(() => {
    // Initialize auth guard on app start
    initializeAuth();
  }, []);

  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/properties/:id" element={<PropertyDetail />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/help" element={<Help />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
