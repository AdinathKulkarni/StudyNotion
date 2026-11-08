import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import './index.css'
import Signup from './pages/Signup.jsx'
import Login from './pages/Login.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import Navbar from './components/core/Common/Navbar.jsx'

function App() {
  return (
    <div className='w-full min-h-screen bg-richblack-900 flex flex-col font-inter '>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
      </Routes>
    </div>
  )
}

export default App