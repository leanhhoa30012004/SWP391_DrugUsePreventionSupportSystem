import React from 'react'
import { Link } from 'react-router-dom';
import { FaPlay, FaClock, FaUserGraduate } from 'react-icons/fa';



const Courses = ({course}) => {
    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
          {/* Course Image */}
          <div className="relative h-48 overflow-hidden">
            <img 
              src={course.thumbnail} 
              alt={course.title}
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white">
              <FaPlay className="w-4 h-4" />
              <span className="text-sm font-medium">{course.duration}</span>
            </div>
          </div>
    
          {/* Course Content */}
          <div className="p-6">
            {/* Age Range Badge */}
            <div className="inline-block px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-medium mb-3">
              {course.ageRange}
            </div>
    
            {/* Course Title */}
            <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
              {course.title}
            </h3>
    
            {/* Course Description */}
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {course.description}
            </p>
    
            {/* Course Details */}
            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <div className="flex items-center gap-2">
                <FaUserGraduate className="w-4 h-4" />
                <span>{course.level}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaClock className="w-4 h-4" />
                <span>{course.lessons} lessons</span>
              </div>
            </div>
    
            {/* Action Button */}
            <Link
              to={`/courses/${course.id}`}
              className="block w-full text-center bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300"
            >
              View Course
            </Link>
          </div>
        </div>
      );
    };

export default Courses
