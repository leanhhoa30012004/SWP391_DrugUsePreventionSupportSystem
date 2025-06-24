import React from 'react';
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
    title: "Design A Website With ThimPress",
    author: "DeterminedPoitras",
    category: "Photography",
    image: "https://i.imgur.com/8Km9tLL.jpg",
    duration: "2 Weeks",
    students: 156,
    price: "Free",
  },
  {
    id: 2,
    title: "Create An LMS Website With LearnPress",
    author: "DeterminedPoitras",
    category: "Photography",
    image: "https://i.imgur.com/1Q9Z1Zm.png",
    duration: "2 Weeks",
    students: 156,
    price: "Free",
  },
  {
    id: 3,
    title: "Create An LMS Website With LearnPress",
    author: "DeterminedPoitras",
    category: "Photography",
    image: "https://i.imgur.com/2nCt3Sbl.jpg",
    duration: "2 Weeks",
    students: 156,
    price: "Free",
  },
  {
    id: 4,
    title: "Create An LMS Website With LearnPress",
    author: "DeterminedPoitras",
    category: "Photography",
    image: "https://i.imgur.com/0y8Ftya.jpg",
    duration: "2 Weeks",
    students: 156,
    price: "Free",
  },
  {
    id: 5,
    title: "Create An LMS Website With LearnPress",
    author: "DeterminedPoitras",
    category: "Photography",
    image: "https://i.imgur.com/9bK0Fqg.jpg",
    duration: "2 Weeks",
    students: 156,
    price: "Free",
  },
  {
    id: 6,
    title: "Create An LMS Website With LearnPress",
    author: "DeterminedPoitras",
    category: "Photography",
    image: "https://i.imgur.com/1Q9Z1Zm.png",
    duration: "2 Weeks",
    students: 156,
    price: "Free",
  },
];

const CourseCard = ({ course }) => (
  <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-4 flex flex-col">
    <div className="relative mb-4">
      <img src={course.image} alt={course.title} className="rounded-xl w-full h-40 object-cover" />
      <span className="absolute top-3 left-3 bg-black text-white text-xs px-3 py-1 rounded-full">{course.category}</span>
    </div>
    <div className="flex-1 flex flex-col">
      <div className="text-xs text-gray-500 mb-1">by {course.author}</div>
      <div className="font-semibold text-lg mb-2 line-clamp-2">{course.title}</div>
      <div className="flex text-xs text-gray-400 mb-2">
        <span>{course.duration}</span>
        <span className="mx-2">•</span>
        <span>{course.students} Students</span>
      </div>
      <div className="flex justify-between items-center mt-auto">
        <span className="text-green-600 font-semibold">{course.price}</span>
        <Link to={`/courses/${course.id}`} className="text-blue-600 font-semibold hover:underline">View More</Link>
      </div>
    </div>
  </div>
);

const CourseList = () => (
  <section className="py-10">
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-2xl font-bold">Featured Courses</h2>
        <p className="text-gray-500">Explore our Popular Courses</p>
      </div>
      <Link to="/courses" className="border px-4 py-2 rounded-full font-medium hover:bg-gray-100">All Courses</Link>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {courses.map(course => <CourseCard key={course.id} course={course} />)}
    </div>
  </section>
);

export default CourseList; 