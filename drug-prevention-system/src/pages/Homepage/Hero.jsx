import React from 'react';
import { Link } from 'react-router-dom';
import Slider from "react-slick";
import { FaArrowLeft, FaArrowRight, FaBookOpen, FaUserMd, FaShieldAlt } from "react-icons/fa";
import Hero1 from "../../assets/hero1.jpg"; 
import Hero2 from "../../assets/hero2.jpg";
import Hero3 from "../../assets/hero3.png"; 

const ImageList = [
    {
      id: 1,
      img: Hero1,
      title: "Building a Healthy Community Together",
      description: "We are committed to providing essential knowledge and skills to prevent social evils, protecting yourself and your loved ones.",
      buttonText: "Join Now",
      buttonLink: "/courses"
    },
    {
      id: 2,
      img: Hero2,
      title: "Education - Prevention - Support",
      description: "Online training platform with in-depth courses on drug awareness, prevention skills, and refusal techniques.",
      buttonText: "Explore Courses",
      buttonLink: "/courses"
    },
    {
      id: 3,
      img: Hero3,
      title: "Professional Consultation - 24/7 Support",
      description: "Experienced counseling team ready to accompany and support you anytime, anywhere.",
      buttonText: "Book Consultation",

      buttonLink: "/online-consultation"
    },
   ];



const PrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute top-1/2 left-4 transform -translate-y-1/2 z-10 bg-white bg-opacity-20 backdrop-blur-sm text-white p-3 rounded-full shadow-lg hover:bg-opacity-30 transition-all duration-300"
    aria-label="Previous slide"
  >
    <FaArrowLeft size={20} />
  </button>
);

const NextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10 bg-white bg-opacity-20 backdrop-blur-sm text-white p-3 rounded-full shadow-lg hover:bg-opacity-30 transition-all duration-300"
    aria-label="Next slide"
  >
    <FaArrowRight size={20} />
  </button>
);

const Hero = () => {
  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    cssEase: "ease-in-out",
    pauseOnHover: true,
    pauseOnFocus: true,
    dotsClass: "slick-dots custom-dots",
  };

  return (
    <div className="relative overflow-hidden">
      {/* Hero Slider */}
      <div className="min-h-[500px] sm:min-h-[600px] lg:min-h-[700px]">
        <Slider {...settings}>
          {ImageList.map((item) => (
            <div key={item.id} className="relative">
              <div className="relative w-full h-[500px] sm:h-[600px] lg:h-[700px]">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                {/* Overlay with red gradient - reduced opacity */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-900/50 via-red-800/40 to-red-700/30"></div>
                
                {/* Content */}
                <div className="absolute inset-0 flex items-center">
                  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl text-white">
                      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
                        {item.title}
                      </h1>
                      <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 leading-relaxed opacity-90 max-w-2xl">
                        {item.description}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                          to={item.buttonLink}
                          className="inline-flex items-center justify-center bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
                        >
                          {item.buttonText}
                        </Link>

                  <FaBookOpen className="text-red-600 text-xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Online Courses</h3>
              </div>
              <p className="text-gray-600 mb-4">Flexible learning with age-appropriate content</p>

                View courses →

              </Link>
            </div>

            {/* Risk Assessment */}
            <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">

                  <FaShieldAlt className="text-red-600 text-xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Risk Assessment</h3>
              </div>
              <p className="text-gray-600 mb-4">ASSIST and CRAFFT surveys to evaluate risk levels</p>

              <Link 
                to="/assessment" 
                className="text-red-600 font-semibold hover:text-red-700 transition-colors"
              >

                Take assessment →

              </Link>
            </div>

            {/* Expert Consultation */}
            <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <FaUserMd className="text-red-600 text-xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Expert Consultation</h3>
              </div>
              <p className="text-gray-600 mb-4">Schedule appointments with experienced counselors</p>
              <Link 
                to="/online-consultation" 
                className="text-red-600 font-semibold hover:text-red-700 transition-colors"
              >
                Book appointment →

              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Dots Styling */}
      <style jsx>{`
        .custom-dots {
          bottom: 20px;
        }
        .custom-dots li button:before {
          font-size: 12px;
          color: white;
          opacity: 0.5;
        }
        .custom-dots li.slick-active button:before {
          opacity: 1;
          color: #EF4444;
        }
      `}</style>
    </div>
  );
};

export default Hero;