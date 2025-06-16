import React from "react";
import { Link } from "react-router-dom";

const courses = [
  {
    id: 1,
    title: "Understanding Substance Abuse",
    author: "Dr. Jane Smith",
    category: "Health Education",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    duration: "3 Weeks",
    students: 210,
    price: "Free",
  },
  {
    id: 2,
    title: "Building Resilience in Youth",
    author: "John Doe, M.Ed.",
    category: "Prevention Skills",
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
    duration: "2 Weeks",
    students: 180,
    price: "Free",
  },
  {
    id: 3,
    title: "How to Say No: Refusal Skills",
    author: "Sarah Lee, Counselor",
    category: "Life Skills",
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
    duration: "1 Week",
    students: 150,
    price: "Free",
  },
  {
    id: 4,
    title: "Family Communication for Prevention",
    author: "Dr. Michael Brown",
    category: "Family Support",
    image: "https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=400&q=80",
    duration: "2 Weeks",
    students: 120,
    price: "Free",
  },
  {
    id: 5,
    title: "Recognizing Early Warning Signs",
    author: "Emily Clark, RN",
    category: "Awareness",
    image: "https://images.unsplash.com/photo-1454023492550-5696f8ff10e1?auto=format&fit=crop&w=400&q=80",
    duration: "1 Week",
    students: 95,
    price: "Free",
  },
  {
    id: 6,
    title: "Community Resources & Support",
    author: "Prevention Team",
    category: "Community",
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    duration: "Ongoing",
    students: 300,
    price: "Free",
  },
];

const CourseCard = ({ course }) => (
  <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-4 flex flex-col">
    <div className="relative mb-4">
      <img src={course.image} alt={course.title} className="rounded-xl w-full h-40 object-cover" />
      <span className="absolute top-3 left-3 bg-blue-700 text-white text-xs px-3 py-1 rounded-full">{course.category}</span>
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
        <p className="text-gray-500">Explore our Popular Courses on Drug Prevention and Healthy Living</p>
      </div>
      <Link to="/courses" className="border px-4 py-2 rounded-full font-medium hover:bg-gray-100">All Courses</Link>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {courses.map(course => <CourseCard key={course.id} course={course} />)}
    </div>
  </section>
);

export default CourseList; 