import React from 'react'
import './App.css'
import Homepage from './pages/Homepage/Homepage'
import SignUp from './components/SignUp/signup'

import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  )
}

export default App;
