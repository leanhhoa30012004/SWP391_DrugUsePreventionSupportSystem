import React from 'react';
import CourseCard from './CourseCard';
import { Link } from 'react-router-dom';
// Import ảnh
import About01 from '../../assets/About01.jpg';
import About02 from '../../assets/About02.jpg';
import About03 from '../../assets/About03.jpg';
import About04 from '../../assets/About04.jpg';
import About05 from '../../assets/About05.jpg';
import Hero1 from '../../assets/hero1.jpg';

const courses = [
  {
    id: 1,
    title: "Understanding Drugs and Their Effects",
    description: "Learn about different types of drugs, their effects on the body and mind, and how to recognize warning signs.",
    thumbnail: About01,
    videoUrl: "https://www.youtube.com/watch?v=example1",
    ageRange: "Ages 13-15",
    level: "Beginner",
    duration: "45 mins",
    lessons: 8
  },
  {
    id: 2,
    title: "Peer Pressure Resistance Skills",
    description: "Develop essential skills to handle peer pressure and make informed decisions in challenging situations.",
    thumbnail: About02,
    videoUrl: "https://www.youtube.com/watch?v=example2",
    ageRange: "Ages 12-14",
    level: "Beginner",
    duration: "30 mins",
    lessons: 6
  },
  {
    id: 3,
    title: "Healthy Coping Mechanisms",
    description: "Learn positive ways to deal with stress, anxiety, and emotional challenges without turning to substances.",
    thumbnail: About03,
    videoUrl: "https://www.youtube.com/watch?v=example3",
    ageRange: "Ages 15-17",
    level: "Intermediate",
    duration: "60 mins",
    lessons: 10
  },
  {
    id: 4,
    title: "Digital Safety and Online Risks",
    description: "Understand online safety, recognize digital threats, and learn how to protect yourself in the digital world.",
    thumbnail: About04,
    videoUrl: "https://www.youtube.com/watch?v=example4",
    ageRange: "Ages 13-16",
    level: "Beginner",
    duration: "40 mins",
    lessons: 7
  },
  {
    id: 5,
    title: "Building Self-Esteem and Confidence",
    description: "Develop strong self-esteem and confidence to make positive life choices and resist negative influences.",
    thumbnail: About05,
    videoUrl: "https://www.youtube.com/watch?v=example5",
    ageRange: "Ages 14-16",
    level: "Intermediate",
    duration: "50 mins",
    lessons: 9
  },
  {
    id: 6,
    title: "Family Communication Skills",
    description: "Learn effective communication techniques to strengthen family relationships and create a supportive environment.",
    thumbnail: Hero1,
    videoUrl: "https://www.youtube.com/watch?v=example6",
    ageRange: "Ages 12-15",
    level: "Beginner",
    duration: "35 mins",
    lessons: 6
  }
];

const CourseList = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Educational Courses
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our age-appropriate courses designed to educate and empower young people with essential knowledge and skills.
          </p>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            to="/courses"
            className="inline-flex items-center bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-8 rounded-full transition-colors duration-300"
          >
            View All Courses
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CourseList; 