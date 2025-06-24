import React, { useState, useEffect, useRef } from 'react';
import { FaPaperPlane, FaUser, FaRobot, FaPhone, FaVideo, FaSmile, FaPaperclip, FaMicrophone, FaEllipsisV, FaSearch, FaUsers, FaUserMd, FaHeadset, FaShieldAlt, FaClock, FaComments, FaStar, FaCircle, FaCheck, FaPlus, FaTimes } from 'react-icons/fa';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

const OnlineConsultant = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      message: 'Xin chào! 👋 Tôi là trợ lý tư vấn của WeHope. Tôi có thể giúp gì cho bạn hôm nay?',
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      isWelcome: true,
      avatar: 'https://c8.alamy.com/comp/H6JXD4/online-consultant-icon-isometric-3d-style-H6JXD4.jpg'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeConsultant, setActiveConsultant] = useState(null);
  const [showConsultantList, setShowConsultantList] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);

  // Mock data for consultants với thông tin chi tiết hơn
  const consultants = [
    {
      id: 1,
      name: 'Dr. Triệu Quốc An',
      specialty: 'Tâm lý học lâm sàng',
      avatar: 'https://img.freepik.com/premium-vector/man-profile-cartoon_18591-58482.jpg?w=360',
      status: 'online',
      rating: 4.9,
      reviewCount: 127,
      experience: '10 năm',
      description: 'Chuyên gia tâm lý với kinh nghiệm tư vấn phòng chống tệ nạn xã hội',
      languages: ['Tiếng Việt', 'English'],
      responseTime: '< 5 phút',
      consultationCount: 450
    },
    {
      id: 2,
      name: 'ThS. Trần Thị Bích',
      specialty: 'Công tác xã hội',
      avatar: 'https://static.vecteezy.com/system/resources/previews/001/993/889/non_2x/beautiful-latin-woman-avatar-character-icon-free-vector.jpg',
      status: 'online',
      rating: 4.8,
      reviewCount: 98,
      experience: '8 năm',
      description: 'Chuyên gia công tác xã hội, hỗ trợ phục hồi và tái hòa nhập',
      languages: ['Tiếng Việt'],
      responseTime: '< 3 phút',
      consultationCount: 320
    },
    {
      id: 3,
      name: 'PGS. Lê Văn Cường',
      specialty: 'Y học cai nghiện',
      avatar: 'https://img.freepik.com/premium-vector/man-profile-cartoon_18591-58482.jpg?w=360',
      status: 'busy',
      rating: 4.9,
      reviewCount: 156,
      experience: '15 năm',
      description: 'Bác sĩ chuyên khoa về điều trị cai nghiện và phục hồi chức năng',
      languages: ['Tiếng Việt', 'English', 'Français'],
      responseTime: '< 10 phút',
      consultationCount: 680
    }
  ];

  // Enhanced quick responses với categories
  const quickResponsesByCategory = {
    general: [
      '🆘 Tôi cần hỗ trợ khẩn cấp',
      '📚 Tư vấn về phòng chống ma túy',
      '❓ Làm thế nào để nhận biết dấu hiệu nghiện?'
    ],
    psychology: [
      '💭 Tư vấn tâm lý cá nhân',
      '😔 Hỗ trợ trầm cảm, lo âu',
      '🧠 Tư vấn hành vi nghiện'
    ],
    medical: [
      '💊 Thông tin về các loại ma túy',
      '🏥 Quy trình điều trị cai nghiện',
      '⚕️ Tác dụng phụ và biến chứng'
    ],
    family: [
      '👨‍👩‍👧‍👦 Tôi muốn giúp người thân cai nghiện',
      '💔 Gia đình tôi đang gặp khó khăn',
      '🤝 Hướng dẫn hỗ trợ người nghiện'
    ],
    emergency: [
      '🚨 Trường hợp khẩn cấp',
      '☎️ Cần hỗ trợ ngay lập tức',
      '🆘 Hotline hỗ trợ 24/7'
    ]
  };

  // Enhanced categories với màu sắc và gradient
  const categories = [
    {
      id: 'general',
      name: 'Tư vấn chung',
      icon: FaComments,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      count: 145
    },
    {
      id: 'psychology',
      name: 'Tâm lý học',
      icon: FaUserMd,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      count: 89
    },
    {
      id: 'medical',
      name: 'Y tế',
      icon: FaShieldAlt,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      count: 76
    },
    {
      id: 'family',
      name: 'Gia đình',
      icon: FaUsers,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      count: 134
    },
    {
      id: 'emergency',
      name: 'Khẩn cấp',
      icon: FaPhone,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
      count: 23
    }
  ];

  const emojis = ['😊', '😢', '😡', '😰', '🤔', '👍', '👎', '❤️', '🙏', '💪'];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      type: 'user',
      message: inputMessage,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      avatar: '👤'
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsTyping(true);
    setShowEmojiPicker(false);

    // Simulate bot response với delay thực tế hơn
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        type: activeConsultant ? 'consultant' : 'bot',
        message: getBotResponse(inputMessage),
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        avatar: activeConsultant ? activeConsultant.avatar : 'https://c8.alamy.com/comp/H6JXD4/online-consultant-icon-isometric-3d-style-H6JXD4.jpg',
        consultant: activeConsultant
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, Math.random() * 2000 + 1000); // Random delay 1-3 seconds
  };

  const getBotResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();

    const responses = {
      'ma túy': [
        'Ma túy gây ra nhiều tác hại nghiêm trọng đến sức khỏe và tinh thần. 💊 Tôi có thể cung cấp thông tin chi tiết về các loại ma túy và tác hại của chúng.',
        'Bạn có muốn tôi kết nối với chuyên gia để được tư vấn trực tiếp không? 👨‍⚕️'
      ],
      'nghiện': [
        'Việc cai nghiện cần có sự hỗ trợ từ chuyên gia y tế và tâm lý. 🏥',
        'Chúng tôi có đội ngũ bác sĩ và nhà tâm lý học giàu kinh nghiệm. Tôi có thể sắp xếp cuộc tư vấn trực tiếp với chuyên gia cho bạn. 💪'
      ],
      'gia đình': [
        'Gia đình đóng vai trò rất quan trọng trong quá trình phòng chống và điều trị nghiện. 👨‍👩‍👧‍👦',
        'Chúng tôi có chương trình tư vấn dành riêng cho gia đình. Bạn có muốn được hướng dẫn cách hỗ trợ người thân không? 🤝'
      ]
    };

    for (const [key, responseArray] of Object.entries(responses)) {
      if (lowerMessage.includes(key)) {
        return responseArray.join(' ');
      }
    }

    return 'Cảm ơn bạn đã liên hệ! 🙏 Để được hỗ trợ tốt nhất, tôi khuyên bạn nên tư vấn trực tiếp với chuyên gia của chúng tôi. Bạn có muốn tôi kết nối với một chuyên gia phù hợp không? ✨';
  };

  const handleQuickResponse = (response) => {
    setInputMessage(response);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const connectToConsultant = (consultant) => {
    setActiveConsultant(consultant);
    setShowConsultantList(false);

    const connectionMessage = {
      id: messages.length + 1,
      type: 'system',
      message: `🎉 Đã kết nối thành công với ${consultant.name} - ${consultant.specialty}. Chuyên gia sẽ phản hồi trong ${consultant.responseTime}.`,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      avatar: '🔗'
    };

    setMessages(prev => [...prev, connectionMessage]);
  };

  const addEmoji = (emoji) => {
    setInputMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50 to-pink-50">
        {/* Enhanced Header với nền gradient đỏ SÁNG */}
        <div className="bg-gradient-to-r from-red-100 via-red-200 to-pink-200 text-gray-800 relative overflow-hidden">
          <div className="absolute inset-0 bg-white bg-opacity-20"></div>
          <div className="container mx-auto px-4 py-12 relative z-10">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-90 rounded-full mb-6 backdrop-blur-sm shadow-lg border-2 border-red-200">
                <img
                  src="https://c8.alamy.com/comp/H6JXD4/online-consultant-icon-isometric-3d-style-H6JXD4.jpg"
                  alt="Online Consultant"
                  className="w-12 h-12 rounded-full object-cover"
                />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-pink-600">
                Online Consultant
              </h1>
              <p className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed font-medium">
                Tư vấn trực tuyến miễn phí 24/7 với đội ngũ chuyên gia hàng đầu về phòng chống tệ nạn xã hội
              </p>
              <div className="flex items-center justify-center gap-6 mt-8 text-gray-700">
                <div className="flex items-center gap-2 bg-white bg-opacity-80 px-4 py-3 rounded-full shadow-lg border border-red-200 hover:shadow-xl transition-all duration-300">
                  <FaClock className="text-red-500" />
                  <span className="font-semibold">24/7 Hỗ trợ</span>
                </div>
                <div className="flex items-center gap-2 bg-white bg-opacity-80 px-4 py-3 rounded-full shadow-lg border border-red-200 hover:shadow-xl transition-all duration-300">
                  <FaShieldAlt className="text-red-500" />
                  <span className="font-semibold">Bảo mật cao</span>
                </div>
                <div className="flex items-center gap-2 bg-white bg-opacity-80 px-4 py-3 rounded-full shadow-lg border border-red-200 hover:shadow-xl transition-all duration-300">
                  <FaUserMd className="text-red-500" />
                  <span className="font-semibold">Chuyên gia giàu kinh nghiệm</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content với layout cải tiến */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Enhanced Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Categories với design mới */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <FaComments className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Danh mục tư vấn</h3>
                </div>
                <div className="space-y-3">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full group relative overflow-hidden rounded-xl p-4 text-left transition-all duration-300 transform hover:scale-105 ${selectedCategory === category.id
                        ? `bg-gradient-to-r ${category.color} text-white shadow-lg shadow-red-500/25`
                        : `${category.bgColor} ${category.textColor} hover:shadow-md`
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <category.icon className="text-lg" />
                          <div>
                            <span className="font-semibold">{category.name}</span>
                            <div className="text-xs opacity-75">{category.count} cuộc tư vấn</div>
                          </div>
                        </div>
                        {selectedCategory === category.id && (
                          <FaCheck className="text-white" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Enhanced Consultants List */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <FaUsers className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Chuyên gia trực tuyến</h3>
                </div>
                <div className="space-y-4">
                  {consultants.map(consultant => (
                    <div
                      key={consultant.id}
                      className="group p-4 rounded-xl hover:bg-gray-50 cursor-pointer transition-all duration-300 border border-transparent hover:border-red-200 hover:shadow-md"
                      onClick={() => connectToConsultant(consultant)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img
                            src={consultant.avatar}
                            alt={consultant.name}
                            className="w-14 h-14 rounded-full object-cover ring-2 ring-white shadow-lg"
                          />
                          <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white shadow-sm ${consultant.status === 'online'
                            ? 'bg-green-500 animate-pulse'
                            : 'bg-yellow-500'
                            }`}></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-800 group-hover:text-red-600 transition-colors">
                            {consultant.name}
                          </h4>
                          <p className="text-sm text-gray-600 truncate mb-1">
                            {consultant.specialty}
                          </p>
                          <div className="flex items-center gap-3 text-xs">
                            <div className="flex items-center gap-1 text-yellow-500">
                              <FaStar className="w-3 h-3 fill-current" />
                              <span className="font-medium">{consultant.rating}</span>
                              <span className="text-gray-400">({consultant.reviewCount})</span>
                            </div>
                            <span className="text-gray-500">{consultant.experience}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${consultant.status === 'online'
                              ? 'bg-green-100 text-green-800 ring-1 ring-green-200'
                              : 'bg-yellow-100 text-yellow-800 ring-1 ring-yellow-200'
                              }`}>
                              <FaCircle className="w-2 h-2 fill-current" />
                              {consultant.status === 'online' ? 'Trực tuyến' : 'Bận'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Enhanced Chat Area */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 h-[750px] flex flex-col overflow-hidden">
                {/* Enhanced Chat Header với màu đỏ */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 opacity-90"></div>
                  <div className="relative z-10 flex items-center justify-between p-6 text-white">
                    <div className="flex items-center gap-4">
                      {activeConsultant ? (
                        <>
                          <div className="relative">
                            <img
                              src={activeConsultant.avatar}
                              alt={activeConsultant.name}
                              className="w-12 h-12 rounded-full object-cover ring-2 ring-white/50"
                            />
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                          </div>
                          <div>
                            <h3 className="font-bold text-lg">{activeConsultant.name}</h3>
                            <div className="flex items-center gap-2 text-red-100">
                              <FaCircle className="w-2 h-2 fill-current text-green-400" />
                              <span className="text-sm">Đang trực tuyến • Phản hồi {activeConsultant.responseTime}</span>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm overflow-hidden">
                            <img
                              src="https://c8.alamy.com/comp/H6JXD4/online-consultant-icon-isometric-3d-style-H6JXD4.jpg"
                              alt="WeHope Assistant"
                              className="w-8 h-8 object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg">WeHope Assistant</h3>
                            <div className="flex items-center gap-2 text-red-100">
                              <FaCircle className="w-2 h-2 fill-current text-green-400 animate-pulse" />
                              <span className="text-sm">Trợ lý AI • Phản hồi tức thì</span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-3 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-all duration-200 backdrop-blur-sm">
                        <FaPhone className="w-4 h-4" />
                      </button>
                      <button className="p-3 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-all duration-200 backdrop-blur-sm">
                        <FaVideo className="w-4 h-4" />
                      </button>
                      <button className="p-3 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-all duration-200 backdrop-blur-sm">
                        <FaEllipsisV className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Enhanced Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-gray-50/50 to-white">
                  {messages.map(message => (
                    <div
                      key={message.id}
                      className={`flex items-end gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.type !== 'user' && (
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-lg flex-shrink-0 bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg overflow-hidden">
                          {typeof message.avatar === 'string' && message.avatar.includes('http') ? (
                            <img src={message.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                          ) : (
                            <span>{message.avatar}</span>
                          )}
                        </div>
                      )}
                      <div className={`max-w-xs lg:max-w-md group ${message.type === 'user' ? 'order-1' : ''}`}>
                        <div className={`px-6 py-4 rounded-2xl shadow-lg relative ${message.type === 'user'
                          ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white ml-auto'
                          : message.type === 'system'
                            ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-l-4 border-yellow-600'
                            : message.type === 'consultant'
                              ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white'
                              : 'bg-white text-gray-800 border border-gray-200'
                          }`}>
                          <p className="text-sm leading-relaxed">{message.message}</p>
                          <div className={`flex items-center justify-between mt-2 pt-2 border-t ${message.type === 'user' || message.type === 'system' || message.type === 'consultant'
                            ? 'border-white/20'
                            : 'border-gray-200'
                            }`}>
                            <p className={`text-xs ${message.type === 'user' || message.type === 'system' || message.type === 'consultant'
                              ? 'text-white/70'
                              : 'text-gray-500'
                              }`}>
                              {message.time}
                            </p>
                            {message.type === 'user' && (
                              <FaCheck className="w-3 h-3 text-white/70" />
                            )}
                          </div>
                        </div>
                      </div>
                      {message.type === 'user' && (
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-lg flex-shrink-0 bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-lg">
                          <span>{message.avatar}</span>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Enhanced Typing indicator */}
                  {isTyping && (
                    <div className="flex items-end gap-3 justify-start">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-lg bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg overflow-hidden">
                        <img
                          src="https://c8.alamy.com/comp/H6JXD4/online-consultant-icon-isometric-3d-style-H6JXD4.jpg"
                          alt="Bot typing"
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                      <div className="bg-white text-gray-800 px-6 py-4 rounded-2xl shadow-lg border border-gray-200">
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                          <span className="text-xs text-gray-500 ml-2">Đang soạn tin...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Enhanced Quick Responses */}
                {messages.length <= 2 && (
                  <div className="px-6 py-4 bg-gradient-to-r from-red-50 to-pink-50 border-t border-gray-100">
                    <p className="text-sm font-medium text-gray-700 mb-3">💡 Gợi ý câu hỏi phổ biến:</p>
                    <div className="flex flex-wrap gap-2">
                      {quickResponsesByCategory[selectedCategory]?.map((response, index) => (
                        <button
                          key={index}
                          onClick={() => handleQuickResponse(response)}
                          className="inline-flex items-center gap-2 text-sm bg-white hover:bg-red-50 text-gray-700 hover:text-red-600 px-4 py-2 rounded-full border border-gray-200 hover:border-red-300 transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                          {response}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Enhanced Input Area */}
                <div className="p-6 bg-white border-t border-gray-100">
                  <div className="flex items-end gap-3">
                    <button className="p-3 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200 shadow-sm hover:shadow-md">
                      <FaPaperclip className="w-4 h-4" />
                    </button>
                    <div className="flex-1 relative">
                      <textarea
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Nhập tin nhắn của bạn... 💬"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:bg-white resize-none transition-all duration-200 shadow-sm"
                        rows="1"
                        style={{ minHeight: '48px', maxHeight: '120px' }}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <button
                          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                          className="p-3 text-gray-500 hover:text-yellow-500 hover:bg-yellow-50 rounded-full transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                          <FaSmile className="w-4 h-4" />
                        </button>
                        {showEmojiPicker && (
                          <div className="absolute bottom-full right-0 mb-2 bg-white rounded-xl shadow-xl border border-gray-200 p-3 grid grid-cols-5 gap-2 z-10">
                            {emojis.map((emoji, index) => (
                              <button
                                key={index}
                                onClick={() => addEmoji(emoji)}
                                className="text-xl hover:bg-gray-100 rounded-lg p-2 transition-colors"
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <button className="p-3 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200 shadow-sm hover:shadow-md">
                        <FaMicrophone className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleSendMessage}
                        disabled={!inputMessage.trim()}
                        className="p-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full hover:from-red-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
                      >
                        <FaPaperPlane className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Info Section */}
        <div className="bg-gradient-to-r from-white to-red-50 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Tại sao chọn tư vấn trực tuyến của WeHope? 🌟
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Chúng tôi cam kết mang đến dịch vụ tư vấn chất lượng cao với đội ngũ chuyên gia hàng đầu
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: FaClock,
                  title: 'Hỗ trợ 24/7',
                  description: 'Dịch vụ tư vấn trực tuyến hoạt động 24/7, sẵn sàng hỗ trợ bạn bất cứ lúc nào với thời gian phản hồi nhanh chóng.',
                  gradient: 'from-red-500 to-pink-500',
                  stats: '< 5 phút phản hồi'
                },
                {
                  icon: FaShieldAlt,
                  title: 'Bảo mật tuyệt đối',
                  description: 'Mọi thông tin trao đổi được mã hóa end-to-end và bảo mật tuyệt đối theo tiêu chuẩn quốc tế.',
                  gradient: 'from-green-500 to-emerald-500',
                  stats: '100% bảo mật'
                },
                {
                  icon: FaHeadset,
                  title: 'Chuyên gia hàng đầu',
                  description: 'Đội ngũ gồm các bác sĩ, nhà tâm lý học và chuyên gia xã hội với hơn 10 năm kinh nghiệm.',
                  gradient: 'from-purple-500 to-pink-500',
                  stats: '50+ chuyên gia'
                }
              ].map((item, index) => (
                <div key={index} className="group">
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-8 text-center border border-gray-100">
                    <div className={`w-20 h-20 bg-gradient-to-r ${item.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <item.icon className="text-2xl text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-red-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      {item.description}
                    </p>
                    <div className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${item.gradient} text-white rounded-full text-sm font-semibold shadow-lg`}>
                      <FaStar className="w-3 h-3" />
                      {item.stats}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OnlineConsultant;