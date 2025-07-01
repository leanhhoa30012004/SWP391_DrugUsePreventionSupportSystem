import React from 'react';
import { useNavigate } from 'react-router-dom';

const CheckIcon = () => (
  <svg className="w-4 h-4 mr-1 text-red-400" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

const ArrowIcon = () => (
  <svg 
    className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
);

const FeatureItem = ({ text }) => (
  <div className="flex items-center text-sm text-gray-500">
    <CheckIcon />
    {text}
  </div>
);

export default function SurveyIntroSection() {
  const navigate = useNavigate();
  const handleNavigateToSurvey = () => {
    console.log('Navigating to /survey');
    navigate('/survey');
  };

  return (
    <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-red-50 via-rose-25 to-white rounded-3xl shadow-xl overflow-hidden border border-red-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center p-10 lg:p-16">
            
            {/* Image Section */}
            <div className="flex justify-center lg:justify-start order-2 lg:order-1">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-red-200 to-pink-200 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                <img 
                  src="https://i.pinimg.com/736x/cc/88/63/cc8863a638ab4d1ac7a5bad55ad252fb.jpg" 
                  alt="Survey illustration" 
                  className="relative w-full max-w-lg rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-500 border-4 border-white"
                />
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-full animate-pulse shadow-lg" />
                <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-gradient-to-r from-pink-400 to-red-400 rounded-full animate-bounce shadow-md" />
              </div>
            </div>

            {/* Content Section */}
            <div className="text-center lg:text-left space-y-8 order-1 lg:order-2">
              <div className="space-y-4">
                <div className="inline-block px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium mb-4">
                  ✨ Personal Assessment
                </div>
                <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 leading-tight">
                  Discover Your Current 
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-600"> Level</span>
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed max-w-md mx-auto lg:mx-0">
                  Take our comprehensive survey to assess your current level and unlock personalized insights for your growth journey.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={handleNavigateToSurvey}
                  className="group inline-flex items-center justify-center px-10 py-5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-red-200"
                >
                  <span className="text-lg">Start Survey</span>
                  <ArrowIcon />
                </button>
                
                <div className="flex items-center justify-center lg:justify-start text-sm text-gray-500 px-4">
                  <span className="mr-2">🎯</span>
                  Free • 5 minutes • Instant results
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-4">
                <div className="text-center lg:text-left">
                  <div className="text-2xl font-bold text-red-500">1000+</div>
                  <div className="text-sm text-gray-600">Completed Surveys</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-2xl font-bold text-red-500">95%</div>
                  <div className="text-sm text-gray-600">Satisfaction Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}