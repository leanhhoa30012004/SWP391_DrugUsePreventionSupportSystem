import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import Hero from "./Hero";
import AboutUs from "./Aboutus";
import CourseList from '../../components/Courses/CourseList';

const Homepage = () => {
    return (
        <>
        <Navbar/>
        <Hero/>
        <AboutUs/>
        <CourseList/>
        </>
    )
}

export default Homepage;