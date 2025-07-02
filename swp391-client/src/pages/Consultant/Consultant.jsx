import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, CheckCircle, Phone, Mail, MapPin, X } from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';
import Swal from 'sweetalert2';
import Footer from '../../components/Footer/footer';

const ConsultantBooking = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    request_date: '',
    request_time: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [timeSlotAvailability, setTimeSlotAvailability] = useState({});
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);

  const API_BASE = 'http://localhost:3000/api/consultation';

  // Custom SweetAlert configurations
  const showAlert = (type, title, text) => {
    const alertConfigs = {
      success: {
        icon: 'success',
        title: title,
        text: text,
        confirmButtonColor: '#dc2626',
        showConfirmButton: true,
        timer: 5000,
        timerProgressBar: true,
        showClass: {
          popup: 'animate__animated animate__fadeInUp animate__faster'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutDown animate__faster'
        }
      },
      error: {
        icon: 'error',
        title: title,
        text: text,
        confirmButtonColor: '#dc2626',
        showConfirmButton: true,
        showClass: {
          popup: 'animate__animated animate__shakeX animate__faster'
        }
      },
      warning: {
        icon: 'warning',
        title: title,
        text: text,
        confirmButtonColor: '#dc2626',
        showConfirmButton: true
      },
      info: {
        icon: 'info',
        title: title,
        text: text,
        confirmButtonColor: '#dc2626',
        showConfirmButton: true
      }
    };

    Swal.fire(alertConfigs[type]);
  };

  // Loading alert for async operations
  const showLoadingAlert = (title = 'Processing...', text = 'Please wait while we process your request.') => {
    Swal.fire({
      title: title,
      text: text,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  };

  // Confirmation dialog
  const showConfirmDialog = async (title, text, confirmText = 'Yes, book it!') => {
    const result = await Swal.fire({
      title: title,
      text: text,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: confirmText,
      cancelButtonText: 'Cancel',
      showClass: {
        popup: 'animate__animated animate__pulse animate__faster'
      }
    });
    return result.isConfirmed;
  };

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00'
  ];

  const checkAllTimeSlotAvailability = async (date) => {
    if (!date) {
      setTimeSlotAvailability({});
      return;
    }

    setIsCheckingAvailability(true);
    const availability = {};

    try {
      const availabilityPromises = timeSlots.map(async (time) => {
        try {
          console.log('date', date, typeof date);
          console.log('time', time, typeof time);
          console.log(`${API_BASE}/check-appointment/${date}/${time}`);
          const response = await fetch(`${API_BASE}/check-appointment/${date}/${time}`);
          
          if (!response.ok) {
            console.warn(`⚠️ API returned status ${response.status} for ${date} ${time}`);
            return { time, isAvailable: false };
          }

          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const isAvailable = await response.json();
            return { time, isAvailable };
          } else {
            console.warn(`⚠️ Unexpected content-type for ${date} ${time}: ${contentType}`);
            return { time, isAvailable: false };
          }
        } catch (error) {
          console.error(`❌ Error checking availability for ${time}:`, error);
          return { time, isAvailable: false };
        }
      });

      const results = await Promise.all(availabilityPromises);
      
      results.forEach(({ time, isAvailable }) => {
        availability[time] = isAvailable;
      });

      setTimeSlotAvailability(availability);
    } catch (error) {
      console.error('Error checking time slot availability:', error);
      timeSlots.forEach(time => {
        availability[time] = false;
      });
      setTimeSlotAvailability(availability);
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  useEffect(() => {
    if (formData.request_date) {
      const normalizedDate = new Date(formData.request_date)
        .toISOString()
        .split("T")[0];
      checkAllTimeSlotAvailability(normalizedDate);
    }
  }, [formData.request_date]);

  useEffect(() => {
    if (!formData.request_date) return;

    const interval = setInterval(() => {
      checkAllTimeSlotAvailability(formData.request_date);
    }, 30000);

    return () => clearInterval(interval);
  }, [formData.request_date]);

  const addRequestAppointment = async (data) => {
    try {
      console.log("Data applied: ",data)
      console.log("Member: ", JSON.parse(localStorage.getItem('user')).user_id)
      const response = await fetch(`${API_BASE}/add-request-appointment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      const result = await response.text();
      return { success: true, message: result };
    } catch (error) {
      console.error('Add appointment error:', error);
      throw error;
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      showAlert('error', 'Validation Error', 'Please enter your name');
      return false;
    }

    if (!formData.email.trim()) {
      showAlert('error', 'Validation Error', 'Please enter your email');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showAlert('error', 'Invalid Email', 'Please enter a valid email address');
      return false;
    }

    if (!formData.phone.trim()) {
      showAlert('error', 'Validation Error', 'Please enter your phone number');
      return false;
    }

    if (!formData.request_date) {
      showAlert('error', 'Date Required', 'Please select a date');
      return false;
    }

    if (!formData.request_time) {
      showAlert('error', 'Time Required', 'Please select a time');
      return false;
    }

    const selectedDate = new Date(formData.request_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      showAlert('error', 'Invalid Date', 'Cannot book appointment in the past');
      return false;
    }

    if (timeSlotAvailability[formData.request_time] === false) {
      showAlert('warning', 'Time Slot Unavailable', 'This time slot is no longer available. Please select another time.');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    // Show confirmation dialog
    const isConfirmed = await showConfirmDialog(
      'Confirm Your Appointment',
      `Are you sure you want to book an appointment for ${formData.request_date} at ${formData.request_time}?`,
      'Yes, book it!'
    );

    if (!isConfirmed) return;

    setIsLoading(true);
    showLoadingAlert('Booking Your Appointment', 'Please wait while we process your booking request...');

    try {
      const appointmentData = {
        member_id: JSON.parse(localStorage.getItem('user')).user_id,
        name: formData.name,
        email: JSON.parse(localStorage.getItem('user')).email,
        phone: formData.phone,
        request_date: formData.request_date,
        request_time: formData.request_time
      };

      const result = await addRequestAppointment(appointmentData);
      console.log("Res: ", result)
      
      Swal.close(); // Close loading alert
      
      if (result.success) {
        // Success with custom HTML content
        await Swal.fire({
          icon: 'success',
          title: 'Booking Successful! 🎉',
          html: `
            <div class="text-left">
              <p class="mb-2"><strong>Your appointment has been requested successfully!</strong></p>
              <p class="mb-2">📅 <strong>Date:</strong> ${new Date(formData.request_date).toLocaleDateString()}</p>
              <p class="mb-2">🕐 <strong>Time:</strong> ${formData.request_time}</p>
              <p class="mb-2">📧 <strong>Email:</strong> ${formData.email}</p>
              <p class="text-sm text-gray-600 mt-4">You will receive a confirmation notification soon.</p>
            </div>
          `,
          confirmButtonColor: '#dc2626',
          confirmButtonText: 'Great!',
          showClass: {
            popup: 'animate__animated animate__bounceIn animate__faster'
          }
        });
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          request_date: '',
          request_time: ''
        });
        setTimeSlotAvailability({});

        if (formData.request_date) {
          setTimeout(() => {
            checkAllTimeSlotAvailability(formData.request_date);
          }, 1000);
        }
      } else {
        showAlert('error', 'Booking Failed', result.message || 'Something went wrong. Please try again later.');
      }
    } catch (error) {
      console.log(error);
      Swal.close(); // Close loading alert
      showAlert('error', 'Booking Failed', 'Something went wrong. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const getTimeSlotStatus = (time) => {
    if (isCheckingAvailability) return 'checking';
    if (timeSlotAvailability[time] === undefined) return 'unknown';
    return timeSlotAvailability[time] ? 'available' : 'unavailable';
  };

  const getTimeSlotClassName = (time) => {
    const status = getTimeSlotStatus(time);
    const isSelected = formData.request_time === time;

    if (status === 'checking') {
      return 'bg-gray-100 text-gray-400 border-gray-200 cursor-wait animate-pulse';
    }

    if (status === 'unavailable') {
      return 'bg-red-100 text-red-400 border-red-200 cursor-not-allowed opacity-60';
    }

    if (isSelected) {
      return 'bg-red-600 text-white border-red-600 shadow-md transform scale-105';
    }

    return 'bg-white text-gray-700 border-gray-200 hover:border-red-300 hover:bg-red-50 cursor-pointer';
  };

  // Show info about SweetAlert2 features
  const showInfoDemo = () => {
    Swal.fire({
      title: 'SweetAlert2 Features Demo',
      html: `
        <div class="text-left">
          <p class="mb-3">✨ <strong>Beautiful alerts with animations</strong></p>
          <p class="mb-3">🎯 <strong>Customizable themes and colors</strong></p>
          <p class="mb-3">⏱️ <strong>Auto-dismiss with progress bar</strong></p>
          <p class="mb-3">🔄 <strong>Loading states for async operations</strong></p>
          <p class="mb-3">❓ <strong>Confirmation dialogs</strong></p>
          <p class="mb-3">🎨 <strong>Rich HTML content support</strong></p>
        </div>
      `,
      icon: 'info',
      confirmButtonColor: '#dc2626',
      confirmButtonText: 'Awesome!',
      showClass: {
        popup: 'animate__animated animate__fadeInDown animate__faster'
      }
    });
  };

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <img 
          src="https://i.pinimg.com/736x/35/e6/b5/35e6b59201cbfb48cd3c244023185c56.jpg"
          alt="Professional consultation"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-opacity-50 flex items-center justify-center">
          <div className="text-center ">
            <h1 className="text-6xl text-white font-bold mb-4">Expert Consultation</h1>
            <p className="text-2xl text-white mb-6">Book your professional consultation appointment today</p>
            <div className="text-black bg-red-100 bg-opacity-80 backdrop-blur-sm rounded-lg p-4 inline-block">
              <div className="flex items-center justify-center space-x-6 text-sm">
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
        </div>
      </div>

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
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                      placeholder="Enter your email address"
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
                      onChange={(e) => setFormData({...formData, request_date: e.target.value, request_time: ''})}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Time Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Time *
                    {isCheckingAvailability && (
                      <span className="text-blue-500 text-xs ml-2">Checking availability...</span>
                    )}
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {timeSlots.map((time) => {
                      const status = getTimeSlotStatus(time);
                      const isDisabled = !formData.request_date || status === 'unavailable' || status === 'checking';
                      
                      return (
                        <button
                          key={time}
                          type="button"
                          onClick={() => !isDisabled && setFormData({...formData, request_time: time})}
                          disabled={isDisabled}
                          className={`p-3 text-sm font-medium rounded-lg border-2 transition-all relative ${getTimeSlotClassName(time)}`}
                        >
                          <Clock className="h-4 w-4 mx-auto mb-1" />
                          {time}
                          
                          {status === 'unavailable' && (
                            <div className="absolute top-1 right-1">
                              <X className="h-3 w-3 text-red-500" />
                            </div>
                          )}
                          {status === 'available' && formData.request_time !== time && (
                            <div className="absolute top-1 right-1">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {!formData.request_date && (
                    <p className="mt-2 text-sm text-gray-500">Please select a date first</p>
                  )}
                  {formData.request_date && Object.keys(timeSlotAvailability).length > 0 && (
                    <div className="mt-3 flex items-center space-x-4 text-xs">
                      <div className="flex items-center space-x-1">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-gray-600">Available</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <X className="h-4 w-4 text-red-500" />
                        <span className="text-gray-600">Fully booked</span>
                      </div>
                    </div>
                  )}
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
                        Book Appointment ✨
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Professional Image Card */}
            <div className="bg-white rounded-xl shadow-lg border border-red-100 overflow-hidden">
              <img 
                src="https://i.pinimg.com/736x/aa/5c/cf/aa5ccf94fbcb048f6bb14a0587b978ec.jpg"
                alt="Professional team"
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Professional Consultation Team</h3>
                <p className="text-sm text-gray-600">Our experienced consultants are ready to help you achieve your goals with personalized guidance and expert advice.</p>
              </div>
            </div>
            
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
                    <p className="text-sm text-gray-600">Fill in your contact information</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-red-100 p-2 rounded-full">
                    <span className="text-red-600 font-bold text-sm">2</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Select your preferred date and available time slot</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-red-100 p-2 rounded-full">
                    <span className="text-red-600 font-bold text-sm">3</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Submit request and receive confirmation details</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Real-time Availability Status */}
            {formData.request_date && (
              <div className="bg-white rounded-xl shadow-lg border border-red-100 overflow-hidden">
                <div className="bg-red-50 px-6 py-4 border-b border-red-100">
                  <h3 className="font-semibold text-gray-800">
                    Availability Status
                    {isCheckingAvailability && (
                      <div className="inline-block ml-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                      </div>
                    )}
                  </h3>
                </div>
                <div className="p-6">
                  <p className="text-sm text-gray-600 mb-3">
                    Real-time availability for {new Date(formData.request_date).toLocaleDateString()}
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {timeSlots.map((time) => {
                      const status = getTimeSlotStatus(time);
                      return (
                        <div key={time} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span>{time}</span>
                          <span className={`px-2 py-1 rounded-full font-medium ${
                            status === 'available' ? 'bg-green-100 text-green-800' :
                            status === 'unavailable' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {status === 'checking' ? '...' : status === 'available' ? 'Open' : 'Full'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    * Availability updates every 30 seconds
                  </p>
                </div>
              </div>
            )}

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
    <Footer/>
    </>
  );
};

export default ConsultantBooking;