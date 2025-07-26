import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, CheckCircle, Phone, Mail, MapPin, X } from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';
import Swal from 'sweetalert2';
import Footer from '../../components/Footer/footer';

const ConsultantBooking = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    appointment_date: '',
    appointment_time: ''
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
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
    '14:00', '15:00', '16:00'
  ];

  const checkAllTimeSlotAvailability = async (date) => {
    if (!date) {
      setTimeSlotAvailability({});
      return;
    }

    setIsCheckingAvailability(true);
    const availability = {};

    try {
      // Lấy member_id từ localStorage
      const user = JSON.parse(localStorage.getItem('user'));
      const memberId = user ? user.user_id : null;

      if (!memberId) {
        Swal.fire({ icon: 'error', title: 'User ID not found', text: 'Vui lòng đăng nhập lại.' });
        setIsCheckingAvailability(false);
        return;
      }

      const availabilityPromises = timeSlots.map(async (time) => {
        try {
          const response = await fetch(`${API_BASE}/check-appointment/${memberId}/${date}/${time}`);
          if (!response.ok) {
            return { time, status: false, booked: false };
          }
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const result = await response.json();
            return {
              time,
              status: result.status,
              booked: result.booked
            };
          } else {
            return { time, status: false, booked: false };
          }
        } catch (error) {
          return { time, status: false, booked: false };
        }
      });

      const results = await Promise.all(availabilityPromises);
      results.forEach(({ time, status, booked }) => {
        availability[time] = { status, booked };
      });
      setTimeSlotAvailability(availability);
    } catch (error) {
      timeSlots.forEach(time => {
        availability[time] = { status: false, booked: false };
      });
      setTimeSlotAvailability(availability);
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  const isPastTimeSlot = (dateStr, timeStr) => {
    if (!dateStr || !timeStr) return false;
    const today = new Date();
    const selectedDate = new Date(dateStr);
    // Nếu là ngày hôm nay thì so sánh giờ phút
    if (
      selectedDate.getFullYear() === today.getFullYear() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getDate() === today.getDate()
    ) {
      const [hour, minute] = timeStr.split(":").map(Number);
      const slotDate = new Date(dateStr);
      slotDate.setHours(hour, minute, 0, 0);
      // So sánh với local time hiện tại
      return slotDate <= today;
    }
    // Nếu là ngày trong quá khứ thì cũng làm mờ
    if (selectedDate < today.setHours(0,0,0,0)) return true;
    return false;
  };

  // Fetch user info and auto-fill form
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch("http://localhost:3000/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.user) {
            // setUserInfo(data.user); // This line was removed
            // Auto-fill form with user info
            setFormData(prev => ({
              ...prev,
              name: data.user.fullname || '',
              email: data.user.email || ''
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    if (formData.appointment_date) {
      const normalizedDate = new Date(formData.appointment_date)
        .toISOString()
        .split("T")[0];
      checkAllTimeSlotAvailability(normalizedDate);
    }
  }, [formData.appointment_date]);

  useEffect(() => {
    if (!formData.appointment_date) return;

    const interval = setInterval(() => {
      checkAllTimeSlotAvailability(formData.appointment_date);
    }, 30000);

    return () => clearInterval(interval);
  }, [formData.appointment_date]);

  const addRequestAppointment = async (data) => {
    try {
      console.log("Data applied: ", data)
      console.log("Member: ", JSON.parse(localStorage.getItem('user')).user_id)
      const response = await fetch(`${API_BASE}/add-appointment`, {
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
      Swal.fire({ icon: 'error', title: 'Validation Error', text: 'Please enter your name' });
      return false;
    }
    if (!formData.email.trim()) {
      Swal.fire({ icon: 'error', title: 'Validation Error', text: 'Please enter your email' });
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Swal.fire({ icon: 'error', title: 'Invalid Email', text: 'Please enter a valid email address' });
      return false;
    }
    if (!formData.appointment_date) {
      Swal.fire({ icon: 'error', title: 'Date Required', text: 'Please select a date' });
      return false;
    }
    if (!formData.appointment_time) {
      Swal.fire({ icon: 'error', title: 'Time Required', text: 'Please select a time' });
      return false;
    }
    // Check if selected date is in the past
  const selectedDate = new Date(formData.appointment_date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (selectedDate < today) {
    Swal.fire({ 
      icon: 'error', 
      title: 'Invalid Date', 
      text: 'Cannot book appointment in the past' 
    });
    return false;
  }

  // NEW: Check if selected time has already passed (for today's appointments)
  const now = new Date();
  const selectedDateTime = new Date(formData.appointment_date + 'T' + formData.appointment_time + ':00');
  
  if (selectedDateTime <= now) {
    const currentTime = now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: false 
    });
    
    Swal.fire({ 
      icon: 'warning', 
      title: 'Time Has Passed', 
      text: `Cannot book appointment for ${formData.appointment_time} as it's already ${currentTime}. Please select a future time slot.`,
      confirmButtonColor: '#dc2626'
    });
    return false;
  }

  // Check availability status
  const timeSlotData = timeSlotAvailability[formData.appointment_time];
  if (timeSlotData) {
    if (timeSlotData.status === false && timeSlotData.booked === false) {
      Swal.fire({ 
        icon: 'warning', 
        title: 'Time Slot Unavailable', 
        text: 'This time slot is fully booked. Please select another time.' 
      });
      return false;
    }
    if (timeSlotData.status === false && timeSlotData.booked === true) {
      Swal.fire({ 
        icon: 'info', 
        title: 'Already Booked', 
        text: 'You have already booked this time slot.' 
      });
      return false;
    }
  }
  
  return true;
};
  const handleSubmit = async () => {
    if (!validateForm()) return;

    // Show confirmation dialog
    const isConfirmed = await showConfirmDialog(
      'Confirm Your Appointment',
      `Are you sure you want to book an appointment for ${formData.appointment_date} at ${formData.appointment_time}?`,
      'Yes, book it!'
    );

    if (!isConfirmed) return;

    setIsLoading(true);
    showLoadingAlert('Booking Your Appointment', 'Please wait while we process your booking request...');

    try {
      const appointmentData = {
        member_id: JSON.parse(localStorage.getItem('user')).user_id,
        appointment_date: formData.appointment_date,
        appointment_time: formData.appointment_time
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
              <p class="mb-2">📅 <strong>Date:</strong> ${new Date(formData.appointment_date).toLocaleDateString()}</p>
              <p class="mb-2">🕐 <strong>Time:</strong> ${formData.appointment_time}</p>
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

        // // Reset form
        // setFormData({
        //   name: '',
        //   email: '',
        //   appointment_date: '',
        //   appointment_time: ''
        // });
        setTimeSlotAvailability({});

        if (formData.appointment_date) {
          setTimeout(() => {
            checkAllTimeSlotAvailability(formData.appointment_date);
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
    const { status, booked } = timeSlotAvailability[time];
    if (status === true && booked === false) return 'available';
    if (status === false && booked === true) return 'booked';
    if (status === false && booked === false) return 'unavailable';
    return 'unknown';
  };

  // Update getTimeSlotClassName to accept isPast param
  const getTimeSlotClassName = (time, isPast = false) => {
    const status = getTimeSlotStatus(time);
    const isSelected = formData.appointment_time === time;
    if (isPast) {
      return 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-60';
    }
    if (status === 'checking') {
      return 'bg-gray-100 text-gray-400 border-gray-200 cursor-wait animate-pulse';
    }
    if (status === 'unavailable') {
      return 'bg-red-100 text-red-400 border-red-200 cursor-not-allowed opacity-60';
    }
    if (status === 'booked') {
      return 'bg-blue-100 text-blue-600 border-blue-200 cursor-default';
    }
    if (isSelected) {
      return 'bg-red-600 text-white border-red-600 shadow-md transform scale-105';
    }
    return 'bg-white text-gray-700 border-gray-200 hover:border-red-300 hover:bg-red-50 cursor-pointer';
  };

  return (
    <>
      <Navbar />
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
                          readOnly
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                          placeholder="Enter your full name"
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
                        readOnly
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                        value={formData.appointment_date}
                        onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value, appointment_time: '' })}
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
                        // Disable if: no date, unavailable, checking, booked, or slot is in the past (today)
                        const isPast = isPastTimeSlot(formData.appointment_date, time);
                        const isDisabled = !formData.appointment_date ||
                          status === 'unavailable' ||
                          status === 'checking' ||
                          status === 'booked' ||
                          isPast;
                        return (
                          <button
                            key={time}
                            type="button"
                            onClick={() => !isDisabled && setFormData({ ...formData, appointment_time: time })}
                            disabled={isDisabled}
                            className={`p-3 text-sm font-medium rounded-lg border-2 transition-all relative ${getTimeSlotClassName(time, isPast)}`}
                          >
                            <Clock className="h-4 w-4 mx-auto mb-1" />
                            {time}
                            {status === 'unavailable' && (
                              <div className="absolute top-1 right-1">
                                <X className="h-3 w-3 text-red-500" />
                              </div>
                            )}
                            {status === 'booked' && (
                              <div className="absolute top-1 right-1">
                                <CheckCircle className="h-3 w-3 text-blue-500" />
                              </div>
                            )}
                            {status === 'available' && formData.appointment_time !== time && (
                              <div className="absolute top-1 right-1">
                                <CheckCircle className="h-3 w-3 text-green-500" />
                              </div>
                            )}
                            {isPast && (
                              <div className="absolute inset-0 bg-gray-200 bg-opacity-60 rounded-lg pointer-events-none"></div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    {!formData.appointment_date && (
                      <p className="mt-2 text-sm text-gray-500">Please select a date first</p>
                    )}
                    {formData.appointment_date && Object.keys(timeSlotAvailability).length > 0 && (
                      <div className="mt-3 flex items-center space-x-4 text-xs">
                        <div className="flex items-center space-x-1">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-gray-600">Available</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CheckCircle className="h-4 w-4 text-blue-500" />
                          <span className="text-gray-600">Your booking</span>
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
                      className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all ${isLoading
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
              {formData.appointment_date && (
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
                      Real-time availability for {new Date(formData.appointment_date).toLocaleDateString()}
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {timeSlots.map((time) => {
                        const status = getTimeSlotStatus(time);
                        return (
                          <div key={time} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span>{time}</span>
                            <span className={`px-2 py-1 rounded-full font-medium ${status === 'available' ? 'bg-green-100 text-green-800' :
                              status === 'unavailable' ? 'bg-red-100 text-red-800' :
                                status === 'booked' ? 'bg-blue-100 text-blue-800' :
                                  'bg-gray-100 text-gray-800'
                              }`}>
                              {status === 'checking' ? '...' :
                                status === 'available' ? 'Open' :
                                  status === 'booked' ? 'Booked' : 'Full'}
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
      <Footer />
    </>
  );
};

export default ConsultantBooking;