import React, { useState } from 'react';
import { 
  Heart, 
  Shield, 
  Users, 
  Target, 
  BookOpen, 
  Calendar, 
  UserCheck, 
  Award, 
  Star, 
  ArrowRight,
  CheckCircle,
  Globe,
  Lightbulb,
  HandHeart,
  GraduationCap,
  MessageCircle,
  BarChart3,
  Clock,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/footer';
import { Link } from 'react-router-dom';

const AboutUsPage = () => {
  const [activeTab, setActiveTab] = useState('mission');

  const features = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Online Training Courses",
      description: "Age-appropriate educational programs covering drug awareness, prevention skills, and refusal techniques for students, parents, and educators."
    },
    {
      icon: <UserCheck className="w-8 h-8" />,
      title: "Risk Assessment Surveys",
      description: "Professional screening tools like ASSIST and CRAFFT to evaluate substance use risk levels and provide personalized recommendations."
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Online Counseling Appointments",
      description: "Direct booking system to schedule consultations with qualified counselors and support specialists."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community Education Programs",
      description: "Comprehensive management of community outreach initiatives and educational campaigns with pre/post program assessments."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Counselor Management",
      description: "Complete profiles of certified counselors including qualifications, specializations, and availability schedules."
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Analytics & Reporting",
      description: "Comprehensive dashboard and reporting system to track user engagement, program effectiveness, and community impact."
    }
  ];

  const stats = [
    { number: "10,000+", label: "Community Members", icon: <Users className="w-6 h-6" /> },
    { number: "500+", label: "Training Courses", icon: <BookOpen className="w-6 h-6" /> },
    { number: "50+", label: "Certified Counselors", icon: <UserCheck className="w-6 h-6" /> },
    { number: "95%", label: "Success Rate", icon: <Award className="w-6 h-6" /> }
  ];

  const team = [
    {
      name: "Dr. Sarah Johnson",
      role: "Clinical Director",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face",
      specialization: "Addiction Medicine & Community Health"
    },
    {
      name: "Michael Chen",
      role: "Program Manager",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      specialization: "Community Outreach & Education"
    },
    {
      name: "Lisa Rodriguez",
      role: "Head Counselor",
      image: "https://images.unsplash.com/photo-1494790108755-2616b332c3e4?w=400&h=400&fit=crop&crop=face",
      specialization: "Youth Counseling & Family Therapy"
    },
    {
      name: "Dr. James Wilson",
      role: "Research Coordinator",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      specialization: "Behavioral Research & Data Analysis"
    }
  ];

  return (
    <>
    <Navbar/>
    
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
     {/* Hero Section */}
     <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://i.pinimg.com/736x/34/05/a3/3405a3290fea048bd1628c348f75f102.jpg" 
            alt="Community support" 
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/60 to-red-800/60"></div>
        </div>
        
        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-16 h-16 bg-white/10 rounded-full blur-sm animate-bounce"></div>
        <div className="absolute top-40 right-20 w-8 h-8 bg-white/20 rounded-full blur-sm animate-pulse"></div>
        <div className="absolute bottom-32 left-1/4 w-12 h-12 bg-white/15 rounded-full blur-sm animate-bounce delay-300"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-24">
          <div className="text-center">
            <div className="flex items-center justify-center mb-8">
              <div className="bg-white p-4 rounded-full shadow-lg mr-4">
                <Heart className="w-12 h-12 text-red-600" />
              </div>
              <div className="bg-white p-4 rounded-full shadow-lg mr-4">
                <Shield className="w-12 h-12 text-red-600" />
              </div>
              <div className="bg-white p-4 rounded-full shadow-lg">
                <Users className="w-12 h-12 text-red-600" />
              </div>
            </div>
            
            <h1 className="text-6xl font-bold text-white mb-6 drop-shadow-lg">
              About Our Mission
            </h1>
            <p className="text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed mb-8">
              Empowering communities through education, prevention, and support in the fight against substance abuse
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 text-white/80">
              <div className="flex items-center bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
                <Globe className="w-5 h-5 mr-2" />
                <span>Community-Driven</span>
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
                <HandHeart className="w-5 h-5 mr-2" />
                <span>Volunteer-Based</span>
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
                <Award className="w-5 h-5 mr-2" />
                <span>Evidence-Based</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission, Vision, Values Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-xl border border-red-100 overflow-hidden">
          <div className="flex flex-wrap border-b border-red-100">
            {[
              { id: 'mission', label: 'Our Mission', icon: <Target className="w-5 h-5" /> },
              { id: 'vision', label: 'Our Vision', icon: <Lightbulb className="w-5 h-5" /> },
              { id: 'values', label: 'Our Values', icon: <Heart className="w-5 h-5" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center px-6 py-4 font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-red-300 text-white'
                    : 'text-red-600 hover:bg-red-50'
                }`}
              >
                {tab.icon}
                <span className="ml-2">{tab.label}</span>
              </button>
            ))}
          </div>
          
          <div className="p-8">
            {activeTab === 'mission' && (
              <div className="text-center">
                <h3 className="text-3xl font-bold text-gray-800 mb-6">Our Mission</h3>
                <p className="text-lg text-gray-600 leading-relaxed max-w-4xl mx-auto">
                  To provide comprehensive, accessible, and evidence-based drug prevention resources to communities worldwide. 
                  We are committed to reducing substance abuse through education, early intervention, professional counseling, 
                  and community engagement. Our platform serves as a bridge connecting individuals at risk with the support 
                  and resources they need to make informed, healthy choices.
                </p>
              </div>
            )}
            
            {activeTab === 'vision' && (
              <div className="text-center">
                <h3 className="text-3xl font-bold text-gray-800 mb-6">Our Vision</h3>
                <p className="text-lg text-gray-600 leading-relaxed max-w-4xl mx-auto">
                  A world where every individual has access to the knowledge, tools, and support necessary to prevent 
                  substance abuse and live a healthy, fulfilling life. We envision communities empowered with resources 
                  that promote awareness, prevention, and recovery, creating a sustainable impact across generations.
                </p>
              </div>
            )}
            
            {activeTab === 'values' && (
              <div>
                <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">Our Core Values</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { title: "Compassion", desc: "We approach every individual with empathy and understanding" },
                    { title: "Integrity", desc: "We maintain the highest standards of honesty and transparency" },
                    { title: "Excellence", desc: "We strive for continuous improvement in all our services" },
                    { title: "Inclusivity", desc: "We welcome and support people from all backgrounds" },
                    { title: "Innovation", desc: "We embrace new technologies and methodologies" },
                    { title: "Collaboration", desc: "We work together with communities and partners" }
                  ].map((value, index) => (
                    <div key={index} className="bg-red-50 p-6 rounded-lg border border-red-100">
                      <h4 className="font-bold text-red-700 mb-2">{value.title}</h4>
                      <p className="text-gray-600 text-sm">{value.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Platform Features */}
      <div className="bg-gradient-to-r from-red-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Platform Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive tools and resources designed to support drug prevention and community education
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg border border-red-100 hover:shadow-xl transition-all duration-300 group">
                <div className="bg-red-600 text-white p-3 rounded-lg inline-block mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="py-16 bg-gradient-to-r from-red-500 to-red-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Our Impact</h2>
            <p className="text-xl text-white/90">Making a difference in communities worldwide</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center bg-white/10 backdrop-blur-sm p-8 rounded-xl">
                <div className="flex justify-center mb-4 text-white">
                  {stat.icon}
                </div>
                <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-white/90 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600">Dedicated professionals committed to making a difference</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg border border-red-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <div className="relative overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{member.name}</h3>
                  <p className="text-red-600 font-semibold mb-2">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.specialization}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            Join our community of volunteers, professionals, and advocates working together to prevent substance abuse and support recovery.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/survey">
                <button className="bg-white text-red-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300 flex items-center group">
                <span>Get Involved</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
            </Link>
            <Link to="/contact">
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-gray-300 transition-all duration-300 flex items-center group">
                <MessageCircle className="w-5 h-5 mr-2" />
                <span>Contact Us</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default AboutUsPage;