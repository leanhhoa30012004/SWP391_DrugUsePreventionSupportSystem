import React from 'react';

const CheckIcon = () => (
  <svg className="w-5 h-5 mr-3 text-red-500" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

const ArrowIcon = () => (
  <svg 
    className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
);

const FeatureItem = ({ text }) => (
  <div className="flex items-center text-gray-700 mb-4 group hover:text-gray-900 transition-colors duration-200">
    <CheckIcon />
    <span className="font-medium">{text}</span>
  </div>
);

export default function ProgramsSection() {
  const handleNavigateToPrograms = () => {
    // Sử dụng window.location để navigate
    window.location.href = '/programs';
  };

  return (
    <div className="bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-red-100">
          {/* Background Decorations */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-red-200 to-pink-200 rounded-full blur-3xl opacity-20"></div>
            <div className="absolute bottom-10 right-10 w-24 h-24 bg-gradient-to-br from-rose-200 to-red-200 rounded-full blur-2xl opacity-20"></div>
          </div>
          
          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center p-10 lg:p-16">
            
            {/* Content Section - Left */}
            <div className="text-center lg:text-left space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-100 to-rose-100 text-red-700 rounded-full text-sm font-semibold mb-4">
                  <span className="mr-2">🤝</span>
                  Community Programs
                </div>
                <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
                  Join Our{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-rose-600 to-red-800">
                    Community
                  </span>
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-pink-600 to-red-600">
                    Programs
                  </span>
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed max-w-lg mx-auto lg:mx-0">
                  Participate in meaningful anti-drug programs designed to strengthen communities and create positive change together.
                </p>
              </div>

              {/* Features List */}
              <div className="space-y-2">
                <FeatureItem text="Educational workshops and seminars" />
                <FeatureItem text="Community outreach initiatives" />
                <FeatureItem text="Support group meetings" />
                <FeatureItem text="Awareness campaigns" />
              </div>

              {/* CTA Button */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={handleNavigateToPrograms}
                  className="group relative inline-flex items-center justify-center px-12 py-6 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-700 hover:via-rose-700 hover:to-red-800 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-red-200 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <span className="relative text-lg">View All Programs</span>
                  <ArrowIcon />
                </button>
                
                <div className="flex items-center justify-center lg:justify-start text-sm text-gray-500 px-4">
                  <span className="mr-2">🎯</span>
                  Free registration • Community focused
                </div>
              </div>
            </div>

            {/* Image Section - Right */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative group">
                <div className="absolute -inset-6 bg-gradient-to-r from-red-200 via-rose-200 to-pink-200 rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                <div className="relative overflow-hidden rounded-3xl">
                  <img 
                    src="https://i.pinimg.com/1200x/dd/d8/84/ddd884c16916f6c36a2a6d8985abe8a7.jpg" 
                    alt="Community programs illustration" 
                    className="relative w-full max-w-lg rounded-3xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-500 border-4 border-white"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent rounded-3xl"></div>
                </div>
                
                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-red-500 to-rose-500 rounded-full animate-pulse shadow-xl flex items-center justify-center">
                  <span className="text-white text-xl">🌟</span>
                </div>
                <div className="absolute -bottom-4 -left-4 w-10 h-10 bg-gradient-to-r from-pink-400 to-red-400 rounded-full animate-bounce shadow-lg flex items-center justify-center">
                  <span className="text-white text-sm">❤️</span>
                </div>
                <div className="absolute top-1/2 -left-6 w-8 h-8 bg-gradient-to-r from-rose-400 to-red-400 rounded-full animate-ping shadow-md"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}