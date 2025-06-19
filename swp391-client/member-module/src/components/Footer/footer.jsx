import React from 'react';
import { Link } from 'react-router-dom';
import Logo from "../../assets/logo-WeHope.png";

const Footer = () => {
    return (
        <>
            {/* Footer */}
            <footer className="bg-gray-50 py-16 border-t border-gray-200">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                        {/* Logo Section - Takes 4 columns */}
                        <div className="lg:col-span-4 flex justify-center lg:justify-start">
                            <div className="text-center lg:text-left">
                                <img
                                    src={Logo}
                                    alt="WeHope Logo"
                                    className="h-80 w-auto mx-auto lg:mx-0 mb-1"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                            </div>
                        </div>

                        {/* Contact Information & Quick Links Container - Takes 8 columns */}
                        <div className="lg:col-span-8">
                            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Contact Information */}
                                    <div>
                                        <h4 className="font-bold text-xl mb-6 text-gray-900 border-b border-gray-200 pb-2">
                                            Contact Information
                                        </h4>
                                        <div className="space-y-3">
                                            <div className="flex items-start gap-3">
                                                <span className="text-red-500 mt-1">📍</span>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-700">Address</p>
                                                    <p className="text-sm text-gray-600">WeHope, TP Hồ Chí Minh</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <span className="text-green-500 mt-1">📞</span>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-700">Phone</p>
                                                    <p className="text-sm text-gray-600">+84937748231</p>
                                                    <p className="text-sm text-gray-600">+84912384773</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <span className="text-blue-500 mt-1">✉️</span>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-700">Email</p>
                                                    <p className="text-sm text-gray-600">WeHope.organization@fpt.net.vn</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <span className="text-purple-500 mt-1">📠</span>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-700">Fax</p>
                                                    <p className="text-sm text-gray-600">02518680375</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Quick Links */}
                                    <div>
                                        <h4 className="font-bold text-xl mb-6 text-gray-900 border-b border-gray-200 pb-2">
                                            Quick Links
                                        </h4>
                                        <div className="space-y-3">
                                            <Link
                                                to="/aboutus"
                                                className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 hover:translate-x-1 transition-all duration-200"
                                            >
                                                <span className="text-red-500">→</span>
                                                About Us
                                            </Link>
                                            <Link
                                                to="/courses"
                                                className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 hover:translate-x-1 transition-all duration-200"
                                            >
                                                <span className="text-red-500">→</span>
                                                What We Do
                                            </Link>
                                            <Link
                                                to="/contact"
                                                className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 hover:translate-x-1 transition-all duration-200"
                                            >
                                                <span className="text-red-500">→</span>
                                                Get Involved
                                            </Link>
                                            <Link
                                                to="/news"
                                                className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 hover:translate-x-1 transition-all duration-200"
                                            >
                                                <span className="text-red-500">→</span>
                                                News And Events
                                            </Link>
                                            <Link
                                                to="/contact"
                                                className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 hover:translate-x-1 transition-all duration-200"
                                            >
                                                <span className="text-red-500">→</span>
                                                Contact Us
                                            </Link>
                                        </div>
                                    </div>
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