import './styles/App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Header from './components/Header'
import Footer from './components/Footer'

import Landing from './components/pages/Landing'
import Login from './components/pages/Login'
import SignUp from './components/pages/SignUp'

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
