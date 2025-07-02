import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, CheckCircle, AlertCircle, Phone, Mail, MapPin } from 'lucide-react';

const ConsultantBooking = () => {
  const [formData, setFormData] = useState({
    member_id: '',
    request_date: '',
    request_time: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);

  // Mock API calls - replace with your actual API endpoints
  const API_BASE = 'http://localhost:3000/api'; // Replace with your API base URL

  const checkAppointment = async (date, time) => {
    try {
      const response = await fetch(`${API_BASE}/check-appointment/${date}/${time}`);
      const isAvailable = await response.json();
      return isAvailable;
    } catch (error) {
      console.error('Check appointment error:', error);
      return false;
    }
  };

  const addRequestAppointment = async (data) => {
    try {
      const response = await fetch(`${API_BASE}/add-request-appointment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Add appointment error:', error);
      throw error;
    }
  };

  // SweetAlert2 equivalent using browser alert (you can replace with actual SweetAlert2)
  const showAlert = (type, title, text) => {
    if (type === 'success') {
      alert(`✅ ${title}\n${text}`);
    } else if (type === 'error') {
      alert(`❌ ${title}\n${text}`);
    } else if (type === 'warning') {
      alert(`⚠️ ${title}\n${text}`);
    }
  };

  const validateForm = () => {
    if (!formData.member_id.trim()) {
      showAlert('error', 'Validation Error', 'Please enter your Member ID');
      return false;
    }
    if (!formData.request_date) {
      showAlert('error', 'Validation Error', 'Please select a date');
      return false;
    }
    if (!formData.request_time) {
      showAlert('error', 'Validation Error', 'Please select a time');
      return false;
    }

    const selectedDate = new Date(formData.request_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      showAlert('error', 'Invalid Date', 'Cannot book appointment in the past');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Check availability
      const isAvailable = await checkAppointment(formData.request_date, formData.request_time);
      
      if (!isAvailable) {
        showAlert('warning', 'Time Slot Unavailable', 'This time slot is fully booked. Please select another time.');
        setIsLoading(false);
        return;
      }

      // Add appointment request
      const result = await addRequestAppointment(formData);
      
      showAlert('success', 'Booking Successful!', 'Your appointment request has been submitted. You will receive a confirmation notification soon.');
      
      // Reset form
      setFormData({
        member_id: '',
        request_date: '',
        request_time: ''
      });

      // Refresh appointments list
      fetchAppointments();

    } catch (error) {
      showAlert('error', 'Booking Failed', 'Something went wrong. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAppointments = async () => {
    // Mock function to fetch user appointments
    // Replace with actual API call
    setAppointments([
      { id: 1, date: '2025-07-05', time: '10:00', status: 'pending' },
      { id: 2, date: '2025-07-08', time: '14:30', status: 'confirmed' }
    ]);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white">
      {/* Header */}
      <header className="bg-red-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white p-2 rounded-lg">
                <User className="h-8 w-8 text-red-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Consultant Booking</h1>
                <p className="text-red-100">Schedule your consultation appointment</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+84 123 456 789</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>support@consultant.com</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg border border-red-100 overflow-hidden">
              <div className="bg-red-600 text-white px-6 py-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Book New Appointment
                </h2>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Member ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Member ID *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.member_id}
                      onChange={(e) => setFormData({...formData, member_id: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                      placeholder="Enter your member ID"
                    />
                  </div>
                </div>

                {/* Date Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Date *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      value={formData.request_date}
                      onChange={(e) => setFormData({...formData, request_date: e.target.value})}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Time Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Time *
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setFormData({...formData, request_time: time})}
                        className={`p-3 text-sm font-medium rounded-lg border-2 transition-all ${
                          formData.request_time === time
                            ? 'bg-red-600 text-white border-red-600 shadow-md transform scale-105'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-red-300 hover:bg-red-50'
                        }`}
                      >
                        <Clock className="h-4 w-4 mx-auto mb-1" />
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all ${
                      isLoading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-red-600 hover:bg-red-700 hover:shadow-lg transform hover:scale-105'
                    }`}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Processing...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <CheckCircle className="mr-2 h-5 w-5" />
                        Book Appointment
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Booking Info */}
            <div className="bg-white rounded-xl shadow-lg border border-red-100 overflow-hidden">
              <div className="bg-red-50 px-6 py-4 border-b border-red-100">
                <h3 className="font-semibold text-gray-800">How It Works</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-red-100 p-2 rounded-full">
                    <span className="text-red-600 font-bold text-sm">1</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Fill in your member ID and select your preferred date and time</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-red-100 p-2 rounded-full">
                    <span className="text-red-600 font-bold text-sm">2</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">System will check availability and add your request to the queue</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-red-100 p-2 rounded-full">
                    <span className="text-red-600 font-bold text-sm">3</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">You'll receive confirmation and meeting details soon</p>
                  </div>
                </div>
              </div>
            </div>

            {/* My Appointments */}
            <div className="bg-white rounded-xl shadow-lg border border-red-100 overflow-hidden">
              <div className="bg-red-50 px-6 py-4 border-b border-red-100">
                <h3 className="font-semibold text-gray-800">My Appointments</h3>
              </div>
              <div className="p-6">
                {appointments.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4">No appointments yet</p>
                ) : (
                  <div className="space-y-3">
                    {appointments.map((apt) => (
                      <div key={apt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-sm text-gray-800">{apt.date}</p>
                          <p className="text-xs text-gray-600">{apt.time}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          apt.status === 'confirmed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {apt.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-red-600 text-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6">
                <h3 className="font-semibold mb-4">Need Help?</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4" />
                    <span>+84 123 456 789</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>support@consultant.com</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>Ho Chi Minh City, Vietnam</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultantBooking;