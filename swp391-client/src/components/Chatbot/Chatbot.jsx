import React, { useState, useRef, useEffect } from 'react';

import './Chatbot.css';

// Icon Components
const ChatbotIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C6.48 2 2 6.48 2 12c0 2.85 1.2 5.41 3.11 7.24L3 23l3.76-2.11C8.59 22.8 10.24 23 12 23c5.52 0 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-2h2v2zm0-4h-2V9h2v4z"/>
  </svg>
);

const SendIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
  </svg>
);

const CloseIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
  </svg>
);

const RobotIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm7 19h-2v-2c0-2.8-2.2-5-5-5s-5 2.2-5 5v2H5v-2c0-3.9 3.1-7 7-7s7 3.1 7 7v2zM8 11h8v2H8v-2zm2-4h4v2h-4V7z"/>
  </svg>
);

const UserIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
  </svg>
);

const GlobeIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"/>
  </svg>
);

const ConversationalChatbot = () => {

import { FaComments, FaTimes, FaPaperPlane, FaRobot, FaUser, FaGlobe } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Thêm import
import './Chatbot.css';

const Chatbot = () => {
  const navigate = useNavigate(); // Thêm hook
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [language, setLanguage] = useState('vi');
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Welcome message when chatbot opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMsg = {
        id: 1,
        text: language === 'vi' 
          ? "Xin chào! Tôi là AI Assistant của WeHope - hệ thống hỗ trợ phòng chống ma túy. Tôi có thể giúp bạn tìm hiểu về các biện pháp phòng ngừa, tác hại của ma túy, hoặc hỗ trợ tư vấn. Bạn có câu hỏi gì muốn thảo luận không?"
          : "Hello! I'm WeHope's AI Assistant - a drug prevention support system. I can help you learn about prevention measures, drug-related harms, or provide consultation support. What would you like to discuss?",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages([welcomeMsg]);
    }
  }, [isOpen, language]);

  // Function to call Claude API for natural AI conversation
  const getAIResponse = async (userMessage, conversationHistory) => {
    try {
      const systemPrompt = language === 'vi' 
        ? `Bạn là một AI Assistant chuyên về lĩnh vực phòng chống ma túy, thuộc hệ thống WeHope - Drug Use Prevention Support System.


THÔNG TIN VỀ WEHOPE:
- Hệ thống hỗ trợ phòng chống sử dụng ma túy
- Cung cấp các tính năng: khảo sát đánh giá, tư vấn trực tuyến, khóa học giáo dục, tin tức cập nhật
- Mục tiêu: Giúp cộng đồng có kiến thức và kỹ năng phòng chống tệ nạn xã hội

VAI TRÒ CỦA BẠN:
- Là một AI assistant thông minh, có kiến thức chuyên sâu về phòng chống ma túy
- Cung cấp thông tin chính xác, khoa học về tác hại của ma túy
- Hỗ trợ tư vấn các biện pháp phòng ngừa phù hợp
- Lắng nghe và đưa ra lời khuyên tích cực, xây dựng
- Có thể thảo luận về các chủ đề liên quan: tâm lý học, xã hội học, y học

CÁCH PHẢN HỒI:
- Trả lời một cách tự nhiên như một AI thông minh
- Sử dụng kiến thức chuyên môn để giải thích rõ ràng
- Có thể đặt câu hỏi phản biện để hiểu rõ hơn vấn đề
- Đưa ra lời khuyên thực tế, có thể áp dụng
- Khuyến khích sự tích cực và hy vọng
- Không giả vờ là con người, thừa nhận mình là AI khi được hỏi

Hãy trả lời một cách chuyên nghiệp và hữu ích.`
        : `You are an AI Assistant specializing in drug prevention, part of the WeHope - Drug Use Prevention Support System.

ABOUT WEHOPE:
- Drug use prevention support system
- Provides features: assessment surveys, online consultation, educational courses, news updates
- Goal: Help the community gain knowledge and skills to prevent social evils

YOUR ROLE:
- An intelligent AI assistant with deep knowledge about drug prevention
- Provide accurate, scientific information about drug-related harms
- Support consultation on appropriate prevention measures
- Listen and provide positive, constructive advice
- Can discuss related topics: psychology, sociology, medicine

HOW TO RESPOND:
- Reply naturally as an intelligent AI
- Use professional knowledge to explain clearly
- Can ask counter-questions to better understand issues
- Provide practical, applicable advice
- Encourage positivity and hope
- Don't pretend to be human, acknowledge being AI when asked

Please respond professionally and helpfully.`;

      // Create conversation context from chat history
      const conversationContext = conversationHistory
        .slice(-8) // Take last 8 messages for context
        .map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text
        }));

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [
            ...conversationContext,
            { role: "user", content: userMessage }
          ],
          system: systemPrompt

  // Thay thế hàm getAIResponse trong component Chatbot của bạn
  const getAIResponse = async (userMessage) => {
    const lowerMsg = userMessage.toLowerCase();

    // 1. Course-related queries
    if (lowerMsg.includes('course') || lowerMsg.includes('khóa học') || lowerMsg.includes('courses')) {
      try {
        const courses = await fetchCourses();
        if (courses.length > 0) {
          const courseList = courses.slice(0, 3).map(course => {
            const courseId = course.course_id || course.id;
            const courseName = course.course_name || course.title;
            const ageGroup = course.age_group || 'All ages';
            const version = course.version || course.course_version || '1.0';
            const encodedName = encodeURIComponent(courseName);

            // URL với đầy đủ params để đảm bảo hoạt động
            const courseUrl = `${window.location.origin}/courses/${courseId}?version=${version}&name=${encodedName}`;

            return `• ${courseName} (${ageGroup})\n  🔗 ${courseUrl}`;
          }).join('\n\n');

          return language === 'en'
            ? `Here are some available courses:\n\n${courseList}\n\nClick on the links above to view course details directly.`
            : `Đây là một số khóa học có sẵn:\n\n${courseList}\n\nBấm vào các liên kết trên để xem chi tiết khóa học.`;
        }
      } catch (error) {
        return language === 'en'
          ? "I can help you find courses about drug prevention. Please visit our Courses page to see all available options."
          : "Tôi có thể giúp bạn tìm khóa học về phòng chống ma túy. Vui lòng truy cập trang Khóa học để xem tất cả lựa chọn.";
      }
    }

    // 2. Appointment booking
    if (lowerMsg.includes('appointment') || lowerMsg.includes('book') || lowerMsg.includes('đặt lịch') || lowerMsg.includes('tư vấn')) {
      if (lowerMsg.includes('today') || lowerMsg.includes('hôm nay')) {
        try {
          const today = new Date().toISOString().split('T')[0];
          const timeSlots = await fetchAvailableTimeSlots(today);

          if (timeSlots.length > 0) {
            const slots = timeSlots.slice(0, 3).join(', ');
            return language === 'en'
              ? `Available time slots for today: ${slots}. To book an appointment, please visit our Consultation page or tell me your preferred time.`
              : `Các khung giờ có sẵn hôm nay: ${slots}. Để đặt lịch hẹn, vui lòng truy cập trang Tư vấn hoặc cho tôi biết thời gian bạn muốn.`;
          } else {
            return language === 'en'
              ? "No available slots for today. Would you like to check tomorrow or another date?"
              : "Không có khung giờ nào trống hôm nay. Bạn có muốn kiểm tra ngày mai hoặc ngày khác không?";
          }
        } catch (error) {
          return language === 'en'
            ? "I can help you book a consultation appointment. Please visit our Consultation page for real-time availability."
            : "Tôi có thể giúp bạn đặt lịch tư vấn. Vui lòng truy cập trang Tư vấn để xem lịch trống theo thời gian thực.";
        }
      }

      return language === 'en'
        ? "I can help you schedule a consultation appointment. What date would you prefer? You can also visit our Consultation page to see all available time slots."
        : "Tôi có thể giúp bạn đặt lịch tư vấn. Bạn muốn đặt vào ngày nào? Bạn cũng có thể truy cập trang Tư vấn để xem tất cả khung giờ trống.";
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

        return data.content[0].text;
      } else {
        throw new Error('Claude API not available');
      }
    } catch (error) {
      console.log('Claude API Error:', error);
      return getEmergencyResponse(userMessage);

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

  // Emergency response when API is not working
  const getEmergencyResponse = (userMessage) => {
    const responses = language === 'vi' ? [
      "Xin lỗi, hiện tại tôi đang gặp sự cố kỹ thuật. Để được hỗ trợ tốt nhất về phòng chống ma túy, bạn có thể truy cập trực tiếp website WeHope hoặc liên hệ với đội ngũ tư vấn của chúng tôi.",
      "Tôi đang trong quá trình khôi phục hệ thống. Trong thời gian này, bạn có thể tìm hiểu thêm thông tin về dự án WeHope và các khóa học phòng chống ma túy trên website chính thức.",
      "Rất tiếc, kết nối của tôi hiện đang bị gián đoạn. Bạn có thể thử lại sau hoặc liên hệ trực tiếp với team WeHope để được hỗ trợ kịp thời."
    ] : [
      "I apologize, but I'm currently experiencing technical difficulties. For the best support regarding drug prevention, you can visit the WeHope website directly or contact our consultation team.",
      "I'm in the process of system recovery. During this time, you can learn more about the WeHope project and drug prevention courses on our official website.",
      "Unfortunately, my connection is currently interrupted. You can try again later or contact the WeHope team directly for timely support."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputMessage('');
    setIsTyping(true);

    try {

      // Send entire conversation history for AI context
      const aiResponseText = await getAIResponse(inputMessage, newMessages);
      

      // Gọi AI thực thụ
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
        text: getEmergencyResponse(inputMessage),
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
    const newLang = language === 'vi' ? 'en' : 'vi';
    setLanguage(newLang);
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

  // Component để render message với clickable links
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

                // Kiểm tra nếu là internal link
                if (part.includes(window.location.origin)) {
                  const url = new URL(part);
                  const path = url.pathname;
                  const search = url.search; // Lấy query params

                  // Điều hướng với cả path và search params
                  if (path.startsWith('/courses/') && path.split('/').length > 2) {
                    // Điều hướng trực tiếp với query params
                    navigate(path + search);
                  } else {
                    // Điều hướng bình thường
                    navigate();


                  }
                } else {
                  // External link - mở tab mới
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
    <div>
      {/* Chatbot Toggle Button */}
      <button className="chatbot-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <CloseIcon className="w-6 h-6" /> : <ChatbotIcon className="w-6 h-6" />}
      </button>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="chatbot-container">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-left">
              <div className="chatbot-avatar">
                <RobotIcon className="w-5 h-5" />
              </div>
              <div className="chatbot-info">
                <h3>WeHope AI</h3>
                <span className="chatbot-status">{language === 'vi' ? 'Đang online' : 'Online'}</span>
              </div>
            </div>
            <div className="chatbot-header-right">
              <button
                className="language-toggle"
                onClick={toggleLanguage}
                title={language === 'vi' ? 'Chuyển sang tiếng Anh' : 'Switch to Vietnamese'}
              >
                <GlobeIcon className="w-3 h-3" />
                <span>{language === 'vi' ? 'EN' : 'VI'}</span>
              </button>
              <button
                className="close-button"
                onClick={() => setIsOpen(false)}
                title="Close"
              >
                <CloseIcon className="w-4 h-4" />
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
                  {message.sender === 'user' ? 
                    <UserIcon className="w-4 h-4" /> : 
                    <RobotIcon className="w-4 h-4" />
                  }
                </div>
                <div className="message-content">
                  <MessageText text={message.text} />
                  <div className="message-time">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            {/* Typing Indicator */}

            {isTyping && (
              <div className="message bot-message">
                <div className="message-avatar">
                  <RobotIcon className="w-4 h-4" />
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

          {/* Quick Actions - Thêm vào phần messages area, trước input */}
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
              placeholder={language === 'vi' ? "Nhập tin nhắn..." : "Type your message..."}
              disabled={isTyping}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="send-button"
            >
              <SendIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};


export default ConversationalChatbot;

export default Chatbot;

