import React from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import AdminDashboardLayout from './pages/Admin/dashboard/AdminDashboardLayout'
import Dashboard from './pages/Admin/dashboard/Dashboard'
import Blogs from './pages/Admin/Blogs/Blogs/Blogs'
import Course from './pages/Admin/Course/Course/Course'
import Survey from './pages/Admin/Survey/Survey/Survey'
import Staff from './pages/Admin/Staff/Staff/Staff'
import Setting from './pages/Admin/Setting/Setting/Setting'

// Import existing pages
import Homepage from './pages/Homepage/Homepage'
import Aboutus from './pages/Homepage/Aboutus'
import OnlineConsultation from './pages/Homepage/Onlineconsultant'
import Register from './pages/Register/Register'
import Login from './pages/Login/Login'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/aboutus" element={<Aboutus />} />
      <Route path="/online-consultation" element={<OnlineConsultation />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      {/* Admin dashboard layout and nested routes */}
      <Route path="/admin/dashboard" element={<AdminDashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="/admin/dashboard/blogs" element={<Blogs />} />
        <Route path="/admin/dashboard/course" element={<Course />} />
        <Route path="/admin/dashboard/survey" element={<Survey />} />
        <Route path="/admin/dashboard/staff" element={<Staff />} />
        <Route path="/admin/dashboard/setting" element={<Setting />} />
      </Route>
    </Routes>
  )
}

export default App;
