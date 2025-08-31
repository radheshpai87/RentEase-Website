import './styles/App.css'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'

// Import layout components
import Header from './components/Header'
import Footer from './components/Footer'

// Import pages
import Landing from './components/pages/Landing'
import Login from './components/pages/Login'
import SignUp from './components/pages/SignUp'

function AppContent() {
  const location = useLocation()
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup'

  return (
    <div className="app">
      {!isAuthPage && <Header />}
      <main>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </main>
      {!isAuthPage && <Footer />}
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
