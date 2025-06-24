import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaFax, FaArrowRight } from 'react-icons/fa';
import Logo from "../../assets/logo-WeHope.png";

const Footer = () => {
    return (
        <>
            {/* Footer */}
            <footer className="bg-gradient-to-r from-blue-50 to-gray-50 text-gray-800 py-16">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                        {/* Logo & About Section */}
                        <div className="lg:col-span-1">
                            <div className="mb-6">
                                <img
                                    src={Logo}
                                    alt="WeHope Logo"
                                    className="h-80 w-auto mb-6 -ml-8"
                                />
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="text-lg font-semibold mb-6 text-gray-800 border-b-2 border-red-500 pb-2">
                                Quick Links
                            </h4>
                            <div className="space-y-3">
                                <Link
                                    to="/aboutus"
                                    className="flex items-center group text-gray-600 hover:text-red-600 transition-all duration-300"
                                >
                                    <FaArrowRight className="text-red-500 text-xs mr-3 group-hover:translate-x-2 transition-transform duration-300" />
                                    <span className="text-sm font-medium">About Us</span>
                                </Link>
                                <Link
                                    to="/courses"
                                    className="flex items-center group text-gray-600 hover:text-red-600 transition-all duration-300"
                                >
                                    <FaArrowRight className="text-red-500 text-xs mr-3 group-hover:translate-x-2 transition-transform duration-300" />
                                    <span className="text-sm font-medium">What We Do</span>
                                </Link>
                                <Link
                                    to="/contact"
                                    className="flex items-center group text-gray-600 hover:text-red-600 transition-all duration-300"
                                >
                                    <FaArrowRight className="text-red-500 text-xs mr-3 group-hover:translate-x-2 transition-transform duration-300" />
                                    <span className="text-sm font-medium">Get Involved</span>
                                </Link>
                                <Link
                                    to="/news"
                                    className="flex items-center group text-gray-600 hover:text-red-600 transition-all duration-300"
                                >
                                    <FaArrowRight className="text-red-500 text-xs mr-3 group-hover:translate-x-2 transition-transform duration-300" />
                                    <span className="text-sm font-medium">News & Events</span>
                                </Link>
                                <Link
                                    to="/contact"
                                    className="flex items-center group text-gray-600 hover:text-red-600 transition-all duration-300"
                                >
                                    <FaArrowRight className="text-red-500 text-xs mr-3 group-hover:translate-x-2 transition-transform duration-300" />
                                    <span className="text-sm font-medium">Contact Us</span>
                                </Link>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div>
                            <h4 className="text-lg font-semibold mb-6 text-gray-800 border-b-2 border-red-500 pb-2">
                                Contact Information
                            </h4>
                            <div className="space-y-4">
                                <div className="flex items-start group">
                                    <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center mr-3 mt-1 group-hover:bg-red-600 transition-all duration-300 shadow-lg">
                                        <FaMapMarkerAlt className="text-white text-sm" />
                                    </div>
                                    <div>
                                        <p className="text-gray-800 font-semibold text-sm">Address</p>
                                        <p className="text-gray-600 text-sm">WeHope, TP Hồ Chí Minh</p>
                                    </div>
                                </div>

                                <div className="flex items-start group">
                                    <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center mr-3 mt-1 group-hover:bg-green-600 transition-all duration-300 shadow-lg">
                                        <FaPhone className="text-white text-sm" />
                                    </div>
                                    <div>
                                        <p className="text-gray-800 font-semibold text-sm">Phone</p>
                                        <p className="text-gray-600 text-sm">+84937748231</p>
                                        <p className="text-gray-600 text-sm">+84912384773</p>
                                    </div>
                                </div>

                                <div className="flex items-start group">
                                    <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center mr-3 mt-1 group-hover:bg-blue-600 transition-all duration-300 shadow-lg">
                                        <FaEnvelope className="text-white text-sm" />
                                    </div>
                                    <div>
                                        <p className="text-gray-800 font-semibold text-sm">Email</p>
                                        <p className="text-gray-600 text-sm">WeHope.organization@fpt.net.vn</p>
                                    </div>
                                </div>

                                <div className="flex items-start group">
                                    <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center mr-3 mt-1 group-hover:bg-purple-600 transition-all duration-300 shadow-lg">
                                        <FaFax className="text-white text-sm" />
                                    </div>
                                    <div>
                                        <p className="text-gray-800 font-semibold text-sm">Fax</p>
                                        <p className="text-gray-600 text-sm">02518680375</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Newsletter */}
                        <div>
                            <h4 className="text-lg font-semibold mb-6 text-gray-800 border-b-2 border-red-500 pb-2">
                                Newsletter
                            </h4>
                            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                                Stay updated with our latest news and events in drug prevention.
                            </p>
                            <div className="space-y-3">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-300"
                                />
                                <button className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                                    Subscribe Now
                                </button>
                            </div>

                            {/* Operating Hours */}
                            <div className="mt-6 p-4 bg-white rounded-lg shadow-lg border border-gray-200">
                                <h5 className="text-gray-800 font-semibold mb-3">Operating Hours</h5>
                                <div className="space-y-2 text-sm text-gray-600">
                                    <p className="flex justify-between">
                                        <span>Monday - Friday:</span>
                                        <span className="font-medium">8:00 AM - 6:00 PM</span>
                                    </p>
                                    <p className="flex justify-between">
                                        <span>Saturday:</span>
                                        <span className="font-medium">9:00 AM - 4:00 PM</span>
                                    </p>
                                    <p className="flex justify-between">
                                        <span>Sunday:</span>
                                        <span className="font-medium text-red-500">Closed</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Copyright */}
            <div className="bg-red-600 text-white py-4">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-sm font-medium">
                        Copyright © 2025. All Rights Reserved by Tung Tung Tung Sahur!
                    </p>
                </div>
            </div>
        </>
    );
};

export default Footer;