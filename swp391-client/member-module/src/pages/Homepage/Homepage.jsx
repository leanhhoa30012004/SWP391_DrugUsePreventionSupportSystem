import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Hero from "./Hero";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaShieldAlt, FaCheckCircle } from "react-icons/fa";
import CoursesList from "../Courses/CourseList";
import AboutUs from "./Aboutus";
// Import AOS nếu bạn muốn dùng animations
import AOS from 'aos';
import Footer from "../../components/Footer/Footer";
// import 'aos/dist/aos.css';

const SurveyPopup = ({ onClose }) => {
  const handleStartSurvey = (e) => {
    e.preventDefault();
    if (!localStorage.getItem('user')) {
      window.location.href = '/register';
    } else {
      window.location.href = '/survey';
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-white p-6 sm:p-8 md:p-10 rounded-2xl shadow-2xl w-full max-w-[500px] min-h-[350px] relative text-center"
      >
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl transition-colors"
        >
          ✖
        </button>

        {/* Hình ảnh chủ đề */}
        <img
          src="https://i.pinimg.com/736x/c4/97/e3/c497e311525475e7f9203e1d4ebcfda1.jpg"
          alt="Say No To Drugs"
          className="w-[180px] mx-auto mb-4 rounded-xl border-4 border-blue-200 shadow"
          onError={(e) => {
            e.target.style.display = 'none'; // Ẩn ảnh nếu không load được
          }}
        />

        {/* Tiêu đề */}
        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
          Assess Your Substance Use Risk Level
          <FaShieldAlt className="text-red-500" />
        </h2>
        <p className="text-gray-600 mb-4">
          Take the <b>ASSIST</b> survey to receive personalized advice and support from our experts.
        </p>

        {/* Lợi ích */}
        <ul className="text-left text-gray-700 mb-6 space-y-1 text-base">
          <li className="flex items-center gap-2">
            <FaCheckCircle className="text-green-500 flex-shrink-0" />
            Assess personal risk level
          </li>
          <li className="flex items-center gap-2">
            <FaCheckCircle className="text-green-500 flex-shrink-0" />
            Get expert advice
          </li>
          <li className="flex items-center gap-2">
            <FaCheckCircle className="text-green-500 flex-shrink-0" />
            Connect with suitable training courses
          </li>
          <li className="flex items-center gap-2">
            <FaCheckCircle className="text-green-500 flex-shrink-0" />
            Completely confidential and free
          </li>
        </ul>

        {/* Button */}
        <button
          className="inline-block bg-gradient-to-r from-red-500 to-red-700 text-white px-6 py-3 rounded-lg shadow-lg text-lg font-semibold hover:scale-105 transition-all duration-300"
          onClick={handleStartSurvey}
        >
          Start Survey 🚀
        </button>
      </motion.div>
    </div>
  );
};

const Homepage = () => {
  const [orderPopup, setOrderPopup] = useState(false);
  const [showSurveyPopup, setShowSurveyPopup] = useState(false);
  const [hasSeenSurvey, setHasSeenSurvey] = useState(false);

  useEffect(() => {
    // Sử dụng state thay vì sessionStorage để tránh lỗi
    try {
      const hasSeenSurvey = sessionStorage.getItem("hasSeenSurvey");
      if (!hasSeenSurvey) {
        setShowSurveyPopup(true);
        sessionStorage.setItem("hasSeenSurvey", "true");
      }
    } catch (error) {
      // Fallback nếu sessionStorage không hoạt động
      console.warn("SessionStorage not available, using state only");
      if (!hasSeenSurvey) {
        setShowSurveyPopup(true);
        setHasSeenSurvey(true);
      }
    }
  }, [hasSeenSurvey]);

  const closeSurveyPopup = () => {
    setShowSurveyPopup(false);
  };

  const handleOrderPopup = () => {
    setOrderPopup(!orderPopup);
  };

  // Comment out AOS nếu không cần thiết hoặc chưa cài đặt
  useEffect(() => {
    // Chỉ chạy AOS nếu đã import
    if (typeof AOS !== 'undefined') {
      AOS.init({
        offset: 100,
        duration: 800,
        easing: "ease-in-sine",
        delay: 100,
      });
      AOS.refresh();
    }
  }, []);

  return (
    <>
      <div className="min-h-screen">
        {showSurveyPopup && <SurveyPopup onClose={closeSurveyPopup} />}

        <Navbar handleOrderPopup={handleOrderPopup} />
        <Hero handleOrderPopup={handleOrderPopup} />
        <AboutUs />

        {/* Uncomment if you want to use CoursesList */}
        <CoursesList />
      </div>

      <Footer />
    </>
  );
};

export default Homepage;