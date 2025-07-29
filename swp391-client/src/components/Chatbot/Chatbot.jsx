import React, { useState, useRef, useEffect } from 'react';
import { FaComments, FaTimes, FaPaperPlane, FaRobot, FaUser, FaGlobe } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './Chatbot.css';

const Chatbot = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [language, setLanguage] = useState('en');
  const messagesEndRef = useRef(null);

  const [conversationContext, setConversationContext] = useState({
    waitingForDate: false,
    waitingForTime: false,
    selectedDate: null,
    availableSlots: [],
    action: null
  });

  const fallbackResponses = {
    en: {
      greetings: [
        "Hello! I'm here to help you with drug prevention and support. How can I assist you today?",
        "Hi there! Welcome to our drug prevention support system. What would you like to know?",
        "Greetings! I'm your AI assistant for drug prevention education. How can I help?"
      ],
      drug_info: [
        "Drugs can have serious effects on your health, relationships, and future. It's important to stay informed and make healthy choices.",
        "Understanding the risks of drug use is crucial. Drugs can affect your brain, body, and mental health in harmful ways.",
        "Drug prevention starts with education. Knowing the facts helps you make informed decisions about your health and well-being."
      ],
      support: [
        "If you or someone you know is struggling with drug use, there are many resources and people who want to help. You're not alone.",
        "Seeking help is a sign of strength, not weakness. Professional counselors and support groups are available to assist you.",
        "Remember, recovery is possible and there are many success stories. Don't hesitate to reach out for support."
      ],
      prevention: [
        "Prevention strategies include building strong relationships, developing healthy coping skills, and staying connected with supportive communities.",
        "Setting clear boundaries, practicing stress management, and having open communication with family and friends are key prevention tools.",
        "Education, awareness, and early intervention are the best ways to prevent drug use and promote healthy lifestyles."
      ],
      default: [
        "That's an interesting question about drug prevention. Let me help you find the information you need.",
        "I'm here to support you with drug prevention education. Could you tell me more about what you'd like to know?",
        "Thank you for reaching out. I'm dedicated to helping with drug prevention and support topics."
      ]
    },
    vi: {
      greetings: [
        "Xin chào! Tôi ở đây để giúp bạn về phòng chống ma túy và hỗ trợ. Tôi có thể hỗ trợ bạn như thế nào hôm nay?",
        "Chào bạn! Chào mừng đến hệ thống hỗ trợ phòng chống ma túy. Bạn muốn biết gì?",
        "Xin chào! Tôi là trợ lý AI cho giáo dục phòng chống ma túy. Tôi có thể giúp gì cho bạn?"
      ],
      drug_info: [
        "Ma túy có thể gây ảnh hưởng nghiêm trọng đến sức khỏe, các mối quan hệ và tương lai của bạn. Việc được thông tin và đưa ra lựa chọn lành mạnh rất quan trọng.",
        "Hiểu biết về rủi ro của việc sử dụng ma túy là rất quan trọng. Ma túy có thể ảnh hưởng đến não, cơ thể và sức khỏe tâm thần theo những cách có hại.",
        "Phòng chống ma túy bắt đầu từ giáo dục. Biết được các sự thật giúp bạn đưa ra quyết định sáng suốt về sức khỏe và hạnh phúc của mình."
      ],
      support: [
        "Nếu bạn hoặc ai đó bạn biết đang gặp khó khăn với việc sử dụng ma túy, có nhiều nguồn lực và người muốn giúp đỡ. Bạn không đơn độc.",
        "Tìm kiếm sự giúp đỡ là dấu hiệu của sức mạnh, không phải yếu đuối. Các chuyên gia tư vấn và nhóm hỗ trợ có sẵn để hỗ trợ bạn.",
        "Hãy nhớ rằng, phục hồi là có thể và có nhiều câu chuyện thành công. Đừng ngần ngại tìm kiếm sự hỗ trợ."
      ],
      prevention: [
        "Các chiến lược phòng ngừa bao gồm xây dựng các mối quan hệ mạnh mẽ, phát triển kỹ năng đối phó lành mạnh và duy trì kết nối với cộng đồng hỗ trợ.",
        "Thiết lập ranh giới rõ ràng, thực hành quản lý căng thẳng và có giao tiếp cởi mở với gia đình và bạn bè là những công cụ phòng ngừa chính.",
        "Giáo dục, awareness và can thiệp sớm là những cách tốt nhất để ngăn chặn việc sử dụng ma túy và thúc đẩy lối sống lành mạnh."
      ],
      default: [
        "Đó là một câu hỏi thú vị về phòng chống ma túy. Hãy để tôi giúp bạn tìm thông tin bạn cần.",
        "Tôi ở đây để hỗ trợ bạn với giáo dục phòng chống ma túy. Bạn có thể cho tôi biết thêm về những gì bạn muốn biết không?",
        "Cảm ơn bạn đã liên hệ. Tôi tận tâm giúp đỡ với các chủ đề phòng chống ma túy và hỗ trợ."
      ]
    }
  };

  // Welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMsg = {
        id: 1,
        text: fallbackResponses[language].greetings[Math.floor(Math.random() * fallbackResponses[language].greetings.length)],
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages([welcomeMsg]);
    }
  }, [isOpen, language]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getAIResponse = async (userMessage) => {
    const lowerMsg = userMessage.toLowerCase();

    // 1. Course-related queries
    if (lowerMsg.includes('course') || lowerMsg.includes('khóa học') || lowerMsg.includes('courses')) {
      try {
        const courses = await fetchCourses();
        if (courses.length > 0) {
          const courseList = courses.slice(0, 3).map(course => {
            const courseName = course.course_name || course.title;
            const ageGroup = course.age_group || 'All ages';
            return `• ${courseName} (${ageGroup})`;
          }).join('\n');

          const coursesUrl = `${window.location.origin}/courses`;

          return language === 'en'
            ? `Here are some available courses:\n\n${courseList}\n\n🔗 View all courses: ${coursesUrl}\n\nVisit our Courses page to explore details and enroll.`
            : `Đây là một số khóa học có sẵn:\n\n${courseList}\n\n🔗 Xem tất cả khóa học: ${coursesUrl}\n\nTruy cập trang Khóa học để khám phá chi tiết và đăng ký.`;
        }
      } catch (error) {
        const coursesUrl = `${window.location.origin}/courses`;
        return language === 'en'
          ? `I can help you find courses about drug prevention.\n\n🔗 Visit our Courses page: ${coursesUrl}`
          : `Tôi có thể giúp bạn tìm khóa học về phòng chống ma túy.\n\n🔗 Truy cập trang Khóa học: ${coursesUrl}`;
      }
    }

    // 2. Appointment booking
    if (lowerMsg.includes('appointment') || lowerMsg.includes('book') || lowerMsg.includes('đặt lịch') || lowerMsg.includes('tư vấn') || lowerMsg.includes('consultation')) {
      console.log('User wants to book an appointment'); // Debug log
      // Nếu đang đợi user nhập ngày
      console.log('Already waiting for date input:', conversationContext.waitingForDate); // Debug log
      if (conversationContext.waitingForDate) {
        console.log('Processing date input:', userMessage); // Debug log

        const dateMatch = userMessage.match(
          /(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})|(\d{2,4})[\/\-\.](\d{1,2})[\/\-\.](\d{1,2})/
        );
        const todayMatch = lowerMsg.includes('today') || lowerMsg.includes('hôm nay');
        const tomorrowMatch = lowerMsg.includes('tomorrow') || lowerMsg.includes('ngày mai');

        let selectedDate = null;

        if (todayMatch) {
          const today = new Date();
          const year = today.getFullYear();
          const month = String(today.getMonth() + 1).padStart(2, '0');
          const day = String(today.getDate()).padStart(2, '0');
          selectedDate = `${year}-${month}-${day}`;
          console.log('✅ Today formatted:', selectedDate);
        } else if (tomorrowMatch) {
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          const year = tomorrow.getFullYear();
          const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
          const day = String(tomorrow.getDate()).padStart(2, '0');
          selectedDate = `${year}-${month}-${day}`;
          console.log('✅ Tomorrow formatted:', selectedDate);
        } else if (dateMatch) {
          // Parse date từ input với validation tốt hơn
          const [full, d1, m1, y1, y2, m2, d2] = dateMatch;
          const day = String(d1 || d2).padStart(2, '0');
          const month = String(m1 || m2).padStart(2, '0');
          const year = y1 || y2;

          if (year < 2024 || year > 2030) {
            return language === 'en'
              ? "❌ Please provide a valid year (2024-2030)."
              : "❌ Vui lòng cung cấp năm hợp lệ (2024-2030).";
          }

          selectedDate = `${year}-${month}-${day}`;
          console.log('✅ Custom date formatted:', selectedDate);
        }

        if (!selectedDate || selectedDate.includes('undefined') || selectedDate.includes('NaN')) {
          console.log('❌ Invalid date format:', selectedDate);
          return language === 'en'
            ? "❌ Invalid date format. Please try again with format DD/MM/YYYY or say 'today'/'tomorrow'."
            : "❌ Định dạng ngày không hợp lệ. Vui lòng thử lại với định dạng DD/MM/YYYY hoặc nói 'hôm nay'/'ngày mai'.";
        }

        if (selectedDate) {
          try {
            const userData = localStorage.getItem('user');
            console.log('Raw user data from localStorage:', userData);

            if (!userData) {
              console.log('❌ No user data in localStorage');
              setConversationContext({
                waitingForDate: false,
                waitingForTime: false,
                selectedDate: null,
                availableSlots: [],
                action: null
              });

              return language === 'en'
                ? "❌ Please log in first to check appointment availability."
                : "❌ Vui lòng đăng nhập trước để kiểm tra lịch hẹn.";
            }

            const user = JSON.parse(userData);
            console.log('Parsed user object:', user);

            const memberId = user.user_id || user.id || user.userId || user.member_id;
            console.log('Found member ID:', memberId);

            if (!memberId) {
              console.log('❌ No member ID found in user object');
              setConversationContext({
                waitingForDate: false,
                waitingForTime: false,
                selectedDate: null,
                availableSlots: [],
                action: null
              });

              return language === 'en'
                ? "❌ User ID not found. Please log in again."
                : "❌ Không tìm thấy ID người dùng. Vui lòng đăng nhập lại.";
            }

            console.log('✅ Using member ID:', memberId, 'for date:', selectedDate);

            const availableSlots = await checkAvailableSlots(memberId, selectedDate);

            console.log('Available slots found:', availableSlots);

            if (availableSlots.length > 0) {
              setConversationContext({
                waitingForDate: false,
                waitingForTime: true,
                selectedDate: selectedDate,
                availableSlots: availableSlots,
                action: 'booking_time'
              });

              const slotsList = availableSlots.map(slot => `• ${slot}`).join('\n');

              return language === 'en'
                ? `Available time slots for ${selectedDate}:\n\n${slotsList}\n\nPlease choose your preferred time slot.`
                : `Các khung giờ trống cho ngày ${selectedDate}:\n\n${slotsList}\n\nVui lòng chọn khung giờ bạn muốn.`;
            } else {
              setConversationContext({
                waitingForDate: false,
                waitingForTime: false,
                selectedDate: null,
                availableSlots: [],
                action: null
              });

              return language === 'en'
                ? `No available slots for ${selectedDate}. Please try another date or visit our Consultation page.`
                : `Không có khung giờ trống cho ngày ${selectedDate}. Vui lòng thử ngày khác hoặc truy cập trang Tư vấn.`;
            }
          } catch (error) {
            console.error('Error checking availability:', error);
            setConversationContext({
              waitingForDate: false,
              waitingForTime: false,
              selectedDate: null,
              availableSlots: [],
              action: null
            });

            return language === 'en'
              ? "Sorry, I couldn't check availability right now. Please visit our Consultation page."
              : "Xin lỗi, tôi không thể kiểm tra lịch trống ngay bây giờ. Vui lòng truy cập trang Tư vấn.";
          }
        } else {
          return language === 'en'
            ? "Please provide a valid date (e.g., 25/12/2024, today, tomorrow)."
            : "Vui lòng cung cấp ngày hợp lệ (ví dụ: 25/12/2024, hôm nay, ngày mai).";
        }
      }

      if (conversationContext.waitingForTime) {
        const timeInput = userMessage.trim();
        console.log('Processing time input:', timeInput);
        console.log('Available slots:', conversationContext.availableSlots);

        const matchedSlot = conversationContext.availableSlots.find(slot =>
          timeInput.includes(slot) || slot.includes(timeInput)
        );

        if (matchedSlot) {
          try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const memberId = user.user_id || user.id;

            console.log('Booking appointment:', {
              memberId,
              date: conversationContext.selectedDate,
              time: matchedSlot
            });

            const bookingResult = await bookSpecificAppointment(
              memberId,
              conversationContext.selectedDate,
              matchedSlot
            );

            setConversationContext({
              waitingForDate: false,
              waitingForTime: false,
              selectedDate: null,
              availableSlots: [],
              action: null
            });

            if (bookingResult.success) {
              return language === 'en'
                ? `✅ Appointment booked successfully!\n\nDate: ${conversationContext.selectedDate}\nTime: ${matchedSlot}\n\nYou'll receive a confirmation email shortly.`
                : `✅ Đặt lịch hẹn thành công!\n\nNgày: ${conversationContext.selectedDate}\nGiờ: ${matchedSlot}\n\nBạn sẽ nhận được email xác nhận sớm.`;
            } else {
              return language === 'en'
                ? `❌ Booking failed. The time slot might be taken. Please try again.`
                : `❌ Đặt lịch thất bại. Khung giờ có thể đã được đặt. Vui lòng thử lại.`;
            }
          } catch (error) {
            console.error('Booking error:', error);
            setConversationContext({
              waitingForDate: false,
              waitingForTime: false,
              selectedDate: null,
              availableSlots: [],
              action: null
            });

            return language === 'en'
              ? "Booking failed. Please visit our Consultation page to book directly."
              : "Đặt lịch thất bại. Vui lòng truy cập trang Tư vấn để đặt trực tiếp.";
          }
        } else {
          const slotsList = conversationContext.availableSlots.map(slot => `• ${slot}`).join('\n');
          return language === 'en'
            ? `Please choose from these available time slots:\n\n${slotsList}`
            : `Vui lòng chọn từ các khung giờ trống sau:\n\n${slotsList}`;
        }
      }

      setConversationContext({
        waitingForDate: true,
        action: 'booking_date',
        waitingForTime: false,
        selectedDate: null,
        availableSlots: []
      });

      return language === 'en'
        ? "I can help you book a consultation appointment.\n\nPlease tell me your preferred date (e.g., 25/12/2024, today, tomorrow)."
        : "Tôi có thể giúp bạn đặt lịch tư vấn.\n\nVui lòng cho tôi biết ngày bạn muốn (ví dụ: 25/12/2024, hôm nay, ngày mai).";
    }

    // 3. Specific course info
    if (lowerMsg.includes('teenager') || lowerMsg.includes('young adult') || lowerMsg.includes('adult') ||
      lowerMsg.includes('thanh thiếu niên') || lowerMsg.includes('người trẻ') || lowerMsg.includes('người lớn')) {
      try {
        const courses = await fetchCourses();
        const ageGroup = lowerMsg.includes('teenager') || lowerMsg.includes('thanh thiếu niên') ? 'Teenagers' :
          lowerMsg.includes('young') || lowerMsg.includes('người trẻ') ? 'Young Adult' : 'Adult';

        const filteredCourses = courses.filter(course => course.age_group === ageGroup);

        if (filteredCourses.length > 0) {
          const courseList = filteredCourses.slice(0, 2).map(course => {
            const courseId = course.course_id || course.id;
            const courseName = course.course_name || course.title;
            const courseUrl = `${window.location.origin}/courses/${courseId}`;

            return `• ${courseName}\n  🔗 ${courseUrl}`;
          }).join('\n\n');

          return language === 'en'
            ? `Courses for ${ageGroup}:\n\n${courseList}\n\nThese courses are specifically designed for your age group with relevant content and examples.`
            : `Khóa học cho ${ageGroup === 'Teenagers' ? 'thanh thiếu niên' : ageGroup === 'Young Adult' ? 'người trẻ' : 'người lớn'}:\n\n${courseList}\n\nCác khóa học này được thiết kế đặc biệt cho độ tuổi của bạn với nội dung và ví dụ phù hợp.`;
        }
      } catch (error) {
        // Fallback to default response
      }
    }

    // 4. Help with navigation
    if (lowerMsg.includes('how to') || lowerMsg.includes('navigate') || lowerMsg.includes('làm thế nào')) {
      return language === 'en'
        ? "I can help you navigate our system:\n• Take surveys to assess your knowledge\n• Browse educational courses\n• Book consultation appointments\n• Read latest news and blogs\n\nWhat would you like to do first?"
        : "Tôi có thể giúp bạn sử dụng hệ thống:\n• Làm khảo sát để đánh giá kiến thức\n• Xem các khóa học giáo dục\n• Đặt lịch tư vấn\n• Đọc tin tức và blog mới nhất\n\nBạn muốn làm gì trước?";
    }

    // 5. Continue with existing project features...
    if (lowerMsg.includes('survey') || lowerMsg.includes('khảo sát')) {
      return language === 'en'
        ? "Our survey feature helps you assess your knowledge and risk factors related to drug use. It's completely anonymous and provides personalized recommendations. Would you like me to guide you to the survey page?"
        : "Chức năng khảo sát giúp bạn đánh giá kiến thức và yếu tố nguy cơ liên quan đến ma túy. Hoàn toàn ẩn danh và cung cấp khuyến nghị cá nhân hóa. Bạn có muốn tôi hướng dẫn đến trang khảo sát không?";
    }

    // 6. Continue with Gemini AI for general drug prevention questions...
    try {
      const systemPrompt = language === 'en'
        ? `You are WeHope AI Assistant with access to real-time system data. You can help users with:

SYSTEM CAPABILITIES:
- Course information: We have courses for different age groups (Teenagers, Young Adults, Adults)
- Appointment booking: Users can schedule consultations with experts
- Survey system: Anonymous assessments with personalized feedback
- Educational resources: Latest news, blogs, and prevention materials

REAL-TIME FEATURES:
- Check available consultation time slots
- Browse course catalog by age group
- Access survey results and recommendations
- Get latest updates on drug prevention

Answer questions about drug prevention, our system features, and guide users to relevant pages. Keep responses helpful and under 150 words.

USER QUESTION: `
        : `Bạn là WeHope AI Assistant có quyền truy cập dữ liệu hệ thống thời gian thực. Bạn có thể giúp người dùng:

KHẢ NĂNG HỆ THỐNG:
- Thông tin khóa học: Chúng tôi có khóa học cho các nhóm tuổi khác nhau (Thanh thiếu niên, Người trẻ, Người lớn)
- Đặt lịch hẹn: Người dùng có thể đặt lịch tư vấn với chuyên gia
- Hệ thống khảo sát: Đánh giá ẩn danh với phản hồi cá nhân hóa
- Tài nguyên giáo dục: Tin tức, blog và tài liệu phòng ngừa mới nhất

TÍNH NĂNG THỜI GIAN THỰC:
- Kiểm tra khung giờ tư vấn có sẵn
- Xem danh mục khóa học theo nhóm tuổi
- Truy cập kết quả khảo sát và khuyến nghị
- Nhận cập nhật mới nhất về phòng chống ma túy

Trả lời câu hỏi về phòng chống ma túy, tính năng hệ thống và hướng dẫn người dùng đến trang phù hợp. Giữ câu trả lời hữu ích và dưới 150 từ.

CÂU HỎI NGƯỜI DÙNG: `;

      // Continue with Gemini API call...
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt + userMessage }] }],
          generationConfig: {
            maxOutputTokens: 150,
            temperature: 0.7,
            topP: 0.8,
            topK: 40
          },
          safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" }
          ]
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
          return data.candidates[0].content.parts[0].text.trim();
        }
      }
    } catch (error) {
      console.log('Gemini AI Error:', error.message);
    }

    // Fallback responses...
    const responses = fallbackResponses[language];
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('xin chào')) {
      return responses.greetings[Math.floor(Math.random() * responses.greetings.length)];
    }

    return responses.default[Math.floor(Math.random() * responses.default.length)];
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const aiResponseText = await getAIResponse(inputMessage);

      const aiResponse = {
        id: messages.length + 2,
        text: aiResponseText,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error getting AI response:', error);

      // Fallback response nếu có lỗi
      const fallbackText = language === 'en'
        ? "I'm having trouble connecting to my AI service right now. Please try again in a moment, or feel free to ask me about drug prevention topics."
        : "Tôi đang gặp khó khăn kết nối với dịch vụ AI ngay bây giờ. Vui lòng thử lại sau, hoặc hỏi tôi về các chủ đề phòng chống ma túy.";

      const fallbackResponse = {
        id: messages.length + 2,
        text: fallbackText,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, fallbackResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'vi' : 'en');
    setMessages([]); // Clear messages when changing language
  };

  const handleQuickAction = (action) => {
    const actionMessages = {
      courses: language === 'en' ? 'Show me available courses' : 'Hiển thị các khóa học có sẵn',
      appointment: language === 'en' ? 'I want to book a consultation' : 'Tôi muốn đặt lịch tư vấn',
      survey: language === 'en' ? 'Tell me about the survey' : 'Cho tôi biết về khảo sát'
    };

    setInputMessage(actionMessages[action]);
    handleSendMessage();
  };

  // API functions
  const fetchCourses = async () => {
    try {
      console.log('Fetching courses from:', `${import.meta.env.VITE_API_URL}/course/get-all-course`);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/course/get-all-course`);
      console.log('Response status:', response.status);

      const data = await response.json();
      console.log('Courses data:', data); // Debug log

      // Kiểm tra cấu trúc data
      if (data && data.courses) {
        console.log('Found courses:', data.courses.length);
        return data.courses;
      } else if (data && Array.isArray(data)) {
        console.log('Data is array:', data.length);
        return data;
      } else {
        console.log('Unexpected data structure:', data);
        return [];
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      return [];
    }
  };

  const fetchAvailableTimeSlots = async (date) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/consultation/checkAppointment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appointment_date: date })
      });
      const data = await response.json();
      return data.available_times || [];
    } catch (error) {
      console.error('Error fetching time slots:', error);
      return [];
    }
  };

  const bookAppointment = async (appointmentData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/consultation/addAppointment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(appointmentData)
      });
      return await response.json();
    } catch (error) {
      console.error('Error booking appointment:', error);
      return { success: false, message: 'Booking failed' };
    }
  };

  const checkAvailableSlots = async (memberId, date) => {
    try {
      console.log('=== CHECKING AVAILABLE SLOTS ===');
      console.log('Member ID:', memberId, '(type:', typeof memberId, ')');
      console.log('Date:', date, '(type:', typeof date, ')');
      console.log('Base API URL:', import.meta.env.VITE_API_URL);

      // SỬA: Kiểm tra input parameters
      if (!memberId || memberId === 'undefined' || memberId === undefined) {
        console.error('❌ Invalid member ID:', memberId);
        return [];
      }

      if (!date || date === 'undefined' || date === undefined || date.includes('undefined')) {
        console.error('❌ Invalid date:', date);
        return [];
      }

      const timeSlots = [
        '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
        '11:00', '11:30', '13:00', '13:30', '14:00', '14:30',
        '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
      ];

      const availableSlots = [];

      for (const time of timeSlots) {
        try {
          console.log(`\n--- Checking slot: ${time} ---`);
          const url = `${import.meta.env.VITE_API_URL}/consultation/check-appointment/${memberId}/${date}/${time}`;
          console.log('Full URL:', url);

          if (url.includes('undefined')) {
            console.error('❌ URL contains undefined:', url);
            continue;
          }

          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });

          console.log(`Response status for ${time}:`, response.status);
          console.log(`Response ok for ${time}:`, response.ok);

          if (!response.ok) {
            console.log(`❌ HTTP error for ${time}:`, response.status, response.statusText);
            continue;
          }

          const data = await response.json();
          console.log(`✅ Response data for ${time}:`, data);

          // Kiểm tra theo format: {status: 'success', booked: false}
          if (data.status === 'success' && data.booked === false) {
            availableSlots.push(time);
            console.log(`🟢 Slot ${time} is AVAILABLE`);
          } else {
            console.log(`🔴 Slot ${time} is NOT AVAILABLE - Status: ${data.status}, Booked: ${data.booked}`);
          }

        } catch (error) {
          console.error(`💥 Error checking slot ${time}:`, error);
        }
      }

      console.log('\n=== FINAL RESULT ===');
      console.log('Available slots found:', availableSlots);
      console.log('Total available slots:', availableSlots.length);
      console.log('====================\n');

      return availableSlots;

    } catch (error) {
      console.error('💥 Error in checkAvailableSlots:', error);
      return [];
    }
  };

  const bookSpecificAppointment = async (memberId, date, time) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/consultation/addAppointment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          member_id: memberId,
          appointment_date: date,
          appointment_time: time
        })
      });

      const data = await response.json();
      return { success: response.ok, data };
    } catch (error) {
      console.error('Error booking appointment:', error);
      return { success: false, message: 'Booking failed' };
    }
  };

  const MessageText = ({ text }) => {
    const renderTextWithLinks = (text) => {
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const parts = text.split(urlRegex);

      return parts.map((part, index) => {
        if (urlRegex.test(part)) {
          return (
            <a
              key={index}
              href={part}
              className="course-link"
              onClick={(e) => {
                e.preventDefault();

                if (part.includes(window.location.origin)) {
                  const url = new URL(part);
                  const path = url.pathname;
                  navigate(path); // Điều hướng đơn giản
                } else {
                  window.open(part, '_blank');
                }
              }}
            >
              {part}
            </a>
          );
        }
        return part;
      });
    };

    return (
      <div className="message-text">
        {renderTextWithLinks(text)}
      </div>
    );
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <div className="chatbot-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <FaTimes /> : <FaComments />}
      </div>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="chatbot-container">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-left">
              <div className="chatbot-avatar">
                <FaRobot />
              </div>
              <div className="chatbot-info">
                <h3>WeHope AI Assistant</h3>
                <span className="chatbot-status">Online</span>
              </div>
            </div>
            <div className="chatbot-header-right">
              <button
                className="language-toggle"
                onClick={toggleLanguage}
                title={language === 'en' ? 'Switch to Vietnamese' : 'Chuyển sang tiếng Anh'}
              >
                <FaGlobe />
                <span>{language === 'en' ? 'VI' : 'EN'}</span>
              </button>
              <button
                className="close-button"
                onClick={() => setIsOpen(false)}
                title="Close"
              >
                <FaTimes />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="chatbot-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
              >
                <div className="message-avatar">
                  {message.sender === 'user' ? <FaUser /> : <FaRobot />}
                </div>
                <div className="message-content">
                  <MessageText text={message.text} />
                  <div className="message-time">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="message bot-message">
                <div className="message-avatar">
                  <FaRobot />
                </div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {messages.length <= 1 && (
            <div className="quick-actions">
              <h4>{language === 'en' ? 'Quick Actions:' : 'Hành động nhanh:'}</h4>
              <div className="action-buttons">
                <button onClick={() => handleQuickAction('courses')}>
                  {language === 'en' ? '📚 View Courses' : '📚 Xem Khóa học'}
                </button>
                <button onClick={() => handleQuickAction('appointment')}>
                  {language === 'en' ? '📅 Book Consultation' : '📅 Đặt lịch tư vấn'}
                </button>
                <button onClick={() => handleQuickAction('survey')}>
                  {language === 'en' ? '📋 Take Survey' : '📋 Làm khảo sát'}
                </button>
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="chatbot-input">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={language === 'en' ? "Type your message..." : "Nhập tin nhắn..."}
              disabled={isTyping}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="send-button"
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;