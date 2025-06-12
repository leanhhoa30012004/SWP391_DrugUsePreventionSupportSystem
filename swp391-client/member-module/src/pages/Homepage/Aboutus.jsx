import React from 'react';
import { FaShieldAlt, FaUsers, FaGraduationCap, FaHandHoldingHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
// Import ảnh
import About01 from '../../assets/About01.jpg';
import About02 from '../../assets/About02.jpg';
import About03 from '../../assets/About03.jpg';
import About04 from '../../assets/About04.jpg';
import About05 from '../../assets/About05.jpg';

const AboutUs = () => {
    const images = [
      {
        src: About01,
        alt: "Community Support Group",
        className: "col-span-2 row-span-2"
      },
      {
        src: About02,
        alt: "Educational Workshop",
        className: "col-span-1"
      },
      {
        src: About03,
        alt: "Professional Counseling",
        className: "col-span-1"
      },
      {
        src: About04,
        alt: "Youth Prevention Program",
        className: "col-span-1"
      },
      {
        src: About05,
        alt: "Family Support Session",
        className: "col-span-1"
      }
    ];
  
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image Gallery */}
            <div className="relative" data-aos="fade-right">
              <div className="grid grid-cols-2 gap-4 h-[600px]">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className={`relative overflow-hidden rounded-lg ${image.className}`}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0  bg-opacity-20 hover:bg-opacity-30 transition-opacity duration-300"></div>
                  </div>
                ))}
              </div>
              {/* Decorative Elements */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-red-500 rounded-full opacity-10"></div>
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-red-400 rounded-full opacity-10"></div>
            </div>

            {/* Content */}
            <div className="lg:pl-12" data-aos="fade-left">
              <h2 className="text-4xl font-bold text-gray-800 mb-6">
                Empowering Communities Through Prevention
              </h2>
              
              <div className="space-y-6 text-gray-600">
                <p className="text-lg">
                  We are a dedicated team of professionals committed to preventing drug abuse and promoting healthy lifestyles in our community.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-red-600 font-bold">01</span>
                    </div>
                    <div className="ml-4">
                      <h3 className="font-semibold text-gray-800">Expert Guidance</h3>
                      <p className="text-gray-600">Professional counselors and healthcare providers offering specialized support.</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-red-600 font-bold">02</span>
                    </div>
                    <div className="ml-4">
                      <h3 className="font-semibold text-gray-800">Community Focus</h3>
                      <p className="text-gray-600">Building strong support networks through education and awareness programs.</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-red-600 font-bold">03</span>
                    </div>
                    <div className="ml-4">
                      <h3 className="font-semibold text-gray-800">24/7 Support</h3>
                      <p className="text-gray-600">Round-the-clock assistance for those seeking help and guidance.</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <Link
                    to="/about"
                    className="inline-flex items-center bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-8 rounded-full transition-colors duration-300 group"
                  >
                    Learn More About Us
                    <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4 pt-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-500">10K+</div>
                    <p className="text-sm text-gray-600">People Helped</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-500">500+</div>
                    <p className="text-sm text-gray-600">Programs</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-500">50+</div>
                    <p className="text-sm text-gray-600">Experts</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };

export default AboutUs; 