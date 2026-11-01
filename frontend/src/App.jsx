import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'

function App() {
  return (
    <div className='w-full min-h-screen bg-richblack-900 flex flex-col font-inter'>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </div>
  )
}

export default App