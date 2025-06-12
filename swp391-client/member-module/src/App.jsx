import React from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import Dashboard from './pages/Homepage/Dashboard'

// Import existing pages
import Homepage from './pages/Homepage/Homepage'

import Aboutus from './pages/Homepage/Aboutus'
import OnlineConsultation from './pages/Homepage/Onlineconsultant'
import Register from './pages/Register/Register'
import Login from './pages/Login/Login'
import Contact from './pages/Contact/Contact'

// TODO: Create these components
// import Courses from './pages/Homepage/Courses'
// import Survey from './pages/Homepage/Survey'
// import News from './pages/Homepage/News'
// import Blogs from './pages/Homepage/Blogs'
// import Contact from './pages/Homepage/Contact'


function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />

      <Route path="/aboutus" element={<Aboutus />} />
      <Route path="/online-consultation" element={<OnlineConsultation />} />

      {/* TODO: Uncomment these routes after creating their components */}
      {/* <Route path="/courses" element={<Courses />} /> */}
      {/* <Route path="/survey" element={<Survey />} /> */}
      {/* <Route path="/news" element={<News />} /> */}
      {/* <Route path="/blogs" element={<Blogs />} /> */}
      <Route path="/contact" element={<Contact />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />

    </Routes>
  )
}

export default App;
