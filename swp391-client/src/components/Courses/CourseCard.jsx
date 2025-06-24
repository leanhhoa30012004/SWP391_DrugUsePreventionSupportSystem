import React from 'react';
import { Link } from 'react-router-dom';
import { FaPlay, FaClock, FaUserGraduate, FaVideo } from 'react-icons/fa';

const CourseCard = ({ course }) => {
  // Kiểm tra nếu course là undefined hoặc null
  if (!course) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Course Image/Video Thumbnail */}
      <div className="relative h-48 overflow-hidden">
        {course.videoUrl ? (
          <div className="relative w-full h-full">
            <img 
              src={course.thumbnail || '/assets/courses/default-thumbnail.jpg'} 
              alt={course.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <a 
                href={course.videoUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <FaPlay className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>
        ) : (
          <img 
            src={course.thumbnail || '/assets/courses/default-thumbnail.jpg'} 
            alt={course.title}
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white">
          <FaVideo className="w-4 h-4" />
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

        {/* Action Buttons */}
        <div className="flex gap-3">
          {course.videoUrl && (
            <a
              href={course.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2"
            >
              <FaVideo className="w-4 h-4" />
              Watch Video
            </a>
          )}
          <Link
            to={`/courses/${course.id}`}
            className="flex-1 text-center bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300"
          >
            View Course
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard; 