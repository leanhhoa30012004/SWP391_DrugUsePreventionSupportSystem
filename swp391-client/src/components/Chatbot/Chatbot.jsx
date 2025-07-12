import React, { useState, useRef, useEffect } from 'react';
import { FaComments, FaTimes, FaPaperPlane, FaRobot, FaUser, FaGlobe } from 'react-icons/fa';
import './Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [language, setLanguage] = useState('en');
  const messagesEndRef = useRef(null);

  // Fake AI responses based on drug prevention themes
  const aiResponses = {
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
        "Giáo dục, nhận thức và can thiệp sớm là những cách tốt nhất để ngăn chặn việc sử dụng ma túy và thúc đẩy lối sống lành mạnh."
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
        text: aiResponses[language].greetings[Math.floor(Math.random() * aiResponses[language].greetings.length)],
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

  const getAIResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    const responses = aiResponses[language];
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('xin chào') || lowerMessage.includes('chào')) {
      return responses.greetings[Math.floor(Math.random() * responses.greetings.length)];
    }
    
    if (lowerMessage.includes('drug') || lowerMessage.includes('ma túy') || lowerMessage.includes('substance')) {
      return responses.drug_info[Math.floor(Math.random() * responses.drug_info.length)];
    }
    
    if (lowerMessage.includes('help') || lowerMessage.includes('support') || lowerMessage.includes('giúp') || lowerMessage.includes('hỗ trợ')) {
      return responses.support[Math.floor(Math.random() * responses.support.length)];
    }
    
    if (lowerMessage.includes('prevent') || lowerMessage.includes('avoid') || lowerMessage.includes('phòng') || lowerMessage.includes('tránh')) {
      return responses.prevention[Math.floor(Math.random() * responses.prevention.length)];
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

    // Simulate AI thinking
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        text: getAIResponse(inputMessage),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
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
                  <div className="message-text">{message.text}</div>
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