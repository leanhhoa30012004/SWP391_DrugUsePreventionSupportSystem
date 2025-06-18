import React from 'react';
import { Link } from 'react-router-dom';
import Logo from "../../assets/logo-WeHope.png";

const Footer = () => {
    return (
        <>
            {/* Footer */}
            <footer className="bg-white py-16">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                        {/* Logo Section */}
                        <div className="flex justify-center md:justify-start">
                            <div className="text-center">
                                <img
                                    src={Logo}
                                    alt="WeHope Logo"
                                    className="h-60 w-auto mx-auto mb-4"
                                />
                            </div>
                        </div>

                        {/* Contact Information & Quick Links Container */}
                        <div className="md:col-span-2 bg-gray-100 p-8 rounded-lg">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Contact Information */}
                                <div>
                                    <h4 className="font-semibold text-lg mb-4 text-gray-800">Contact Information</h4>
                                    <div className="text-sm space-y-2 text-gray-600">
                                        <p>WeHope, TP HỒ Chí Minh</p>
                                        <p>Phone: +84937748231, +84912384773</p>
                                        <p>Email: WeHope.organization@fpt.net.vn</p>
                                        <p>Fax: 02518680375</p>
                                    </div>
                                </div>

                                {/* Quick Links */}
                                <div>
                                    <h4 className="font-semibold text-lg mb-4 text-gray-800">Quick Links</h4>
                                    <div className="text-sm space-y-2 text-gray-600">
                                        <Link to="/aboutus" className="block hover:text-gray-800 cursor-pointer">About Us</Link>
                                        <Link to="/courses" className="block hover:text-gray-800 cursor-pointer">What We Do</Link>
                                        <Link to="/contact" className="block hover:text-gray-800 cursor-pointer">Get Involved</Link>
                                        <Link to="/news" className="block hover:text-gray-800 cursor-pointer">News And Events</Link>
                                        <Link to="/contact" className="block hover:text-gray-800 cursor-pointer">Contact Us</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Copyright */}
            <div className="bg-red-500 text-white py-4">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-sm">
                        Copyright 2025. All Rights Reserved by Tung Tung Tung Sahur!
                    </p>
                </div>
            </div>
        </>
    );
};

export default Footer;