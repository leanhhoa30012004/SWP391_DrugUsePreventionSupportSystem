import React from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'

// Homepage components
// import Dashboard from './pages/Homepage/Dashboard' // Comment out vì file không tồn tại
import Homepage from './pages/Homepage/Homepage'
import Aboutus from './pages/Homepage/Aboutus'
import OnlineConsultation from './pages/Homepage/Onlineconsultant'

// Auth components
import Register from './pages/Register/Register'
import Login from './pages/Login/Login'
import ForgotPassword from './pages/ForgotPassword/forgotPassword'
import ResetPassword from './pages/ForgotPassword/resetPassword'
import ConfirmationCode from './pages/ForgotPassword/ConfirmationCode'

// Admin components
import AdminDashboardLayout from './pages/Admin/dashboard/AdminDashboardLayout'
import AdminDashboard from './pages/Admin/dashboard/Dashboard'
import Blogs from './pages/Admin/Blogs/Blogs/Blogs'
import Course from './pages/Admin/Course/Course/Course'
import Survey from './pages/Admin/Survey/Survey/Survey'
import Staff from './pages/Admin/Staff/Staff/Staff'
import Setting from './pages/Admin/Setting/Setting/Setting'

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Homepage />} />
      <Route path="/aboutus" element={<Aboutus />} />
      <Route path="/online-consultation" element={<OnlineConsultation />} />

      {/* Auth Routes */}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/confirmation-code" element={<ConfirmationCode />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* User Dashboard - Comment out vì component không tồn tại */}
      {/* <Route path="/dashboard" element={<Dashboard />} /> */}

      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={<AdminDashboardLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="blogs" element={<Blogs />} />
        <Route path="course" element={<Course />} />
        <Route path="survey" element={<Survey />} />
        <Route path="staff" element={<Staff />} />
        <Route path="setting" element={<Setting />} />
      </Route>
    </Routes>
  )
}

export default App;