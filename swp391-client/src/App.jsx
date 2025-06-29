import React from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'

// Homepage components
import Homepage from './pages/Homepage/Homepage'
// import Aboutus from './pages/Homepage/Aboutus'
import OnlineConsultation from './pages/Homepage/Onlineconsultant'
import Contact from './pages/Contact/contact'
import News from './pages/News/news'
import Blogs from './pages/Blogs/blogs'
import Courses from './pages/Courses/Courses'
import CourseDetail from './pages/Courses/CourseDetail.jsx'

// Auth components
import Register from './pages/Register/Register'
import Login from './pages/Login/Login'
import ForgotPassword from './pages/ForgotPassword/forgotPassword'
import ResetPassword from './pages/ForgotPassword/resetPassword'
// import ConfirmationCode from './pages/ForgotPassword/ConfirmationCode'
import ManagerLogin from './pages/Login/ManagerLogin'

// Admin components
import AdminDashboardLayout from './pages/Admin/dashboard/AdminDashboardLayout'
import AdminDashboard from './pages/Admin/dashboard/Dashboard'
import AdminBlogs from './pages/Admin/Blogs/Blogs/Blogs'
import Course from './pages/Admin/Course/Course/Course'
import AdminSurvey from './pages/Admin/Survey/Survey/Survey'
import Staff from './pages/Admin/Staff/Staff/Staff'
import Setting from './pages/Admin/Setting/Setting/Setting'
import CourseLearning from './pages/Courses/CourseLearning.jsx'
import SurveyHistoryPage from './pages/Survey/SurveyHistoryPage.jsx'

// Survey components
import Survey from './pages/Survey/Survey'
import SurveySelectionPage from './pages/Survey/ViewSurvey'
import AboutUsPage from './pages/About/About'

// Manager components
import UserManagementLayout from './pages/Manager/dashboard/UserManagementLayout'
import ManagerDashboard from './pages/Manager/dashboard/Dashboard'
import UserManagement from './pages/Manager/dashboard/UserManagement'
import SidebarLayout from './pages/Manager/dashboard/SidebarLayout'
import SurveyManagement from './pages/Manager/dashboard/SurveyManagement'
import CourseManagement from './pages/Manager/dashboard/CourseManagement'
import ConsultantManagement from './pages/Manager/dashboard/ConsultantManagement'

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Homepage />} />
      {/* <Route path="/aboutus" element={<Aboutus />} /> */}
      <Route path="/online-consultation" element={<OnlineConsultation />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/news" element={<News />} />
      <Route path="/blogs" element={<Blogs />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/courses/:course_id" element={<CourseDetail />} />
      <Route path="/learning/:course_id" element={<CourseLearning />} />

      {/* Auth Routes */}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      {/* <Route path="/confirmation-code" element={<ConfirmationCode />} /> */}
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/manager-login" element={<ManagerLogin />} />

      {/* Survey Routes */}
      <Route path="/survey" element={<SurveySelectionPage />} />
      <Route path="/survey/:sid" element={<Survey />} />
      <Route path="/survey/history/:memberId/:id" element={<SurveyHistoryPage />} />
      <Route path="/about" element={<AboutUsPage />} />

      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={<AdminDashboardLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="blogs" element={<AdminBlogs />} />
        <Route path="course" element={<Course />} />
        <Route path="survey" element={<AdminSurvey />} />
        <Route path="staff" element={<Staff />} />
        <Route path="setting" element={<Setting />} />
      </Route>

      {/* Manager Routes - Simplified User Management Only */}
      <Route path="/manager/dashboard" element={<SidebarLayout />}>
        <Route index element={<ManagerDashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="survey" element={<SurveyManagement />} />
        <Route path="course" element={<CourseManagement />} />
        <Route path="consultant" element={<ConsultantManagement />} />
      </Route>
    </Routes>
  )
}

export default App