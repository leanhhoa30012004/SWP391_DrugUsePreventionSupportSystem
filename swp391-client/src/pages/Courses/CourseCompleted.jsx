import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Award } from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';

const CourseCompleted = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const score = location.score || 0;
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center py-12 px-4">
        <div className="max-w-xl w-full bg-white rounded-xl shadow-lg border border-green-100 p-10 text-center">
          <div className="flex flex-col items-center mb-6">
            <div className="bg-gradient-to-r from-green-400 to-green-600 rounded-full p-4 mb-4">
              <CheckCircle className="w-16 h-16 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-green-700 mb-2">{score > 0 ? `Congratulations!`: `Failure!`}</h1>
            <p className="text-lg text-gray-700 mb-4">You {score > 0 ? `have successfully completed`: `have failed the test of`} this course with {score > 0 ? `${score} points`: `score less than 8 points`}</p>
            <Award className="w-12 h-12 text-yellow-400 mb-2" />
            <p className="text-gray-600 mb-6">Keep learning and growing. Your achievement has been recorded.</p>
          </div>
          <button
            onClick={() => navigate('/courses')}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300"
          >
            Back to Course List
          </button>
        </div>
      </div>
    </>
  );
};

export default CourseCompleted; 